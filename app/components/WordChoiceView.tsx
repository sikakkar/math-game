import { View, Text, Pressable, StyleSheet } from "react-native";
import type { WordChoiceProblem } from "../../lib/problems";
import type { SubmitPayload } from "../../lib/context";
import SpeakButton from "./SpeakButton";

type Feedback = { index: number; result: "correct" | "wrong" } | null;

type Props = {
  problem: WordChoiceProblem;
  sectionColor: string;
  feedback: Feedback;
  onSubmit: (payload: SubmitPayload, feedbackMeta: { index: number }) => void;
};

const TITLES: Record<WordChoiceProblem["mode"], string> = {
  read_word: "Read it! Tap the picture",
  picture_word: "Which word is it?",
  missing_sound: "What sound is missing?",
};

export default function WordChoiceView({ problem, sectionColor, feedback, onSubmit }: Props) {
  const choicesArePictures = problem.mode === "read_word";

  return (
    <>
      <Text style={styles.title}>{TITLES[problem.mode]}</Text>

      {problem.mode === "read_word" ? (
        // The word only: no picture and no audio, so the child has to decode it.
        <Text style={styles.bigWord}>{problem.word}</Text>
      ) : (
        <View style={styles.pictureRow}>
          <Text style={styles.picture}>{problem.emoji}</Text>
          <SpeakButton text={problem.word} color={sectionColor} />
        </View>
      )}

      {problem.mode === "missing_sound" && (
        <View style={styles.blankRow}>
          {problem.before ? <Text style={styles.blankWord}>{problem.before}</Text> : null}
          <View
            style={[
              styles.blank,
              { borderColor: sectionColor },
              feedback && { backgroundColor: "#22C55E", borderColor: "#22C55E" },
            ]}
          >
            {/* The answer only goes in the blank once answered, so it can't be read out early. */}
            <Text style={[styles.blankWord, { color: "#fff" }]}>
              {feedback ? problem.answer : " "}
            </Text>
          </View>
          {problem.after ? <Text style={styles.blankWord}>{problem.after}</Text> : null}
        </View>
      )}

      <View style={styles.choicesGrid}>
        {problem.choices.map((choice, i) => {
          let bgColor = choicesArePictures ? "#fff" : sectionColor;
          let borderColor = sectionColor;
          if (feedback) {
            const isAnswer = choice === problem.answer;
            if (feedback.index === i) {
              bgColor = feedback.result === "correct" ? "#22C55E" : "#EF4444";
              borderColor = bgColor;
            } else if (feedback.result === "wrong" && isAnswer) {
              bgColor = "#22C55E";
              borderColor = bgColor;
            }
          }

          return (
            <Pressable
              key={i}
              accessibilityRole="button"
              accessibilityLabel={choice}
              style={[styles.choiceButton, { backgroundColor: bgColor, borderColor }]}
              onPress={() => onSubmit({ kind: "word_choice", choice }, { index: i })}
              disabled={feedback !== null}
            >
              <Text style={choicesArePictures ? styles.choicePicture : styles.choiceText}>{choice}</Text>
            </Pressable>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E1B4B",
    marginBottom: 12,
    textAlign: "center",
  },
  bigWord: {
    fontSize: 64,
    fontWeight: "800",
    color: "#1E1B4B",
    letterSpacing: 4,
    marginBottom: 20,
  },
  pictureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 12,
  },
  picture: {
    fontSize: 72,
  },
  blankRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  blankWord: {
    fontSize: 48,
    fontWeight: "800",
    color: "#1E1B4B",
    letterSpacing: 2,
  },
  blank: {
    minWidth: 56,
    paddingHorizontal: 6,
    borderBottomWidth: 4,
    borderRadius: 6,
    alignItems: "center",
  },
  choicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
    paddingBottom: 40,
    width: "100%",
  },
  choiceButton: {
    width: "45%",
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 3,
    alignItems: "center",
    minHeight: 48,
  },
  choiceText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },
  choicePicture: {
    fontSize: 48,
  },
});
