'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db');
const requireAuth = require('../middleware/auth');
const techniques = require('../techniques');

const router = express.Router();

router.use(requireAuth);

// ---------------------------------------------------------------------------
// GET /api/breathing/techniques  – list all available techniques
// ---------------------------------------------------------------------------
router.get('/techniques', (req, res) => {
  return res.json(techniques);
});

// ---------------------------------------------------------------------------
// POST /api/breathing/sessions  – log a completed session
// ---------------------------------------------------------------------------
router.post('/sessions', (req, res) => {
  try {
    const { technique, duration_seconds } = req.body;

    if (!technique || !technique.trim()) {
      return res.status(400).json({ error: 'technique is required.' });
    }

    const duration = Number(duration_seconds);
    if (!duration_seconds || isNaN(duration) || duration <= 0) {
      return res.status(400).json({ error: 'duration_seconds must be a positive number.' });
    }

    // Validate technique ID is one we know about (lenient — allow free-form too)
    const knownIds = techniques.map((t) => t.id);
    const knownNames = techniques.map((t) => t.name.toLowerCase());
    const isKnown =
      knownIds.includes(technique) ||
      knownNames.includes(technique.toLowerCase());

    // We allow custom technique names but warn in the response when unrecognised
    const db = getDb();
    const id = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO breathing_sessions (id, user_id, technique, duration_seconds, completed_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, req.user.id, technique.trim(), Math.round(duration), now);

    const session = db.prepare('SELECT * FROM breathing_sessions WHERE id = ?').get(id);
    return res.status(201).json({
      ...session,
      ...(isKnown ? {} : { warning: 'Technique not in the built-in list but was saved.' }),
    });
  } catch (err) {
    console.error('[breathing/create]', err);
    return res.status(500).json({ error: 'Failed to log breathing session.' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/breathing/sessions  – history with optional pagination
// ---------------------------------------------------------------------------
router.get('/sessions', (req, res) => {
  try {
    const { limit = 20, offset = 0, from, to } = req.query;
    const db = getDb();

    let query = 'SELECT * FROM breathing_sessions WHERE user_id = ?';
    const params = [req.user.id];

    if (from) { query += ' AND completed_at >= ?'; params.push(from); }
    if (to)   { query += ' AND completed_at <= ?'; params.push(to);   }

    query += ' ORDER BY completed_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const sessions = db.prepare(query).all(...params);

    // Aggregate stats
    const stats = db.prepare(`
      SELECT
        COUNT(*) as total_sessions,
        SUM(duration_seconds) as total_seconds,
        ROUND(AVG(duration_seconds), 0) as avg_duration_seconds
      FROM breathing_sessions
      WHERE user_id = ?
    `).get(req.user.id);

    return res.json({ sessions, stats });
  } catch (err) {
    console.error('[breathing/history]', err);
    return res.status(500).json({ error: 'Failed to retrieve breathing history.' });
  }
});

// ---------------------------------------------------------------------------
// DELETE /api/breathing/sessions/:id
// ---------------------------------------------------------------------------
router.delete('/sessions/:id', (req, res) => {
  try {
    const db = getDb();
    const result = db
      .prepare('DELETE FROM breathing_sessions WHERE id = ? AND user_id = ?')
      .run(req.params.id, req.user.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Breathing session not found.' });
    }
    return res.status(204).send();
  } catch (err) {
    console.error('[breathing/delete]', err);
    return res.status(500).json({ error: 'Failed to delete breathing session.' });
  }
});

module.exports = router;
