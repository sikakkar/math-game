import { View, Text, Pressable, StyleSheet } from "react-native";
import type { MultipleChoiceProblem } from "../../lib/problems";
import type { SubmitPayload } from "../../lib/context";

type Feedback = { index: number; result: "correct" | "wrong" } | null;

type Props = {
  problem: MultipleChoiceProblem;
  sectionColor: string;
  feedback: Feedback;
  onSubmit: (payload: SubmitPayload, feedbackMeta: { index: number }) => void;
};

export default function MultipleChoiceView({ problem, sectionColor, feedback, onSubmit }: Props) {
  return (
    <>
      <Text style={styles.question}>
        {problem.question.includes("=") ? problem.question : `${problem.question} = ?`}
      </Text>
      <View style={styles.choicesGrid}>
        {problem.choices.map((choice, i) => {
          let bgColor = sectionColor;
          if (feedback) {
            if (feedback.index === i) {
              bgColor = feedback.result === "correct" ? "#22C55E" : "#EF4444";
            } else if (
              feedback.result === "wrong" &&
              choice === problem.answer
            ) {
              bgColor = "#22C55E";
            }
          }

          return (
            <Pressable
              key={i}
              style={[styles.choiceButton, { backgroundColor: bgColor }]}
              onPress={() => onSubmit({ kind: "multiple_choice", choice }, { index: i })}
              disabled={feedback !== null}
            >
              <Text style={styles.choiceText}>{choice}</Text>
            </Pressable>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
    width: "100%",
  },
  choiceButton: {
    width: "45%",
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: "center",
    minHeight: 48,
  },
  choiceText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },
});
