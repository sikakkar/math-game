import React, { createContext, useContext, useState, useCallback } from "react";
import { supabase, type Profile, type SkillProgress, type ProfileStats } from "./supabase";
import { generateFromConfig, type Problem } from "./problems";
import {
  SKILL_MAP,
  SKILL_SECTION_MAP,
  ALL_SKILLS,
  MASTERY_THRESHOLDS,
  type Skill,
} from "./curriculum";

type MissedProblem = { question: string; answer: number };

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
};

type GameContextType = GameState & {
  selectProfile: (profile: Profile) => Promise<void>;
  startLesson: (skillId: string) => void;
  submitAnswer: (choice: number) => "correct" | "wrong";
  nextProblem: () => void;
  isSessionOver: () => boolean;
  syncResults: () => Promise<void>;
  clearProfile: () => void;
  getSkillStatus: (skillId: string) => SkillStatus;
  getSkillProgress: (skillId: string) => SkillProgress | null;
  getPlayableSkillId: () => string | null;
};

const PROBLEMS_PER_SESSION = 10;

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>({
    profile: null,
    profileStats: null,
    skillProgressMap: {},
    activeSkillId: null,
    currentProblem: null,
    problemIndex: 0,
    sessionScore: 0,
    sessionMissed: [],
  });

  const selectProfile = useCallback(async (profile: Profile) => {
    // Fetch all skill progress for this profile
    const { data: progressData } = await supabase
      .from("skill_progress")
      .select("*")
      .eq("profile_id", profile.id);

    const skillProgressMap: Record<string, SkillProgress> = {};
    for (const sp of progressData ?? []) {
      skillProgressMap[sp.skill_id] = sp;
    }

    // Fetch profile stats
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

      // If has progress, return based on mastery level
      if (progress && progress.mastery_level > 0) {
        if (progress.mastery_level >= 3) return "mastered";
        if (progress.mastery_level >= 2) return "practicing";
        return "learning";
      }

      // Check prerequisite
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
    // The playable skill is the most advanced non-locked, non-mastered skill.
    // Kids must work at their current level — no going back to easier stuff.
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

    const problem = generateFromConfig(skill.problemConfig);

    setState((s) => ({
      ...s,
      activeSkillId: skillId,
      problemIndex: 0,
      sessionScore: 0,
      sessionMissed: [],
      currentProblem: problem,
    }));
  }, []);

  const submitAnswer = useCallback(
    (choice: number): "correct" | "wrong" => {
      const problem = state.currentProblem;
      if (!problem) return "wrong";

      const isCorrect = choice === problem.answer;

      setState((s) => ({
        ...s,
        sessionScore: isCorrect ? s.sessionScore + 1 : s.sessionScore,
        sessionMissed: isCorrect
          ? s.sessionMissed
          : [
              ...s.sessionMissed,
              { question: problem.question, answer: problem.answer },
            ],
      }));

      return isCorrect ? "correct" : "wrong";
    },
    [state.currentProblem]
  );

  const nextProblem = useCallback(() => {
    setState((s) => {
      const nextIndex = s.problemIndex + 1;
      if (nextIndex >= PROBLEMS_PER_SESSION) {
        return { ...s, problemIndex: nextIndex, currentProblem: null };
      }

      const skill = s.activeSkillId ? SKILL_MAP[s.activeSkillId] : null;
      if (!skill) return { ...s, problemIndex: nextIndex, currentProblem: null };

      const problem = generateFromConfig(skill.problemConfig);
      return { ...s, problemIndex: nextIndex, currentProblem: problem };
    });
  }, []);

  const isSessionOver = useCallback(() => {
    return state.problemIndex >= PROBLEMS_PER_SESSION;
  }, [state.problemIndex]);

  const syncResults = useCallback(async () => {
    if (!state.profile || !state.activeSkillId) return;

    const skillId = state.activeSkillId;
    const existing = state.skillProgressMap[skillId];
    const currentLevel = existing?.mastery_level ?? 0;
    const score = state.sessionScore;

    // Determine new mastery level
    let newLevel = currentLevel;
    if (currentLevel === 0) {
      // Any attempt -> learning
      newLevel = 1;
    } else if (currentLevel === 1 && score >= MASTERY_THRESHOLDS[1]) {
      newLevel = 2;
    } else if (currentLevel === 2 && score >= MASTERY_THRESHOLDS[2]) {
      newLevel = 3;
    }
    // mastered stays mastered

    const bestScore = Math.max(existing?.best_score ?? 0, score);
    const attempts = (existing?.attempts ?? 0) + 1;

    // Upsert skill_progress
    const { data: upsertedProgress } = await supabase
      .from("skill_progress")
      .upsert(
        {
          profile_id: state.profile.id,
          skill_id: skillId,
          mastery_level: newLevel,
          best_score: bestScore,
          attempts,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "profile_id,skill_id" }
      )
      .select()
      .single();

    // Update streak
    const now = new Date();
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
      // same day, keep streak
      newStreak = Math.max(newStreak, 1);
    } else {
      newStreak = 1;
    }

    const totalCompleted =
      (state.profileStats?.total_completed ?? 0) + PROBLEMS_PER_SESSION;

    // Upsert profile_stats
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
      if (upsertedProgress) {
        newMap[skillId] = upsertedProgress;
      } else {
        // Fallback: update locally
        newMap[skillId] = {
          id: existing?.id ?? "",
          profile_id: s.profile!.id,
          skill_id: skillId,
          mastery_level: newLevel,
          best_score: bestScore,
          attempts,
          updated_at: now.toISOString(),
        };
      }

      return {
        ...s,
        skillProgressMap: newMap,
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
    state.skillProgressMap,
    state.profileStats,
  ]);

  const clearProfile = useCallback(() => {
    setState({
      profile: null,
      profileStats: null,
      skillProgressMap: {},
      activeSkillId: null,
      currentProblem: null,
      problemIndex: 0,
      sessionScore: 0,
      sessionMissed: [],
    });
  }, []);

  return (
    <GameContext.Provider
      value={{
        ...state,
        selectProfile,
        startLesson,
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
