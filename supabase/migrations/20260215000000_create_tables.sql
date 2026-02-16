-- Create profiles table
CREATE TABLE profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  track text NOT NULL CHECK (track IN ('addition_subtraction', 'multiplication')),
  created_at timestamptz DEFAULT now()
);

-- Create progress table
CREATE TABLE progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  current_level int DEFAULT 1,
  streak int DEFAULT 0,
  total_completed int DEFAULT 0,
  missed_problems jsonb DEFAULT '[]',
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for now (tighten later if needed)
CREATE POLICY "Allow all access to profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to progress" ON progress FOR ALL USING (true) WITH CHECK (true);
