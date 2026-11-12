import * as Speech from "expo-speech";

/** Say a word aloud, slowly enough for early readers. Silently does nothing if speech is unavailable. */
export function sayWord(text: string) {
  try {
    Speech.stop();
    Speech.speak(text, { language: "en-US", rate: 0.8 });
  } catch {
    // No speech engine (e.g. some browsers); the picture still carries the meaning.
  }
}
