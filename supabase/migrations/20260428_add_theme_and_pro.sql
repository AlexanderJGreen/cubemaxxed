-- Add theme preference and Pro flag to user profiles

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS theme  text    NOT NULL DEFAULT 'retro-dark',
  ADD COLUMN IF NOT EXISTS is_pro boolean NOT NULL DEFAULT false;

-- Constrain theme to valid values
ALTER TABLE profiles
  ADD CONSTRAINT profiles_theme_check
  CHECK (theme IN ('retro-dark', 'midnight', 'paper-light', 'vaporwave', 'gan'));
