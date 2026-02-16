import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl ?? "";
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  name: string;
  track: "addition_subtraction" | "multiplication";
  created_at: string;
};

export type Progress = {
  id: string;
  profile_id: string;
  current_level: number;
  streak: number;
  total_completed: number;
  missed_problems: { question: string; answer: number }[];
  updated_at: string;
};
