import React, { createContext, useContext, useState, useCallback } from "react";
import { supabase, type Profile, type Progress } from "./supabase";
import { generateProblem, type Problem } from "./problems";

type MissedProblem = { question: string; answer: number };

type GameState = {
  profile: Profile | null;
  progress: Progress | null;
  currentProblem: Problem | null;
  problemIndex: number;
  sessionScore: number;
  sessionMissed: MissedProblem[];
  consecutiveCorrect: number;
  consecutiveWrong: number;
  sessionLevel: number;
};

type GameContextType = GameState & {
  selectProfile: (profile: Profile) => Promise<void>;
  startSession: () => void;
  submitAnswer: (choice: number) => "correct" | "wrong";
  nextProblem: () => void;
  isSessionOver: () => boolean;
  syncResults: () => Promise<void>;
  clearProfile: () => void;
};

const PROBLEMS_PER_SESSION = 10;

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>({
    profile: null,
    progress: null,
    currentProblem: null,
    problemIndex: 0,
    sessionScore: 0,
    sessionMissed: [],
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    sessionLevel: 1,
  });

  const selectProfile = useCallback(async (profile: Profile) => {
    const { data } = await supabase
      .from("progress")
      .select("*")
      .eq("profile_id", profile.id)
      .single();

    const progress: Progress = data ?? {
      id: "",
      profile_id: profile.id,
      current_level: 1,
      streak: 0,
      total_completed: 0,
      missed_problems: [],
      updated_at: new Date().toISOString(),
    };

    setState((s) => ({
      ...s,
      profile,
      progress,
      sessionLevel: progress.current_level,
    }));
  }, []);

  const getLevelForProblem = useCallback(
    (index: number, baseLevel: number): number => {
      if (index < 2) {
        // warm-up: one level below
        return Math.max(1, baseLevel - 1);
      }
      if (index >= 8) {
        // challenge: one level above
        return Math.min(10, baseLevel + 1);
      }
      return baseLevel;
    },
    []
  );

  const startSession = useCallback(() => {
    setState((s) => {
      const level = s.progress?.current_level ?? 1;
      const track = s.profile?.track ?? "addition_subtraction";
      const problemLevel = getLevelForProblem(0, level);
      const problem = generateProblem(track, problemLevel);

      return {
        ...s,
        problemIndex: 0,
        sessionScore: 0,
        sessionMissed: [],
        consecutiveCorrect: 0,
        consecutiveWrong: 0,
        sessionLevel: level,
        currentProblem: problem,
      };
    });
  }, [getLevelForProblem]);

  const submitAnswer = useCallback(
    (choice: number): "correct" | "wrong" => {
      const problem = state.currentProblem;
      if (!problem) return "wrong";

      const isCorrect = choice === problem.answer;

      setState((s) => {
        let newLevel = s.sessionLevel;
        let consCorrect = isCorrect ? s.consecutiveCorrect + 1 : 0;
        let consWrong = isCorrect ? 0 : s.consecutiveWrong + 1;

        if (consCorrect >= 3) {
          newLevel = Math.min(10, newLevel + 1);
          consCorrect = 0;
        }
        if (consWrong >= 2) {
          newLevel = Math.max(1, newLevel - 1);
          consWrong = 0;
        }

        return {
          ...s,
          sessionScore: isCorrect ? s.sessionScore + 1 : s.sessionScore,
          sessionMissed: isCorrect
            ? s.sessionMissed
            : [
                ...s.sessionMissed,
                { question: problem.question, answer: problem.answer },
              ],
          consecutiveCorrect: consCorrect,
          consecutiveWrong: consWrong,
          sessionLevel: newLevel,
        };
      });

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

      const track = s.profile?.track ?? "addition_subtraction";
      const problemLevel = getLevelForProblem(nextIndex, s.sessionLevel);
      const problem = generateProblem(track, problemLevel);

      return { ...s, problemIndex: nextIndex, currentProblem: problem };
    });
  }, [getLevelForProblem]);

  const isSessionOver = useCallback(() => {
    return state.problemIndex >= PROBLEMS_PER_SESSION;
  }, [state.problemIndex]);

  const syncResults = useCallback(async () => {
    if (!state.profile || !state.progress) return;

    const now = new Date();
    const lastPlayed = new Date(state.progress.updated_at);
    const daysDiff = Math.floor(
      (now.getTime() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24)
    );

    let newStreak = state.progress.streak;
    if (daysDiff === 1) {
      newStreak += 1;
    } else if (daysDiff === 0) {
      // same day, keep streak
    } else {
      newStreak = 1;
    }

    const allMissed = [
      ...state.progress.missed_problems,
      ...state.sessionMissed,
    ].slice(-20);

    const updates = {
      current_level: state.sessionLevel,
      streak: newStreak,
      total_completed:
        state.progress.total_completed + PROBLEMS_PER_SESSION,
      missed_problems: allMissed,
      updated_at: now.toISOString(),
    };

    if (state.progress.id) {
      await supabase
        .from("progress")
        .update(updates)
        .eq("id", state.progress.id);
    } else {
      await supabase
        .from("progress")
        .insert({ profile_id: state.profile.id, ...updates });
    }

    setState((s) => ({
      ...s,
      progress: s.progress
        ? { ...s.progress, ...updates }
        : null,
    }));
  }, [state.profile, state.progress, state.sessionLevel, state.sessionMissed]);

  const clearProfile = useCallback(() => {
    setState({
      profile: null,
      progress: null,
      currentProblem: null,
      problemIndex: 0,
      sessionScore: 0,
      sessionMissed: [],
      consecutiveCorrect: 0,
      consecutiveWrong: 0,
      sessionLevel: 1,
    });
  }, []);

  return (
    <GameContext.Provider
      value={{
        ...state,
        selectProfile,
        startSession,
        submitAnswer,
        nextProblem,
        isSessionOver,
        syncResults,
        clearProfile,
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
