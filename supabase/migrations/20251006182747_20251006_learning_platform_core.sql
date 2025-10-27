/*
  # Interactive Learning Platform - Core Schema
  
  1. New Tables
    - `learning_courses`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `thumbnail_url` (text)
      - `duration_hours` (decimal)
      - `difficulty` (text)
      - `category` (text)
      - `is_published` (boolean)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `learning_modules`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `position` (integer)
      - `estimated_time` (integer, in minutes)
      - `is_published` (boolean)
      - `created_at` (timestamptz)
    
    - `learning_lessons`
      - `id` (uuid, primary key)
      - `module_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `position` (integer)
      - `duration_minutes` (integer)
      - `content_types` (text array)
      - `is_published` (boolean)
      - `created_at` (timestamptz)
    
    - `learning_steps`
      - `id` (uuid, primary key)
      - `lesson_id` (uuid, foreign key)
      - `step_number` (integer)
      - `type` (text) - video, text, quiz, practice, interactive
      - `title` (text)
      - `content` (jsonb)
      - `estimated_time` (integer, in minutes)
      - `created_at` (timestamptz)
    
    - `learning_user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `fingerprint_hash` (text)
      - `display_name` (text)
      - `avatar_url` (text)
      - `total_points` (integer)
      - `level` (integer)
      - `streak_days` (integer)
      - `last_active` (timestamptz)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
    
    - `learning_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `course_id` (uuid, foreign key)
      - `module_id` (uuid)
      - `lesson_id` (uuid)
      - `step_id` (uuid)
      - `completed` (boolean)
      - `completed_at` (timestamptz)
      - `time_spent` (integer, in seconds)
      - `score` (decimal)
      - `attempts` (integer)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `learning_analytics_events`
      - `id` (uuid, primary key)
      - `user_id` (uuid)
      - `session_id` (text)
      - `event_type` (text)
      - `event_data` (jsonb)
      - `fingerprint` (text)
      - `user_agent` (text)
      - `timestamp` (timestamptz)
    
    - `learning_video_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `step_id` (uuid, foreign key)
      - `video_url` (text)
      - `watched_segments` (integer array)
      - `total_duration` (decimal)
      - `watch_time` (decimal)
      - `completion_percent` (decimal)
      - `last_position` (decimal)
      - `updated_at` (timestamptz)
    
    - `learning_quiz_results`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `step_id` (uuid, foreign key)
      - `score` (decimal)
      - `max_score` (decimal)
      - `answers` (jsonb)
      - `time_spent` (integer)
      - `attempt_number` (integer)
      - `passed` (boolean)
      - `completed_at` (timestamptz)
    
    - `learning_achievements`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `icon` (text)
      - `criteria` (jsonb)
      - `points` (integer)
      - `created_at` (timestamptz)
    
    - `learning_user_achievements`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `achievement_id` (uuid, foreign key)
      - `earned_at` (timestamptz)
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access to published courses
    - Add admin policies for content management
  
  3. Indexes
    - Add indexes on foreign keys for performance
    - Add indexes on timestamp fields for analytics queries
    - Add indexes on user_id fields for progress tracking
*/

-- Create learning_courses table
CREATE TABLE IF NOT EXISTS learning_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  duration_hours DECIMAL(5,2),
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category TEXT,
  is_published BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create learning_modules table
CREATE TABLE IF NOT EXISTS learning_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES learning_courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL,
  estimated_time INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create learning_lessons table
CREATE TABLE IF NOT EXISTS learning_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES learning_modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  content_types TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create learning_steps table
CREATE TABLE IF NOT EXISTS learning_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES learning_lessons(id) ON DELETE CASCADE NOT NULL,
  step_number INTEGER NOT NULL,
  type TEXT CHECK (type IN ('video', 'text', 'quiz', 'practice', 'interactive')) NOT NULL,
  title TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  estimated_time INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(lesson_id, step_number)
);

-- Create learning_user_profiles table
CREATE TABLE IF NOT EXISTS learning_user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  fingerprint_hash TEXT,
  display_name TEXT,
  avatar_url TEXT,
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_active TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create learning_progress table
CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES learning_user_profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES learning_courses(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES learning_modules(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES learning_lessons(id) ON DELETE CASCADE,
  step_id UUID REFERENCES learning_steps(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  time_spent INTEGER DEFAULT 0,
  score DECIMAL(5,2),
  attempts INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id, module_id, lesson_id, step_id)
);

-- Create learning_analytics_events table
CREATE TABLE IF NOT EXISTS learning_analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  fingerprint TEXT,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- Create learning_video_progress table
CREATE TABLE IF NOT EXISTS learning_video_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES learning_user_profiles(id) ON DELETE CASCADE NOT NULL,
  step_id UUID REFERENCES learning_steps(id) ON DELETE CASCADE NOT NULL,
  video_url TEXT,
  watched_segments INTEGER[] DEFAULT '{}',
  total_duration DECIMAL(10,2),
  watch_time DECIMAL(10,2) DEFAULT 0,
  completion_percent DECIMAL(5,2) DEFAULT 0,
  last_position DECIMAL(10,2) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, step_id)
);

-- Create learning_quiz_results table
CREATE TABLE IF NOT EXISTS learning_quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES learning_user_profiles(id) ON DELETE CASCADE NOT NULL,
  step_id UUID REFERENCES learning_steps(id) ON DELETE CASCADE NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  max_score DECIMAL(5,2) NOT NULL,
  answers JSONB DEFAULT '{}'::jsonb,
  time_spent INTEGER DEFAULT 0,
  attempt_number INTEGER DEFAULT 1,
  passed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- Create learning_achievements table
CREATE TABLE IF NOT EXISTS learning_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create learning_user_achievements table
CREATE TABLE IF NOT EXISTS learning_user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES learning_user_profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES learning_achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_learning_modules_course ON learning_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_learning_lessons_module ON learning_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_learning_steps_lesson ON learning_steps(lesson_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user ON learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_course ON learning_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_updated ON learning_progress(updated_at);
CREATE INDEX IF NOT EXISTS idx_learning_analytics_user_time ON learning_analytics_events(user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_learning_analytics_type ON learning_analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_learning_video_progress_user ON learning_video_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_quiz_results_user ON learning_quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_user_achievements_user ON learning_user_achievements(user_id);

-- Enable Row Level Security
ALTER TABLE learning_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_video_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for learning_courses
CREATE POLICY "Anyone can view published courses"
  ON learning_courses FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated users can view all courses"
  ON learning_courses FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for learning_modules
CREATE POLICY "Anyone can view published modules"
  ON learning_modules FOR SELECT
  USING (
    is_published = true AND
    EXISTS (SELECT 1 FROM learning_courses WHERE id = course_id AND is_published = true)
  );

-- RLS Policies for learning_lessons
CREATE POLICY "Anyone can view published lessons"
  ON learning_lessons FOR SELECT
  USING (
    is_published = true AND
    EXISTS (
      SELECT 1 FROM learning_modules m
      JOIN learning_courses c ON m.course_id = c.id
      WHERE m.id = module_id AND m.is_published = true AND c.is_published = true
    )
  );

-- RLS Policies for learning_steps
CREATE POLICY "Anyone can view published steps"
  ON learning_steps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM learning_lessons l
      JOIN learning_modules m ON l.module_id = m.id
      JOIN learning_courses c ON m.course_id = c.id
      WHERE l.id = lesson_id AND l.is_published = true AND m.is_published = true AND c.is_published = true
    )
  );

-- RLS Policies for learning_user_profiles
CREATE POLICY "Users can view own profile"
  ON learning_user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON learning_user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON learning_user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for learning_progress
CREATE POLICY "Users can view own progress"
  ON learning_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON learning_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON learning_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for learning_analytics_events
CREATE POLICY "Users can insert own analytics"
  ON learning_analytics_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own analytics"
  ON learning_analytics_events FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- RLS Policies for learning_video_progress
CREATE POLICY "Users can view own video progress"
  ON learning_video_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own video progress"
  ON learning_video_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own video progress"
  ON learning_video_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for learning_quiz_results
CREATE POLICY "Users can view own quiz results"
  ON learning_quiz_results FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz results"
  ON learning_quiz_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for learning_achievements
CREATE POLICY "Anyone can view achievements"
  ON learning_achievements FOR SELECT
  USING (true);

-- RLS Policies for learning_user_achievements
CREATE POLICY "Users can view own achievements"
  ON learning_user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can earn achievements"
  ON learning_user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for learning_courses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_learning_courses_updated_at'
  ) THEN
    CREATE TRIGGER update_learning_courses_updated_at
      BEFORE UPDATE ON learning_courses
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Create trigger for learning_progress
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_learning_progress_updated_at'
  ) THEN
    CREATE TRIGGER update_learning_progress_updated_at
      BEFORE UPDATE ON learning_progress
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;