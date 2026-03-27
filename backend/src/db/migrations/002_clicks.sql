CREATE TABLE IF NOT EXISTS clicks(
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(10) NOT NULL,
    clicked_at TIMESTAMP DEFAULT NOW(),
    ip_address VARCHAR(255) 
);

CREATE INDEX IF NOT EXISTS idx_clicks_clicket_at ON clicks(clicked_at);