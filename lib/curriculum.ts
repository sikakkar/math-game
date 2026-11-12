export type ProblemType =
  | "addition"
  | "subtraction"
  | "multiplication"
  | "division"
  | "mixed_add_sub"
  | "mixed_mul_div";

export type ProblemConfig = {
  type: ProblemType;
  operand1Range: [number, number];
  operand2Range: [number, number];
  constraints?: {
    sumMax?: number;
    doubles?: boolean;
    fixedOperand?: number;
  };
};

export type Subject = "math" | "reading";

export type ReadingConfig = {
  /** Words with pictures (keys of WORD_EMOJI) this skill practises. */
  words: string[];
  /** Sounds this skill focuses on; one is blanked out in "missing sound" questions. */
  focus: string[];
  /** Sounds offered as choices / decoy tiles (the right answer is always excluded). */
  altSounds: string[];
  /** Extra decodable words (no picture) used for rhymes and look-alike choices. */
  extras: string[];
  /** Every word taught so far on the reading path (filled in below). */
  known: string[];
};

type SkillBase = {
  id: string;
  name: string;
  icon: string;
  prerequisite: string | null;
};

export type MathSkill = SkillBase & { problemConfig: ProblemConfig; readingConfig?: undefined };
export type ReadingSkill = SkillBase & { readingConfig: ReadingConfig; problemConfig?: undefined };
export type Skill = MathSkill | ReadingSkill;

export type Section = {
  name: string;
  color: string;
  skills: Skill[];
};

export const MASTERY_THRESHOLDS: Record<number, number> = {
  1: 7,
  2: 8,
  3: 9,
};

export const CURRICULUM: Section[] = [
  {
    name: "Addition Basics",
    color: "#6C63FF",
    skills: [
      {
        id: "add_within_5",
        name: "Add to 5",
        icon: "1+2",
        prerequisite: null,
        problemConfig: {
          type: "addition",
          operand1Range: [1, 5],
          operand2Range: [1, 5],
          constraints: { sumMax: 5 },
        },
      },
      {
        id: "add_within_10",
        name: "Add to 10",
        icon: "5+3",
        prerequisite: "add_within_5",
        problemConfig: {
          type: "addition",
          operand1Range: [1, 9],
          operand2Range: [1, 9],
          constraints: { sumMax: 10 },
        },
      },
      {
        id: "add_doubles",
        name: "Doubles",
        icon: "4+4",
        prerequisite: "add_within_10",
        problemConfig: {
          type: "addition",
          operand1Range: [1, 10],
          operand2Range: [1, 10],
          constraints: { doubles: true },
        },
      },
      {
        id: "add_within_20",
        name: "Add to 20",
        icon: "9+7",
        prerequisite: "add_doubles",
        problemConfig: {
          type: "addition",
          operand1Range: [1, 19],
          operand2Range: [1, 19],
          constraints: { sumMax: 20 },
        },
      },
    ],
  },
  {
    name: "Subtraction Basics",
    color: "#8B5CF6",
    skills: [
      {
        id: "sub_within_5",
        name: "Sub to 5",
        icon: "5-2",
        prerequisite: "add_within_20",
        problemConfig: {
          type: "subtraction",
          operand1Range: [2, 5],
          operand2Range: [1, 5],
        },
      },
      {
        id: "sub_within_10",
        name: "Sub to 10",
        icon: "8-3",
        prerequisite: "sub_within_5",
        problemConfig: {
          type: "subtraction",
          operand1Range: [2, 10],
          operand2Range: [1, 10],
        },
      },
      {
        id: "sub_within_20",
        name: "Sub to 20",
        icon: "15-8",
        prerequisite: "sub_within_10",
        problemConfig: {
          type: "subtraction",
          operand1Range: [2, 20],
          operand2Range: [1, 20],
        },
      },
    ],
  },
  {
    name: "Add & Subtract Mix",
    color: "#7C3AED",
    skills: [
      {
        id: "mixed_within_10",
        name: "Mix to 10",
        icon: "±10",
        prerequisite: "sub_within_20",
        problemConfig: {
          type: "mixed_add_sub",
          operand1Range: [1, 10],
          operand2Range: [1, 10],
          constraints: { sumMax: 10 },
        },
      },
      {
        id: "mixed_within_20",
        name: "Mix to 20",
        icon: "±20",
        prerequisite: "mixed_within_10",
        problemConfig: {
          type: "mixed_add_sub",
          operand1Range: [1, 20],
          operand2Range: [1, 20],
          constraints: { sumMax: 20 },
        },
      },
    ],
  },
  {
    name: "Bigger Numbers",
    color: "#4F46E5",
    skills: [
      {
        id: "add_tens",
        name: "Add Tens",
        icon: "30+5",
        prerequisite: "mixed_within_20",
        problemConfig: {
          type: "addition",
          operand1Range: [10, 50],
          operand2Range: [1, 9],
        },
      },
      {
        id: "sub_tens",
        name: "Sub Tens",
        icon: "40-7",
        prerequisite: "add_tens",
        problemConfig: {
          type: "subtraction",
          operand1Range: [20, 50],
          operand2Range: [1, 9],
        },
      },
      {
        id: "add_two_digit",
        name: "Add 2-Digit",
        icon: "24+31",
        prerequisite: "sub_tens",
        problemConfig: {
          type: "addition",
          operand1Range: [10, 99],
          operand2Range: [10, 99],
        },
      },
      {
        id: "sub_two_digit",
        name: "Sub 2-Digit",
        icon: "53-27",
        prerequisite: "add_two_digit",
        problemConfig: {
          type: "subtraction",
          operand1Range: [20, 99],
          operand2Range: [10, 99],
        },
      },
      {
        id: "mixed_two_digit",
        name: "Mix 2-Digit",
        icon: "±99",
        prerequisite: "sub_two_digit",
        problemConfig: {
          type: "mixed_add_sub",
          operand1Range: [10, 99],
          operand2Range: [10, 99],
        },
      },
    ],
  },
  {
    name: "Multiplication",
    color: "#FF8C42",
    skills: [
      {
        id: "mul_by_1",
        name: "Times 1",
        icon: "×1",
        prerequisite: "mixed_two_digit",
        problemConfig: {
          type: "multiplication",
          operand1Range: [1, 9],
          operand2Range: [1, 1],
          constraints: { fixedOperand: 1 },
        },
      },
      {
        id: "mul_by_2",
        name: "Times 2",
        icon: "×2",
        prerequisite: "mul_by_1",
        problemConfig: {
          type: "multiplication",
          operand1Range: [1, 9],
          operand2Range: [2, 2],
          constraints: { fixedOperand: 2 },
        },
      },
      {
        id: "mul_by_5",
        name: "Times 5",
        icon: "×5",
        prerequisite: "mul_by_2",
        problemConfig: {
          type: "multiplication",
          operand1Range: [1, 9],
          operand2Range: [5, 5],
          constraints: { fixedOperand: 5 },
        },
      },
      {
        id: "mul_by_10",
        name: "Times 10",
        icon: "×10",
        prerequisite: "mul_by_5",
        problemConfig: {
          type: "multiplication",
          operand1Range: [1, 9],
          operand2Range: [10, 10],
          constraints: { fixedOperand: 10 },
        },
      },
    ],
  },
  {
    name: "Times Tables",
    color: "#F59E0B",
    skills: [
      {
        id: "mul_by_3",
        name: "Times 3",
        icon: "×3",
        prerequisite: "mul_by_10",
        problemConfig: {
          type: "multiplication",
          operand1Range: [1, 9],
          operand2Range: [3, 3],
          constraints: { fixedOperand: 3 },
        },
      },
      {
        id: "mul_by_4",
        name: "Times 4",
        icon: "×4",
        prerequisite: "mul_by_3",
        problemConfig: {
          type: "multiplication",
          operand1Range: [1, 9],
          operand2Range: [4, 4],
          constraints: { fixedOperand: 4 },
        },
      },
      {
        id: "mul_by_6",
        name: "Times 6",
        icon: "×6",
        prerequisite: "mul_by_4",
        problemConfig: {
          type: "multiplication",
          operand1Range: [1, 9],
          operand2Range: [6, 6],
          constraints: { fixedOperand: 6 },
        },
      },
      {
        id: "mul_by_7",
        name: "Times 7",
        icon: "×7",
        prerequisite: "mul_by_6",
        problemConfig: {
          type: "multiplication",
          operand1Range: [1, 9],
          operand2Range: [7, 7],
          constraints: { fixedOperand: 7 },
        },
      },
      {
        id: "mul_by_8",
        name: "Times 8",
        icon: "×8",
        prerequisite: "mul_by_7",
        problemConfig: {
          type: "multiplication",
          operand1Range: [1, 9],
          operand2Range: [8, 8],
          constraints: { fixedOperand: 8 },
        },
      },
      {
        id: "mul_by_9",
        name: "Times 9",
        icon: "×9",
        prerequisite: "mul_by_8",
        problemConfig: {
          type: "multiplication",
          operand1Range: [1, 9],
          operand2Range: [9, 9],
          constraints: { fixedOperand: 9 },
        },
      },
      {
        id: "mul_by_11",
        name: "Times 11",
        icon: "×11",
        prerequisite: "mul_by_9",
        problemConfig: {
          type: "multiplication",
          operand1Range: [1, 12],
          operand2Range: [11, 11],
          constraints: { fixedOperand: 11 },
        },
      },
      {
        id: "mul_by_12",
        name: "Times 12",
        icon: "×12",
        prerequisite: "mul_by_11",
        problemConfig: {
          type: "multiplication",
          operand1Range: [1, 12],
          operand2Range: [12, 12],
          constraints: { fixedOperand: 12 },
        },
      },
      {
        id: "mul_mixed",
        name: "Mixed ×",
        icon: "×?",
        prerequisite: "mul_by_12",
        problemConfig: {
          type: "multiplication",
          operand1Range: [1, 9],
          operand2Range: [1, 12],
        },
      },
    ],
  },
  {
    name: "Division",
    color: "#EF4444",
    skills: [
      {
        id: "div_by_2",
        name: "Divide by 2",
        icon: "÷2",
        prerequisite: "mul_mixed",
        problemConfig: {
          type: "division",
          operand1Range: [1, 9],
          operand2Range: [2, 2],
          constraints: { fixedOperand: 2 },
        },
      },
      {
        id: "div_by_5",
        name: "Divide by 5",
        icon: "÷5",
        prerequisite: "div_by_2",
        problemConfig: {
          type: "division",
          operand1Range: [1, 9],
          operand2Range: [5, 5],
          constraints: { fixedOperand: 5 },
        },
      },
      {
        id: "div_by_3_4",
        name: "Divide 3&4",
        icon: "÷3÷4",
        prerequisite: "div_by_5",
        problemConfig: {
          type: "division",
          operand1Range: [1, 9],
          operand2Range: [3, 4],
        },
      },
      {
        id: "div_mixed",
        name: "Mixed ÷",
        icon: "÷?",
        prerequisite: "div_by_3_4",
        problemConfig: {
          type: "division",
          operand1Range: [1, 12],
          operand2Range: [2, 9],
        },
      },
      {
        id: "mixed_mul_div",
        name: "× and ÷",
        icon: "×÷",
        prerequisite: "div_mixed",
        problemConfig: {
          type: "mixed_mul_div",
          operand1Range: [1, 12],
          operand2Range: [2, 9],
        },
      },
    ],
  },
];

// --- Early literacy ---

const VOWELS = ["a", "e", "i", "o", "u"];
const DIGRAPHS = ["sh", "ch", "th", "ck"];
const VOWEL_TEAMS = ["ee", "ea", "ai", "oa"];

function reading(
  words: string,
  focus: string[],
  altSounds: string[],
  extras: string
): ReadingConfig {
  return {
    words: words.split(" "),
    focus,
    altSounds,
    extras: extras.split(" "),
    known: [],
  };
}

function combine(...configs: ReadingConfig[]): ReadingConfig {
  const uniq = (xs: string[]) => Array.from(new Set(xs));
  const focus = uniq(configs.flatMap((c) => c.focus));
  return {
    words: uniq(configs.flatMap((c) => c.words)),
    focus,
    altSounds: focus,
    extras: uniq(configs.flatMap((c) => c.extras)),
    known: [],
  };
}

const R = {
  a: reading("cat bat hat rat map van cap bag can man ram pan", ["a"], VOWELS,
    "sat mat pat fat tap nap lap sap ban tan dad sad had bad rag tag wag jam dam"),
  i: reading("pig pin lip kid bin zip", ["i"], VOWELS,
    "big dig fig wig sip tip hip dip win fin tin kit sit hit lid did hid"),
  o: reading("dog log pot box fox hot cop dot", ["o"], VOWELS,
    "hog jog fog cot not got hop mop top pop rod nod"),
  u: reading("sun bus cup bug hug nut hut run tub", ["u"], VOWELS,
    "fun bun gun pup cut but rug mug dug jug cub rub"),
  e: reading("bed hen net pen web jet leg ten red", ["e"], VOWELS,
    "fed led wed men bet get let pet set wet peg beg"),
  sh: reading("ship shell fish dish shop cash", ["sh"], DIGRAPHS,
    "wish mash rash dash hop top sell bell"),
  ch: reading("chick chess check chat lunch inch", ["ch"], DIGRAPHS,
    "chin chip much such munch bunch punch hat pick neck"),
  th: reading("bath thumb think math", ["th"], DIGRAPHS,
    "path with thin pink sink wink"),
  ck: reading("duck sock rock lock lick", ["ck"], DIGRAPHS,
    "luck tuck puck dock tick kick pick sick"),
  startBlends: reading("frog crab drum flag sled plug swim grin clap brick truck clock",
    ["fr", "cr", "dr", "fl", "sl", "pl", "sw", "gr", "cl", "br", "tr"],
    ["fr", "cr", "dr", "fl", "sl", "pl", "sw", "gr", "cl", "br", "tr", "bl", "st", "sn"],
    "log jog grab plum bag rag bed bug mug him trim pin win thin map cap snap stick trick luck sock"),
  endBlends: reading("tent hand milk gift ant mask sink vest fist",
    ["nt", "nd", "lk", "ft", "sk", "nk", "st"],
    ["nt", "nd", "lk", "ft", "sk", "nk", "st", "mp"],
    "bent went sent sand band land silk lift sift pant plant task ask pink wink best nest rest test list mist"),
  aeie: reading("cake game snake grape plane skate kite bike dice smile mice", ["a", "i"], VOWELS,
    "lake bake make rake take same name came tape cape cane lane gate late date bite white like hike nice rice mile tile"),
  oeue: reading("rose bone nose rope home globe cube tune mute", ["o", "u"], VOWELS,
    "hose close cone stone dome hope slope robe tube dune june cute"),
  eeea: reading("bee tree feet sheep seed queen teeth leaf tea beach peach seal meat",
    ["ee", "ea"], VOWEL_TEAMS,
    "see free meet sweet keep deep feed need weed green seen sea pea reach teach meal deal real beat heat seat eat"),
  aioa: reading("rain snail mail train nail paint boat goat coat soap road",
    ["ai", "oa"], VOWEL_TEAMS,
    "pain main chain brain tail sail pail faint float moat load toad"),
};

export const READING_CURRICULUM: Section[] = [
  {
    name: "CVC Words",
    color: "#0EA5E9",
    skills: [
      { id: "read_cvc_a", name: "Short a", icon: "cat", prerequisite: null, readingConfig: R.a },
      { id: "read_cvc_i", name: "Short i", icon: "pig", prerequisite: "read_cvc_a", readingConfig: R.i },
      { id: "read_cvc_o", name: "Short o", icon: "dog", prerequisite: "read_cvc_i", readingConfig: R.o },
      { id: "read_cvc_u", name: "Short u", icon: "sun", prerequisite: "read_cvc_o", readingConfig: R.u },
      { id: "read_cvc_e", name: "Short e", icon: "bed", prerequisite: "read_cvc_u", readingConfig: R.e },
      { id: "read_cvc_mix", name: "CVC Mix", icon: "a·e·i", prerequisite: "read_cvc_e",
        readingConfig: combine(R.a, R.i, R.o, R.u, R.e) },
    ],
  },
  {
    name: "Digraphs",
    color: "#14B8A6",
    skills: [
      { id: "read_sh", name: "sh", icon: "sh", prerequisite: "read_cvc_mix", readingConfig: R.sh },
      { id: "read_ch", name: "ch", icon: "ch", prerequisite: "read_sh", readingConfig: R.ch },
      { id: "read_th", name: "th", icon: "th", prerequisite: "read_ch", readingConfig: R.th },
      { id: "read_ck", name: "ck", icon: "ck", prerequisite: "read_th", readingConfig: R.ck },
      { id: "read_digraph_mix", name: "Digraph Mix", icon: "sh·ch", prerequisite: "read_ck",
        readingConfig: combine(R.sh, R.ch, R.th, R.ck) },
    ],
  },
  {
    name: "Blends",
    color: "#22C55E",
    skills: [
      { id: "read_blend_start", name: "Start Blends", icon: "fr-", prerequisite: "read_digraph_mix", readingConfig: R.startBlends },
      { id: "read_blend_end", name: "End Blends", icon: "-nd", prerequisite: "read_blend_start", readingConfig: R.endBlends },
    ],
  },
  {
    name: "Magic e",
    color: "#EC4899",
    skills: [
      { id: "read_magic_e_ai", name: "a_e & i_e", icon: "a_e", prerequisite: "read_blend_end", readingConfig: R.aeie },
      { id: "read_magic_e_ou", name: "o_e & u_e", icon: "o_e", prerequisite: "read_magic_e_ai", readingConfig: R.oeue },
    ],
  },
  {
    name: "Vowel Teams",
    color: "#F97316",
    skills: [
      { id: "read_team_ee_ea", name: "ee & ea", icon: "ee", prerequisite: "read_magic_e_ou", readingConfig: R.eeea },
      { id: "read_team_ai_oa", name: "ai & oa", icon: "ai", prerequisite: "read_team_ee_ea", readingConfig: R.aioa },
      { id: "read_team_mix", name: "Team Mix", icon: "ee·oa", prerequisite: "read_team_ai_oa",
        readingConfig: combine(R.eeea, R.aioa) },
    ],
  },
];

// Each reading skill may borrow look-alike words from anything taught up to that point.
{
  const known = new Set<string>();
  for (const skill of READING_CURRICULUM.flatMap((s) => s.skills)) {
    const cfg = skill.readingConfig!;
    for (const w of [...cfg.words, ...cfg.extras]) known.add(w);
    cfg.known = Array.from(known);
  }
}

export const CURRICULA: Record<Subject, Section[]> = {
  math: CURRICULUM,
  reading: READING_CURRICULUM,
};

export const SUBJECTS: { id: Subject; name: string; icon: string }[] = [
  { id: "math", name: "Math", icon: "🔢" },
  { id: "reading", name: "Reading", icon: "📖" },
];

export const SUBJECT_SKILLS: Record<Subject, Skill[]> = {
  math: CURRICULUM.flatMap((s) => s.skills),
  reading: READING_CURRICULUM.flatMap((s) => s.skills),
};

export const SKILL_SUBJECT_MAP: Record<string, Subject> = Object.fromEntries(
  (Object.keys(SUBJECT_SKILLS) as Subject[]).flatMap((subject) =>
    SUBJECT_SKILLS[subject].map((skill) => [skill.id, subject])
  )
);

export const ALL_SKILLS: Skill[] = [...SUBJECT_SKILLS.math, ...SUBJECT_SKILLS.reading];

export const SKILL_MAP: Record<string, Skill> = Object.fromEntries(
  ALL_SKILLS.map((s) => [s.id, s])
);

export const SKILL_SECTION_MAP: Record<string, Section> = Object.fromEntries(
  [...CURRICULUM, ...READING_CURRICULUM].flatMap((section) =>
    section.skills.map((skill) => [skill.id, section])
  )
);
