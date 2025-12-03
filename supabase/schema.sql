-- Supabase Database Schema for JunyFit

-- 1. Templates Table (운동 프로그램 템플릿)
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Exercises Table (운동 목록)
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_sets INTEGER NOT NULL,
  target_reps_min INTEGER NOT NULL,
  target_reps_max INTEGER NOT NULL,
  rest_seconds INTEGER NOT NULL,
  intention TEXT,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Workout Sessions Table (운동 세션 기록)
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Workout Sets Table (세트별 기록)
CREATE TABLE workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE SET NULL,
  set_number INTEGER NOT NULL,
  weight DECIMAL(5, 2),
  reps INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_exercises_template_id ON exercises(template_id);
CREATE INDEX idx_workout_sets_session_id ON workout_sets(session_id);
CREATE INDEX idx_workout_sessions_started_at ON workout_sessions(started_at DESC);

-- Row Level Security (RLS) - 나중에 사용자 인증 추가 시 활성화
-- ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
