const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

// Database file will live in /server/data/habits.db
const dbFile = path.join(__dirname, "..", "data", "habits.db");

async function initDb() {
  const db = await open({
    filename: dbFile,
    driver: sqlite3.Database
  });

  // Enforce foreign keys in SQLite (important)
  await db.exec("PRAGMA foreign_keys = ON;");

  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS habit_completions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER NOT NULL,
      completed_on TEXT NOT NULL, -- YYYY-MM-DD
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
      UNIQUE (habit_id, completed_on)
    );
  `);

  return db;
}

module.exports = { initDb };
