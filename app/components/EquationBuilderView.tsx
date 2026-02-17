import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { EquationBuilderProblem } from "../../lib/problems";
import type { SubmitPayload } from "../../lib/context";

type Feedback = { result: "correct" | "wrong" } | null;

type Props = {
  problem: EquationBuilderProblem;
  sectionColor: string;
  feedback: Feedback;
  onSubmit: (payload: SubmitPayload, feedbackMeta: {}) => void;
};

export default function EquationBuilderView({ problem, sectionColor, feedback, onSubmit }: Props) {
  const [placed, setPlaced] = useState<(string | null)[]>(
    Array(problem.correctOrder.length).fill(null)
  );
  const [availableMask, setAvailableMask] = useState<boolean[]>(
    problem.tiles.map(() => true)
  );

  const placedCount = placed.filter((p) => p !== null).length;
  const allPlaced = placedCount === problem.correctOrder.length;

  const handleTapTile = (tileIndex: number) => {
    if (feedback || !availableMask[tileIndex]) return;
    const nextSlot = placed.indexOf(null);
    if (nextSlot === -1) return;

    const newPlaced = [...placed];
    newPlaced[nextSlot] = problem.tiles[tileIndex];
    setPlaced(newPlaced);

    const newMask = [...availableMask];
    newMask[tileIndex] = false;
    setAvailableMask(newMask);
  };

  const handleTapSlot = (slotIndex: number) => {
    if (feedback) return;
    const val = placed[slotIndex];
    if (val === null) return;

    // Find original tile index to restore
    const tileIdx = problem.tiles.findIndex(
      (t, i) => t === val && !availableMask[i]
    );

    const newPlaced = [...placed];
    // Remove this and shift later items back
    newPlaced[slotIndex] = null;
    // Compact: move non-null items to the left
    const compacted = newPlaced.filter((p) => p !== null);
    const finalPlaced = [
      ...compacted,
      ...Array(problem.correctOrder.length - compacted.length).fill(null),
    ];
    setPlaced(finalPlaced);

    if (tileIdx >= 0) {
      const newMask = [...availableMask];
      newMask[tileIdx] = true;
      setAvailableMask(newMask);
    }
  };

  const handleCheck = () => {
    if (feedback) return;
    const arrangedTiles = placed.filter((p): p is string => p !== null);
    onSubmit({ kind: "equation_builder", arrangedTiles }, {});
  };

  const getSlotStyle = (index: number) => {
    if (!feedback) {
      return placed[index] !== null
        ? { backgroundColor: sectionColor }
        : { backgroundColor: "#E5E7EB", borderWidth: 2, borderColor: "#9CA3AF", borderStyle: "dashed" as const };
    }
    if (placed[index] !== null) {
      return { backgroundColor: feedback.result === "correct" ? "#22C55E" : "#EF4444" };
    }
    return { backgroundColor: "#E5E7EB" };
  };

  return (
    <>
      <Text style={styles.title}>Build the equation</Text>
      <View style={styles.slotsRow}>
        {placed.map((val, i) => (
          <Pressable
            key={i}
            style={[styles.slot, getSlotStyle(i)]}
            onPress={() => handleTapSlot(i)}
            disabled={feedback !== null || val === null}
          >
            <Text style={[styles.slotText, val !== null ? { color: "#fff" } : { color: "#9CA3AF" }]}>
              {val ?? "—"}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.tilesRow}>
        {problem.tiles.map((tile, i) => (
          <Pressable
            key={i}
            style={[
              styles.tile,
              {
                backgroundColor: availableMask[i] ? sectionColor : "#D1D5DB",
                opacity: availableMask[i] ? 1 : 0.4,
              },
            ]}
            onPress={() => handleTapTile(i)}
            disabled={feedback !== null || !availableMask[i]}
          >
            <Text style={styles.tileText}>{tile}</Text>
          </Pressable>
        ))}
      </View>
      {!feedback && allPlaced && (
        <Pressable
          style={[styles.checkButton, { backgroundColor: sectionColor }]}
          onPress={handleCheck}
        >
          <Text style={styles.checkText}>Check!</Text>
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
  slotsRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginBottom: 32,
  },
  slot: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  slotText: {
    fontSize: 24,
    fontWeight: "700",
  },
  tilesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  tile: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    minHeight: 48,
    minWidth: 48,
  },
  tileText: {
    fontSize: 24,
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
