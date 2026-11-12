import { useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { WordChoiceProblem } from "../../lib/reading";
import type { SubmitPayload } from "../../lib/context";
import { speakWord, stopSpeaking } from "../../lib/speech";
import SpeakButton from "./SpeakButton";

type Feedback = { index: number; result: "correct" | "wrong" } | null;

type Props = {
  problem: WordChoiceProblem;
  sectionColor: string;
  feedback: Feedback;
  onSubmit: (payload: SubmitPayload, feedbackMeta: { index: number }) => void;
};

export default function WordChoiceView({ problem, sectionColor, feedback, onSubmit }: Props) {
  useEffect(() => {
    if (problem.autoSpeak && problem.speak) speakWord(problem.speak);
    return () => stopSpeaking();
  }, [problem]);

  const handlePress = (choice: string, index: number) => {
    onSubmit({ kind: "word_choice", choice }, { index });
    // Hear the word once answered, to tie its sound to its spelling
    speakWord(problem.word);
  };

  const isListen = problem.mode === "listen";
  const isRhyme = problem.mode === "rhyme";

  return (
    <>
      <Text style={styles.prompt}>
        {problem.prompt}
        {isRhyme && <Text style={styles.promptWord}> {problem.display}</Text>}
        {isRhyme && "?"}
      </Text>

      {isListen && problem.speak && (
        <SpeakButton word={problem.speak} color={sectionColor} size="large" />
      )}

      {!isListen && (
        <View style={styles.questionRow}>
          {problem.emoji && <Text style={styles.picture}>{problem.emoji}</Text>}
          {problem.display && !isRhyme && (
            <Text style={styles.display}>{problem.display}</Text>
          )}
          {problem.speak && <SpeakButton word={problem.speak} color={sectionColor} />}
        </View>
      )}

      <View style={styles.choicesGrid}>
        {problem.choices.map((choice, i) => {
          let bgColor = sectionColor;
          if (feedback) {
            if (feedback.index === i) {
              bgColor = feedback.result === "correct" ? "#22C55E" : "#EF4444";
            } else if (feedback.result === "wrong" && choice === problem.answer) {
              bgColor = "#22C55E";
            }
          }
          return (
            <Pressable
              key={i}
              accessibilityRole="button"
              accessibilityLabel={choice}
              style={[styles.choiceButton, { backgroundColor: bgColor }]}
              onPress={() => handlePress(choice, i)}
              disabled={feedback !== null}
            >
              <Text
                style={problem.choiceStyle === "emoji" ? styles.choiceEmoji : styles.choiceText}
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
  prompt: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E1B4B",
    textAlign: "center",
    marginBottom: 20,
  },
  promptWord: {
    fontSize: 32,
    color: "#1E1B4B",
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginBottom: 28,
  },
  picture: {
    fontSize: 72,
  },
  display: {
    fontSize: 52,
    fontWeight: "700",
    color: "#1E1B4B",
    letterSpacing: 2,
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
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    minHeight: 48,
  },
  choiceText: {
    fontSize: 34,
    fontWeight: "700",
    color: "#fff",
  },
  choiceEmoji: {
    fontSize: 48,
  },
});
