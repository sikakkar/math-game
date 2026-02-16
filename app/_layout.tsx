import { Stack } from "expo-router";
import { GameProvider } from "../lib/context";

export default function RootLayout() {
  return (
    <GameProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </GameProvider>
  );
}
