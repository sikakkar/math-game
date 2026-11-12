import { View, Text, Pressable, StyleSheet } from "react-native";
import type { LiteracyChoiceProblem } from "../../lib/literacy";
import type { SubmitPayload } from "../../lib/context";
import SpeakButton from "./SpeakButton";

type Feedback = { index: number; result: "correct" | "wrong" } | null;

type Props = {
  problem: LiteracyChoiceProblem;
  sectionColor: string;
  feedback: Feedback;
  onSubmit: (payload: SubmitPayload, feedbackMeta: { index: number }) => void;
};

export default function LiteracyChoiceView({ problem, sectionColor, feedback, onSubmit }: Props) {
  const isPicture = problem.choiceStyle === "picture";
  // A single letter or emoji gets a huge font; a word stays readable on a phone.
  const displayIsWord = /^[a-zA-Z-]{2,}$/.test(problem.display);

  return (
    <>
      <SpeakButton text={problem.speak} color={sectionColor} />
      <Text style={styles.instruction}>{problem.instruction}</Text>
      {problem.display !== "" && (
        <Text style={[styles.display, displayIsWord && styles.displayWord]}>{problem.display}</Text>
      )}
      {problem.subDisplay && <Text style={styles.subDisplay}>{problem.subDisplay}</Text>}
      <View style={styles.choicesGrid}>
        {problem.choices.map((choice, i) => {
          let bgColor = isPicture ? "#fff" : sectionColor;
          let borderColor = isPicture ? sectionColor : "transparent";
          let opacity = 1;
          if (feedback) {
            const isAnswer = choice === problem.answer;
            if (feedback.index === i || (feedback.result === "wrong" && isAnswer)) {
              const wrongPick = feedback.index === i && feedback.result === "wrong";
              const color = wrongPick ? "#EF4444" : "#22C55E";
              bgColor = isPicture ? (wrongPick ? "#FEE2E2" : "#DCFCE7") : color;
              borderColor = color;
            } else {
              opacity = 0.35;
            }
          }
          return (
            <Pressable
              key={i}
              accessibilityLabel={`choice ${choice}`}
              style={[styles.choiceButton, { backgroundColor: bgColor, borderColor, opacity }]}
              onPress={() => onSubmit({ kind: "literacy_choice", choice }, { index: i })}
              disabled={feedback !== null}
            >
              <Text
                style={[
                  styles.choiceText,
                  isPicture && styles.choicePicture,
                  problem.choiceStyle === "letter" && styles.choiceLetter,
                ]}
              >
                {choice}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  instruction: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E1B4B",
    textAlign: "center",
    marginBottom: 8,
  },
  display: {
    fontSize: 88,
    fontWeight: "700",
    color: "#1E1B4B",
    lineHeight: 104,
  },
  displayWord: {
    fontSize: 60,
    lineHeight: 72,
    letterSpacing: 2,
  },
  subDisplay: {
    fontSize: 44,
    fontWeight: "700",
    color: "#1E1B4B",
    letterSpacing: 4,
    marginBottom: 8,
  },
  choicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
    paddingTop: 16,
    paddingBottom: 60,
    width: "100%",
  },
  choiceButton: {
    width: "45%",
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 4,
    alignItems: "center",
    minHeight: 48,
  },
  choiceText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },
  choiceLetter: {
    fontSize: 40,
  },
  choicePicture: {
    fontSize: 48,
    lineHeight: 60,
  },
});
