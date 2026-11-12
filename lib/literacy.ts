// Early literacy content: letter sounds → CVC words → digraphs → blends → sight words.
// Every word that can appear on screen (answers *and* distractors) comes from the
// curated lists below, so generated choices are always real, kid-safe words.

export type PictureWord = { word: string; emoji: string };

/**
 * Keyword pictures for each letter sound. `end` marks a sound heard at the end (x).
 * `hint` marks pictures with another common name (🦎 iguana/lizard, 👸 queen/princess):
 * they are only shown when the word is also read aloud, never as silent choices.
 */
type LetterPicture = PictureWord & { end?: boolean; hint?: boolean };

export const LETTER_PICTURES: Record<string, LetterPicture[]> = {
  a: [{ word: "ant", emoji: "🐜" }, { word: "apple", emoji: "🍎" }],
  b: [{ word: "ball", emoji: "🏀" }, { word: "bee", emoji: "🐝" }, { word: "banana", emoji: "🍌" }],
  c: [{ word: "cat", emoji: "🐱" }, { word: "cow", emoji: "🐄" }, { word: "carrot", emoji: "🥕" }],
  d: [{ word: "dog", emoji: "🐶" }, { word: "duck", emoji: "🦆" }, { word: "dolphin", emoji: "🐬" }],
  e: [{ word: "egg", emoji: "🥚" }, { word: "elephant", emoji: "🐘" }],
  f: [{ word: "fish", emoji: "🐟" }, { word: "fox", emoji: "🦊" }, { word: "fire", emoji: "🔥" }],
  g: [{ word: "goat", emoji: "🐐" }, { word: "gift", emoji: "🎁" }, { word: "grapes", emoji: "🍇" }],
  h: [{ word: "hat", emoji: "🎩" }, { word: "house", emoji: "🏠" }, { word: "horse", emoji: "🐴" }],
  i: [{ word: "iguana", emoji: "🦎", hint: true }],
  j: [{ word: "juice", emoji: "🧃" }, { word: "jeans", emoji: "👖" }],
  k: [{ word: "kite", emoji: "🪁" }, { word: "key", emoji: "🔑" }, { word: "koala", emoji: "🐨", hint: true }],
  l: [{ word: "lion", emoji: "🦁" }, { word: "lemon", emoji: "🍋" }, { word: "leaf", emoji: "🍃" }],
  m: [{ word: "monkey", emoji: "🐒" }, { word: "moon", emoji: "🌙" }, { word: "mouse", emoji: "🐭" }],
  n: [{ word: "nose", emoji: "👃" }, { word: "net", emoji: "🥅" }],
  o: [{ word: "octopus", emoji: "🐙" }],
  p: [{ word: "pig", emoji: "🐷" }, { word: "pizza", emoji: "🍕" }, { word: "penguin", emoji: "🐧" }],
  q: [{ word: "queen", emoji: "👸", hint: true }],
  r: [{ word: "rabbit", emoji: "🐰" }, { word: "robot", emoji: "🤖" }, { word: "rainbow", emoji: "🌈" }],
  s: [{ word: "sun", emoji: "☀️" }, { word: "sock", emoji: "🧦" }, { word: "seal", emoji: "🦭" }],
  t: [{ word: "tiger", emoji: "🐯" }, { word: "turtle", emoji: "🐢" }, { word: "tomato", emoji: "🍅" }],
  u: [{ word: "umbrella", emoji: "☂️" }, { word: "up", emoji: "⬆️", hint: true }],
  v: [{ word: "van", emoji: "🚐", hint: true }, { word: "violin", emoji: "🎻" }, { word: "volcano", emoji: "🌋" }],
  w: [{ word: "watermelon", emoji: "🍉" }, { word: "web", emoji: "🕸️", hint: true }, { word: "wolf", emoji: "🐺" }],
  x: [{ word: "fox", emoji: "🦊", end: true }, { word: "box", emoji: "📦", end: true }],
  y: [{ word: "yo-yo", emoji: "🪀" }, { word: "yarn", emoji: "🧶" }],
  z: [{ word: "zebra", emoji: "🦓" }, { word: "zero", emoji: "0️⃣" }],
};

/** Decodable picture words, grouped by pattern. */
export const WORD_SETS: Record<string, PictureWord[]> = {
  cvc_a: [
    { word: "cat", emoji: "🐱" }, { word: "hat", emoji: "🎩" }, { word: "bat", emoji: "🦇" },
    { word: "rat", emoji: "🐀" }, { word: "map", emoji: "🗺️" }, { word: "can", emoji: "🥫" },
    { word: "van", emoji: "🚐" }, { word: "bag", emoji: "👜" }, { word: "cap", emoji: "🧢" },
    { word: "pan", emoji: "🍳" },
  ],
  cvc_i: [
    { word: "pig", emoji: "🐷" }, { word: "pin", emoji: "📌" }, { word: "bin", emoji: "🗑️" },
    { word: "six", emoji: "6️⃣" }, { word: "zip", emoji: "🤐" }, { word: "kid", emoji: "🧒" },
    { word: "lip", emoji: "👄" },
  ],
  cvc_o: [
    { word: "dog", emoji: "🐶" }, { word: "fox", emoji: "🦊" }, { word: "box", emoji: "📦" },
    { word: "log", emoji: "🪵" }, { word: "pot", emoji: "🍲" }, { word: "hot", emoji: "🥵" },
    { word: "cop", emoji: "👮" }, { word: "dot", emoji: "⚫" },
  ],
  cvc_e: [
    { word: "bed", emoji: "🛏️" }, { word: "hen", emoji: "🐔" }, { word: "pen", emoji: "🖊️" },
    { word: "net", emoji: "🥅" }, { word: "web", emoji: "🕸️" }, { word: "ten", emoji: "🔟" },
    { word: "leg", emoji: "🦵" }, { word: "red", emoji: "🔴" }, { word: "jet", emoji: "✈️" },
    { word: "wet", emoji: "💦" },
  ],
  cvc_u: [
    { word: "sun", emoji: "☀️" }, { word: "bus", emoji: "🚌" }, { word: "cup", emoji: "☕" },
    { word: "bug", emoji: "🐛" }, { word: "hug", emoji: "🤗" }, { word: "nut", emoji: "🥜" },
    { word: "tub", emoji: "🛁" }, { word: "run", emoji: "🏃" },
  ],
  digraph_sh: [
    { word: "ship", emoji: "🚢" }, { word: "fish", emoji: "🐟" }, { word: "shell", emoji: "🐚" },
    { word: "dish", emoji: "🍽️" }, { word: "cash", emoji: "💵" }, { word: "shop", emoji: "🛍️" },
  ],
  digraph_ch: [
    { word: "chick", emoji: "🐤" }, { word: "lunch", emoji: "🍱" }, { word: "chop", emoji: "🪓" },
    { word: "chess", emoji: "♟️" }, { word: "chips", emoji: "🍟" }, { word: "bench", emoji: "🪑" },
  ],
  digraph_th_ck: [
    { word: "bath", emoji: "🛁" }, { word: "math", emoji: "➕" }, { word: "think", emoji: "🤔" },
    { word: "duck", emoji: "🦆" }, { word: "sock", emoji: "🧦" }, { word: "rock", emoji: "🪨" },
    { word: "lock", emoji: "🔒" },
  ],
  blend_start: [
    { word: "frog", emoji: "🐸" }, { word: "crab", emoji: "🦀" }, { word: "drum", emoji: "🥁" },
    { word: "flag", emoji: "🚩" }, { word: "sled", emoji: "🛷" }, { word: "plug", emoji: "🔌" },
    { word: "swim", emoji: "🏊" }, { word: "stop", emoji: "🛑" }, { word: "clap", emoji: "👏" },
    { word: "grin", emoji: "😁" },
  ],
  blend_end: [
    { word: "hand", emoji: "✋" }, { word: "tent", emoji: "⛺" }, { word: "milk", emoji: "🥛" },
    { word: "gift", emoji: "🎁" }, { word: "golf", emoji: "⛳" }, { word: "mask", emoji: "🎭" },
    { word: "nest", emoji: "🪺" },
  ],
};

/**
 * Extra real words used only as look-alike distractors ("cat" vs "cot" vs "cut").
 * Keep this list kid-safe: generated distractors never invent spellings.
 */
const DISTRACTOR_WORDS = [
  "cot", "cut", "hit", "hot", "hut", "bit", "bet", "but", "pat", "pet", "pit", "mat", "met",
  "mop", "tan", "tin", "fan", "fin", "fun", "big", "bag", "beg", "bug", "dig", "dug", "hog",
  "jog", "fog", "pop", "top", "tip", "tap", "nap", "nip", "lap", "lid", "led", "lad", "sad",
  "sat", "set", "sip", "sap", "rug", "rag", "rig", "rod", "rid", "bed", "bad", "bud", "bid",
  "pen", "pin", "pan", "pun", "ten", "ton", "men", "man", "dam", "dim", "den", "din", "hen",
  "hum", "him", "ham", "jam", "jab", "job", "web", "wed", "wig", "win", "van", "vat", "box",
  "bat", "fox", "fix", "six", "sax", "mix", "wax", "yes", "yet", "yum", "zap", "zip", "cab",
  "cub", "cob", "kit", "kid", "can", "con", "cap", "cop", "cup", "sun", "sum", "run", "ran",
  "nut", "net", "not", "tub", "tab", "rub", "rob", "dog", "dot", "log", "leg", "lag", "pot",
  "pit", "put", "hug", "hag", "lip", "lap", "map", "mud", "mad", "red", "rat", "wet", "jet",
  "ship", "shop", "chip", "chop", "fish", "dish", "wish", "cash", "dash", "mash", "shell",
  "chick", "check", "chess", "lunch", "bunch", "munch", "bench", "chips", "ships", "shops",
  "bath", "math", "path", "moth", "think", "thick", "thin", "duck", "deck", "dock", "sock",
  "sack", "rock", "rack", "lock", "lick", "luck", "frog", "flag", "flog", "crab", "grab",
  "drum", "drip", "sled", "slid", "plug", "plum", "swim", "slim", "stop", "step", "clap",
  "clip", "grin", "grim", "hand", "band", "sand", "tent", "test", "milk", "silk", "gift",
  "lift", "golf", "mask", "task", "nest", "best", "pond", "bond", "fond",
];

/** High-frequency words, taught by sound (read aloud) + sight. */
export const SIGHT_WORDS: Record<string, string[]> = {
  sight_1: ["the", "a", "I", "to", "and", "is", "it", "see", "go", "can"],
  sight_2: ["you", "we", "my", "he", "she", "said", "was", "of", "like", "look"],
};

const SIGHT_DISTRACTORS = [
  "the", "then", "they", "this", "a", "at", "I", "in", "is", "it", "if", "to", "too", "two",
  "and", "an", "as", "see", "so", "she", "go", "got", "can", "cat", "you", "your", "yes",
  "we", "me", "my", "by", "he", "her", "said", "sad", "was", "saw", "as", "of", "off", "on",
  "like", "look", "lake", "book", "took",
];

export const ALL_PICTURE_WORDS: PictureWord[] = [
  ...Object.values(LETTER_PICTURES).flat(),
  ...Object.values(WORD_SETS).flat(),
];

// --- Literacy config ---

export type LiteracyConfig =
  | { type: "letter_sounds"; letters: string[] }
  | { type: "words"; sets: string[] }
  | { type: "sight_words"; sets: string[] };

// --- Literacy problem shapes ---

export type ChoiceStyle = "letter" | "word" | "picture";

/** One prompt (picture, letter, word or "c _ t"), pick one of 4 choices. */
export type LiteracyChoiceProblem = {
  kind: "literacy_choice";
  instruction: string;
  /** Big text shown above the choices (emoji, letter, word). Empty when audio-only. */
  display: string;
  /** Smaller line under the display, e.g. "c _ t". */
  subDisplay?: string;
  /** What the 🔊 button (and auto-read) says. */
  speak: string;
  choices: string[];
  answer: string;
  choiceStyle: ChoiceStyle;
  /** Shown in the results "review" list. */
  review: string;
};

/** Tap every picture/word that matches. */
export type LiteracyPopProblem = {
  kind: "literacy_pop";
  instruction: string;
  display: string;
  speak: string;
  items: string[];
  correctIndices: number[];
  itemStyle: ChoiceStyle;
  review: string;
};

/** Tap letter tiles in order to spell the pictured word. */
export type SpellWordProblem = {
  kind: "spell_word";
  emoji: string;
  word: string;
  tiles: string[];
  speak: string;
};

export type LiteracyProblem = LiteracyChoiceProblem | LiteracyPopProblem | SpellWordProblem;

export type LiteracySlotKind =
  | "picture_to_letter"
  | "letter_to_picture"
  | "letter_pop"
  | "picture_to_word"
  | "word_to_picture"
  | "missing_letter"
  | "spell_word"
  | "hear_word"
  | "word_pop";

// --- Helpers ---

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");
const VOWELS = ["a", "e", "i", "o", "u"];

/** Letters whose keyword pictures start with the same sound (cat / kite / queen). */
const SAME_SOUND: Record<string, string[]> = { c: ["k", "q"], k: ["c", "q"], q: ["c", "k"] };

function soundsAlike(a: string, b: string): boolean {
  return a === b || (SAME_SOUND[a] ?? []).includes(b);
}

/** Letters to fill out a choice set when the skill's own set is small. */
function letterPool(letters: string[], count: number, exclude: string): string[] {
  const own = letters.filter((l) => !soundsAlike(exclude, l));
  const extra = ALPHABET.filter((l) => !letters.includes(l) && !soundsAlike(exclude, l));
  return [...shuffle(own), ...shuffle(extra)].slice(0, count);
}

/** Pictures safe to show without a spoken name. */
function silentPictures(letter: string): LetterPicture[] {
  return LETTER_PICTURES[letter].filter((p) => !p.hint);
}

function letterDistractorPictures(target: string, count: number): PictureWord[] {
  const out: PictureWord[] = [];
  const seenEmoji = new Set<string>();
  // Never use a picture whose word starts (or ends, for x) with the target sound.
  const candidates = shuffle(
    Object.entries(LETTER_PICTURES)
      .filter(([l]) => !soundsAlike(target, l))
      .flatMap(([, pics]) => pics)
  ).filter(
    (p) =>
      !p.hint &&
      !ALPHABET.some((l) => soundsAlike(target, l) && p.word.startsWith(l)) &&
      !(target === "x" && p.word.endsWith("x"))
  );
  for (const p of candidates) {
    if (out.length >= count) break;
    if (seenEmoji.has(p.emoji)) continue;
    seenEmoji.add(p.emoji);
    out.push(p);
  }
  return out;
}

function soundPhrase(letter: string, pic: { end?: boolean }): string {
  return pic.end ? "ends with" : "starts with";
}

function editDistanceOneSameLength(a: string, b: string): boolean {
  if (a.length !== b.length || a === b) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diff++;
  return diff === 1;
}

/** Look-alike real words for `word`, closest first. */
function lookAlikes(word: string, count: number): string[] {
  const pool = Array.from(
    new Set([...DISTRACTOR_WORDS, ...Object.values(WORD_SETS).flat().map((w) => w.word)])
  ).filter((w) => w !== word);
  const close = shuffle(pool.filter((w) => editDistanceOneSameLength(w, word)));
  const sameLen = shuffle(pool.filter((w) => w.length === word.length && !close.includes(w)));
  return [...close, ...sameLen].slice(0, count);
}

function wordsFor(config: LiteracyConfig): PictureWord[] {
  if (config.type !== "words") return [];
  return config.sets.flatMap((s) => WORD_SETS[s] ?? []);
}

// --- Generators: letter sounds ---

function genPictureToLetter(letters: string[]): LiteracyChoiceProblem {
  const letter = pick(letters);
  const pic = pick(LETTER_PICTURES[letter]);
  const phrase = soundPhrase(letter, pic);
  const choices = shuffle([letter, ...letterPool(letters, 3, letter)]);
  return {
    kind: "literacy_choice",
    instruction: phrase === "ends with" ? "What sound does it end with?" : "What sound does it start with?",
    display: pic.emoji,
    speak: `${pic.word}. What sound does ${pic.word} ${phrase === "ends with" ? "end" : "start"} with?`,
    choices,
    answer: letter,
    choiceStyle: "letter",
    review: `${pic.emoji} ${pic.word} ${phrase}`,
  };
}

function genLetterToPicture(letters: string[]): LiteracyChoiceProblem {
  const usable = letters.filter((l) => silentPictures(l).length > 0);
  if (usable.length === 0) return genPictureToLetter(letters);
  const letter = pick(usable);
  const pic = pick(silentPictures(letter));
  const wrong = letterDistractorPictures(letter, 3);
  const phrase = soundPhrase(letter, pic);
  return {
    kind: "literacy_choice",
    instruction: `Which one ${phrase} this sound?`,
    display: letter,
    speak: `Which picture ${phrase} this letter's sound?`,
    choices: shuffle([pic.emoji, ...wrong.map((w) => w.emoji)]),
    answer: pic.emoji,
    choiceStyle: "picture",
    review: `${capitalizeFirst(phrase)} ${letter}`,
  };
}

function genLetterPop(letters: string[]): LiteracyPopProblem | LiteracyChoiceProblem {
  const usable = letters.filter((l) => silentPictures(l).length > 0);
  if (usable.length === 0) return genPictureToLetter(letters);
  const letter = pick(usable);
  const own = shuffle(silentPictures(letter)).slice(0, 3);
  const wrong = letterDistractorPictures(letter, 6 - own.length);
  const all = shuffle([
    ...own.map((p) => ({ emoji: p.emoji, ok: true })),
    ...wrong.map((p) => ({ emoji: p.emoji, ok: false })),
  ]);
  const phrase = soundPhrase(letter, own[0]);
  return {
    kind: "literacy_pop",
    instruction: `Tap all that ${phrase === "ends with" ? "end" : "start"} with`,
    display: letter,
    speak: `Tap every picture that ${phrase} this letter's sound.`,
    items: all.map((a) => a.emoji),
    correctIndices: all.map((a, i) => (a.ok ? i : -1)).filter((i) => i >= 0),
    itemStyle: "picture",
    review: `${capitalizeFirst(phrase)} ${letter}`,
  };
}

// --- Generators: decodable words ---

function genPictureToWord(words: PictureWord[]): LiteracyChoiceProblem {
  const target = pick(words);
  const choices = shuffle([target.word, ...lookAlikes(target.word, 3)]);
  return {
    kind: "literacy_choice",
    instruction: "Which word is this?",
    display: target.emoji,
    speak: "Which word matches the picture?",
    choices,
    answer: target.word,
    choiceStyle: "word",
    review: target.emoji,
  };
}

function genWordToPicture(words: PictureWord[]): LiteracyChoiceProblem {
  const target = pick(words);
  const others = shuffle(
    ALL_PICTURE_WORDS.filter(
      (w) => w.emoji !== target.emoji && w.word !== target.word && !(w as LetterPicture).hint
    )
  );
  const wrong: string[] = [];
  for (const w of others) {
    if (wrong.length >= 3) break;
    if (!wrong.includes(w.emoji)) wrong.push(w.emoji);
  }
  return {
    kind: "literacy_choice",
    instruction: "Read it! Which picture?",
    display: target.word,
    speak: "Read the word, then tap its picture.",
    choices: shuffle([target.emoji, ...wrong]),
    answer: target.emoji,
    choiceStyle: "picture",
    review: target.word,
  };
}

function genMissingLetter(words: PictureWord[]): LiteracyChoiceProblem {
  const target = pick(words);
  const w = target.word;
  // Prefer the vowel (the hardest part to hear), sometimes a consonant.
  const vowelIdx = w.split("").findIndex((c) => VOWELS.includes(c));
  const idx = Math.random() < 0.6 && vowelIdx >= 0 ? vowelIdx : pick([0, w.length - 1]);
  const answer = w[idx];
  const isVowel = VOWELS.includes(answer);
  const pool = isVowel
    ? VOWELS.filter((v) => v !== answer)
    : ALPHABET.filter((l) => !VOWELS.includes(l) && l !== answer);
  // Never offer a distractor that also spells a real word (e.g. c_t → "cot").
  const known = new Set([...DISTRACTOR_WORDS, ...ALL_PICTURE_WORDS.map((p) => p.word)]);
  const safe = shuffle(pool).filter((l) => !known.has(w.slice(0, idx) + l + w.slice(idx + 1)));
  const wrong = [...safe, ...shuffle(pool)].filter((l, i, a) => a.indexOf(l) === i).slice(0, 3);
  const pattern = w
    .split("")
    .map((c, i) => (i === idx ? "_" : c))
    .join(" ");
  return {
    kind: "literacy_choice",
    instruction: "Which letter is missing?",
    display: target.emoji,
    subDisplay: pattern,
    speak: `${target.word}. Which letter is missing?`,
    choices: shuffle([answer, ...wrong]),
    answer,
    choiceStyle: "letter",
    review: `${target.emoji} ${pattern}`,
  };
}

function genSpellWord(words: PictureWord[]): SpellWordProblem {
  const target = pick(words);
  const letters = target.word.split("");
  const extra = shuffle(ALPHABET.filter((l) => !letters.includes(l)))[0];
  return {
    kind: "spell_word",
    emoji: target.emoji,
    word: target.word,
    tiles: shuffle([...letters, extra]),
    speak: `Spell ${target.word}.`,
  };
}

// --- Generators: sight words ---

function sightWordsFor(config: LiteracyConfig): string[] {
  if (config.type !== "sight_words") return [];
  return config.sets.flatMap((s) => SIGHT_WORDS[s] ?? []);
}

function sightDistractors(word: string, own: string[], count: number): string[] {
  const lower = word.toLowerCase();
  const close = SIGHT_DISTRACTORS.filter(
    (w) => w.toLowerCase() !== lower && (w[0].toLowerCase() === lower[0] || w.length === word.length)
  );
  const rest = own.filter((w) => w.toLowerCase() !== lower);
  return Array.from(new Set([...shuffle(close), ...shuffle(rest)])).slice(0, count);
}

function genHearWord(words: string[]): LiteracyChoiceProblem {
  const word = pick(words);
  return {
    kind: "literacy_choice",
    instruction: "Tap the word you hear",
    display: "",
    speak: word === "a" ? "a. As in, a cat." : word,
    choices: shuffle([word, ...sightDistractors(word, words, 3)]),
    answer: word,
    choiceStyle: "word",
    review: "🔊",
  };
}

function genWordPop(words: string[]): LiteracyPopProblem {
  const word = pick(words);
  const copies = 2 + Math.floor(Math.random() * 2);
  const wrong = sightDistractors(word, words, 6 - copies);
  const all = shuffle([
    ...Array(copies).fill(null).map(() => ({ w: word, ok: true })),
    ...wrong.map((w) => ({ w, ok: false })),
  ]);
  return {
    kind: "literacy_pop",
    instruction: "Tap every",
    display: word,
    speak: `Tap every word that says ${word}.`,
    items: all.map((a) => a.w),
    correctIndices: all.map((a, i) => (a.ok ? i : -1)).filter((i) => i >= 0),
    itemStyle: "word",
    review: "Tap every",
  };
}

function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// --- Session plan + dispatch ---

export function generateLiteracySessionPlan(config: LiteracyConfig): LiteracySlotKind[] {
  let slots: LiteracySlotKind[];
  switch (config.type) {
    case "letter_sounds":
      slots = [
        "picture_to_letter", "picture_to_letter", "picture_to_letter", "picture_to_letter",
        "letter_to_picture", "letter_to_picture", "letter_to_picture",
        "letter_pop", "letter_pop", "picture_to_letter",
      ];
      break;
    case "words":
      slots = [
        "picture_to_word", "picture_to_word", "picture_to_word",
        "word_to_picture", "word_to_picture",
        "missing_letter", "missing_letter",
        "spell_word", "spell_word", "picture_to_word",
      ];
      break;
    case "sight_words":
      slots = [
        "hear_word", "hear_word", "hear_word", "hear_word", "hear_word", "hear_word",
        "word_pop", "word_pop", "word_pop", "hear_word",
      ];
      break;
  }
  return shuffle(slots);
}

export function generateLiteracyProblem(
  slot: LiteracySlotKind,
  config: LiteracyConfig
): LiteracyProblem {
  if (config.type === "letter_sounds") {
    switch (slot) {
      case "letter_to_picture":
        return genLetterToPicture(config.letters);
      case "letter_pop":
        return genLetterPop(config.letters);
      default:
        return genPictureToLetter(config.letters);
    }
  }
  if (config.type === "words") {
    const words = wordsFor(config);
    switch (slot) {
      case "word_to_picture":
        return genWordToPicture(words);
      case "missing_letter":
        return genMissingLetter(words);
      case "spell_word":
        return genSpellWord(words);
      default:
        return genPictureToWord(words);
    }
  }
  const words = sightWordsFor(config);
  return slot === "word_pop" ? genWordPop(words) : genHearWord(words);
}
