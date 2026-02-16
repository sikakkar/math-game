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
  // Greeting variants (profile picker)
  { file: "greeting.png", prompt: "Orca waving, friendly greeting pose" },
  { file: "greeting_peek.png", prompt: "Orca peeking out from behind a wall, playful and curious, half-hidden" },
  { file: "greeting_bow.png", prompt: "Orca doing a little bow, welcoming gesture, arms spread wide" },

  // Pointing variants (path screen — next to playable node)
  { file: "pointing.png", prompt: "Orca pointing forward, encouraging" },
  { file: "pointing_excited.png", prompt: "Orca excitedly bouncing while pointing to the right, big smile" },
  { file: "pointing_wand.png", prompt: "Orca holding a magic wand and pointing it, sparkles coming out" },

  // Thinking variants (game screen — idle/question)
  { file: "thinking.png", prompt: "Orca with hand on chin, curious" },
  { file: "thinking_hmm.png", prompt: "Orca looking upward with one eye squinted, wondering, question marks around head" },
  { file: "thinking_scratch.png", prompt: "Orca scratching its head with a puzzled but cute expression" },
  { file: "thinking_book.png", prompt: "Orca reading a small book, wearing tiny glasses, studious" },

  // Correct answer reactions (game screen — after correct answer)
  { file: "correct_cheer.png", prompt: "Orca cheering with both arms raised high, huge smile, excited" },
  { file: "correct_dance.png", prompt: "Orca doing a happy dance, one leg up, arms swaying joyfully" },
  { file: "correct_clap.png", prompt: "Orca clapping enthusiastically, eyes sparkling with pride" },
  { file: "correct_star.png", prompt: "Orca holding up a big golden star proudly, beaming smile" },

  // Wrong answer reactions (game screen — after wrong answer)
  { file: "wrong_oops.png", prompt: "Orca covering its mouth with flippers, surprised 'oops' expression, gentle and kind" },
  { file: "wrong_hug.png", prompt: "Orca with open arms offering a comforting hug, warm caring smile" },
  { file: "wrong_tryagain.png", prompt: "Orca pointing upward with a determined encouraging look, like saying 'you got this next time'" },

  // Celebrating variants (results screen — high score >= 8)
  { file: "celebrating.png", prompt: "Orca jumping and cheering with joy" },
  { file: "celebrating_trophy.png", prompt: "Orca proudly holding up a golden trophy, confetti falling around" },
  { file: "celebrating_fireworks.png", prompt: "Orca watching colorful fireworks, amazed and delighted, party hat on" },

  // Encouraging variants (results screen — lower score < 8)
  { file: "encouraging.png", prompt: "Orca giving thumbs up, supportive" },
  { file: "encouraging_flex.png", prompt: "Orca flexing its muscles with a determined grin, 'you are strong' pose" },
  { file: "encouraging_heart.png", prompt: "Orca making a heart shape with its flippers, warm loving expression" },
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

const onlyNew = process.argv.includes("--only-new");

for (const entry of IMAGES) {
  const outPath = path.join(OUT_DIR, entry.file);
  if (onlyNew && fs.existsSync(outPath)) {
    console.log(`Skipping ${entry.file} (already exists)`);
    continue;
  }
  await generateImage(entry);
}

console.log("\nDone! All orca images generated.");
