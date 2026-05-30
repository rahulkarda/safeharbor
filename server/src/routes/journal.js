'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseEntry(row) {
  if (!row) return null;
  return {
    ...row,
    tags: JSON.parse(row.tags || '[]'),
  };
}

// ---------------------------------------------------------------------------
// POST /api/journal  – create entry
// ---------------------------------------------------------------------------
router.post('/', (req, res) => {
  try {
    const { title, content, mood_score, tags = [] } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'title is required.' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'content is required.' });
    }
    if (!Array.isArray(tags)) {
      return res.status(400).json({ error: 'tags must be an array.' });
    }

    if (mood_score !== undefined && mood_score !== null) {
      const ms = Number(mood_score);
      if (!Number.isInteger(ms) || ms < 1 || ms > 10) {
        return res.status(400).json({ error: 'mood_score must be an integer between 1 and 10.' });
      }
    }

    const db = getDb();
    const id = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO journal_entries (id, user_id, title, content, mood_score, tags, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      req.user.id,
      title.trim(),
      content.trim(),
      mood_score !== undefined && mood_score !== null ? Number(mood_score) : null,
      JSON.stringify(tags),
      now,
      now
    );

    const entry = db.prepare('SELECT * FROM journal_entries WHERE id = ?').get(id);
    return res.status(201).json(parseEntry(entry));
  } catch (err) {
    console.error('[journal/create]', err);
    return res.status(500).json({ error: 'Failed to save journal entry.' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/journal  – list with optional text/tag search
// ---------------------------------------------------------------------------
router.get('/', (req, res) => {
  try {
    const { search, tag, from, to, limit = 20, offset = 0 } = req.query;
    const db = getDb();

    let query = 'SELECT * FROM journal_entries WHERE user_id = ?';
    const params = [req.user.id];

    if (search) {
      query += ' AND (title LIKE ? OR content LIKE ?)';
      const pattern = `%${search}%`;
      params.push(pattern, pattern);
    }

    if (tag) {
      // Tags are stored as a JSON array string; simple LIKE check is sufficient for most use-cases
      query += ' AND tags LIKE ?';
      params.push(`%"${tag}"%`);
    }

    if (from) { query += ' AND created_at >= ?'; params.push(from); }
    if (to)   { query += ' AND created_at <= ?'; params.push(to);   }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const rows = db.prepare(query).all(...params);
    return res.json(rows.map(parseEntry));
  } catch (err) {
    console.error('[journal/list]', err);
    return res.status(500).json({ error: 'Failed to retrieve journal entries.' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/journal/:id
// ---------------------------------------------------------------------------
router.get('/:id', (req, res) => {
  try {
    const db = getDb();
    const entry = db
      .prepare('SELECT * FROM journal_entries WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);

    if (!entry) {
      return res.status(404).json({ error: 'Journal entry not found.' });
    }
    return res.json(parseEntry(entry));
  } catch (err) {
    console.error('[journal/get]', err);
    return res.status(500).json({ error: 'Failed to retrieve journal entry.' });
  }
});

// ---------------------------------------------------------------------------
// PUT /api/journal/:id  – update
// ---------------------------------------------------------------------------
router.put('/:id', (req, res) => {
  try {
    const db = getDb();
    const existing = db
      .prepare('SELECT * FROM journal_entries WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);

    if (!existing) {
      return res.status(404).json({ error: 'Journal entry not found.' });
    }

    const { title, content, mood_score, tags } = req.body;

    const newTitle   = title   !== undefined ? title.trim()   : existing.title;
    const newContent = content !== undefined ? content.trim() : existing.content;
    const newTags    = tags    !== undefined ? tags            : JSON.parse(existing.tags);

    if (!newTitle) return res.status(400).json({ error: 'title cannot be empty.' });
    if (!newContent) return res.status(400).json({ error: 'content cannot be empty.' });
    if (!Array.isArray(newTags)) return res.status(400).json({ error: 'tags must be an array.' });

    let newMoodScore = existing.mood_score;
    if (mood_score !== undefined) {
      if (mood_score === null) {
        newMoodScore = null;
      } else {
        const ms = Number(mood_score);
        if (!Number.isInteger(ms) || ms < 1 || ms > 10) {
          return res.status(400).json({ error: 'mood_score must be an integer between 1 and 10.' });
        }
        newMoodScore = ms;
      }
    }

    const updatedAt = new Date().toISOString();

    db.prepare(`
      UPDATE journal_entries
      SET title = ?, content = ?, mood_score = ?, tags = ?, updated_at = ?
      WHERE id = ?
    `).run(newTitle, newContent, newMoodScore, JSON.stringify(newTags), updatedAt, req.params.id);

    const updated = db.prepare('SELECT * FROM journal_entries WHERE id = ?').get(req.params.id);
    return res.json(parseEntry(updated));
  } catch (err) {
    console.error('[journal/update]', err);
    return res.status(500).json({ error: 'Failed to update journal entry.' });
  }
});

// ---------------------------------------------------------------------------
// DELETE /api/journal/:id
// ---------------------------------------------------------------------------
router.delete('/:id', (req, res) => {
  try {
    const db = getDb();
    const result = db
      .prepare('DELETE FROM journal_entries WHERE id = ? AND user_id = ?')
      .run(req.params.id, req.user.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Journal entry not found.' });
    }
    return res.status(204).send();
  } catch (err) {
    console.error('[journal/delete]', err);
    return res.status(500).json({ error: 'Failed to delete journal entry.' });
  }
});

module.exports = router;
