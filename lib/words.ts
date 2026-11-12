// Word bank for the early-literacy track.
//
// Every word that can appear with a picture lives in WORD_EMOJI. Emojis must be
// unique so "tap the picture" questions never have two right answers.
// Only emojis from Unicode 13 or older are used so they render on older phones.

export const WORD_EMOJI: Record<string, string> = {
  // Short a
  cat: "🐱", bat: "🦇", hat: "🎩", rat: "🐀", map: "🗺️", van: "🚐",
  cap: "🧢", bag: "👜", can: "🥫", man: "👨", ram: "🐏", pan: "🍳",
  // Short i
  pig: "🐷", pin: "📌", lip: "👄", kid: "🧒", bin: "🗑️", zip: "🤐",
  // Short o
  dog: "🐶", log: "🪵", pot: "🍲", box: "📦", fox: "🦊", hot: "🥵",
  cop: "👮", dot: "⚫",
  // Short u
  sun: "☀️", bus: "🚌", cup: "☕", bug: "🐛", hug: "🫂", nut: "🥜",
  hut: "🛖", run: "🏃", tub: "🛁",
  // Short e
  bed: "🛏️", hen: "🐔", net: "🥅", pen: "🖊️", web: "🕸️", jet: "🛩️",
  leg: "🦵", ten: "🔟", red: "🟥",
  // sh
  ship: "🚢", shell: "🐚", fish: "🐟", dish: "🍽️", shop: "🏪", cash: "💵",
  // ch
  chick: "🐤", chess: "♟️", check: "✅", chat: "💬", lunch: "🍱", inch: "📏",
  // th
  bath: "🛀", thumb: "👍", think: "🤔", math: "🧮",
  // ck
  duck: "🦆", sock: "🧦", rock: "🪨", lock: "🔒", lick: "👅",
  // Initial blends
  frog: "🐸", crab: "🦀", drum: "🥁", flag: "🚩", sled: "🛷", plug: "🔌",
  swim: "🏊", grin: "😁", clap: "👏", brick: "🧱", truck: "🚚", clock: "🕐",
  // Final blends
  tent: "⛺", hand: "✋", milk: "🥛", gift: "🎁", ant: "🐜", mask: "😷",
  sink: "🚰", vest: "🦺", fist: "✊",
  // Magic e: a_e, i_e
  cake: "🎂", game: "🎮", snake: "🐍", grape: "🍇", plane: "✈️", skate: "⛸️",
  kite: "🪁", bike: "🚲", dice: "🎲", smile: "😊", mice: "🐁",
  // Magic e: o_e, u_e
  rose: "🌹", bone: "🦴", nose: "👃", rope: "🪢", home: "🏠", globe: "🌎",
  cube: "🧊", tune: "🎵", mute: "🔇",
  // ee, ea
  bee: "🐝", tree: "🌳", feet: "🦶", sheep: "🐑", seed: "🌱", queen: "👸",
  teeth: "🦷", leaf: "🍁", tea: "🍵", beach: "🏖️", peach: "🍑", seal: "🦭",
  meat: "🥩",
  // ai, oa
  rain: "🌧️", snail: "🐌", mail: "📬", train: "🚆", nail: "💅", paint: "🎨",
  boat: "⛵", goat: "🐐", coat: "🧥", soap: "🧼", road: "🛣️",
};

// Letter groups that make one sound, matched longest-first when splitting a word.
const MULTI_LETTER_GRAPHEMES = ["sh", "ch", "th", "ck", "qu", "ee", "ea", "ai", "oa"];

/** Split a word into sound tiles, e.g. "ship" → ["sh", "i", "p"]. */
export function splitGraphemes(word: string): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < word.length) {
    const multi = MULTI_LETTER_GRAPHEMES.find((g) => word.startsWith(g, i));
    if (multi) {
      out.push(multi);
      i += multi.length;
    } else {
      out.push(word[i]);
      i += 1;
    }
  }
  return out;
}

/** The part of a word that rhymes: from its first vowel on ("cat" → "at", "queen" → "een"). */
export function rime(word: string): string {
  const start = word.startsWith("qu") ? 2 : 0;
  for (let i = start; i < word.length; i++) {
    if ("aeiou".includes(word[i])) return word.slice(i);
  }
  return word;
}
