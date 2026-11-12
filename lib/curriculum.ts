import type { LiteracyConfig } from "./literacy";

export type Subject = "math" | "reading";

export type SkillConfig = ProblemConfig | LiteracyConfig;

export function isLiteracyConfig(config: SkillConfig): config is LiteracyConfig {
  return (
    config.type === "letter_sounds" ||
    config.type === "words" ||
    config.type === "sight_words"
  );
}

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

export type Skill = {
  id: string;
  name: string;
  icon: string;
  prerequisite: string | null;
  problemConfig: SkillConfig;
};

export type Section = {
  name: string;
  subject: Subject;
  color: string;
  skills: Skill[];
};

export const MASTERY_THRESHOLDS: Record<number, number> = {
  1: 7,
  2: 8,
  3: 9,
};

export const MATH_CURRICULUM: Section[] = [
  {
    subject: "math",
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
    subject: "math",
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
    subject: "math",
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
    subject: "math",
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
    subject: "math",
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
    subject: "math",
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
    subject: "math",
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

const letterSkill = (letters: string[], prerequisite: string | null): Skill => ({
  id: `lit_letters_${letters.join("")}`,
  name: letters.join(" "),
  icon: letters.length > 4 ? `${letters.slice(0, 3).join("")}…` : letters.join(""),
  prerequisite,
  problemConfig: { type: "letter_sounds", letters },
});

/**
 * Reading path: letter sounds (taught in the common "s a t p i n" order, so kids
 * can blend real words early) → CVC words by vowel → digraphs → blends → sight words.
 */
export const READING_CURRICULUM: Section[] = [
  {
    subject: "reading",
    name: "Letter Sounds",
    color: "#10B981",
    skills: [
      letterSkill(["s", "a", "t", "p"], null),
      letterSkill(["i", "n", "m", "d"], "lit_letters_satp"),
      letterSkill(["g", "o", "c", "k"], "lit_letters_inmd"),
      letterSkill(["e", "u", "r", "h"], "lit_letters_gock"),
      letterSkill(["b", "f", "l", "j"], "lit_letters_eurh"),
      letterSkill(["v", "w", "x", "y", "z", "q"], "lit_letters_bflj"),
      {
        id: "lit_letters_all",
        name: "All Sounds",
        icon: "a–z",
        prerequisite: "lit_letters_vwxyzq",
        problemConfig: { type: "letter_sounds", letters: "abcdefghijklmnopqrstuvwxyz".split("") },
      },
    ],
  },
  {
    subject: "reading",
    name: "CVC Words",
    color: "#0EA5E9",
    skills: [
      { id: "lit_cvc_a", name: "Short a", icon: "cat", prerequisite: "lit_letters_all", problemConfig: { type: "words", sets: ["cvc_a"] } },
      { id: "lit_cvc_i", name: "Short i", icon: "pig", prerequisite: "lit_cvc_a", problemConfig: { type: "words", sets: ["cvc_i"] } },
      { id: "lit_cvc_o", name: "Short o", icon: "dog", prerequisite: "lit_cvc_i", problemConfig: { type: "words", sets: ["cvc_o"] } },
      { id: "lit_cvc_e", name: "Short e", icon: "hen", prerequisite: "lit_cvc_o", problemConfig: { type: "words", sets: ["cvc_e"] } },
      { id: "lit_cvc_u", name: "Short u", icon: "sun", prerequisite: "lit_cvc_e", problemConfig: { type: "words", sets: ["cvc_u"] } },
      {
        id: "lit_cvc_mix",
        name: "CVC Mix",
        icon: "a e i",
        prerequisite: "lit_cvc_u",
        problemConfig: { type: "words", sets: ["cvc_a", "cvc_i", "cvc_o", "cvc_e", "cvc_u"] },
      },
    ],
  },
  {
    subject: "reading",
    name: "Sight Words",
    color: "#F43F5E",
    skills: [
      { id: "lit_sight_1", name: "Sight Words 1", icon: "the", prerequisite: "lit_cvc_mix", problemConfig: { type: "sight_words", sets: ["sight_1"] } },
      { id: "lit_sight_2", name: "Sight Words 2", icon: "said", prerequisite: "lit_sight_1", problemConfig: { type: "sight_words", sets: ["sight_2"] } },
    ],
  },
  {
    subject: "reading",
    name: "Digraphs",
    color: "#8B5CF6",
    skills: [
      { id: "lit_dig_sh", name: "sh words", icon: "sh", prerequisite: "lit_sight_2", problemConfig: { type: "words", sets: ["digraph_sh"] } },
      { id: "lit_dig_ch", name: "ch words", icon: "ch", prerequisite: "lit_dig_sh", problemConfig: { type: "words", sets: ["digraph_ch"] } },
      { id: "lit_dig_th_ck", name: "th & ck", icon: "th", prerequisite: "lit_dig_ch", problemConfig: { type: "words", sets: ["digraph_th_ck"] } },
    ],
  },
  {
    subject: "reading",
    name: "Blends",
    color: "#F59E0B",
    skills: [
      { id: "lit_blend_start", name: "Start Blends", icon: "fr", prerequisite: "lit_dig_th_ck", problemConfig: { type: "words", sets: ["blend_start"] } },
      { id: "lit_blend_end", name: "End Blends", icon: "nd", prerequisite: "lit_blend_start", problemConfig: { type: "words", sets: ["blend_end"] } },
      {
        id: "lit_review",
        name: "Big Review",
        icon: "📚",
        prerequisite: "lit_blend_end",
        problemConfig: { type: "words", sets: ["cvc_a", "cvc_i", "cvc_o", "cvc_e", "cvc_u", "digraph_sh", "digraph_ch", "digraph_th_ck", "blend_start", "blend_end"] },
      },
    ],
  },
];

export const SUBJECTS: { id: Subject; label: string; curriculum: Section[] }[] = [
  { id: "math", label: "Math", curriculum: MATH_CURRICULUM },
  { id: "reading", label: "Reading", curriculum: READING_CURRICULUM },
];

/** Every section, math and reading. */
export const CURRICULUM: Section[] = [...MATH_CURRICULUM, ...READING_CURRICULUM];

export const ALL_SKILLS: Skill[] = CURRICULUM.flatMap((s) => s.skills);

export const SKILL_MAP: Record<string, Skill> = Object.fromEntries(
  ALL_SKILLS.map((s) => [s.id, s])
);

export const SKILLS_BY_SUBJECT: Record<Subject, Skill[]> = {
  math: MATH_CURRICULUM.flatMap((s) => s.skills),
  reading: READING_CURRICULUM.flatMap((s) => s.skills),
};

export const SKILL_SECTION_MAP: Record<string, Section> = Object.fromEntries(
  CURRICULUM.flatMap((section) =>
    section.skills.map((skill) => [skill.id, section])
  )
);
