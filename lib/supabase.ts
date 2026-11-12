import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import Constants from "expo-constants";

const configuredUrl: string = Constants.expoConfig?.extra?.supabaseUrl ?? "";
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey ?? "";

function isLoopback(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
  } catch {
    return false;
  }
}

/**
 * A local Supabase (http://127.0.0.1:54321) is only reachable from the machine
 * running it. When the web app is served by the Expo dev server, send requests
 * through its /supabase proxy (see metro.config.js) instead, so the app also
 * works when opened from a phone or over https.
 */
function resolveSupabaseUrl(): string {
  if (
    Platform.OS === "web" &&
    typeof window !== "undefined" &&
    isLoopback(configuredUrl)
  ) {
    return `${window.location.origin}/supabase`;
  }
  return configuredUrl;
}

const supabaseUrl = resolveSupabaseUrl();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  name: string;
  created_at: string;
};

export type SkillProgress = {
  id: string;
  profile_id: string;
  skill_id: string;
  mastery_level: number;
  best_score: number;
  attempts: number;
  updated_at: string;
};

export type ProfileStats = {
  id: string;
  profile_id: string;
  streak: number;
  total_completed: number;
  last_played_at: string;
};
