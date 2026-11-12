import { useEffect } from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { say, stopSpeaking } from "../../lib/speech";

/** 🔊 button that replays `text`; also reads it once when the question appears. */
export default function SpeakButton({ text, color }: { text: string; color: string }) {
  useEffect(() => {
    say(text);
    return () => stopSpeaking();
  }, [text]);

  return (
    <Pressable
      accessibilityLabel="Hear it again"
      style={[styles.button, { borderColor: color }]}
      onPress={() => say(text)}
    >
      <Text style={styles.icon}>🔊</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  icon: {
    fontSize: 26,
  },
});
