import { useEffect, useState, useCallback, useMemo } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useRouter, Redirect } from "expo-router";
import { useGame } from "../lib/context";
import { SKILL_MAP, SKILL_SECTION_MAP } from "../lib/curriculum";

type Feedback = { index: number; result: "correct" | "wrong" } | null;

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
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [reactionImage, setReactionImage] = useState<any>(null);

  // Pick a new thinking image each problem
  const thinkingImage = useMemo(
    () => pickRandom(THINKING_IMAGES),
    [problemIndex]
  );

  const handleChoice = useCallback(
    (choice: number, choiceIndex: number) => {
      if (feedback) return; // prevent double tap

      const result = submitAnswer(choice);
      setFeedback({ index: choiceIndex, result });
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

  // Guard: redirect if no active session (handles direct URL access)
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
        <Text style={styles.question}>{currentProblem.question} = ?</Text>
      </View>

      <View style={styles.choicesGrid}>
        {currentProblem.choices.map((choice, i) => {
          let bgColor = sectionColor;
          if (feedback) {
            if (feedback.index === i) {
              bgColor = feedback.result === "correct" ? "#22C55E" : "#EF4444";
            } else if (
              feedback.result === "wrong" &&
              choice === currentProblem.answer
            ) {
              bgColor = "#22C55E";
            }
          }

          return (
            <Pressable
              key={i}
              style={[styles.choiceButton, { backgroundColor: bgColor }]}
              onPress={() => handleChoice(choice, i)}
              disabled={feedback !== null}
            >
              <Text style={styles.choiceText}>{choice}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
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
  question: {
    fontSize: 56,
    fontWeight: "700",
    color: "#1E1B4B",
  },
  choicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
    paddingBottom: 60,
  },
  choiceButton: {
    width: "45%",
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  choiceText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },
});
