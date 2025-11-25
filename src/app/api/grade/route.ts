import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const genAI = new GoogleGenerativeAI(apiKey || "");
const model = genAI.getGenerativeModel({ model: modelName });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, question, selectedOption, correctOption, reasoning, explanation, history, userMessage } = body;

    let prompt = "";

    if (action === 'hint') {
      prompt = `
                You are a helpful tutor. The student is stuck on this question:
                "${question}"
                
                Provide a helpful hint that guides them toward the correct answer without giving it away directly.
                Keep it short (under 50 words).
            `;
    } else if (action === 'chat') {
      prompt = `
                You are a helpful tutor discussing a quiz question.
                Question: "${question}"
                Correct Answer: "${correctOption}"
                Official Explanation: "${explanation}"
                
                Chat History:
                ${JSON.stringify(history)}
                
                Student says: "${userMessage}"
                
                Respond to the student. Answer their questions, clarify concepts, or help them understand why the answer is what it is.
                Keep it conversational and encouraging.
            `;
    } else {
      // Default: grade
      prompt = `
                You are a helpful tutor grading a student's answer.

                Question: "${question}"
                Student's Answer: "${selectedOption}"
                Correct Answer: "${correctOption}"
                Student's Reasoning: "${reasoning}"
                Official Explanation: "${explanation}"

                Analyze the student's answer and reasoning VERY CAREFULLY.

                CRITICAL: You MUST respond with ONLY a valid JSON object. No markdown, no extra text, ONLY the JSON.

                The JSON structure must be:
                {
                    "feedback": "Your concise feedback (under 100 words)",
                    "isCorrect": true or false,
                    "isExcellent": true or false
                }

                Rules:
                - isCorrect is true ONLY if selectedOption matches correctOption
                - isExcellent is true ONLY if isCorrect is true AND reasoning is sound
                - feedback should explain why the answer is right/wrong

                Respond with ONLY the JSON object, nothing else.
            `;
    }

    let retries = 3;
    while (retries > 0) {
      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        if (action === 'grade') {
          let cleanText = text
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

          // Extraer solo el objeto JSON si hay texto adicional
          const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            cleanText = jsonMatch[0];
          }

          try {
            const data = JSON.parse(cleanText);

            // Validar estructura esperada
            if (typeof data.isCorrect !== 'boolean') {
              throw new Error("Invalid response structure: missing isCorrect");
            }

            // Asegurar que isExcellent existe
            if (typeof data.isExcellent !== 'boolean') {
              data.isExcellent = false;
            }

            // Asegurar que feedback existe
            if (!data.feedback || typeof data.feedback !== 'string') {
              data.feedback = "No feedback provided.";
            }

            return NextResponse.json(data);
          } catch (parseError: any) {
            console.error("JSON Parse Error:", parseError);
            console.error("Raw Text:", text);

            // Fallback: intentar con respuesta de error más clara
            return NextResponse.json({
              error: "AI response format error. Please try again.",
              details: parseError.message
            }, { status: 500 });
          }
        } else {
          // For hint and chat, just return the text
          return NextResponse.json({ message: text });
        }
      } catch (error: any) {
        if (error.status === 429 && retries > 1) {
          console.warn("Rate limit hit in grading API. Retrying...");
          await new Promise(resolve => setTimeout(resolve, 3000));
          retries--;
        } else {
          throw error;
        }
      }
    }
    throw new Error("Max retries reached or API error");
  } catch (error: any) {
    console.error("Error in grading API:", error);
    return NextResponse.json({ error: `Error: ${error.message}` }, { status: 500 });
  }
}
