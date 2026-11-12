import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { SpellWordProblem } from "../../lib/literacy";
import type { SubmitPayload } from "../../lib/context";
import SpeakButton from "./SpeakButton";

type Feedback = { result: "correct" | "wrong" } | null;

type Props = {
  problem: SpellWordProblem;
  sectionColor: string;
  feedback: Feedback;
  onSubmit: (payload: SubmitPayload, feedbackMeta: {}) => void;
};

/** Tap letter tiles in order to spell the pictured word; tap a placed letter to take it back. */
export default function SpellWordView({ problem, sectionColor, feedback, onSubmit }: Props) {
  const slotCount = problem.word.length;
  // Each slot holds the index of the tile placed there.
  const [placed, setPlaced] = useState<number[]>([]);

  const tapTile = (tileIndex: number) => {
    if (feedback || placed.includes(tileIndex) || placed.length >= slotCount) return;
    setPlaced([...placed, tileIndex]);
  };

  const tapSlot = (slot: number) => {
    if (feedback || slot >= placed.length) return;
    setPlaced(placed.filter((_, i) => i !== slot));
  };

  const slotColor = () => {
    if (!feedback) return sectionColor;
    return feedback.result === "correct" ? "#22C55E" : "#EF4444";
  };

  return (
    <>
      <SpeakButton text={problem.speak} color={sectionColor} />
      <Text style={styles.title}>Spell it!</Text>
      <Text style={styles.picture}>{problem.emoji}</Text>
      <View style={styles.slotsRow}>
        {Array.from({ length: slotCount }).map((_, i) => {
          const tile = placed[i];
          const filled = tile !== undefined;
          return (
            <Pressable
              key={i}
              accessibilityLabel={`slot ${i + 1}`}
              style={[
                styles.slot,
                filled
                  ? { backgroundColor: slotColor() }
                  : { backgroundColor: "#E5E7EB", borderWidth: 2, borderColor: "#9CA3AF", borderStyle: "dashed" as const },
              ]}
              onPress={() => tapSlot(i)}
              disabled={feedback !== null || !filled}
            >
              <Text style={[styles.slotText, { color: filled ? "#fff" : "#9CA3AF" }]}>
                {filled ? problem.tiles[tile] : "_"}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {feedback?.result === "wrong" && <Text style={styles.answer}>{problem.word}</Text>}
      <View style={styles.tilesRow}>
        {problem.tiles.map((letter, i) => {
          const used = placed.includes(i);
          return (
            <Pressable
              key={i}
              accessibilityLabel={`tile ${letter}`}
              style={[styles.tile, { backgroundColor: used ? "#D1D5DB" : sectionColor, opacity: used ? 0.4 : 1 }]}
              onPress={() => tapTile(i)}
              disabled={feedback !== null || used}
            >
              <Text style={styles.tileText}>{letter}</Text>
            </Pressable>
          );
        })}
      </View>
      {!feedback && placed.length === slotCount && (
        <Pressable
          style={[styles.checkButton, { backgroundColor: sectionColor }]}
          onPress={() => onSubmit({ kind: "spell_word", letters: placed.map((t) => problem.tiles[t]) }, {})}
        >
          <Text style={styles.checkText}>Check!</Text>
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
    textAlign: "center",
  },
  picture: {
    fontSize: 80,
    lineHeight: 96,
    marginBottom: 12,
  },
  slotsRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginBottom: 12,
  },
  slot: {
    width: 56,
    height: 64,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  slotText: {
    fontSize: 36,
    fontWeight: "700",
  },
  answer: {
    fontSize: 28,
    fontWeight: "700",
    color: "#22C55E",
    marginBottom: 8,
  },
  tilesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    paddingHorizontal: 8,
    marginTop: 16,
  },
  tile: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tileText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },
  checkButton: {
    marginTop: 24,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    alignItems: "center",
    alignSelf: "center",
    minHeight: 48,
  },
  checkText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
});
