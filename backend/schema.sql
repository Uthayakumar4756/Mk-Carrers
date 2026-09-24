-- ===========================================================
-- MK Career Guidance — MySQL schema (optional real backend)
-- Run this once on your MySQL server / hosting provider:
--   mysql -u youruser -p < schema.sql
-- ===========================================================

CREATE DATABASE IF NOT EXISTS mk_career CHARACTER SET utf8mb4;
USE mk_career;

-- Visitors who registered their email in the chatbot
CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL UNIQUE,
  registered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  visits INT NOT NULL DEFAULT 1
);

-- Every chat message tied to a lead
CREATE TABLE IF NOT EXISTS chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  sender ENUM('user','bot') NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

-- Contact / "book a session" form submissions
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(190) NOT NULL,
  topic VARCHAR(120),
  message TEXT,
  submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Admin accounts (passwords stored as bcrypt hashes, never plain text)
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(60) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- A row per admin login attempt — "who logged in, and when"
CREATE TABLE IF NOT EXISTS admin_logins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(60) NOT NULL,
  success TINYINT(1) NOT NULL,
  ip_address VARCHAR(64),
  logged_in_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
