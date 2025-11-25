import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import fs from "fs/promises";
import path from "path";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

if (!apiKey) {
    console.error("Error: GEMINI_API_KEY or NEXT_PUBLIC_GEMINI_API_KEY is not set.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
                id: { type: SchemaType.STRING },
                title: { type: SchemaType.STRING },
                summary: { type: SchemaType.STRING },
                mindMap: {
                    type: SchemaType.OBJECT,
                    properties: {
                        nodes: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    id: { type: SchemaType.STRING },
                                    type: { type: SchemaType.STRING },
                                    data: {
                                        type: SchemaType.OBJECT,
                                        properties: { label: { type: SchemaType.STRING } },
                                        required: ["label"],
                                    },
                                    position: {
                                        type: SchemaType.OBJECT,
                                        properties: {
                                            x: { type: SchemaType.NUMBER },
                                            y: { type: SchemaType.NUMBER },
                                        },
                                        required: ["x", "y"],
                                    },
                                },
                                required: ["id", "type", "data", "position"],
                            },
                        },
                        edges: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    id: { type: SchemaType.STRING },
                                    source: { type: SchemaType.STRING },
                                    target: { type: SchemaType.STRING },
                                },
                                required: ["id", "source", "target"],
                            },
                        },
                    },
                    required: ["nodes", "edges"],
                },
                quiz: {
                    type: SchemaType.ARRAY,
                    items: {
                        type: SchemaType.OBJECT,
                        properties: {
                            id: { type: SchemaType.STRING },
                            question: { type: SchemaType.STRING },
                            options: {
                                type: SchemaType.ARRAY,
                                items: { type: SchemaType.STRING },
                            },
                            correctAnswer: { type: SchemaType.NUMBER },
                            explanation: { type: SchemaType.STRING },
                        },
                        required: ["id", "question", "options", "correctAnswer", "explanation"],
                    },
                },
            },
            required: ["id", "title", "summary", "mindMap", "quiz"],
        },
    },
});

const RAW_DIR = path.join(process.cwd(), "src/data/raw");
const PROCESSED_DIR = path.join(process.cwd(), "src/data/processed");


function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processFile(filename) {
    const filePath = path.join(RAW_DIR, filename);
    const text = await fs.readFile(filePath, "utf-8");
    const baseName = path.basename(filename, ".txt");
    const outputFile = path.join(PROCESSED_DIR, `${baseName}.json`);

    // Skip if already exists
    try {
        await fs.access(outputFile);
        console.log(`Skipping ${filename} (already processed)`);
        return;
    } catch (e) {
        // File doesn't exist, proceed
    }

    console.log(`Processing ${filename}...`);

    const prompt = `
    Analyze the following text from a class lecture (Class: ${baseName}).
    Create a structured output containing:
    1. A concise summary of the key concepts.
    2. A mind map structure (nodes and edges) suitable for React Flow. The nodes should represent key concepts and their relationships. Position them logically (e.g., central concept at 0,0, others radiating out). Use "default" type for nodes.
    3. A quiz with 5 multiple-choice questions. Each question should test understanding of the material. Include an explanation for the correct answer.

    Text content:
    ${text.substring(0, 30000)} // Limit to avoid token limits if necessary, though 2.0 Flash has large context.
  `;

    let retries = 3;
    while (retries > 0) {
        try {
            const result = await model.generateContent(prompt);
            const response = result.response;
            const json = response.text();

            await fs.writeFile(outputFile, json);
            console.log(`Saved ${baseName}.json`);
            break; // Success, exit retry loop
        } catch (error) {
            if (error.status === 429) {
                console.warn(`Rate limit hit for ${filename}. Retrying in 20 seconds...`);
                await sleep(20000);
                retries--;
            } else {
                console.error(`Error processing ${filename}:`, error);
                break; // Non-retriable error
            }
        }
    }
}

async function main() {
    try {
        const files = await fs.readdir(RAW_DIR);
        for (const file of files) {
            if (file.endsWith(".txt")) {
                await processFile(file);
                // Add a small delay between files even on success to be nice to the API
                await sleep(5000);
            }
        }
        console.log("All files processed.");
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
