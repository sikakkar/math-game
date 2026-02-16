import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl ?? "";
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey ?? "";

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
