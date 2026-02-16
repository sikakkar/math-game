-- Drop old progress table and track column
DROP TABLE IF EXISTS progress;
ALTER TABLE profiles DROP COLUMN IF EXISTS track;

-- Remove the old check constraint (if it exists from the track column)
-- ALTER TABLE profiles will handle this since the column is dropped

-- Create skill_progress table
CREATE TABLE skill_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  skill_id text NOT NULL,
  mastery_level int DEFAULT 0,
  best_score int DEFAULT 0,
  attempts int DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(profile_id, skill_id)
);

-- Create profile_stats table
CREATE TABLE profile_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  streak int DEFAULT 0,
  total_completed int DEFAULT 0,
  last_played_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE skill_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_stats ENABLE ROW LEVEL SECURITY;

-- Allow public access for now
CREATE POLICY "Allow all access to skill_progress" ON skill_progress FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to profile_stats" ON profile_stats FOR ALL USING (true) WITH CHECK (true);
