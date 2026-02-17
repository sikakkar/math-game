import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { OrderingProblem } from "../../lib/problems";
import type { SubmitPayload } from "../../lib/context";

type Feedback = { result: "correct" | "wrong" } | null;

type Props = {
  problem: OrderingProblem;
  sectionColor: string;
  feedback: Feedback;
  onSubmit: (payload: SubmitPayload, feedbackMeta: {}) => void;
};

export default function OrderingView({ problem, sectionColor, feedback, onSubmit }: Props) {
  // selectedOrder stores item indices in the order the user tapped them
  const [selectedOrder, setSelectedOrder] = useState<number[]>([]);

  const allPlaced = selectedOrder.length === problem.items.length;

  const handleTapCard = (itemIndex: number) => {
    if (feedback) return;
    if (selectedOrder.includes(itemIndex)) return;
    setSelectedOrder((prev) => [...prev, itemIndex]);
  };

  const handleUndo = () => {
    if (feedback) return;
    setSelectedOrder((prev) => prev.slice(0, -1));
  };

  const handleCheck = () => {
    if (feedback) return;
    onSubmit({ kind: "ordering", selectedOrder }, {});
  };

  const getCardStyle = (itemIndex: number) => {
    const orderPos = selectedOrder.indexOf(itemIndex);
    if (feedback && orderPos >= 0) {
      return { backgroundColor: feedback.result === "correct" ? "#22C55E" : "#EF4444" };
    }
    if (orderPos >= 0) {
      return { backgroundColor: sectionColor, opacity: 0.5 };
    }
    return { backgroundColor: "#E5E7EB" };
  };

  const getCardTextColor = (itemIndex: number) => {
    return selectedOrder.includes(itemIndex) ? "#fff" : "#374151";
  };

  return (
    <>
      <Text style={styles.title}>Order: smallest to biggest</Text>

      {/* Expression cards in 2x2 grid */}
      <View style={styles.cardsGrid}>
        {problem.items.map((item, i) => {
          const orderPos = selectedOrder.indexOf(i);
          return (
            <Pressable
              key={i}
              style={[styles.card, getCardStyle(i)]}
              onPress={() => handleTapCard(i)}
              disabled={feedback !== null || selectedOrder.includes(i)}
            >
              <Text style={[styles.cardText, { color: getCardTextColor(i) }]}>{item}</Text>
              {orderPos >= 0 && (
                <View style={styles.orderBadge}>
                  <Text style={styles.orderBadgeText}>{orderPos + 1}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Order slots */}
      <View style={styles.orderBar}>
        {problem.items.map((_, i) => (
          <View
            key={i}
            style={[
              styles.orderSlot,
              i < selectedOrder.length
                ? { backgroundColor: feedback ? (feedback.result === "correct" ? "#22C55E" : "#EF4444") : sectionColor }
                : { backgroundColor: "#D1D5DB" },
            ]}
          >
            <Text style={styles.orderSlotText}>
              {i < selectedOrder.length ? problem.items[selectedOrder[i]] : `${i + 1}`}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.actionsRow}>
        {!feedback && selectedOrder.length > 0 && (
          <Pressable style={styles.undoButton} onPress={handleUndo}>
            <Text style={styles.undoText}>Undo</Text>
          </Pressable>
        )}
        {!feedback && allPlaced && (
          <Pressable
            style={[styles.checkButton, { backgroundColor: sectionColor }]}
            onPress={handleCheck}
          >
            <Text style={styles.checkText}>Check!</Text>
          </Pressable>
        )}
      </View>
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
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    marginBottom: 24,
  },
  card: {
    width: "45%",
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    minHeight: 64,
    justifyContent: "center",
    position: "relative",
  },
  cardText: {
    fontSize: 24,
    fontWeight: "700",
  },
  orderBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1E1B4B",
    alignItems: "center",
    justifyContent: "center",
  },
  orderBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  orderBar: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginBottom: 24,
  },
  orderSlot: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
    minWidth: 72,
    minHeight: 48,
    justifyContent: "center",
  },
  orderSlotText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
  },
  undoButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  undoText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
  },
  checkButton: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    alignItems: "center",
    minHeight: 48,
  },
  checkText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
});
