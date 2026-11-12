// Word bank for the early-literacy (reading) track.
//
// Each entry is written as "graphemes:emoji", with graphemes separated by "-".
// A grapheme is the letter or letter group that makes one sound ("sh", "ck", "ee").
// The emoji is optional: words without a clear picture are still used for
// listening, spelling and rhyming questions, just not picture questions.

export type Word = {
  word: string;
  graphemes: string[];
  emoji?: string;
};

function parse(list: string[]): Word[] {
  return list.map((entry) => {
    const [spelled, emoji] = entry.split(":");
    const graphemes = spelled.split("-");
    return { word: graphemes.join(""), graphemes, emoji: emoji || undefined };
  });
}

// --- CVC words, by short vowel ---

export const SHORT_A = parse([
  "c-a-t:🐱", "h-a-t:🎩", "b-a-t:🦇", "r-a-t:🐀", "m-a-t", "s-a-t",
  "m-a-p:🗺️", "c-a-p:🧢", "t-a-p", "n-a-p",
  "c-a-n:🥫", "p-a-n:🍳", "m-a-n:👨", "v-a-n:🚐", "f-a-n", "r-a-n",
  "b-a-g:👜", "t-a-g", "r-a-m:🐏", "j-a-m", "d-a-d", "s-a-d:😢", "m-a-d:😠",
]);

export const SHORT_I = parse([
  "p-i-g:🐷", "w-i-g", "d-i-g", "b-i-g",
  "z-i-p:🤐", "l-i-p:👄", "h-i-p", "s-i-p",
  "p-i-n:📌", "t-i-n", "b-i-n", "w-i-n:🏆", "f-i-n",
  "s-i-x:6️⃣", "m-i-x", "f-i-x",
  "k-i-d:🧒", "l-i-d", "h-i-d", "s-i-t", "h-i-t", "b-i-b",
]);

export const SHORT_O = parse([
  "d-o-g:🐶", "l-o-g:🪵", "h-o-g:🐗", "f-o-g:🌫️", "j-o-g",
  "p-o-t:🍲", "h-o-t:🥵", "d-o-t", "c-o-t", "n-o-t",
  "m-o-p", "t-o-p", "h-o-p",
  "b-o-x:📦", "f-o-x:🦊", "o-x:🐂",
  "j-o-b", "r-o-d", "s-o-b", "r-o-b",
]);

export const SHORT_U = parse([
  "s-u-n:☀️", "b-u-n", "r-u-n:🏃", "f-u-n",
  "b-u-s:🚌", "c-u-p:🥤", "p-u-p",
  "b-u-g:🐛", "r-u-g", "h-u-g:🤗", "m-u-g:☕", "j-u-g",
  "n-u-t:🥜", "c-u-t", "h-u-t:🛖", "g-u-m",
  "t-u-b:🛁", "r-u-b", "m-u-d", "b-u-d",
]);

export const SHORT_E = parse([
  "b-e-d:🛏️", "r-e-d:🟥", "f-e-d", "l-e-d",
  "h-e-n:🐔", "p-e-n:🖊️", "t-e-n:🔟", "m-e-n",
  "n-e-t:🥅", "j-e-t:✈️", "w-e-t", "v-e-t", "p-e-t", "g-e-t", "l-e-t",
  "l-e-g:🦵", "p-e-g", "w-e-b:🕸️", "y-e-s:✅",
]);

// --- Digraphs ---

export const DIGRAPH_SH = parse([
  "sh-i-p:🚢", "sh-e-ll:🐚", "f-i-sh:🐟", "d-i-sh:🍽️", "sh-o-p:🛒",
  "sh-e-d", "sh-u-t", "w-i-sh", "c-a-sh:💵", "r-u-sh",
]);

export const DIGRAPH_CH = parse([
  "ch-i-ck:🐤", "ch-i-n", "ch-o-p", "ch-a-t:💬", "r-i-ch:💰",
  "m-u-ch", "i-n-ch", "l-u-n-ch:🍱", "b-e-n-ch", "ch-i-p",
]);

export const DIGRAPH_TH = parse([
  "b-a-th:🛁", "m-a-th:🧮", "th-i-n", "th-i-ck", "p-a-th",
  "w-i-th", "th-e-m", "th-e-n", "th-a-t", "th-i-s",
]);

export const DIGRAPH_CK = parse([
  "d-u-ck:🦆", "s-o-ck:🧦", "r-o-ck:🪨", "l-o-ck:🔒", "s-i-ck:🤒",
  "k-i-ck", "b-a-ck", "p-a-ck:🎒", "n-e-ck", "l-u-ck",
]);

// --- Consonant blends (letters kept separate: both sounds are heard) ---

export const START_BLENDS = parse([
  "f-r-o-g:🐸", "c-r-a-b:🦀", "d-r-u-m:🥁", "f-l-a-g:🚩", "s-l-e-d:🛷",
  "p-l-u-g:🔌", "c-l-a-p:👏", "s-t-o-p:🛑", "s-w-i-m:🏊", "g-r-i-n:😁",
  "d-r-i-p:💧", "s-n-a-p", "t-r-a-p", "s-p-o-t", "s-l-i-p",
]);

export const END_BLENDS = parse([
  "h-a-n-d:✋", "t-e-n-t:⛺", "m-i-l-k:🥛", "g-i-f-t:🎁", "m-a-s-k:🎭",
  "j-u-m-p", "b-e-s-t", "l-i-s-t", "p-o-n-d", "b-e-l-t",
  "d-e-s-k", "r-a-f-t", "s-a-n-d:🏖️", "l-a-m-p", "w-i-n-d",
]);

// --- Long vowels ---

export const MAGIC_E = parse([
  "c-a-k-e:🎂", "s-n-a-k-e:🐍", "g-a-t-e", "l-a-k-e", "c-a-v-e",
  "b-i-k-e:🚲", "k-i-t-e:🪁", "d-i-c-e:🎲", "m-i-c-e:🐭", "f-i-v-e:5️⃣",
  "b-o-n-e:🦴", "r-o-s-e:🌹", "h-o-m-e:🏠", "n-o-s-e:👃", "r-o-p-e",
  "c-u-b-e:🧊", "t-u-n-e", "m-u-l-e",
]);

export const VOWEL_TEAMS_EE = parse([
  "b-ee:🐝", "t-r-ee:🌳", "f-ee-t:🦶", "sh-ee-p:🐑", "s-ee-d:🌱",
  "l-ea-f:🍃", "t-ea:🍵", "s-ea:🌊", "m-ea-t:🍖", "s-ee",
]);

export const VOWEL_TEAMS_AI = parse([
  "r-ai-n:🌧️", "s-n-ai-l:🐌", "t-r-ai-n:🚆", "m-ai-l:📬", "t-ai-l",
  "h-ay", "d-ay", "p-l-ay", "p-ay", "w-ay",
]);

export const VOWEL_TEAMS_OA = parse([
  "b-oa-t:⛵", "g-oa-t:🐐", "c-oa-t:🧥", "r-oa-d:🛣️", "s-oa-p:🧼",
  "s-n-ow:❄️", "b-ow-l:🥣", "c-r-ow", "t-oa-d", "g-r-ow",
]);

// --- R-controlled vowels ---

export const BOSSY_R_AR_OR = parse([
  "c-ar:🚗", "s-t-ar:⭐", "j-ar:🫙", "sh-ar-k:🦈", "f-ar-m",
  "c-or-n:🌽", "f-or-k:🍴", "h-or-s-e:🐴", "s-t-or-m:⛈️", "p-or-t",
]);

export const BOSSY_R_ER = parse([
  "b-ir-d:🐦", "g-ir-l:👧", "sh-ir-t:👕", "n-ur-s-e:🧑‍⚕️", "t-ur-t-l-e:🐢",
  "f-er-n", "h-er", "s-ur-f:🏄", "b-ur-n", "f-ir-s-t:🥇",
]);

// --- Sight words (no pictures; learned by sight and sound) ---

function sight(words: string[]): Word[] {
  return words.map((w) => ({ word: w, graphemes: w.split("") }));
}

export const SIGHT_1 = sight(["the", "a", "I", "to", "and", "is", "it", "in"]);
export const SIGHT_2 = sight(["you", "said", "was", "are", "of", "he", "she", "we"]);
export const SIGHT_3 = sight(["they", "have", "come", "here", "look", "see", "my", "go"]);
export const SIGHT_4 = sight(["what", "where", "who", "do", "for", "one", "two", "there"]);

export const ALL_PHONETIC_WORDS: Word[] = [
  ...SHORT_A, ...SHORT_I, ...SHORT_O, ...SHORT_U, ...SHORT_E,
  ...DIGRAPH_SH, ...DIGRAPH_CH, ...DIGRAPH_TH, ...DIGRAPH_CK,
  ...START_BLENDS, ...END_BLENDS,
  ...MAGIC_E, ...VOWEL_TEAMS_EE, ...VOWEL_TEAMS_AI, ...VOWEL_TEAMS_OA,
  ...BOSSY_R_AR_OR, ...BOSSY_R_ER,
];
