export type Problem = {
  question: string;
  answer: number;
  choices: number[];
};

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
  // Try nearby numbers first
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

  // Fill remaining if needed
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

function generateAdditionSubtraction(level: number): Problem {
  let a: number, b: number, answer: number, question: string;

  switch (level) {
    case 1: // addition, 1-5
      a = randInt(1, 5);
      b = randInt(1, 5);
      answer = a + b;
      question = `${a} + ${b}`;
      break;
    case 2: // addition, 1-9
      a = randInt(1, 9);
      b = randInt(1, 9);
      answer = a + b;
      question = `${a} + ${b}`;
      break;
    case 3: // subtraction, 1-5, no negatives
      a = randInt(2, 5);
      b = randInt(1, a);
      answer = a - b;
      question = `${a} - ${b}`;
      break;
    case 4: // subtraction, 1-9, no negatives
      a = randInt(2, 9);
      b = randInt(1, a);
      answer = a - b;
      question = `${a} - ${b}`;
      break;
    case 5: { // mixed +/-, 1-9
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
    case 6: // addition, double digits: 10-50 + 1-9
      a = randInt(10, 50);
      b = randInt(1, 9);
      answer = a + b;
      question = `${a} + ${b}`;
      break;
    case 7: // addition, double digits: 10-99 + 10-99
      a = randInt(10, 99);
      b = randInt(10, 99);
      answer = a + b;
      question = `${a} + ${b}`;
      break;
    case 8: // subtraction, double digits: 20-99 - 1-19, no negatives
      a = randInt(20, 99);
      b = randInt(1, 19);
      answer = a - b;
      question = `${a} - ${b}`;
      break;
    case 9: // subtraction, double digits: 20-99 - 10-99, no negatives
      a = randInt(20, 99);
      b = randInt(10, a);
      answer = a - b;
      question = `${a} - ${b}`;
      break;
    case 10: // mixed +/-, full double-digit range
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

  return { question, answer, choices };
}

function generateMultiplication(level: number): Problem {
  let a: number, b: number;

  switch (level) {
    case 1: { // 1s and 2s
      a = randInt(1, 2);
      b = randInt(1, 9);
      break;
    }
    case 2: { // 5s and 10s
      a = Math.random() > 0.5 ? 5 : 10;
      b = randInt(1, 9);
      break;
    }
    case 3: { // 3s and 4s
      a = randInt(3, 4);
      b = randInt(1, 9);
      break;
    }
    case 4: { // 6s, 7s, 8s
      a = randInt(6, 8);
      b = randInt(1, 9);
      break;
    }
    case 5: { // 9s and mixed
      if (Math.random() > 0.5) {
        a = 9;
        b = randInt(1, 9);
      } else {
        a = randInt(1, 9);
        b = randInt(1, 9);
      }
      break;
    }
    case 6: { // 1-9 × 1-12 (introduce 10, 11, 12 as second operand)
      a = randInt(1, 9);
      b = randInt(1, 12);
      break;
    }
    case 7: { // 10s, 11s, 12s × 1-9
      a = randInt(10, 12);
      b = randInt(1, 9);
      break;
    }
    case 8: { // 10-12 × 10-12
      a = randInt(10, 12);
      b = randInt(10, 12);
      break;
    }
    case 9: { // mixed 1-12 × 1-12 (50% chance of at least one operand >9)
      if (Math.random() > 0.5) {
        a = randInt(10, 12);
        b = randInt(1, 12);
      } else {
        a = randInt(1, 12);
        b = randInt(1, 12);
      }
      break;
    }
    case 10: // full 1-12 × 1-12
    default: {
      a = randInt(1, 12);
      b = randInt(1, 12);
      break;
    }
  }

  // Randomly swap order so it's not always "small x big"
  if (Math.random() > 0.5) [a, b] = [b, a];

  const answer = a * b;
  const question = `${a} × ${b}`;
  const wrong = generateWrongChoices(answer, 3);
  const choices = shuffle([answer, ...wrong]);

  return { question, answer, choices };
}

export function generateProblem(
  track: "addition_subtraction" | "multiplication",
  level: number
): Problem {
  if (track === "addition_subtraction") {
    return generateAdditionSubtraction(level);
  }
  return generateMultiplication(level);
}

// --- Config-based problem generation for curriculum skills ---

import type { ProblemConfig } from "./curriculum";

function generateAdditionFromConfig(config: ProblemConfig): Problem {
  const { operand1Range, operand2Range, constraints } = config;
  let a: number, b: number;

  if (constraints?.doubles) {
    a = randInt(operand1Range[0], operand1Range[1]);
    b = a;
  } else {
    a = randInt(operand1Range[0], operand1Range[1]);
    b = randInt(operand2Range[0], operand2Range[1]);
    if (constraints?.sumMax) {
      // Re-roll until within sum constraint (max 50 tries, then clamp)
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
  return { question, answer, choices: shuffle([answer, ...wrong]) };
}

function generateSubtractionFromConfig(config: ProblemConfig): Problem {
  const { operand1Range, operand2Range } = config;
  let a = randInt(operand1Range[0], operand1Range[1]);
  let b = randInt(operand2Range[0], Math.min(operand2Range[1], a));
  // Ensure non-negative result
  if (b > a) [a, b] = [b, a];

  const answer = a - b;
  const question = `${a} - ${b}`;
  const wrong = generateWrongChoices(answer, 3);
  return { question, answer, choices: shuffle([answer, ...wrong]) };
}

function generateMultiplicationFromConfig(config: ProblemConfig): Problem {
  const { operand1Range, operand2Range, constraints } = config;
  let a = randInt(operand1Range[0], operand1Range[1]);
  let b = constraints?.fixedOperand ?? randInt(operand2Range[0], operand2Range[1]);

  // Randomly swap order so it's not always "small × big"
  if (Math.random() > 0.5) [a, b] = [b, a];

  const answer = a * b;
  const question = `${a} × ${b}`;
  const wrong = generateWrongChoices(answer, 3);
  return { question, answer, choices: shuffle([answer, ...wrong]) };
}

function generateDivisionFromConfig(config: ProblemConfig): Problem {
  const { operand1Range, operand2Range, constraints } = config;
  // Generate as reversed multiplication for exact division
  const quotient = randInt(operand1Range[0], operand1Range[1]);
  const divisor = constraints?.fixedOperand ?? randInt(operand2Range[0], operand2Range[1]);
  const dividend = quotient * divisor;

  const answer = quotient;
  const question = `${dividend} ÷ ${divisor}`;
  const wrong = generateWrongChoices(answer, 3);
  return { question, answer, choices: shuffle([answer, ...wrong]) };
}

function generateMixedAddSubFromConfig(config: ProblemConfig): Problem {
  if (Math.random() > 0.5) {
    return generateAdditionFromConfig(config);
  }
  return generateSubtractionFromConfig(config);
}

function generateMixedMulDivFromConfig(config: ProblemConfig): Problem {
  if (Math.random() > 0.5) {
    return generateMultiplicationFromConfig(config);
  }
  return generateDivisionFromConfig(config);
}

export function generateFromConfig(config: ProblemConfig): Problem {
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
