import { ALL_SKILLS } from "./curriculum";
import type { SessionSlotKind } from "./problems";

export type SkipQuizPlan = {
  /** The locked skill the player wants to jump to */
  targetSkillId: string;
  /** Skills that get marked complete if the quiz is passed, in curriculum order */
  skippedSkillIds: string[];
  /** Skill each quiz question is drawn from, easiest first */
  questionSkillIds: string[];
  /** Question format for each question */
  slots: SessionSlotKind[];
  /** Correct answers needed to pass */
  passScore: number;
};

export const SKIP_QUIZ_MIN_QUESTIONS = 5;
export const SKIP_QUIZ_MAX_QUESTIONS = 8;
/** Mistakes allowed while still passing */
export const SKIP_QUIZ_ALLOWED_MISTAKES = 1;

// Quick formats only: the quiz should feel short.
const QUIZ_SLOTS: SessionSlotKind[] = [
  "multiple_choice",
  "missing_operand",
  "multiple_choice",
  "comparison",
  "multiple_choice",
  "bubble_pop",
  "missing_operand",
  "ordering",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build a short quiz covering every level between the player's current level
 * and the level they want to jump to. Questions are spread evenly across the
 * skipped levels and always include the last one before the target, since
 * that is the level the target builds on directly.
 *
 * Returns null if the target is not ahead of the current level.
 */
export function planSkipQuiz(
  targetSkillId: string,
  currentSkillId: string | null
): SkipQuizPlan | null {
  const targetIndex = ALL_SKILLS.findIndex((s) => s.id === targetSkillId);
  const currentIndex = currentSkillId
    ? ALL_SKILLS.findIndex((s) => s.id === currentSkillId)
    : 0;
  if (targetIndex <= 0 || currentIndex < 0 || targetIndex <= currentIndex) {
    return null;
  }

  const skipped = ALL_SKILLS.slice(currentIndex, targetIndex).map((s) => s.id);
  const count = Math.min(
    SKIP_QUIZ_MAX_QUESTIONS,
    Math.max(SKIP_QUIZ_MIN_QUESTIONS, skipped.length)
  );

  const questionSkillIds: string[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.round((i * (skipped.length - 1)) / (count - 1));
    questionSkillIds.push(skipped[idx]);
  }

  return {
    targetSkillId,
    skippedSkillIds: skipped,
    questionSkillIds,
    slots: shuffle(QUIZ_SLOTS.slice(0, count)),
    passScore: count - SKIP_QUIZ_ALLOWED_MISTAKES,
  };
}
