-- Add new features database schema
-- Run: psql -U postgres -d ccfms -f scripts/add-new-features.sql

-- Add profile picture to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture TEXT;

-- Create user_notes table for notepad functionality
CREATE TABLE IF NOT EXISTS user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notes TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for user_notes
CREATE INDEX IF NOT EXISTS idx_user_notes_user ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_created ON user_notes(created_at DESC);

-- Update existing users to have default profile picture
UPDATE users SET profile_picture = NULL WHERE profile_picture IS NULL;
