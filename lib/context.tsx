import React, { createContext, useContext, useState, useCallback } from "react";
import { supabase, type Profile, type SkillProgress, type ProfileStats } from "./supabase";
import {
  generateForSlot,
  generateSessionPlan,
  evaluateEquation,
  type Problem,
  type SessionSlotKind,
} from "./problems";
import {
  SKILL_MAP,
  SKILL_SECTION_MAP,
  ALL_SKILLS,
  MASTERY_THRESHOLDS,
  type Skill,
} from "./curriculum";
import { planSkipQuiz, type SkipQuizPlan } from "./skipQuiz";

// --- Submit payload discriminated union ---

export type SubmitPayload =
  | { kind: "multiple_choice"; choice: number }
  | { kind: "comparison"; choice: "A" | "B" }
  | { kind: "bubble_pop"; selectedIndices: number[] }
  | { kind: "equation_builder"; arrangedTiles: string[] }
  | { kind: "ordering"; selectedOrder: number[] };

// --- Generalized missed problem ---

export type MissedProblem = { description: string; answer: string };

export type SkillStatus =
  | "locked"
  | "available"
  | "learning"
  | "practicing"
  | "mastered";

type GameState = {
  profile: Profile | null;
  profileStats: ProfileStats | null;
  skillProgressMap: Record<string, SkillProgress>;
  activeSkillId: string | null;
  currentProblem: Problem | null;
  problemIndex: number;
  sessionScore: number;
  sessionMissed: MissedProblem[];
  sessionPlan: SessionSlotKind[];
  /** Skill each question in the session is drawn from (length = session length) */
  sessionSkillIds: string[];
  /** Set while the session is a skip-ahead quiz rather than a normal lesson */
  skipQuiz: SkipQuizPlan | null;
  /** Outcome of the last synced skip quiz, for the results screen */
  lastSkipResult: { passed: boolean; targetSkillId: string } | null;
};

type GameContextType = GameState & {
  selectProfile: (profile: Profile) => Promise<void>;
  startLesson: (skillId: string) => void;
  startSkipQuiz: (targetSkillId: string) => boolean;
  getSkipQuizPlan: (targetSkillId: string) => SkipQuizPlan | null;
  sessionLength: number;
  submitAnswer: (payload: SubmitPayload) => "correct" | "wrong";
  nextProblem: () => void;
  isSessionOver: () => boolean;
  syncResults: () => Promise<void>;
  clearProfile: () => void;
  getSkillStatus: (skillId: string) => SkillStatus;
  getSkillProgress: (skillId: string) => SkillProgress | null;
  getPlayableSkillId: () => string | null;
};

const PROBLEMS_PER_SESSION = 10;

const EMPTY_SESSION = {
  activeSkillId: null,
  currentProblem: null,
  problemIndex: 0,
  sessionScore: 0,
  sessionMissed: [],
  sessionPlan: [],
  sessionSkillIds: [],
  skipQuiz: null,
  lastSkipResult: null,
} satisfies Partial<GameState>;

const GameContext = createContext<GameContextType | null>(null);

/** Check if an answer is correct for a given problem and payload */
function checkAnswer(problem: Problem, payload: SubmitPayload): { correct: boolean; description: string; answerStr: string } {
  switch (problem.kind) {
    case "multiple_choice": {
      if (payload.kind !== "multiple_choice") return { correct: false, description: problem.question, answerStr: String(problem.answer) };
      const correct = payload.choice === problem.answer;
      return { correct, description: problem.question, answerStr: String(problem.answer) };
    }
    case "comparison": {
      if (payload.kind !== "comparison") return { correct: false, description: `${problem.expressionA} vs ${problem.expressionB}`, answerStr: problem.answer === "A" ? problem.expressionA : problem.expressionB };
      const correct = payload.choice === problem.answer;
      const answerExpr = problem.answer === "A" ? `${problem.expressionA} (=${problem.valueA})` : `${problem.expressionB} (=${problem.valueB})`;
      return { correct, description: `Which is bigger: ${problem.expressionA} or ${problem.expressionB}?`, answerStr: answerExpr };
    }
    case "bubble_pop": {
      if (payload.kind !== "bubble_pop") return { correct: false, description: `Tap all equal to ${problem.targetValue}`, answerStr: problem.correctIndices.map(i => problem.bubbles[i]).join(", ") };
      // Must select exactly the right set
      const selectedSet = new Set(payload.selectedIndices);
      const correctSet = new Set(problem.correctIndices);
      const correct = selectedSet.size === correctSet.size && [...correctSet].every(i => selectedSet.has(i));
      return { correct, description: `Tap all equal to ${problem.targetValue}`, answerStr: problem.correctIndices.map(i => problem.bubbles[i]).join(", ") };
    }
    case "equation_builder": {
      if (payload.kind !== "equation_builder") return { correct: false, description: "Build the equation", answerStr: problem.correctOrder.join(" ") };
      const correct = evaluateEquation(payload.arrangedTiles);
      return { correct, description: "Build the equation", answerStr: problem.correctOrder.join(" ") };
    }
    case "ordering": {
      if (payload.kind !== "ordering") return { correct: false, description: "Order smallest to biggest", answerStr: problem.correctOrder.map(i => problem.items[i]).join(", ") };
      const correct = payload.selectedOrder.length === problem.correctOrder.length &&
        payload.selectedOrder.every((val, idx) => val === problem.correctOrder[idx]);
      return { correct, description: "Order smallest to biggest", answerStr: problem.correctOrder.map(i => problem.items[i]).join(", ") };
    }
  }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>({
    profile: null,
    profileStats: null,
    skillProgressMap: {},
    ...EMPTY_SESSION,
  });

  const selectProfile = useCallback(async (profile: Profile) => {
    const { data: progressData } = await supabase
      .from("skill_progress")
      .select("*")
      .eq("profile_id", profile.id);

    const skillProgressMap: Record<string, SkillProgress> = {};
    for (const sp of progressData ?? []) {
      skillProgressMap[sp.skill_id] = sp;
    }

    const { data: statsData } = await supabase
      .from("profile_stats")
      .select("*")
      .eq("profile_id", profile.id)
      .single();

    const profileStats: ProfileStats = statsData ?? {
      id: "",
      profile_id: profile.id,
      streak: 0,
      total_completed: 0,
      last_played_at: new Date().toISOString(),
    };

    setState((s) => ({
      ...s,
      profile,
      profileStats,
      skillProgressMap,
    }));
  }, []);

  const getSkillStatus = useCallback(
    (skillId: string): SkillStatus => {
      const skill = SKILL_MAP[skillId];
      if (!skill) return "locked";

      const progress = state.skillProgressMap[skillId];

      if (progress && progress.mastery_level > 0) {
        if (progress.mastery_level >= 3) return "mastered";
        if (progress.mastery_level >= 2) return "practicing";
        return "learning";
      }

      if (!skill.prerequisite) return "available";

      const prereqProgress = state.skillProgressMap[skill.prerequisite];
      if (prereqProgress && prereqProgress.mastery_level >= 2) {
        return "available";
      }

      return "locked";
    },
    [state.skillProgressMap]
  );

  const getSkillProgress = useCallback(
    (skillId: string): SkillProgress | null => {
      return state.skillProgressMap[skillId] ?? null;
    },
    [state.skillProgressMap]
  );

  const getPlayableSkillId = useCallback((): string | null => {
    let playable: string | null = null;
    for (const skill of ALL_SKILLS) {
      const status = getSkillStatus(skill.id);
      if (status === "available" || status === "learning" || status === "practicing") {
        playable = skill.id;
      }
    }
    return playable;
  }, [getSkillStatus]);

  const startLesson = useCallback((skillId: string) => {
    const skill = SKILL_MAP[skillId];
    if (!skill) return;

    const plan = generateSessionPlan();
    const problem = generateForSlot(plan[0], skill.problemConfig);

    setState((s) => ({
      ...s,
      ...EMPTY_SESSION,
      activeSkillId: skillId,
      sessionPlan: plan,
      sessionSkillIds: Array(PROBLEMS_PER_SESSION).fill(skillId),
      currentProblem: problem,
    }));
  }, []);

  const getSkipQuizPlan = useCallback(
    (targetSkillId: string): SkipQuizPlan | null => {
      if (getSkillStatus(targetSkillId) !== "locked") return null;
      return planSkipQuiz(targetSkillId, getPlayableSkillId());
    },
    [getSkillStatus, getPlayableSkillId]
  );

  const startSkipQuiz = useCallback(
    (targetSkillId: string): boolean => {
      const quiz = getSkipQuizPlan(targetSkillId);
      if (!quiz) return false;

      const firstSkill = SKILL_MAP[quiz.questionSkillIds[0]];
      const problem = generateForSlot(quiz.slots[0], firstSkill.problemConfig);

      setState((s) => ({
        ...s,
        ...EMPTY_SESSION,
        activeSkillId: targetSkillId,
        sessionPlan: quiz.slots,
        sessionSkillIds: quiz.questionSkillIds,
        skipQuiz: quiz,
        currentProblem: problem,
      }));
      return true;
    },
    [getSkipQuizPlan]
  );

  const submitAnswer = useCallback(
    (payload: SubmitPayload): "correct" | "wrong" => {
      const problem = state.currentProblem;
      if (!problem) return "wrong";

      const { correct, description, answerStr } = checkAnswer(problem, payload);

      setState((s) => ({
        ...s,
        sessionScore: correct ? s.sessionScore + 1 : s.sessionScore,
        sessionMissed: correct
          ? s.sessionMissed
          : [
              ...s.sessionMissed,
              { description, answer: answerStr },
            ],
      }));

      return correct ? "correct" : "wrong";
    },
    [state.currentProblem]
  );

  const nextProblem = useCallback(() => {
    setState((s) => {
      const nextIndex = s.problemIndex + 1;
      if (nextIndex >= s.sessionSkillIds.length) {
        return { ...s, problemIndex: nextIndex, currentProblem: null };
      }

      const skill = SKILL_MAP[s.sessionSkillIds[nextIndex]];
      if (!skill) return { ...s, problemIndex: nextIndex, currentProblem: null };

      const slotKind = s.sessionPlan[nextIndex] ?? "multiple_choice";
      const problem = generateForSlot(slotKind, skill.problemConfig);
      return { ...s, problemIndex: nextIndex, currentProblem: problem };
    });
  }, []);

  const isSessionOver = useCallback(() => {
    return (
      state.sessionSkillIds.length > 0 &&
      state.problemIndex >= state.sessionSkillIds.length
    );
  }, [state.problemIndex, state.sessionSkillIds.length]);

  const syncResults = useCallback(async () => {
    if (!state.profile || !state.activeSkillId) return;

    const skillId = state.activeSkillId;
    const sessionLength = state.sessionSkillIds.length;
    const now = new Date();

    // --- Skill progress ---
    const profileId = state.profile.id;
    const progressRow = (id: string, masteryLevel: number, bestScore: number, attempts: number) => ({
      profile_id: profileId,
      skill_id: id,
      mastery_level: masteryLevel,
      best_score: bestScore,
      attempts,
      updated_at: now.toISOString(),
    });

    let rows: ReturnType<typeof progressRow>[] = [];
    let skipResult: GameState["lastSkipResult"] = null;

    if (state.skipQuiz) {
      const quiz = state.skipQuiz;
      const passed = state.sessionScore >= quiz.passScore;
      skipResult = { passed, targetSkillId: quiz.targetSkillId };
      if (passed) {
        // Mark every skipped skill as mastered so the target unlocks.
        // Never lower a level the player already earned.
        rows = quiz.skippedSkillIds.map((id) => {
          const ex = state.skillProgressMap[id];
          return progressRow(id, Math.max(ex?.mastery_level ?? 0, 3), ex?.best_score ?? 0, ex?.attempts ?? 0);
        });
      }
    } else {
      const existing = state.skillProgressMap[skillId];
      const currentLevel = existing?.mastery_level ?? 0;
      const score = state.sessionScore;

      let newLevel = currentLevel;
      if (currentLevel === 0) {
        newLevel = 1;
      } else if (currentLevel === 1 && score >= MASTERY_THRESHOLDS[1]) {
        newLevel = 2;
      } else if (currentLevel === 2 && score >= MASTERY_THRESHOLDS[2]) {
        newLevel = 3;
      }

      rows = [
        progressRow(
          skillId,
          newLevel,
          Math.max(existing?.best_score ?? 0, score),
          (existing?.attempts ?? 0) + 1
        ),
      ];
    }

    let progressRows: SkillProgress[] = [];
    if (rows.length > 0) {
      const { data: upserted } = await supabase
        .from("skill_progress")
        .upsert(rows, { onConflict: "profile_id,skill_id" })
        .select();
      progressRows =
        upserted ??
        rows.map((r) => ({ id: state.skillProgressMap[r.skill_id]?.id ?? "", ...r }));
    }

    // --- Profile stats ---
    const lastPlayed = state.profileStats
      ? new Date(state.profileStats.last_played_at)
      : now;
    const daysDiff = Math.floor(
      (now.getTime() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24)
    );

    let newStreak = state.profileStats?.streak ?? 0;
    if (daysDiff === 1) {
      newStreak += 1;
    } else if (daysDiff === 0) {
      newStreak = Math.max(newStreak, 1);
    } else {
      newStreak = 1;
    }

    const totalCompleted =
      (state.profileStats?.total_completed ?? 0) + sessionLength;

    const { data: upsertedStats } = await supabase
      .from("profile_stats")
      .upsert(
        {
          profile_id: state.profile.id,
          streak: newStreak,
          total_completed: totalCompleted,
          last_played_at: now.toISOString(),
        },
        { onConflict: "profile_id" }
      )
      .select()
      .single();

    setState((s) => {
      const newMap = { ...s.skillProgressMap };
      for (const row of progressRows) {
        newMap[row.skill_id] = row;
      }

      return {
        ...s,
        skillProgressMap: newMap,
        lastSkipResult: skipResult,
        profileStats: upsertedStats ?? {
          id: s.profileStats?.id ?? "",
          profile_id: s.profile!.id,
          streak: newStreak,
          total_completed: totalCompleted,
          last_played_at: now.toISOString(),
        },
      };
    });
  }, [
    state.profile,
    state.activeSkillId,
    state.sessionScore,
    state.sessionSkillIds.length,
    state.skipQuiz,
    state.skillProgressMap,
    state.profileStats,
  ]);

  const clearProfile = useCallback(() => {
    setState({
      profile: null,
      profileStats: null,
      skillProgressMap: {},
      ...EMPTY_SESSION,
    });
  }, []);

  return (
    <GameContext.Provider
      value={{
        ...state,
        selectProfile,
        startLesson,
        startSkipQuiz,
        getSkipQuizPlan,
        sessionLength: state.sessionSkillIds.length,
        submitAnswer,
        nextProblem,
        isSessionOver,
        syncResults,
        clearProfile,
        getSkillStatus,
        getSkillProgress,
        getPlayableSkillId,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
