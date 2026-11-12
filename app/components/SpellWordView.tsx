import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { SpellWordProblem } from "../../lib/reading";
import type { SubmitPayload } from "../../lib/context";
import { speakWord, stopSpeaking } from "../../lib/speech";
import SpeakButton from "./SpeakButton";

type Feedback = { result: "correct" | "wrong" } | null;

type Props = {
  problem: SpellWordProblem;
  sectionColor: string;
  feedback: Feedback;
  onSubmit: (payload: SubmitPayload, feedbackMeta: {}) => void;
};

export default function SpellWordView({ problem, sectionColor, feedback, onSubmit }: Props) {
  // Indices into problem.tiles, in the order they were placed
  const [placed, setPlaced] = useState<number[]>([]);

  useEffect(() => {
    // Without a picture, the spoken word is the only clue: say it straight away
    if (!problem.emoji) speakWord(problem.word);
    return () => stopSpeaking();
  }, [problem]);

  const allPlaced = placed.length === problem.slotCount;

  const handleTapTile = (tileIndex: number) => {
    if (feedback || placed.includes(tileIndex) || allPlaced) return;
    setPlaced((p) => [...p, tileIndex]);
  };

  const handleTapSlot = (slotIndex: number) => {
    if (feedback || slotIndex >= placed.length) return;
    setPlaced((p) => p.filter((_, i) => i !== slotIndex));
  };

  const handleCheck = () => {
    if (feedback) return;
    onSubmit({ kind: "spell_word", arranged: placed.map((i) => problem.tiles[i]) }, {});
    speakWord(problem.word);
  };

  const slotColor = (filled: boolean) => {
    if (feedback && filled) return feedback.result === "correct" ? "#22C55E" : "#EF4444";
    return filled ? sectionColor : "#E5E7EB";
  };

  return (
    <>
      <Text style={styles.title}>Spell the word</Text>
      <View style={styles.questionRow}>
        {problem.emoji && <Text style={styles.picture}>{problem.emoji}</Text>}
        <SpeakButton word={problem.word} color={sectionColor} />
      </View>

      <View style={styles.slotsRow}>
        {Array.from({ length: problem.slotCount }, (_, i) => {
          const tile = placed[i] !== undefined ? problem.tiles[placed[i]] : null;
          return (
            <Pressable
              key={i}
              accessibilityLabel={tile ? `Remove ${tile}` : `Empty slot ${i + 1}`}
              style={[
                styles.slot,
                { backgroundColor: slotColor(tile !== null) },
                tile === null && styles.slotEmpty,
              ]}
              onPress={() => handleTapSlot(i)}
              disabled={feedback !== null || tile === null}
            >
              <Text style={[styles.slotText, { color: tile ? "#fff" : "#9CA3AF" }]}>
                {tile ?? ""}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {feedback?.result === "wrong" && (
        <Text style={styles.correction}>{problem.word}</Text>
      )}

      <View style={styles.tilesRow}>
        {problem.tiles.map((tile, i) => {
          const used = placed.includes(i);
          return (
            <Pressable
              key={i}
              accessibilityRole="button"
              accessibilityLabel={`Tile ${tile}`}
              style={[
                styles.tile,
                { backgroundColor: used ? "#D1D5DB" : sectionColor, opacity: used ? 0.4 : 1 },
              ]}
              onPress={() => handleTapTile(i)}
              disabled={feedback !== null || used}
            >
              <Text style={styles.tileText}>{tile}</Text>
            </Pressable>
          );
        })}
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
    fontSize: 24,
    fontWeight: "700",
    color: "#1E1B4B",
    marginBottom: 16,
    textAlign: "center",
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24,
  },
  picture: {
    fontSize: 72,
  },
  slotsRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginBottom: 16,
  },
  slot: {
    minWidth: 56,
    height: 64,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  slotEmpty: {
    borderWidth: 2,
    borderColor: "#9CA3AF",
    borderStyle: "dashed",
  },
  slotText: {
    fontSize: 32,
    fontWeight: "700",
  },
  correction: {
    fontSize: 28,
    fontWeight: "700",
    color: "#22C55E",
    marginBottom: 12,
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
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    minHeight: 56,
    minWidth: 56,
  },
  tileText: {
    fontSize: 28,
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
