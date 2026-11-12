import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { LiteracyPopProblem } from "../../lib/literacy";
import type { SubmitPayload } from "../../lib/context";
import SpeakButton from "./SpeakButton";

type Feedback = { result: "correct" | "wrong" } | null;

type Props = {
  problem: LiteracyPopProblem;
  sectionColor: string;
  feedback: Feedback;
  onSubmit: (payload: SubmitPayload, feedbackMeta: {}) => void;
};

export default function LiteracyPopView({ problem, sectionColor, feedback, onSubmit }: Props) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const isPicture = problem.itemStyle === "picture";

  const toggle = (i: number) => {
    if (feedback) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const bubbleStyle = (i: number) => {
    const picked = selected.has(i);
    if (feedback) {
      const ok = problem.correctIndices.includes(i);
      if (ok) return { backgroundColor: "#22C55E", opacity: picked ? 1 : 0.6 };
      if (picked) return { backgroundColor: "#EF4444" };
      return { backgroundColor: "#E5E7EB" };
    }
    return picked
      ? { backgroundColor: sectionColor, borderWidth: 3, borderColor: "#1E1B4B" }
      : { backgroundColor: isPicture ? "#fff" : "#E5E7EB" };
  };

  return (
    <>
      <SpeakButton text={problem.speak} color={sectionColor} />
      <Text style={styles.title}>
        {problem.instruction} <Text style={[styles.target, { color: sectionColor }]}>{problem.display}</Text>
      </Text>
      <View style={styles.grid}>
        {problem.items.map((item, i) => (
          <Pressable
            key={i}
            accessibilityLabel={`bubble ${item}`}
            style={[styles.bubble, bubbleStyle(i)]}
            onPress={() => toggle(i)}
            disabled={feedback !== null}
          >
            <Text
              style={[
                isPicture ? styles.picture : styles.word,
                !isPicture && { color: selected.has(i) || feedback ? "#fff" : "#374151" },
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>
      {!feedback && (
        <Pressable
          style={[styles.doneButton, { backgroundColor: selected.size > 0 ? sectionColor : "#D1D5DB" }]}
          onPress={() => onSubmit({ kind: "literacy_pop", selectedIndices: Array.from(selected) }, {})}
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
    fontSize: 26,
    fontWeight: "700",
    color: "#1E1B4B",
    marginBottom: 20,
    textAlign: "center",
  },
  target: {
    fontSize: 40,
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
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 72,
  },
  picture: {
    fontSize: 40,
    lineHeight: 50,
  },
  word: {
    fontSize: 26,
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
