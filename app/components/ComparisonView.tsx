import { View, Text, Pressable, StyleSheet } from "react-native";
import type { ComparisonProblem } from "../../lib/problems";
import type { SubmitPayload } from "../../lib/context";

type Feedback = { choice: "A" | "B"; result: "correct" | "wrong" } | null;

type Props = {
  problem: ComparisonProblem;
  sectionColor: string;
  feedback: Feedback;
  onSubmit: (payload: SubmitPayload, feedbackMeta: { choice: "A" | "B" }) => void;
};

export default function ComparisonView({ problem, sectionColor, feedback, onSubmit }: Props) {
  const getColor = (side: "A" | "B") => {
    if (!feedback) return sectionColor;
    if (feedback.choice === side) {
      return feedback.result === "correct" ? "#22C55E" : "#EF4444";
    }
    // Show correct answer if user was wrong
    if (feedback.result === "wrong" && problem.answer === side) {
      return "#22C55E";
    }
    return sectionColor;
  };

  return (
    <>
      <Text style={styles.title}>Which is bigger?</Text>
      <View style={styles.buttonsContainer}>
        <Pressable
          style={[styles.expressionButton, { backgroundColor: getColor("A") }]}
          onPress={() => onSubmit({ kind: "comparison", choice: "A" }, { choice: "A" })}
          disabled={feedback !== null}
        >
          <Text style={styles.expressionText}>{problem.expressionA}</Text>
        </Pressable>
        <Pressable
          style={[styles.expressionButton, { backgroundColor: getColor("B") }]}
          onPress={() => onSubmit({ kind: "comparison", choice: "B" }, { choice: "B" })}
          disabled={feedback !== null}
        >
          <Text style={styles.expressionText}>{problem.expressionB}</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1E1B4B",
    marginBottom: 24,
  },
  buttonsContainer: {
    gap: 16,
    width: "100%",
    paddingBottom: 60,
  },
  expressionButton: {
    width: "100%",
    paddingVertical: 32,
    borderRadius: 16,
    alignItems: "center",
    minHeight: 80,
  },
  expressionText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
  },
});
