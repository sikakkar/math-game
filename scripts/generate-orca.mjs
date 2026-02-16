import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "assets", "orca");

// Read .env manually (no dependency needed)
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^\s*([\w]+)\s*=\s*(.+?)\s*$/);
    if (match) process.env[match[1]] = match[2];
  }
}

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY in .env");
  process.exit(1);
}

const STYLE_PREFIX =
  "Cute cartoon orca whale character, kid-friendly, simple flat illustration style, expressive eyes, white background, no text, mascot for a children's math app.";

const IMAGES = [
  { file: "greeting.png", prompt: "Orca waving, friendly greeting pose" },
  { file: "pointing.png", prompt: "Orca pointing forward, encouraging" },
  { file: "thinking.png", prompt: "Orca with hand on chin, curious" },
  { file: "celebrating.png", prompt: "Orca jumping and cheering with joy" },
  { file: "encouraging.png", prompt: "Orca giving thumbs up, supportive" },
];

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/nano-banana-pro-preview:generateContent?key=${API_KEY}`;

async function generateImage(entry) {
  console.log(`Generating ${entry.file}...`);

  const fullPrompt = `${STYLE_PREFIX} ${entry.prompt}`;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: fullPrompt }],
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE", "TEXT"],
        responseMimeType: "text/plain",
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  const data = await res.json();

  // Find inline_data in response parts
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p.inlineData);

  if (!imagePart) {
    console.error("Response parts:", JSON.stringify(parts, null, 2));
    throw new Error(`No image data in response for ${entry.file}`);
  }

  const buffer = Buffer.from(imagePart.inlineData.data, "base64");
  const outPath = path.join(OUT_DIR, entry.file);
  fs.writeFileSync(outPath, buffer);
  console.log(`  Saved ${outPath} (${buffer.length} bytes)`);
}

// Ensure output directory exists
fs.mkdirSync(OUT_DIR, { recursive: true });

for (const entry of IMAGES) {
  await generateImage(entry);
}

console.log("\nDone! All orca images generated.");
