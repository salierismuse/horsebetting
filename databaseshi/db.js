const Database = require('better-sqlite3');
const db = new Database('my-database.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    balance INTEGER DEFAULT 10000,
    last_login TEXT
  );

  CREATE TABLE IF NOT EXISTS horses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quirks TEXT,
    speed FLOAT DEFAULT 10,
    name TEXT NOT NULL,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS races (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    condition TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT DEFAULT NULL,
    winner_horse_id INTEGER REFERENCES horses(id) DEFAULT NULL
  );

  CREATE TABLE IF NOT EXISTS bets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    horse_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    race_id REFERENCES races(id) NOT NULL
  );
`);

const existingHorses = db.prepare('SELECT COUNT(*) as count FROM horses').get();

if (existingHorses.count === 0) {
  const insertHorse = db.prepare('INSERT INTO horses (name, quirks, speed) VALUES (?, ?, ?)');

  insertHorse.run('Jangles', JSON.stringify({ start: 0.7, end: 1.2, luck: 2, rain: 1.0, sun: 1.0 }), 8);
  insertHorse.run('Echo', JSON.stringify({ start: 1.3, end: 1.0, luck: 0.7, rain: 1.5, sun: 0.8 }), 10);
  insertHorse.run('Blaze', JSON.stringify({ start: 2.0, end: 0.3, luck: 2.0, rain: 0.5, sun: 1.5 }), 12);

}

module.exports = db;