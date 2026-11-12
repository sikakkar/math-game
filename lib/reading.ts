import type { ReadingConfig } from "./curriculum";
import { ALL_PHONETIC_WORDS, type Word } from "./words";

// --- Problem types ---

export type WordChoiceMode =
  | "listen"
  | "picture_to_word"
  | "word_to_picture"
  | "missing_sound"
  | "rhyme";

export type WordChoiceProblem = {
  kind: "word_choice";
  mode: WordChoiceMode;
  /** Instruction shown above the question */
  prompt: string;
  /** Word read aloud by the speaker button */
  speak?: string;
  /** Read the word aloud as soon as the question appears */
  autoSpeak: boolean;
  /** Picture shown with the question */
  emoji?: string;
  /** Large text shown with the question, e.g. "c _ t" */
  display?: string;
  choices: string[];
  choiceStyle: "word" | "emoji";
  answer: string;
  /** The target word, for the review list on the results screen */
  word: string;
};

export type SpellWordProblem = {
  kind: "spell_word";
  word: string;
  emoji?: string;
  /** Number of grapheme slots to fill */
  slotCount: number;
  /** Grapheme tiles to tap, shuffled, including one extra that is not needed */
  tiles: string[];
};

export type ReadingProblem = WordChoiceProblem | SpellWordProblem;

export type ReadingSlotKind = WordChoiceMode | "spell_word";

// --- Helpers ---

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const CONSONANTS = "bcdfghjklmnprstvwz".split("");

// Words used recently in this session, so the same word does not come up twice in a row.
const recentWords: string[] = [];
const RECENT_LIMIT = 4;

function pickTarget(pool: Word[]): Word {
  const fresh = pool.filter((w) => !recentWords.includes(w.word));
  const target = pick(fresh.length > 0 ? fresh : pool);
  recentWords.push(target.word);
  if (recentWords.length > RECENT_LIMIT) recentWords.shift();
  return target;
}

/** How different two words look: graphemes that differ, position by position. */
function distance(a: Word, b: Word): number {
  const len = Math.max(a.graphemes.length, b.graphemes.length);
  let d = Math.abs(a.graphemes.length - b.graphemes.length) * 2;
  for (let i = 0; i < len; i++) {
    if (a.graphemes[i] !== b.graphemes[i]) d++;
  }
  return d;
}

/** The n words from the pool that look most like the target (ties broken randomly). */
function similarWords(target: Word, pool: Word[], n: number): Word[] {
  const seen = new Set([target.word]);
  const candidates: Word[] = [];
  for (const w of shuffle(pool)) {
    if (seen.has(w.word)) continue;
    seen.add(w.word);
    candidates.push(w);
  }
  return candidates
    .sort((a, b) => distance(target, a) - distance(target, b))
    .slice(0, n);
}

// Spellings that make the same sound, so "bee" and "sea" count as rhyming.
const SAME_SOUND: Record<string, string> = { ea: "ee", ay: "ai", ow: "oa", ir: "er", ur: "er" };

/** The vowel and everything after it ("at" in "cat"); words rhyme when these match. */
function rime(word: Word): string | null {
  const start = word.graphemes.findIndex((g) => /[aeiou]/.test(g));
  if (start < 0) return null;
  return word.graphemes
    .slice(start)
    .map((g) => SAME_SOUND[g] ?? g)
    .join("");
}

// --- Generators ---

function listen(pool: Word[]): WordChoiceProblem {
  const target = pickTarget(pool);
  const choices = shuffle([target, ...similarWords(target, pool, 3)]).map((w) => w.word);
  return {
    kind: "word_choice",
    mode: "listen",
    prompt: "Tap the word you hear",
    speak: target.word,
    autoSpeak: true,
    choices,
    choiceStyle: "word",
    answer: target.word,
    word: target.word,
  };
}

function pictureToWord(pool: Word[]): WordChoiceProblem {
  const withPictures = pool.filter((w) => w.emoji);
  if (withPictures.length === 0) return listen(pool);
  const target = pickTarget(withPictures);
  // Distractors must not share the target's picture
  const others = pool.filter((w) => w.emoji !== target.emoji);
  const choices = shuffle([target, ...similarWords(target, others, 3)]).map((w) => w.word);
  return {
    kind: "word_choice",
    mode: "picture_to_word",
    prompt: "Which word matches the picture?",
    autoSpeak: false,
    emoji: target.emoji,
    choices,
    choiceStyle: "word",
    answer: target.word,
    word: target.word,
  };
}

function wordToPicture(pool: Word[]): WordChoiceProblem {
  const withPictures = pool.filter((w) => w.emoji);
  if (withPictures.length < 3) return listen(pool);
  const target = pickTarget(withPictures);
  const others = withPictures.filter((w) => w.emoji !== target.emoji);
  const distractors: Word[] = [];
  for (const w of similarWords(target, others, others.length)) {
    if (distractors.length >= 3) break;
    if (!distractors.some((d) => d.emoji === w.emoji)) distractors.push(w);
  }
  return {
    kind: "word_choice",
    mode: "word_to_picture",
    prompt: "Read the word. Tap its picture!",
    autoSpeak: false,
    display: target.word,
    choices: shuffle([target, ...distractors]).map((w) => w.emoji!),
    choiceStyle: "emoji",
    answer: target.emoji!,
    word: target.word,
  };
}

function missingSound(pool: Word[], config: ReadingConfig): ReadingProblem {
  const groups = config.soundGroups;
  if (!groups) return spellWord(pool, config);
  const focus = new Set(groups.flat());
  const eligible = pool.filter((w) => w.graphemes.some((g) => focus.has(g)));
  if (eligible.length === 0) return listen(pool);
  // Prefer words with a picture, so the child is not relying on audio alone
  const withPictures = eligible.filter((w) => w.emoji);
  const target = pickTarget(withPictures.length > 0 ? withPictures : eligible);

  // When every word in the skill uses the same focus sound (e.g. all short "a"),
  // always blanking it would make "a" the answer every time, so blank any sound.
  const focusUsed = new Set(pool.flatMap((w) => w.graphemes.filter((g) => focus.has(g))));
  const positions = target.graphemes
    .map((g, i) => (focusUsed.size === 1 || focus.has(g) ? i : -1))
    .filter((i) => i >= 0);
  const blankAt = pick(positions);
  const answer = target.graphemes[blankAt];
  const distractors = focus.has(answer)
    ? shuffle(
        groups.filter((group) => !group.includes(answer)).map((group) => pick(group))
      ).slice(0, 3)
    : shuffle(CONSONANTS.filter((c) => c !== answer)).slice(0, 3);

  const display = target.graphemes
    .map((g, i) => (i === blankAt ? "_".repeat(Math.max(1, g.length)) : g))
    .join(" ");

  return {
    kind: "word_choice",
    mode: "missing_sound",
    prompt: "Which sound is missing?",
    speak: target.word,
    autoSpeak: false,
    emoji: target.emoji,
    display,
    choices: shuffle([answer, ...distractors]),
    choiceStyle: "word",
    answer,
    word: target.word,
  };
}

function rhyme(pool: Word[]): WordChoiceProblem {
  // Find targets that have a rhyming partner, preferring partners from this skill's words
  const options = shuffle(pool).flatMap((target) => {
    const key = rime(target);
    if (!key) return [];
    const isPartner = (w: Word) => w.word !== target.word && rime(w) === key;
    const partners = pool.filter(isPartner);
    const fallback = ALL_PHONETIC_WORDS.filter(
      (w) => isPartner(w) && w.word.length <= target.word.length + 1
    );
    const partner = partners.length > 0 ? pick(partners) : fallback.length > 0 ? pick(fallback) : null;
    return partner ? [{ target, partner, key }] : [];
  });
  if (options.length === 0) return listen(pool);

  const fresh = options.filter((o) => !recentWords.includes(o.target.word));
  const { target, partner, key } = pick(fresh.length > 0 ? fresh : options);
  recentWords.push(target.word);
  if (recentWords.length > RECENT_LIMIT) recentWords.shift();

  const nonRhymes = pool.filter((w) => rime(w) !== key);
  const distractors = similarWords(target, nonRhymes, 3);
  return {
    kind: "word_choice",
    mode: "rhyme",
    prompt: "Which word rhymes with",
    speak: target.word,
    autoSpeak: false,
    display: target.word,
    choices: shuffle([partner, ...distractors]).map((w) => w.word),
    choiceStyle: "word",
    answer: partner.word,
    word: target.word,
  };
}

function spellWord(pool: Word[], config: ReadingConfig): SpellWordProblem {
  const withPictures = pool.filter((w) => w.emoji);
  const target = pickTarget(
    config.soundGroups && withPictures.length > 0 ? withPictures : pool
  );

  // One extra tile that is not part of the word, to make it a real choice
  let extra: string | undefined;
  if (config.soundGroups) {
    const others = config.soundGroups.flat().filter((g) => !target.graphemes.includes(g));
    if (others.length > 0) extra = pick(others);
  } else {
    const letters = "abcdefghijklmnoprstuwy".split("").filter((l) => !target.word.includes(l));
    extra = pick(letters);
  }

  return {
    kind: "spell_word",
    word: target.word,
    emoji: target.emoji,
    slotCount: target.graphemes.length,
    tiles: shuffle(extra ? [...target.graphemes, extra] : [...target.graphemes]),
  };
}

// --- Session ---

export function generateReadingSessionPlan(): ReadingSlotKind[] {
  recentWords.length = 0;
  return shuffle<ReadingSlotKind>([
    "listen",
    "listen",
    "picture_to_word",
    "picture_to_word",
    "word_to_picture",
    "missing_sound",
    "missing_sound",
    "spell_word",
    "spell_word",
    "rhyme",
  ]);
}

export function generateReadingForSlot(
  slot: ReadingSlotKind,
  config: ReadingConfig
): ReadingProblem {
  const pool = config.words;
  // Sight words are learned whole: no pictures, rhymes or sound swaps
  if (!config.soundGroups) {
    return slot === "spell_word" || slot === "missing_sound"
      ? spellWord(pool, config)
      : listen(pool);
  }
  switch (slot) {
    case "listen":
      return listen(pool);
    case "picture_to_word":
      return pictureToWord(pool);
    case "word_to_picture":
      return wordToPicture(pool);
    case "missing_sound":
      return missingSound(pool, config);
    case "rhyme":
      return rhyme(pool);
    case "spell_word":
      return spellWord(pool, config);
  }
}
