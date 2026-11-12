import * as Speech from "expo-speech";

/** Read a prompt aloud for pre-readers. Never throws: audio is a helper, not a requirement. */
export function say(text: string) {
  if (!text) return;
  try {
    Speech.stop();
    Speech.speak(text, { language: "en-US", rate: 0.85, pitch: 1.1 });
  } catch {
    // No speech engine available (e.g. headless browser): the screen still works.
  }
}

export function stopSpeaking() {
  try {
    Speech.stop();
  } catch {
    // ignore
  }
}
