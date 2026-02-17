// --- Problem type discriminated union ---

export type MultipleChoiceProblem = {
  kind: "multiple_choice";
  question: string;
  answer: number;
  choices: number[];
};

export type ComparisonProblem = {
  kind: "comparison";
  expressionA: string;
  expressionB: string;
  valueA: number;
  valueB: number;
  answer: "A" | "B";
};

export type BubblePopProblem = {
  kind: "bubble_pop";
  targetValue: number;
  bubbles: string[];
  correctIndices: number[];
};

export type EquationBuilderProblem = {
  kind: "equation_builder";
  tiles: string[];
  correctOrder: string[];
};

export type OrderingProblem = {
  kind: "ordering";
  items: string[];
  correctOrder: number[];
};

export type Problem =
  | MultipleChoiceProblem
  | ComparisonProblem
  | BubblePopProblem
  | EquationBuilderProblem
  | OrderingProblem;

// --- Session slot types ---

export type SessionSlotKind =
  | "multiple_choice"
  | "missing_operand"
  | "comparison"
  | "bubble_pop"
  | "equation_builder"
  | "ordering";

// --- Helpers ---

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateWrongChoices(answer: number, count: number): number[] {
  const wrong = new Set<number>();
  const candidates = [
    answer - 2,
    answer - 1,
    answer + 1,
    answer + 2,
    answer - 3,
    answer + 3,
  ].filter((n) => n >= 0 && n !== answer);

  for (const c of candidates) {
    if (wrong.size >= count) break;
    wrong.add(c);
  }

  let offset = 4;
  while (wrong.size < count) {
    const candidate = answer + offset;
    if (candidate >= 0 && candidate !== answer) {
      wrong.add(candidate);
    }
    offset = offset > 0 ? -offset : -offset + 1;
  }

  return Array.from(wrong).slice(0, count);
}

// --- Legacy level-based generators (kept for backward compat) ---

function generateAdditionSubtraction(level: number): MultipleChoiceProblem {
  let a: number, b: number, answer: number, question: string;

  switch (level) {
    case 1:
      a = randInt(1, 5);
      b = randInt(1, 5);
      answer = a + b;
      question = `${a} + ${b}`;
      break;
    case 2:
      a = randInt(1, 9);
      b = randInt(1, 9);
      answer = a + b;
      question = `${a} + ${b}`;
      break;
    case 3:
      a = randInt(2, 5);
      b = randInt(1, a);
      answer = a - b;
      question = `${a} - ${b}`;
      break;
    case 4:
      a = randInt(2, 9);
      b = randInt(1, a);
      answer = a - b;
      question = `${a} - ${b}`;
      break;
    case 5: {
      const isAdd = Math.random() > 0.5;
      if (isAdd) {
        a = randInt(1, 9);
        b = randInt(1, 9);
        answer = a + b;
        question = `${a} + ${b}`;
      } else {
        a = randInt(2, 9);
        b = randInt(1, a);
        answer = a - b;
        question = `${a} - ${b}`;
      }
      break;
    }
    case 6:
      a = randInt(10, 50);
      b = randInt(1, 9);
      answer = a + b;
      question = `${a} + ${b}`;
      break;
    case 7:
      a = randInt(10, 99);
      b = randInt(10, 99);
      answer = a + b;
      question = `${a} + ${b}`;
      break;
    case 8:
      a = randInt(20, 99);
      b = randInt(1, 19);
      answer = a - b;
      question = `${a} - ${b}`;
      break;
    case 9:
      a = randInt(20, 99);
      b = randInt(10, a);
      answer = a - b;
      question = `${a} - ${b}`;
      break;
    case 10:
    default: {
      const isAdd2 = Math.random() > 0.5;
      if (isAdd2) {
        a = randInt(10, 99);
        b = randInt(10, 99);
        answer = a + b;
        question = `${a} + ${b}`;
      } else {
        a = randInt(20, 99);
        b = randInt(10, a);
        answer = a - b;
        question = `${a} - ${b}`;
      }
      break;
    }
  }

  const wrong = generateWrongChoices(answer, 3);
  const choices = shuffle([answer, ...wrong]);

  return { kind: "multiple_choice", question, answer, choices };
}

function generateMultiplication(level: number): MultipleChoiceProblem {
  let a: number, b: number;

  switch (level) {
    case 1: {
      a = randInt(1, 2);
      b = randInt(1, 9);
      break;
    }
    case 2: {
      a = Math.random() > 0.5 ? 5 : 10;
      b = randInt(1, 9);
      break;
    }
    case 3: {
      a = randInt(3, 4);
      b = randInt(1, 9);
      break;
    }
    case 4: {
      a = randInt(6, 8);
      b = randInt(1, 9);
      break;
    }
    case 5: {
      if (Math.random() > 0.5) {
        a = 9;
        b = randInt(1, 9);
      } else {
        a = randInt(1, 9);
        b = randInt(1, 9);
      }
      break;
    }
    case 6: {
      a = randInt(1, 9);
      b = randInt(1, 12);
      break;
    }
    case 7: {
      a = randInt(10, 12);
      b = randInt(1, 9);
      break;
    }
    case 8: {
      a = randInt(10, 12);
      b = randInt(10, 12);
      break;
    }
    case 9: {
      if (Math.random() > 0.5) {
        a = randInt(10, 12);
        b = randInt(1, 12);
      } else {
        a = randInt(1, 12);
        b = randInt(1, 12);
      }
      break;
    }
    case 10:
    default: {
      a = randInt(1, 12);
      b = randInt(1, 12);
      break;
    }
  }

  if (Math.random() > 0.5) [a, b] = [b, a];

  const answer = a * b;
  const question = `${a} × ${b}`;
  const wrong = generateWrongChoices(answer, 3);
  const choices = shuffle([answer, ...wrong]);

  return { kind: "multiple_choice", question, answer, choices };
}

export function generateProblem(
  track: "addition_subtraction" | "multiplication",
  level: number
): MultipleChoiceProblem {
  if (track === "addition_subtraction") {
    return generateAdditionSubtraction(level);
  }
  return generateMultiplication(level);
}

// --- Config-based problem generation for curriculum skills ---

import type { ProblemConfig } from "./curriculum";

function generateAdditionFromConfig(config: ProblemConfig): MultipleChoiceProblem {
  const { operand1Range, operand2Range, constraints } = config;
  let a: number, b: number;

  if (constraints?.doubles) {
    a = randInt(operand1Range[0], operand1Range[1]);
    b = a;
  } else {
    a = randInt(operand1Range[0], operand1Range[1]);
    b = randInt(operand2Range[0], operand2Range[1]);
    if (constraints?.sumMax) {
      let tries = 0;
      while (a + b > constraints.sumMax && tries < 50) {
        a = randInt(operand1Range[0], operand1Range[1]);
        b = randInt(operand2Range[0], operand2Range[1]);
        tries++;
      }
      if (a + b > constraints.sumMax) {
        b = Math.max(operand2Range[0], constraints.sumMax - a);
      }
    }
  }

  const answer = a + b;
  const question = `${a} + ${b}`;
  const wrong = generateWrongChoices(answer, 3);
  return { kind: "multiple_choice", question, answer, choices: shuffle([answer, ...wrong]) };
}

function generateSubtractionFromConfig(config: ProblemConfig): MultipleChoiceProblem {
  const { operand1Range, operand2Range } = config;
  let a = randInt(operand1Range[0], operand1Range[1]);
  let b = randInt(operand2Range[0], Math.min(operand2Range[1], a));
  if (b > a) [a, b] = [b, a];

  const answer = a - b;
  const question = `${a} - ${b}`;
  const wrong = generateWrongChoices(answer, 3);
  return { kind: "multiple_choice", question, answer, choices: shuffle([answer, ...wrong]) };
}

function generateMultiplicationFromConfig(config: ProblemConfig): MultipleChoiceProblem {
  const { operand1Range, operand2Range, constraints } = config;
  let a = randInt(operand1Range[0], operand1Range[1]);
  let b = constraints?.fixedOperand ?? randInt(operand2Range[0], operand2Range[1]);

  if (Math.random() > 0.5) [a, b] = [b, a];

  const answer = a * b;
  const question = `${a} × ${b}`;
  const wrong = generateWrongChoices(answer, 3);
  return { kind: "multiple_choice", question, answer, choices: shuffle([answer, ...wrong]) };
}

function generateDivisionFromConfig(config: ProblemConfig): MultipleChoiceProblem {
  const { operand1Range, operand2Range, constraints } = config;
  const quotient = randInt(operand1Range[0], operand1Range[1]);
  const divisor = constraints?.fixedOperand ?? randInt(operand2Range[0], operand2Range[1]);
  const dividend = quotient * divisor;

  const answer = quotient;
  const question = `${dividend} ÷ ${divisor}`;
  const wrong = generateWrongChoices(answer, 3);
  return { kind: "multiple_choice", question, answer, choices: shuffle([answer, ...wrong]) };
}

function generateMixedAddSubFromConfig(config: ProblemConfig): MultipleChoiceProblem {
  if (Math.random() > 0.5) {
    return generateAdditionFromConfig(config);
  }
  return generateSubtractionFromConfig(config);
}

function generateMixedMulDivFromConfig(config: ProblemConfig): MultipleChoiceProblem {
  if (Math.random() > 0.5) {
    return generateMultiplicationFromConfig(config);
  }
  return generateDivisionFromConfig(config);
}

export function generateFromConfig(config: ProblemConfig): MultipleChoiceProblem {
  switch (config.type) {
    case "addition":
      return generateAdditionFromConfig(config);
    case "subtraction":
      return generateSubtractionFromConfig(config);
    case "multiplication":
      return generateMultiplicationFromConfig(config);
    case "division":
      return generateDivisionFromConfig(config);
    case "mixed_add_sub":
      return generateMixedAddSubFromConfig(config);
    case "mixed_mul_div":
      return generateMixedMulDivFromConfig(config);
  }
}

// --- New generators for additional question types ---

/** Helper: get the operator symbol from a question string like "3 + 4" */
function parseOperator(question: string): string | null {
  const ops = ["+", "-", "×", "÷"];
  for (const op of ops) {
    if (question.includes(` ${op} `)) return op;
  }
  return null;
}

/** Helper: parse operands from a question string */
function parseOperands(question: string): { a: string; op: string; b: string } | null {
  const match = question.match(/^(\d+)\s*([+\-×÷])\s*(\d+)$/);
  if (!match) return null;
  return { a: match[1], op: match[2], b: match[3] };
}

/**
 * Missing Operand: reuses MultipleChoiceProblem.
 * Formats question as "a OP ___ = result" with the missing operand as the answer.
 */
export function generateMissingOperand(config: ProblemConfig): MultipleChoiceProblem {
  const base = generateFromConfig(config);
  const parsed = parseOperands(base.question);
  if (!parsed) return base; // fallback to standard MC

  const { a, op, b } = parsed;

  // Randomly pick which operand to hide
  if (Math.random() > 0.5) {
    // Hide second operand: "a OP ___ = answer"
    const missingVal = parseInt(b, 10);
    const question = `${a} ${op} ___ = ${base.answer}`;
    const wrong = generateWrongChoices(missingVal, 3);
    return { kind: "multiple_choice", question, answer: missingVal, choices: shuffle([missingVal, ...wrong]) };
  } else {
    // Hide first operand: "___ OP b = answer"
    const missingVal = parseInt(a, 10);
    const question = `___ ${op} ${b} = ${base.answer}`;
    const wrong = generateWrongChoices(missingVal, 3);
    return { kind: "multiple_choice", question, answer: missingVal, choices: shuffle([missingVal, ...wrong]) };
  }
}

/**
 * Comparison: generate 2 problems, show both expressions, ask which is bigger.
 */
export function generateComparison(config: ProblemConfig): ComparisonProblem | MultipleChoiceProblem {
  for (let attempt = 0; attempt < 20; attempt++) {
    const p1 = generateFromConfig(config);
    const p2 = generateFromConfig(config);
    if (p1.answer !== p2.answer) {
      const answer: "A" | "B" = p1.answer > p2.answer ? "A" : "B";
      return {
        kind: "comparison",
        expressionA: p1.question,
        expressionB: p2.question,
        valueA: p1.answer,
        valueB: p2.answer,
        answer,
      };
    }
  }
  // Fallback to standard MC
  return generateFromConfig(config);
}

/**
 * Bubble Pop: pick a target value, find 2-3 expressions that equal it, add wrong ones.
 */
export function generateBubblePop(config: ProblemConfig): BubblePopProblem | MultipleChoiceProblem {
  // Generate a pool of problems
  const pool: { expr: string; value: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const p = generateFromConfig(config);
    pool.push({ expr: p.question, value: p.answer });
  }

  // Find a value that appears at least 2 times with distinct expressions
  const byValue = new Map<number, string[]>();
  for (const item of pool) {
    const existing = byValue.get(item.value) ?? [];
    // Only add if expression is unique
    if (!existing.includes(item.expr)) {
      existing.push(item.expr);
      byValue.set(item.value, existing);
    }
  }

  // Find target with 2-3 matching expressions
  let targetValue = 0;
  let correctExprs: string[] = [];
  for (const [val, exprs] of byValue) {
    if (exprs.length >= 2) {
      targetValue = val;
      correctExprs = exprs.slice(0, Math.min(3, exprs.length));
      break;
    }
  }

  if (correctExprs.length < 2) {
    // Fallback to standard MC
    return generateFromConfig(config);
  }

  // Gather wrong expressions (different values)
  const wrongExprs: string[] = [];
  for (const item of pool) {
    if (item.value !== targetValue && !wrongExprs.includes(item.expr)) {
      wrongExprs.push(item.expr);
      if (wrongExprs.length >= 8 - correctExprs.length) break;
    }
  }

  // Need at least a few wrong ones
  if (wrongExprs.length < 3) {
    return generateFromConfig(config);
  }

  // Take enough wrong to make 6-8 total
  const totalTarget = Math.min(8, correctExprs.length + wrongExprs.length);
  const wrongCount = totalTarget - correctExprs.length;
  const selectedWrong = wrongExprs.slice(0, wrongCount);

  const allBubbles = [...correctExprs, ...selectedWrong];
  const shuffled = shuffle(allBubbles.map((expr, i) => ({ expr, isCorrect: i < correctExprs.length })));

  const bubbles = shuffled.map((b) => b.expr);
  const correctIndices = shuffled
    .map((b, i) => (b.isCorrect ? i : -1))
    .filter((i) => i >= 0);

  return {
    kind: "bubble_pop",
    targetValue,
    bubbles,
    correctIndices,
  };
}

/**
 * Equation Builder: generate a problem, split into tiles, shuffle.
 * Validates by evaluating the expression rather than string comparison (handles commutativity).
 */
export function generateEquationBuilder(config: ProblemConfig): EquationBuilderProblem | MultipleChoiceProblem {
  const base = generateFromConfig(config);
  const parsed = parseOperands(base.question);
  if (!parsed) return base; // fallback

  const { a, op, b } = parsed;
  const correctOrder = [a, op, b, "=", String(base.answer)];
  const tiles = shuffle([...correctOrder]);

  return {
    kind: "equation_builder",
    tiles,
    correctOrder,
  };
}

/**
 * Evaluate a simple equation like "3 + 4 = 7" or "3 × 4 = 12".
 * Returns true if the equation is valid.
 */
export function evaluateEquation(tiles: string[]): boolean {
  // Expected format: [num, op, num, "=", num]
  if (tiles.length !== 5 || tiles[3] !== "=") return false;

  const left1 = parseInt(tiles[0], 10);
  const op = tiles[1];
  const left2 = parseInt(tiles[2], 10);
  const right = parseInt(tiles[4], 10);

  if (isNaN(left1) || isNaN(left2) || isNaN(right)) return false;

  let result: number;
  switch (op) {
    case "+": result = left1 + left2; break;
    case "-": result = left1 - left2; break;
    case "×": result = left1 * left2; break;
    case "÷": result = left2 !== 0 ? left1 / left2 : NaN; break;
    default: return false;
  }

  return result === right;
}

/**
 * Ordering: generate 4 problems with distinct answers, return items to sort smallest to biggest.
 */
export function generateOrdering(config: ProblemConfig): OrderingProblem | MultipleChoiceProblem {
  const items: { expr: string; value: number }[] = [];
  const usedValues = new Set<number>();

  for (let attempt = 0; attempt < 50 && items.length < 4; attempt++) {
    const p = generateFromConfig(config);
    if (!usedValues.has(p.answer)) {
      usedValues.add(p.answer);
      items.push({ expr: p.question, value: p.answer });
    }
  }

  if (items.length < 4) {
    // Fallback to standard MC
    return generateFromConfig(config);
  }

  // Shuffle the items for display
  const shuffled = shuffle(items);
  const expressions = shuffled.map((item) => item.expr);

  // Correct order: indices sorted by value ascending
  const indexed = shuffled.map((item, i) => ({ i, value: item.value }));
  indexed.sort((a, b) => a.value - b.value);
  const correctOrder = indexed.map((item) => item.i);

  return {
    kind: "ordering",
    items: expressions,
    correctOrder,
  };
}

// --- Session planning ---

export function generateSessionPlan(): SessionSlotKind[] {
  const slots: SessionSlotKind[] = [
    "multiple_choice",
    "multiple_choice",
    "multiple_choice",
    "multiple_choice",
    "missing_operand",
    "missing_operand",
    "comparison",
    "bubble_pop",
    "equation_builder",
    "ordering",
  ];
  return shuffle(slots);
}

export function generateForSlot(
  slotKind: SessionSlotKind,
  config: ProblemConfig
): Problem {
  switch (slotKind) {
    case "multiple_choice":
      return generateFromConfig(config);
    case "missing_operand":
      return generateMissingOperand(config);
    case "comparison":
      return generateComparison(config);
    case "bubble_pop":
      return generateBubblePop(config);
    case "equation_builder":
      return generateEquationBuilder(config);
    case "ordering":
      return generateOrdering(config);
  }
}
