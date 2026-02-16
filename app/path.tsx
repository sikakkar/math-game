import { useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useGame, type SkillStatus } from "../lib/context";
import { CURRICULUM, type Section, type Skill } from "../lib/curriculum";

export default function PathScreen() {
  const {
    profile,
    profileStats,
    startLesson,
    getSkillStatus,
    getSkillProgress,
    getPlayableSkillId,
    clearProfile,
  } = useGame();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const firstAvailableY = useRef<number | null>(null);

  useEffect(() => {
    if (!profile) {
      router.replace("/");
    }
  }, [profile, router]);

  // Auto-scroll to first available/in-progress skill
  useEffect(() => {
    const timer = setTimeout(() => {
      if (firstAvailableY.current !== null && scrollRef.current) {
        scrollRef.current.scrollTo({
          y: Math.max(0, firstAvailableY.current - 200),
          animated: true,
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!profile) return null;

  const playableId = getPlayableSkillId();

  const handleNodePress = (skill: Skill) => {
    if (skill.id !== playableId) return;
    startLesson(skill.id);
    router.push("/game");
  };

  const handleSwitchPlayer = () => {
    clearProfile();
    router.replace("/");
  };

  let globalNodeIndex = 0;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={handleSwitchPlayer}>
          <Text style={styles.profileName}>{profile.name}</Text>
        </Pressable>
        <Text style={styles.streak}>
          {profileStats?.streak ?? 0} day streak
        </Text>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {CURRICULUM.map((section) => (
          <View key={section.name} style={styles.section}>
            <View
              style={[
                styles.sectionHeader,
                { backgroundColor: section.color },
              ]}
            >
              <Text style={styles.sectionName}>{section.name}</Text>
            </View>

            <View style={styles.nodesContainer}>
              {section.skills.map((skill, skillIndex) => {
                const status = getSkillStatus(skill.id);
                const progress = getSkillProgress(skill.id);
                const masteryLevel = progress?.mastery_level ?? 0;
                const nodeIndex = globalNodeIndex++;

                // Zigzag x-offset
                const xOffset =
                  Math.sin((nodeIndex * Math.PI) / 2) * 80;

                const isPlayable = skill.id === playableId;

                // Track playable node for auto-scroll
                const isFirstAvailable =
                  isPlayable &&
                  firstAvailableY.current === null;

                return (
                  <View
                    key={skill.id}
                    style={[
                      styles.nodeRow,
                      { marginLeft: xOffset + 80 },
                    ]}
                    onLayout={
                      isFirstAvailable
                        ? (e) => {
                            firstAvailableY.current =
                              e.nativeEvent.layout.y;
                          }
                        : undefined
                    }
                  >
                    <Pressable
                      style={[
                        styles.node,
                        getNodeStyle(status, section.color, isPlayable),
                      ]}
                      onPress={() => handleNodePress(skill)}
                      disabled={!isPlayable}
                    >
                      <Text
                        style={[
                          styles.nodeIcon,
                          status === "locked" && styles.nodeIconLocked,
                        ]}
                      >
                        {status === "locked" ? "🔒" : skill.icon}
                      </Text>
                    </Pressable>

                    <View style={styles.masteryDots}>
                      {[1, 2, 3].map((level) => (
                        <View
                          key={level}
                          style={[
                            styles.dot,
                            masteryLevel >= level
                              ? styles.dotFilled
                              : styles.dotEmpty,
                          ]}
                        />
                      ))}
                    </View>

                    <Text
                      style={[
                        styles.nodeName,
                        status === "locked" && styles.nodeNameLocked,
                      ]}
                    >
                      {skill.name}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

function getNodeStyle(
  status: SkillStatus,
  sectionColor: string,
  isPlayable: boolean
) {
  if (status === "locked") {
    return { backgroundColor: "#D1D5DB", borderColor: "#9CA3AF" };
  }
  if (isPlayable) {
    return {
      backgroundColor: sectionColor,
      borderColor: "#FBBF24",
      borderWidth: 3,
    };
  }
  // Completed / passed nodes — dimmed with checkmark-style gold border
  if (status === "mastered") {
    return {
      backgroundColor: sectionColor,
      borderColor: "#FBBF24",
      borderWidth: 3,
      opacity: 0.5,
    };
  }
  // Earlier non-mastered skills the kid has moved past
  return {
    backgroundColor: sectionColor,
    borderColor: sectionColor,
    opacity: 0.5,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F3FF",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6C63FF",
  },
  streak: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F59E0B",
  },
  scrollContent: {
    paddingVertical: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    marginHorizontal: 24,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  nodesContainer: {
    paddingHorizontal: 12,
  },
  nodeRow: {
    alignItems: "center",
    marginBottom: 28,
    width: 90,
  },
  node: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  nodeIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  nodeIconLocked: {
    fontSize: 22,
  },
  masteryDots: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotFilled: {
    backgroundColor: "#FBBF24",
  },
  dotEmpty: {
    backgroundColor: "#D1D5DB",
  },
  nodeName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginTop: 4,
    textAlign: "center",
  },
  nodeNameLocked: {
    color: "#9CA3AF",
  },
  bottomSpacer: {
    height: 60,
  },
});
