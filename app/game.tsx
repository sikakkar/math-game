import { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { useGame } from "../lib/context";
import { SKILL_MAP, SKILL_SECTION_MAP } from "../lib/curriculum";

type Feedback = { index: number; result: "correct" | "wrong" } | null;

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

  // Guard: if no active skill, redirect to path
  useEffect(() => {
    if (!activeSkillId || !profile) {
      router.replace("/path");
    }
  }, [activeSkillId, profile, router]);

  const handleChoice = useCallback(
    (choice: number, choiceIndex: number) => {
      if (feedback) return; // prevent double tap

      const result = submitAnswer(choice);
      setFeedback({ index: choiceIndex, result });

      setTimeout(() => {
        setFeedback(null);
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

  if (!currentProblem || !profile || !activeSkillId) return null;

  const skill = SKILL_MAP[activeSkillId];
  const section = SKILL_SECTION_MAP[activeSkillId];
  const sectionColor = section?.color ?? "#6C63FF";

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
        <Image
          source={require("../assets/orca/thinking.png")}
          style={styles.orca}
        />
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
    width: 80,
    height: 80,
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
