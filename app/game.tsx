import { useEffect, useState, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useRouter, Redirect } from "expo-router";
import { useGame, type SubmitPayload } from "../lib/context";
import { SKILL_MAP, SKILL_SECTION_MAP } from "../lib/curriculum";
import type { Problem } from "../lib/problems";

import MultipleChoiceView from "./components/MultipleChoiceView";
import ComparisonView from "./components/ComparisonView";
import BubblePopView from "./components/BubblePopView";
import EquationBuilderView from "./components/EquationBuilderView";
import OrderingView from "./components/OrderingView";

type FeedbackState =
  | { kind: "multiple_choice"; index: number; result: "correct" | "wrong" }
  | { kind: "comparison"; choice: "A" | "B"; result: "correct" | "wrong" }
  | { kind: "bubble_pop"; result: "correct" | "wrong" }
  | { kind: "equation_builder"; result: "correct" | "wrong" }
  | { kind: "ordering"; result: "correct" | "wrong" }
  | null;

const THINKING_IMAGES = [
  require("../assets/orca/thinking.png"),
  require("../assets/orca/thinking_hmm.png"),
  require("../assets/orca/thinking_scratch.png"),
  require("../assets/orca/thinking_book.png"),
];

const CORRECT_IMAGES = [
  require("../assets/orca/correct_cheer.png"),
  require("../assets/orca/correct_dance.png"),
  require("../assets/orca/correct_clap.png"),
  require("../assets/orca/correct_star.png"),
];

const WRONG_IMAGES = [
  require("../assets/orca/wrong_oops.png"),
  require("../assets/orca/wrong_hug.png"),
  require("../assets/orca/wrong_tryagain.png"),
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function GameScreen() {
  const {
    profile,
    activeSkillId,
    currentProblem,
    problemIndex,
    sessionScore,
    submitAnswer,
    nextProblem,
    isSessionOver,
  } = useGame();
  const router = useRouter();
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [reactionImage, setReactionImage] = useState<any>(null);

  const thinkingImage = useMemo(
    () => pickRandom(THINKING_IMAGES),
    [problemIndex]
  );

  const handleSubmit = useCallback(
    (payload: SubmitPayload, feedbackMeta: any) => {
      if (feedback) return;

      const result = submitAnswer(payload);

      // Build feedback state based on problem kind
      let fb: FeedbackState;
      switch (payload.kind) {
        case "multiple_choice":
          fb = { kind: "multiple_choice", index: feedbackMeta.index, result };
          break;
        case "comparison":
          fb = { kind: "comparison", choice: feedbackMeta.choice, result };
          break;
        case "bubble_pop":
          fb = { kind: "bubble_pop", result };
          break;
        case "equation_builder":
          fb = { kind: "equation_builder", result };
          break;
        case "ordering":
          fb = { kind: "ordering", result };
          break;
      }

      setFeedback(fb);
      setReactionImage(
        result === "correct" ? pickRandom(CORRECT_IMAGES) : pickRandom(WRONG_IMAGES)
      );

      setTimeout(() => {
        setFeedback(null);
        setReactionImage(null);
        nextProblem();
      }, result === "correct" ? 400 : 1000);
    },
    [feedback, submitAnswer, nextProblem]
  );

  useEffect(() => {
    if (isSessionOver()) {
      router.replace("/results");
    }
  }, [problemIndex, isSessionOver, router]);

  if (!activeSkillId || !profile) return <Redirect href="/path" />;
  if (!currentProblem) return null;

  const skill = SKILL_MAP[activeSkillId];
  const section = SKILL_SECTION_MAP[activeSkillId];
  const sectionColor = section?.color ?? "#6C63FF";

  const orcaSource = reactionImage ?? thinkingImage;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={[styles.topText, { color: sectionColor }]}>
          {skill?.name ?? "Practice"}
        </Text>
        <Text style={styles.topText}>
          {problemIndex + 1} / 10
        </Text>
        <Text style={styles.topText}>
          {sessionScore} correct
        </Text>
      </View>

      <View style={styles.questionArea}>
        <Image source={orcaSource} style={styles.orca} resizeMode="contain" />
        <ProblemView
          problem={currentProblem}
          sectionColor={sectionColor}
          feedback={feedback}
          onSubmit={handleSubmit}
        />
      </View>
    </View>
  );
}

function ProblemView({
  problem,
  sectionColor,
  feedback,
  onSubmit,
}: {
  problem: Problem;
  sectionColor: string;
  feedback: FeedbackState;
  onSubmit: (payload: SubmitPayload, feedbackMeta: any) => void;
}) {
  switch (problem.kind) {
    case "multiple_choice":
      return (
        <MultipleChoiceView
          problem={problem}
          sectionColor={sectionColor}
          feedback={feedback?.kind === "multiple_choice" ? feedback : null}
          onSubmit={onSubmit}
        />
      );
    case "comparison":
      return (
        <ComparisonView
          problem={problem}
          sectionColor={sectionColor}
          feedback={feedback?.kind === "comparison" ? feedback : null}
          onSubmit={onSubmit}
        />
      );
    case "bubble_pop":
      return (
        <BubblePopView
          problem={problem}
          sectionColor={sectionColor}
          feedback={feedback?.kind === "bubble_pop" ? feedback : null}
          onSubmit={onSubmit}
        />
      );
    case "equation_builder":
      return (
        <EquationBuilderView
          problem={problem}
          sectionColor={sectionColor}
          feedback={feedback?.kind === "equation_builder" ? feedback : null}
          onSubmit={onSubmit}
        />
      );
    case "ordering":
      return (
        <OrderingView
          problem={problem}
          sectionColor={sectionColor}
          feedback={feedback?.kind === "ordering" ? feedback : null}
          onSubmit={onSubmit}
        />
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F3FF",
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  topText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  orca: {
    width: 150,
    height: 100,
    marginBottom: 16,
  },
  questionArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
