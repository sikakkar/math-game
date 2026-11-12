import * as W from "./words";
import type { Word } from "./words";

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

type BaseSkill = {
  id: string;
  name: string;
  icon: string;
  prerequisite: string | null;
};

export type MathSkill = BaseSkill & {
  problemConfig: ProblemConfig;
};

export type ReadingConfig = {
  /** Words practised in this skill */
  words: Word[];
  /**
   * Graphemes this skill focuses on, grouped by sound. "Missing letter"
   * questions blank one of these and offer graphemes from the other groups
   * as wrong answers. Omit for sight words (learned whole, not sounded out).
   */
  soundGroups?: string[][];
};

export type ReadingSkill = BaseSkill & {
  readingConfig: ReadingConfig;
};

export type Skill = MathSkill | ReadingSkill;

export function isReadingSkill(skill: Skill): skill is ReadingSkill {
  return "readingConfig" in skill;
}

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

const SHORT_VOWELS = [["a"], ["e"], ["i"], ["o"], ["u"]];
const DIGRAPHS = [["sh"], ["ch"], ["th"], ["ck"]];

/**
 * Early literacy, following a systematic-phonics order: short-vowel CVC words
 * first, then sight words, digraphs, blends, long vowels and r-controlled vowels.
 */
export const READING_CURRICULUM: Section[] = [
  {
    name: "Short Vowel Words",
    color: "#10B981",
    skills: [
      { id: "read_cvc_a", name: "Short a", icon: "cat", prerequisite: null,
        readingConfig: { words: W.SHORT_A, soundGroups: SHORT_VOWELS } },
      { id: "read_cvc_i", name: "Short i", icon: "pig", prerequisite: "read_cvc_a",
        readingConfig: { words: W.SHORT_I, soundGroups: SHORT_VOWELS } },
      { id: "read_cvc_o", name: "Short o", icon: "dog", prerequisite: "read_cvc_i",
        readingConfig: { words: W.SHORT_O, soundGroups: SHORT_VOWELS } },
      { id: "read_cvc_u", name: "Short u", icon: "sun", prerequisite: "read_cvc_o",
        readingConfig: { words: W.SHORT_U, soundGroups: SHORT_VOWELS } },
      { id: "read_cvc_e", name: "Short e", icon: "bed", prerequisite: "read_cvc_u",
        readingConfig: { words: W.SHORT_E, soundGroups: SHORT_VOWELS } },
      { id: "read_cvc_mix", name: "CVC Mix", icon: "a e i", prerequisite: "read_cvc_e",
        readingConfig: {
          words: [...W.SHORT_A, ...W.SHORT_I, ...W.SHORT_O, ...W.SHORT_U, ...W.SHORT_E],
          soundGroups: SHORT_VOWELS,
        } },
    ],
  },
  {
    name: "First Sight Words",
    color: "#14B8A6",
    skills: [
      { id: "read_sight_1", name: "Sight Words 1", icon: "the", prerequisite: "read_cvc_mix",
        readingConfig: { words: W.SIGHT_1 } },
      { id: "read_sight_2", name: "Sight Words 2", icon: "said", prerequisite: "read_sight_1",
        readingConfig: { words: W.SIGHT_2 } },
    ],
  },
  {
    name: "Digraphs",
    color: "#06B6D4",
    skills: [
      { id: "read_digraph_sh", name: "sh words", icon: "sh", prerequisite: "read_sight_2",
        readingConfig: { words: W.DIGRAPH_SH, soundGroups: DIGRAPHS } },
      { id: "read_digraph_ch", name: "ch words", icon: "ch", prerequisite: "read_digraph_sh",
        readingConfig: { words: W.DIGRAPH_CH, soundGroups: DIGRAPHS } },
      { id: "read_digraph_th", name: "th words", icon: "th", prerequisite: "read_digraph_ch",
        readingConfig: { words: W.DIGRAPH_TH, soundGroups: DIGRAPHS } },
      { id: "read_digraph_ck", name: "ck words", icon: "ck", prerequisite: "read_digraph_th",
        readingConfig: { words: W.DIGRAPH_CK, soundGroups: DIGRAPHS } },
      { id: "read_digraph_mix", name: "Digraph Mix", icon: "sh ch", prerequisite: "read_digraph_ck",
        readingConfig: {
          words: [...W.DIGRAPH_SH, ...W.DIGRAPH_CH, ...W.DIGRAPH_TH, ...W.DIGRAPH_CK],
          soundGroups: DIGRAPHS,
        } },
    ],
  },
  {
    name: "Blends",
    color: "#0EA5E9",
    skills: [
      { id: "read_blend_start", name: "Start Blends", icon: "fr", prerequisite: "read_digraph_mix",
        readingConfig: { words: W.START_BLENDS, soundGroups: [["r"], ["l"], ["w"], ["t"], ["n"], ["p"]] } },
      { id: "read_blend_end", name: "End Blends", icon: "nd", prerequisite: "read_blend_start",
        readingConfig: { words: W.END_BLENDS, soundGroups: [["n"], ["s"], ["l"], ["m"], ["f"]] } },
    ],
  },
  {
    name: "More Sight Words",
    color: "#3B82F6",
    skills: [
      { id: "read_sight_3", name: "Sight Words 3", icon: "they", prerequisite: "read_blend_end",
        readingConfig: { words: W.SIGHT_3 } },
      { id: "read_sight_4", name: "Sight Words 4", icon: "who", prerequisite: "read_sight_3",
        readingConfig: { words: W.SIGHT_4 } },
    ],
  },
  {
    name: "Long Vowels",
    color: "#22C55E",
    skills: [
      { id: "read_magic_e", name: "Magic e", icon: "a_e", prerequisite: "read_sight_4",
        readingConfig: { words: W.MAGIC_E, soundGroups: [["a"], ["i"], ["o"], ["u"]] } },
      { id: "read_team_ee", name: "ee & ea", icon: "ee", prerequisite: "read_magic_e",
        readingConfig: { words: W.VOWEL_TEAMS_EE, soundGroups: [["ee", "ea"], ["ai"], ["oa"]] } },
      { id: "read_team_ai", name: "ai & ay", icon: "ai", prerequisite: "read_team_ee",
        readingConfig: { words: W.VOWEL_TEAMS_AI, soundGroups: [["ai", "ay"], ["ee"], ["oa"]] } },
      { id: "read_team_oa", name: "oa & ow", icon: "oa", prerequisite: "read_team_ai",
        readingConfig: { words: W.VOWEL_TEAMS_OA, soundGroups: [["oa", "ow"], ["ee"], ["ai"]] } },
    ],
  },
  {
    name: "Bossy R",
    color: "#84CC16",
    skills: [
      { id: "read_r_ar_or", name: "ar & or", icon: "ar", prerequisite: "read_team_oa",
        readingConfig: { words: W.BOSSY_R_AR_OR, soundGroups: [["ar"], ["or"], ["er", "ir", "ur"]] } },
      { id: "read_r_er", name: "er ir ur", icon: "ir", prerequisite: "read_r_ar_or",
        readingConfig: { words: W.BOSSY_R_ER, soundGroups: [["er", "ir", "ur"], ["ar"], ["or"]] } },
    ],
  },
];

export const SUBJECT_CURRICULA: Record<Subject, Section[]> = {
  math: CURRICULUM,
  reading: READING_CURRICULUM,
};

export const SKILL_SUBJECT_MAP: Record<string, Subject> = Object.fromEntries(
  (Object.keys(SUBJECT_CURRICULA) as Subject[]).flatMap((subject) =>
    SUBJECT_CURRICULA[subject].flatMap((section) =>
      section.skills.map((skill) => [skill.id, subject])
    )
  )
);

export const SUBJECT_SKILLS: Record<Subject, Skill[]> = {
  math: CURRICULUM.flatMap((s) => s.skills),
  reading: READING_CURRICULUM.flatMap((s) => s.skills),
};

export const ALL_SKILLS: Skill[] = [...SUBJECT_SKILLS.math, ...SUBJECT_SKILLS.reading];

export const SKILL_MAP: Record<string, Skill> = Object.fromEntries(
  ALL_SKILLS.map((s) => [s.id, s])
);

export const SKILL_SECTION_MAP: Record<string, Section> = Object.fromEntries(
  [...CURRICULUM, ...READING_CURRICULUM].flatMap((section) =>
    section.skills.map((skill) => [skill.id, section])
  )
);
