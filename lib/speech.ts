import * as Speech from "expo-speech";

/** Read a word aloud, slowly enough for an early reader to hear each sound. */
export function speakWord(word: string) {
  try {
    Speech.stop();
    Speech.speak(word, { language: "en-US", rate: 0.8 });
  } catch {
    // Speech is a helper; the game still works without it.
  }
}

export function stopSpeaking() {
  try {
    Speech.stop();
  } catch {
    // ignore
  }
}
