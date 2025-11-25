import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local file
let apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  try {
    const envPath = resolve(__dirname, "../.env.local");
    const envContent = readFileSync(envPath, "utf8");
    const lines = envContent.split("\n");

    for (const line of lines) {
      const match = line.match(/^(NEXT_PUBLIC_GEMINI_API_KEY|GEMINI_API_KEY)=(.+)$/);
      if (match) {
        apiKey = match[2].trim();
        break;
      }
    }
  } catch (error) {
    // Ignore error, will check apiKey below
  }
}

if (!apiKey) {
  console.error("❌ Missing API key. Please set NEXT_PUBLIC_GEMINI_API_KEY or GEMINI_API_KEY in .env.local");
  process.exit(1);
}

async function listModels() {
  try {
    console.log("🔍 Fetching available models via REST API...\n");

    // Use the REST API directly to list models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const data = await response.json();
    const models = data.models || [];

    console.log(`✅ Found ${models.length} available models:\n`);
    console.log("=" .repeat(80));

    models.forEach((model, index) => {
      console.log(`\n${index + 1}. Model Name: ${model.name}`);
      console.log(`   Display Name: ${model.displayName}`);
      console.log(`   Description: ${model.description}`);
      console.log(`   Supported Generation Methods: ${model.supportedGenerationMethods?.join(", ") || "N/A"}`);
      console.log(`   Input Token Limit: ${model.inputTokenLimit || "N/A"}`);
      console.log(`   Output Token Limit: ${model.outputTokenLimit || "N/A"}`);

      if (model.name.includes("gemini-1.5-flash")) {
        console.log(`   ⭐ RECOMMENDED FOR YOUR USE CASE`);
      }
    });

    console.log("\n" + "=".repeat(80));
    console.log("\n💡 To use a model, reference it by its 'name' field in your code.");
    console.log("   The SDK usually expects just the model ID without the 'models/' prefix.");
    console.log("   Example: genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })\n");

    // Filter models that support content generation
    const generativeModels = models.filter(m =>
      m.supportedGenerationMethods?.includes("generateContent")
    );

    console.log(`\n📝 Models supporting content generation (${generativeModels.length}):`);
    generativeModels.forEach(m => {
      const modelId = m.name.replace("models/", "");
      console.log(`   - ${modelId} (${m.displayName})`);
    });

  } catch (error) {
    console.error("❌ Error listing models:", error.message);
    if (error.status) {
      console.error(`   Status: ${error.status}`);
    }
    if (error.stack) {
      console.error(`   Stack: ${error.stack}`);
    }
    process.exit(1);
  }
}

listModels();
