'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// All mood routes require authentication
router.use(requireAuth);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseEntry(row) {
  if (!row) return null;
  return {
    ...row,
    emotions: JSON.parse(row.emotions || '[]'),
  };
}

// ---------------------------------------------------------------------------
// POST /api/mood  – create a mood entry
// ---------------------------------------------------------------------------
router.post('/', (req, res) => {
  try {
    const { score, emotions = [], note } = req.body;

    if (score === undefined || score === null) {
      return res.status(400).json({ error: 'score is required.' });
    }

    const numScore = Number(score);
    if (!Number.isInteger(numScore) || numScore < 1 || numScore > 10) {
      return res.status(400).json({ error: 'score must be an integer between 1 and 10.' });
    }

    if (!Array.isArray(emotions)) {
      return res.status(400).json({ error: 'emotions must be an array of strings.' });
    }

    const db = getDb();
    const id = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO mood_entries (id, user_id, score, emotions, note, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, req.user.id, numScore, JSON.stringify(emotions), note || null, now);

    const entry = db.prepare('SELECT * FROM mood_entries WHERE id = ?').get(id);
    return res.status(201).json(parseEntry(entry));
  } catch (err) {
    console.error('[mood/create]', err);
    return res.status(500).json({ error: 'Failed to save mood entry.' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/mood  – list mood entries with optional date range
// ---------------------------------------------------------------------------
router.get('/', (req, res) => {
  try {
    const { from, to, limit = 30, offset = 0 } = req.query;
    const db = getDb();

    let query = 'SELECT * FROM mood_entries WHERE user_id = ?';
    const params = [req.user.id];

    if (from) {
      query += ' AND created_at >= ?';
      params.push(from);
    }
    if (to) {
      query += ' AND created_at <= ?';
      params.push(to);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const rows = db.prepare(query).all(...params);
    return res.json(rows.map(parseEntry));
  } catch (err) {
    console.error('[mood/list]', err);
    return res.status(500).json({ error: 'Failed to retrieve mood entries.' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/mood/analytics  – aggregated stats
// ---------------------------------------------------------------------------
router.get('/analytics', (req, res) => {
  try {
    const { from, to } = req.query;
    const db = getDb();

    let whereClause = 'WHERE user_id = ?';
    const params = [req.user.id];

    if (from) { whereClause += ' AND created_at >= ?'; params.push(from); }
    if (to)   { whereClause += ' AND created_at <= ?'; params.push(to);   }

    // Average and count
    const stats = db.prepare(`
      SELECT
        COUNT(*) as total_entries,
        ROUND(AVG(score), 2) as average_score,
        MIN(score) as min_score,
        MAX(score) as max_score
      FROM mood_entries ${whereClause}
    `).get(...params);

    // Daily trend – last 30 days (or the filtered range)
    const trend = db.prepare(`
      SELECT
        DATE(created_at) as date,
        ROUND(AVG(score), 2) as average_score,
        COUNT(*) as entry_count
      FROM mood_entries ${whereClause}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `).all(...params);

    // Emotion frequency
    const emotionRows = db.prepare(`
      SELECT emotions FROM mood_entries ${whereClause}
    `).all(...params);

    const emotionFrequency = {};
    for (const row of emotionRows) {
      const emoList = JSON.parse(row.emotions || '[]');
      for (const emo of emoList) {
        emotionFrequency[emo] = (emotionFrequency[emo] || 0) + 1;
      }
    }

    const topEmotions = Object.entries(emotionFrequency)
      .sort(([, a], [, b]) => b - a)
      .map(([emotion, count]) => ({ emotion, count }));

    return res.json({ stats, trend, topEmotions });
  } catch (err) {
    console.error('[mood/analytics]', err);
    return res.status(500).json({ error: 'Failed to compute analytics.' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/mood/:id  – single entry
// ---------------------------------------------------------------------------
router.get('/:id', (req, res) => {
  try {
    const db = getDb();
    const entry = db
      .prepare('SELECT * FROM mood_entries WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);

    if (!entry) {
      return res.status(404).json({ error: 'Mood entry not found.' });
    }
    return res.json(parseEntry(entry));
  } catch (err) {
    console.error('[mood/get]', err);
    return res.status(500).json({ error: 'Failed to retrieve mood entry.' });
  }
});

// ---------------------------------------------------------------------------
// PUT /api/mood/:id  – update entry
// ---------------------------------------------------------------------------
router.put('/:id', (req, res) => {
  try {
    const db = getDb();
    const existing = db
      .prepare('SELECT * FROM mood_entries WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);

    if (!existing) {
      return res.status(404).json({ error: 'Mood entry not found.' });
    }

    const { score, emotions, note } = req.body;

    const newScore = score !== undefined ? Number(score) : existing.score;
    if (!Number.isInteger(newScore) || newScore < 1 || newScore > 10) {
      return res.status(400).json({ error: 'score must be an integer between 1 and 10.' });
    }

    const newEmotions = emotions !== undefined ? emotions : JSON.parse(existing.emotions);
    if (!Array.isArray(newEmotions)) {
      return res.status(400).json({ error: 'emotions must be an array.' });
    }

    const newNote = note !== undefined ? note : existing.note;

    db.prepare(`
      UPDATE mood_entries SET score = ?, emotions = ?, note = ? WHERE id = ?
    `).run(newScore, JSON.stringify(newEmotions), newNote, req.params.id);

    const updated = db.prepare('SELECT * FROM mood_entries WHERE id = ?').get(req.params.id);
    return res.json(parseEntry(updated));
  } catch (err) {
    console.error('[mood/update]', err);
    return res.status(500).json({ error: 'Failed to update mood entry.' });
  }
});

// ---------------------------------------------------------------------------
// DELETE /api/mood/:id
// ---------------------------------------------------------------------------
router.delete('/:id', (req, res) => {
  try {
    const db = getDb();
    const result = db
      .prepare('DELETE FROM mood_entries WHERE id = ? AND user_id = ?')
      .run(req.params.id, req.user.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Mood entry not found.' });
    }
    return res.status(204).send();
  } catch (err) {
    console.error('[mood/delete]', err);
    return res.status(500).json({ error: 'Failed to delete mood entry.' });
  }
});

module.exports = router;
