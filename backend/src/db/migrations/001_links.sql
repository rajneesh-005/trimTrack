CREATE TABLE IF NOT EXISTS links (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(10) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    title VARCHAR(25),
    create_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_links_short_code on links(short_code);