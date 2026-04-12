-- Cycle App — Supabase Database Schema
-- Run this SQL in your Supabase SQL editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  onboarding_completed BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own row
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Emotional snapshots
CREATE TABLE emotional_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  home_stress INT CHECK (home_stress BETWEEN 1 AND 5),
  loneliness INT CHECK (loneliness BETWEEN 1 AND 5),
  energy INT CHECK (energy BETWEEN 1 AND 5),
  general_stress INT CHECK (general_stress BETWEEN 1 AND 5),
  context VARCHAR(20) CHECK (context IN ('onboarding', 'monthly', 'reversion'))
);

ALTER TABLE emotional_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own snapshots" ON emotional_snapshots
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own snapshots" ON emotional_snapshots
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Cycles
CREATE TABLE cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  why_now TEXT,
  success_vision TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'graduated', 'closed')),
  ended_at TIMESTAMPTZ,
  closing_context_tags TEXT[],
  closing_note TEXT,
  graduating_note TEXT
);

ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cycles" ON cycles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cycles" ON cycles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cycles" ON cycles
  FOR UPDATE USING (auth.uid() = user_id);

-- Check-ins
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  did_the_thing VARCHAR(20) CHECK (did_the_thing IN ('yes', 'no', 'partially')),
  general_feeling INT CHECK (general_feeling BETWEEN 1 AND 5),
  note TEXT
);

ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own checkins" ON checkins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checkins" ON checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reversion events
CREATE TABLE reversion_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  declared_by VARCHAR(20) CHECK (declared_by IN ('user', 'app_nudge')),
  unraveling VARCHAR(30) CHECK (unraveling IN ('gradual', 'specific_moment')),
  feeling VARCHAR(20) CHECK (feeling IN ('relief', 'shame', 'numbness', 'unknown', 'other')),
  context_tags TEXT[],
  free_text TEXT,
  outcome VARCHAR(20) CHECK (outcome IN ('resumed', 'paused', 'graduated', 'closed'))
);

ALTER TABLE reversion_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reversion events" ON reversion_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reversion events" ON reversion_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reflections
CREATE TABLE reflections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  content TEXT NOT NULL
);

ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reflections" ON reflections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reflections" ON reflections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for common queries
CREATE INDEX idx_cycles_user_id ON cycles(user_id);
CREATE INDEX idx_cycles_status ON cycles(status);
CREATE INDEX idx_checkins_cycle_id ON checkins(cycle_id);
CREATE INDEX idx_checkins_user_id ON checkins(user_id);
CREATE INDEX idx_checkins_created_at ON checkins(created_at DESC);
CREATE INDEX idx_reversion_events_cycle_id ON reversion_events(cycle_id);
CREATE INDEX idx_reflections_user_id ON reflections(user_id);
CREATE INDEX idx_reflections_created_at ON reflections(created_at DESC);

-- Function to auto-create user row on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user row
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
