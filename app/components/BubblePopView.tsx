import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { BubblePopProblem } from "../../lib/problems";
import type { SubmitPayload } from "../../lib/context";

type Feedback = { result: "correct" | "wrong" } | null;

type Props = {
  problem: BubblePopProblem;
  sectionColor: string;
  feedback: Feedback;
  onSubmit: (payload: SubmitPayload, feedbackMeta: {}) => void;
};

export default function BubblePopView({ problem, sectionColor, feedback, onSubmit }: Props) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggleBubble = (index: number) => {
    if (feedback) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleDone = () => {
    if (feedback) return;
    onSubmit({ kind: "bubble_pop", selectedIndices: Array.from(selected) }, {});
  };

  const getBubbleStyle = (index: number) => {
    if (feedback) {
      const isCorrect = problem.correctIndices.includes(index);
      const wasSelected = selected.has(index);
      if (isCorrect && wasSelected) return { backgroundColor: "#22C55E" };
      if (isCorrect && !wasSelected) return { backgroundColor: "#22C55E", opacity: 0.6 };
      if (!isCorrect && wasSelected) return { backgroundColor: "#EF4444" };
      return { backgroundColor: "#E5E7EB" };
    }
    if (selected.has(index)) {
      return { backgroundColor: sectionColor, borderWidth: 3, borderColor: "#1E1B4B" };
    }
    return { backgroundColor: "#E5E7EB" };
  };

  const getBubbleTextColor = (index: number) => {
    if (feedback) {
      const isCorrect = problem.correctIndices.includes(index);
      const wasSelected = selected.has(index);
      if (isCorrect || wasSelected) return "#fff";
      return "#374151";
    }
    return selected.has(index) ? "#fff" : "#374151";
  };

  return (
    <>
      <Text style={styles.title}>Tap all that equal {problem.targetValue}</Text>
      <View style={styles.grid}>
        {problem.bubbles.map((bubble, i) => (
          <Pressable
            key={i}
            style={[styles.bubble, getBubbleStyle(i)]}
            onPress={() => toggleBubble(i)}
            disabled={feedback !== null}
          >
            <Text style={[styles.bubbleText, { color: getBubbleTextColor(i) }]}>{bubble}</Text>
          </Pressable>
        ))}
      </View>
      {!feedback && (
        <Pressable
          style={[styles.doneButton, { backgroundColor: selected.size > 0 ? sectionColor : "#D1D5DB" }]}
          onPress={handleDone}
          disabled={selected.size === 0}
        >
          <Text style={styles.doneText}>Done!</Text>
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E1B4B",
    marginBottom: 20,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  bubble: {
    width: "30%",
    paddingVertical: 20,
    borderRadius: 50,
    alignItems: "center",
    minHeight: 64,
    justifyContent: "center",
  },
  bubbleText: {
    fontSize: 20,
    fontWeight: "700",
  },
  doneButton: {
    marginTop: 24,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    alignItems: "center",
    alignSelf: "center",
    minHeight: 48,
  },
  doneText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
});
