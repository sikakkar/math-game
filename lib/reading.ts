import type { ReadingConfig } from "./curriculum";
import {
  shuffle,
  type Problem,
  type WordChoiceMode,
} from "./problems";
import { WORD_EMOJI, rime, splitGraphemes } from "./words";

export type ReadingSlotKind = WordChoiceMode | "word_builder" | "rhyme";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Number of differing letters, or Infinity when lengths differ. */
function letterDistance(a: string, b: string): number {
  if (a.length !== b.length) return Infinity;
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

/**
 * Pick `count` distractors for `target` from `pool`, preferring look-alike words
 * (one letter different) so the child has to actually read, not guess from shape.
 */
function lookAlikes(target: string, pool: string[], count: number): string[] {
  const candidates = shuffle(Array.from(new Set(pool)).filter((w) => w !== target));
  candidates.sort((a, b) => {
    const da = Math.min(letterDistance(target, a), 3);
    const db = Math.min(letterDistance(target, b), 3);
    return da - db;
  });
  return candidates.slice(0, count);
}

// Spellings that make the same sound. Offering one as the "wrong" answer for the
// other would be a coin toss for a child sounding the word out, so they never compete.
const SAME_SOUND = [["ee", "ea"]];

/** Sounds from `options` that a child could tell apart from `sound` by ear. */
function distinctSounds(sound: string, options: string[]): string[] {
  const group = SAME_SOUND.find((g) => g.includes(sound)) ?? [sound];
  return options.filter((s) => !group.includes(s));
}

function hasPicture(word: string): boolean {
  return word in WORD_EMOJI;
}

/** Word → tap the matching picture. This is the core decoding exercise. */
export function generateReadWord(config: ReadingConfig): Problem {
  const word = pick(config.words);
  const emoji = WORD_EMOJI[word];
  const pool = config.known.filter(hasPicture);
  const wrong = lookAlikes(word, pool, 3).map((w) => WORD_EMOJI[w]);
  return {
    kind: "word_choice",
    mode: "read_word",
    word,
    emoji,
    choices: shuffle([emoji, ...wrong]),
    answer: emoji,
  };
}

/** Picture → tap the matching word (cat vs cot vs cut…). */
export function generatePictureWord(config: ReadingConfig): Problem {
  const word = pick(config.words);
  const wrong = lookAlikes(word, config.known, 3);
  return {
    kind: "word_choice",
    mode: "picture_word",
    word,
    emoji: WORD_EMOJI[word],
    choices: shuffle([word, ...wrong]),
    answer: word,
  };
}

/** Picture + word with its focus sound blanked out ("c _ t") → pick the sound. */
export function generateMissingSound(config: ReadingConfig): Problem {
  const word = pick(config.words);
  let best: { sound: string; index: number } | null = null;
  for (const sound of config.focus) {
    const index = word.indexOf(sound);
    if (index >= 0 && (!best || index < best.index)) best = { sound, index };
  }
  if (!best) return generatePictureWord(config);
  const alternatives = distinctSounds(best.sound, config.altSounds);
  if (alternatives.length === 0) return generatePictureWord(config);

  const wrong = shuffle(alternatives).slice(0, 3);
  return {
    kind: "word_choice",
    mode: "missing_sound",
    word,
    emoji: WORD_EMOJI[word],
    before: word.slice(0, best.index),
    after: word.slice(best.index + best.sound.length),
    choices: shuffle([best.sound, ...wrong]),
    answer: best.sound,
  };
}

/** Picture → arrange sound tiles (plus one decoy) to spell the word. */
export function generateWordBuilder(config: ReadingConfig): Problem {
  const word = pick(config.words);
  const graphemes = splitGraphemes(word);
  const decoys = config.altSounds.filter((s) =>
    graphemes.every((g) => distinctSounds(g, [s]).length > 0)
  );
  const tiles = decoys.length > 0 ? [...graphemes, pick(decoys)] : [...graphemes];
  return {
    kind: "equation_builder",
    tiles: shuffle(tiles),
    correctOrder: graphemes,
    word,
    emoji: WORD_EMOJI[word],
  };
}

/** Tap every word that rhymes with the target word. */
export function generateRhyme(config: ReadingConfig): Problem {
  const pool = Array.from(new Set([...config.words, ...config.extras]));
  const byRime = new Map<string, string[]>();
  for (const w of pool) {
    const r = rime(w);
    byRime.set(r, [...(byRime.get(r) ?? []), w]);
  }

  // Need the target plus at least two rhymes, and enough non-rhymes to make it a choice.
  const targets = shuffle(pool.filter((w) => (byRime.get(rime(w))?.length ?? 0) >= 3));
  for (const target of targets) {
    const rhymes = shuffle(byRime.get(rime(target))!.filter((w) => w !== target)).slice(0, 3);
    const others = shuffle(pool.filter((w) => rime(w) !== rime(target))).slice(0, 6 - rhymes.length);
    if (others.length < 3) continue;

    const bubbles = shuffle([...rhymes, ...others]);
    return {
      kind: "bubble_pop",
      targetValue: 0,
      title: `Tap words that rhyme with “${target}”`,
      speakText: target,
      bubbles,
      correctIndices: bubbles
        .map((w, i) => (rhymes.includes(w) ? i : -1))
        .filter((i) => i >= 0),
    };
  }
  return generateReadWord(config);
}

export function generateReadingSessionPlan(): ReadingSlotKind[] {
  return shuffle<ReadingSlotKind>([
    "read_word",
    "read_word",
    "read_word",
    "picture_word",
    "picture_word",
    "missing_sound",
    "missing_sound",
    "word_builder",
    "word_builder",
    "rhyme",
  ]);
}

export function generateReadingForSlot(slot: ReadingSlotKind, config: ReadingConfig): Problem {
  switch (slot) {
    case "read_word":
      return generateReadWord(config);
    case "picture_word":
      return generatePictureWord(config);
    case "missing_sound":
      return generateMissingSound(config);
    case "word_builder":
      return generateWordBuilder(config);
    case "rhyme":
      return generateRhyme(config);
  }
}
