import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { Platform } from "react-native";

const configuredUrl: string = Constants.expoConfig?.extra?.supabaseUrl ?? "";
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey ?? "";

/**
 * A local Supabase (127.0.0.1 / localhost) is only reachable from the machine running it. On web,
 * route it through the dev server's /__supabase proxy (metro.config.js) instead, so the app also
 * works when opened from a phone or another computer.
 */
function resolveSupabaseUrl(url: string): string {
  if (Platform.OS !== "web" || typeof window === "undefined" || !url) return url;
  try {
    const { hostname } = new URL(url);
    if (hostname === "127.0.0.1" || hostname === "localhost") {
      return `${window.location.origin}/__supabase`;
    }
  } catch {
    // fall through to the configured URL
  }
  return url;
}

export const supabase = createClient(resolveSupabaseUrl(configuredUrl), supabaseAnonKey);

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
