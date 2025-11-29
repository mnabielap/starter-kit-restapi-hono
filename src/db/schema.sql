-- Delete tables if they exist to ensure a clean schema.
DROP TABLE IF EXISTS tokens;
DROP TABLE IF EXISTS users;

-- Table to store user data
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('user', 'admin')) DEFAULT 'user',
    is_email_verified INTEGER NOT NULL DEFAULT 0, -- 0 for false, 1 for true
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table to store refresh token, reset password token, etc.
CREATE TABLE tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    expires TIMESTAMP NOT NULL,
    blacklisted INTEGER NOT NULL DEFAULT 0, -- 0 for false, 1 for true
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for faster searches
CREATE INDEX idx_tokens_user_id_type ON tokens(user_id, type);
CREATE UNIQUE INDEX idx_users_email ON users(email);