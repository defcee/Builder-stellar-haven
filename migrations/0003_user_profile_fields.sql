ALTER TABLE users
  ADD COLUMN phone         TEXT CHECK (phone IS NULL OR char_length(phone) BETWEEN 7 AND 20),
  ADD COLUMN avatar_url    TEXT,
  ADD COLUMN last_login_at TIMESTAMPTZ;
