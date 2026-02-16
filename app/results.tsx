import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useGame } from "../lib/context";

export default function ResultsScreen() {
  const {
    sessionScore,
    sessionMissed,
    progress,
    profile,
    syncResults,
    startSession,
    clearProfile,
  } = useGame();
  const router = useRouter();
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (!synced) {
      syncResults().then(() => setSynced(true));
    }
  }, [synced, syncResults]);

  const stars = sessionScore === 10 ? 3 : sessionScore >= 8 ? 2 : 1;
  const starDisplay = Array(3)
    .fill(null)
    .map((_, i) => (i < stars ? "★" : "☆"))
    .join(" ");

  const trackColor =
    profile?.track === "multiplication" ? "#FF8C42" : "#6C63FF";

  const handlePlayAgain = () => {
    startSession();
    router.replace("/game");
  };

  const handleSwitch = () => {
    clearProfile();
    router.replace("/");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      bounces={false}
    >
      <Text style={styles.stars}>{starDisplay}</Text>

      <Text style={styles.scoreText}>
        {sessionScore} / 10 correct
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {progress?.total_completed ?? 0}
          </Text>
          <Text style={styles.statLabel}>Total solved</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {progress?.streak ?? 0}
          </Text>
          <Text style={styles.statLabel}>Day streak</Text>
        </View>
      </View>

      {sessionMissed.length > 0 && (
        <View style={styles.missedSection}>
          <Text style={styles.missedTitle}>Review these:</Text>
          {sessionMissed.map((m, i) => (
            <Text key={i} style={styles.missedItem}>
              {m.question} = {m.answer}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.buttons}>
        <Pressable
          style={[styles.button, { backgroundColor: trackColor }]}
          onPress={handlePlayAgain}
        >
          <Text style={styles.buttonText}>Play Again</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.buttonOutline]}
          onPress={handleSwitch}
        >
          <Text style={[styles.buttonText, { color: "#6B7280" }]}>
            Switch Player
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  stars: {
    fontSize: 56,
    color: "#FBBF24",
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E1B4B",
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 32,
  },
  statBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    minWidth: 120,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1E1B4B",
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  missedSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 320,
    marginBottom: 32,
  },
  missedTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E1B4B",
    marginBottom: 12,
  },
  missedItem: {
    fontSize: 20,
    color: "#EF4444",
    marginBottom: 4,
  },
  buttons: {
    gap: 16,
    width: "100%",
    maxWidth: 320,
  },
  button: {
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#D1D5DB",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
});
