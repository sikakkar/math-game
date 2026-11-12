import { Pressable, Text, StyleSheet } from "react-native";
import { sayWord } from "../../lib/speech";

/** Round 🔊 button that reads a word aloud. */
export default function SpeakButton({ text, color }: { text: string; color: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Hear the word"
      style={[styles.button, { borderColor: color }]}
      onPress={() => sayWord(text)}
    >
      <Text style={styles.icon}>🔊</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 22,
  },
});
