import { useEffect, useRef, useMemo } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Image, Platform } from "react-native";
import { useRouter, Redirect } from "expo-router";
import { useGame, type SkillStatus } from "../lib/context";
import { CURRICULUM, type Section, type Skill } from "../lib/curriculum";

const POINTING_IMAGES = [
  require("../assets/orca/pointing.png"),
  require("../assets/orca/pointing_excited.png"),
  require("../assets/orca/pointing_wand.png"),
];

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

  const pointingImage = useMemo(
    () => POINTING_IMAGES[Math.floor(Math.random() * POINTING_IMAGES.length)],
    []
  );

  // Scroll the playable skill into view after mount
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const timer = setTimeout(() => {
      const el = document.getElementById("playable-skill");
      if (!el) return;

      // Walk up to find the scrollable ancestor (RN Web ScrollView)
      let scrollable: HTMLElement | null = el.parentElement;
      while (scrollable) {
        const style = window.getComputedStyle(scrollable);
        if (
          (style.overflowY === "auto" || style.overflowY === "scroll") &&
          scrollable.scrollHeight > scrollable.clientHeight
        ) break;
        scrollable = scrollable.parentElement;
      }
      if (!scrollable) return;

      const elRect = el.getBoundingClientRect();
      const scrollRect = scrollable.getBoundingClientRect();
      const offsetInContent = elRect.top - scrollRect.top + scrollable.scrollTop;
      scrollable.scrollTop = Math.max(0, offsetInContent - scrollable.clientHeight / 2);
    }, 300);
    return () => clearTimeout(timer);
  }, [profile]);

  if (!profile) return <Redirect href="/" />;

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

                return (
                  <View
                    key={skill.id}
                    nativeID={isPlayable ? "playable-skill" : undefined}
                    style={[
                      styles.nodeRow,
                      { marginLeft: xOffset + 80 },
                    ]}
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
                    {isPlayable && (
                      <Image
                        source={pointingImage}
                        style={styles.orcaPointing}
                        resizeMode="contain"
                      />
                    )}

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
  orcaPointing: {
    width: 70,
    height: 50,
    position: "absolute",
    right: -65,
    top: 5,
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
