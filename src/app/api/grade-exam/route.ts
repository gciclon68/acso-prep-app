import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const genAI = new GoogleGenerativeAI(apiKey || "");
const model = genAI.getGenerativeModel({ model: modelName });

export async function POST(req: Request) {
    try {
        const { question, image, textAnswer } = await req.json();

        let promptParts: any[] = [
            `You are a strict but fair professor grading a final exam question.
       Question: "${question}"
       Student's Answer (Text): "${textAnswer}"
       
       Analyze the student's submission.
       1. If an image is provided, analyze the handwritten solution or diagram.
       2. Check for correctness of the logic and the final result.
       3. Point out any errors in the steps.
       4. Give a pass/fail grade and a brief explanation.`
        ];

        if (image) {
            // Image is base64 data:image/jpeg;base64,...
            // We need to strip the prefix
            const base64Data = image.split(',')[1];
            promptParts.push({
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg", // Assuming jpeg/png, Gemini handles standard types
                },
            });
        }

        const result = await model.generateContent(promptParts);
        const feedback = result.response.text();

        return NextResponse.json({ feedback });
    } catch (error) {
        console.error("Error in exam grading API:", error);
        return NextResponse.json({ error: "Failed to grade exam" }, { status: 500 });
    }
}
