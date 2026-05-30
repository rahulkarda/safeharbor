'use strict';

const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.join(__dirname, '..', 'safeharbor.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeSchema();
  }
  return db;
}

function initializeSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id          TEXT PRIMARY KEY,
      email       TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      last_login  TEXT
    );

    CREATE TABLE IF NOT EXISTS mood_entries (
      id          TEXT PRIMARY KEY,
      user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      score       INTEGER NOT NULL CHECK(score BETWEEN 1 AND 10),
      emotions    TEXT NOT NULL DEFAULT '[]',
      note        TEXT,
      created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    CREATE INDEX IF NOT EXISTS idx_mood_user_created ON mood_entries(user_id, created_at);

    CREATE TABLE IF NOT EXISTS journal_entries (
      id          TEXT PRIMARY KEY,
      user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title       TEXT NOT NULL,
      content     TEXT NOT NULL,
      mood_score  INTEGER CHECK(mood_score BETWEEN 1 AND 10),
      tags        TEXT NOT NULL DEFAULT '[]',
      created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    CREATE INDEX IF NOT EXISTS idx_journal_user_created ON journal_entries(user_id, created_at);

    CREATE TABLE IF NOT EXISTS breathing_sessions (
      id               TEXT PRIMARY KEY,
      user_id          TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      technique        TEXT NOT NULL,
      duration_seconds INTEGER NOT NULL,
      completed_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    CREATE INDEX IF NOT EXISTS idx_breathing_user ON breathing_sessions(user_id, completed_at);

    CREATE TABLE IF NOT EXISTS crisis_contacts (
      id              TEXT PRIMARY KEY,
      name            TEXT NOT NULL,
      phone           TEXT NOT NULL,
      description     TEXT,
      available_hours TEXT,
      country         TEXT NOT NULL DEFAULT 'US',
      categories      TEXT NOT NULL DEFAULT '[]'
    );
  `);

  seedCrisisContacts();
}

function seedCrisisContacts() {
  const existing = db.prepare('SELECT COUNT(*) as cnt FROM crisis_contacts').get();
  if (existing.cnt > 0) return;

  const contacts = [
    {
      id: uuidv4(),
      name: 'National Suicide Prevention Lifeline',
      phone: '988',
      description:
        'Free, confidential crisis support for people in suicidal crisis or emotional distress. ' +
        'Connects callers to trained crisis counselors.',
      available_hours: '24/7',
      country: 'US',
      categories: JSON.stringify(['suicide', 'crisis', 'mental-health']),
    },
    {
      id: uuidv4(),
      name: 'Crisis Text Line',
      phone: 'Text HOME to 741741',
      description:
        'Free crisis counseling via text message. Text HOME to 741741 to connect with a ' +
        'trained Crisis Counselor.',
      available_hours: '24/7',
      country: 'US',
      categories: JSON.stringify(['crisis', 'text', 'mental-health']),
    },
    {
      id: uuidv4(),
      name: 'SAMHSA National Helpline',
      phone: '1-800-662-4357',
      description:
        'Free, confidential treatment referral and information service for individuals and families ' +
        'facing mental and/or substance use disorders.',
      available_hours: '24/7',
      country: 'US',
      categories: JSON.stringify(['substance-use', 'mental-health', 'referral']),
    },
    {
      id: uuidv4(),
      name: 'Veterans Crisis Line',
      phone: '988 (press 1)',
      description:
        'Connects veterans and their families with qualified VA responders through a ' +
        'confidential toll-free hotline, online chat, or text.',
      available_hours: '24/7',
      country: 'US',
      categories: JSON.stringify(['veterans', 'crisis', 'suicide', 'mental-health']),
    },
    {
      id: uuidv4(),
      name: 'The Trevor Project',
      phone: '1-866-488-7386',
      description:
        'Crisis intervention and suicide prevention for LGBTQ+ young people under 25. ' +
        'Also offers TrevorText and TrevorChat online.',
      available_hours: '24/7',
      country: 'US',
      categories: JSON.stringify(['lgbtq', 'youth', 'crisis', 'suicide']),
    },
    {
      id: uuidv4(),
      name: 'NAMI Helpline',
      phone: '1-800-950-6264',
      description:
        'Free peer-support service for anyone who has questions or concerns about a mental health ' +
        'condition for themselves or a family member.',
      available_hours: 'Mon–Fri 10am–10pm ET',
      country: 'US',
      categories: JSON.stringify(['mental-health', 'peer-support', 'family']),
    },
    {
      id: uuidv4(),
      name: 'Childhelp National Child Abuse Hotline',
      phone: '1-800-422-4453',
      description:
        'Crisis intervention, information, and referral to emergency, social service, and support ' +
        'resources for child abuse situations.',
      available_hours: '24/7',
      country: 'US',
      categories: JSON.stringify(['child-abuse', 'crisis', 'children']),
    },
  ];

  const insert = db.prepare(`
    INSERT INTO crisis_contacts (id, name, phone, description, available_hours, country, categories)
    VALUES (@id, @name, @phone, @description, @available_hours, @country, @categories)
  `);

  const insertMany = db.transaction((rows) => {
    for (const row of rows) insert.run(row);
  });

  insertMany(contacts);
}

module.exports = { getDb };
