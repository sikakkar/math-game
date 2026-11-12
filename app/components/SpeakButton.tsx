import { Pressable, Text, StyleSheet } from "react-native";
import { speakWord } from "../../lib/speech";

type Props = {
  word: string;
  color: string;
  size?: "small" | "large";
};

/** A speaker button that reads the word aloud. */
export default function SpeakButton({ word, color, size = "small" }: Props) {
  const large = size === "large";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Hear the word"
      style={[
        styles.button,
        large ? styles.large : styles.small,
        { backgroundColor: color },
      ]}
      onPress={() => speakWord(word)}
    >
      <Text style={large ? styles.iconLarge : styles.iconSmall}>🔊</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  small: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  large: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 24,
  },
  iconSmall: {
    fontSize: 26,
  },
  iconLarge: {
    fontSize: 52,
  },
});
