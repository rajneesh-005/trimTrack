ALTER TABLE links ADD COLUMN user_id INTEGER REFERENCES users(id);
CREATE INDEX IF NOT EXISTS idx_links_users_id ON links(user_id);