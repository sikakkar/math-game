import { useEffect, useState, useMemo } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { useGame } from "../lib/context";
import { SKILL_MAP, SKILL_SECTION_MAP, MASTERY_THRESHOLDS } from "../lib/curriculum";

const CELEBRATING_IMAGES = [
  require("../assets/orca/celebrating.png"),
  require("../assets/orca/celebrating_trophy.png"),
  require("../assets/orca/celebrating_fireworks.png"),
];

const ENCOURAGING_IMAGES = [
  require("../assets/orca/encouraging.png"),
  require("../assets/orca/encouraging_flex.png"),
  require("../assets/orca/encouraging_heart.png"),
];

const MASTERY_LABELS: Record<number, string> = {
  0: "Not Started",
  1: "Learning",
  2: "Practicing",
  3: "Mastered",
};

export default function ResultsScreen() {
  const {
    sessionScore,
    sessionMissed,
    activeSkillId,
    profileStats,
    syncResults,
    startLesson,
    getSkillProgress,
    getPlayableSkillId,
  } = useGame();
  const router = useRouter();
  const [synced, setSynced] = useState(false);
  const [prevLevel, setPrevLevel] = useState<number | null>(null);

  const orcaImage = useMemo(() => {
    const pool = sessionScore >= 8 ? CELEBRATING_IMAGES : ENCOURAGING_IMAGES;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [sessionScore]);

  useEffect(() => {
    if (!synced && activeSkillId) {
      // Capture level before sync
      const progress = getSkillProgress(activeSkillId);
      setPrevLevel(progress?.mastery_level ?? 0);
      syncResults().then(() => setSynced(true));
    }
  }, [synced, syncResults, activeSkillId, getSkillProgress]);

  const skill = activeSkillId ? SKILL_MAP[activeSkillId] : null;
  const section = activeSkillId ? SKILL_SECTION_MAP[activeSkillId] : null;
  const sectionColor = section?.color ?? "#6C63FF";

  // Current mastery after sync
  const currentProgress = activeSkillId ? getSkillProgress(activeSkillId) : null;
  const currentLevel = currentProgress?.mastery_level ?? 0;
  const didAdvance = prevLevel !== null && currentLevel > prevLevel;

  const stars = sessionScore === 10 ? 3 : sessionScore >= 8 ? 2 : 1;
  const starDisplay = Array(3)
    .fill(null)
    .map((_, i) => (i < stars ? "\u2605" : "\u2606"))
    .join(" ");

  const playableId = synced ? getPlayableSkillId() : null;
  const canPracticeAgain = synced && activeSkillId === playableId;

  const handlePracticeAgain = () => {
    if (activeSkillId && canPracticeAgain) {
      startLesson(activeSkillId);
      router.replace("/game");
    }
  };

  const handleBackToPath = () => {
    router.replace("/path");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      bounces={false}
    >
      <Image source={orcaImage} style={styles.orca} resizeMode="contain" />

      <Text style={styles.stars}>{starDisplay}</Text>

      {skill && (
        <Text style={[styles.skillName, { color: sectionColor }]}>
          {skill.name}
        </Text>
      )}

      <Text style={styles.scoreText}>
        {sessionScore} / 10 correct
      </Text>

      {/* Mastery indicator */}
      <View style={styles.masterySection}>
        <Text style={styles.masteryLabel}>
          {MASTERY_LABELS[currentLevel]}
        </Text>
        <View style={styles.masteryDots}>
          {[1, 2, 3].map((level) => (
            <View
              key={level}
              style={[
                styles.dot,
                currentLevel >= level ? styles.dotFilled : styles.dotEmpty,
              ]}
            />
          ))}
        </View>
        {didAdvance && synced && (
          <Text style={styles.advanceText}>
            Level up! You reached {MASTERY_LABELS[currentLevel]}!
          </Text>
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {profileStats?.total_completed ?? 0}
          </Text>
          <Text style={styles.statLabel}>Total solved</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {profileStats?.streak ?? 0}
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
        {canPracticeAgain && (
          <Pressable
            style={[styles.button, { backgroundColor: sectionColor }]}
            onPress={handlePracticeAgain}
          >
            <Text style={styles.buttonText}>Practice Again</Text>
          </Pressable>
        )}
        <Pressable
          style={[styles.button, canPracticeAgain ? styles.buttonOutline : { backgroundColor: sectionColor }]}
          onPress={handleBackToPath}
        >
          <Text style={[styles.buttonText, canPracticeAgain ? { color: "#6B7280" } : undefined]}>
            {canPracticeAgain ? "Back to Path" : "Continue"}
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
  orca: {
    width: 200,
    height: 120,
    marginBottom: 12,
  },
  stars: {
    fontSize: 56,
    color: "#FBBF24",
    marginBottom: 16,
  },
  skillName: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E1B4B",
    marginBottom: 20,
  },
  masterySection: {
    alignItems: "center",
    marginBottom: 24,
  },
  masteryLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  masteryDots: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  dotFilled: {
    backgroundColor: "#FBBF24",
  },
  dotEmpty: {
    backgroundColor: "#D1D5DB",
  },
  advanceText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#22C55E",
    marginTop: 12,
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
