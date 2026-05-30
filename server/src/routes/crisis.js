'use strict';

const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

// Crisis contacts are public — no auth required

// ---------------------------------------------------------------------------
// GET /api/crisis  – return all crisis contacts
// ---------------------------------------------------------------------------
router.get('/', (req, res) => {
  try {
    const { country } = req.query;
    const db = getDb();

    let query = 'SELECT * FROM crisis_contacts';
    const params = [];

    if (country) {
      query += ' WHERE country = ?';
      params.push(country.toUpperCase());
    }

    query += ' ORDER BY name ASC';

    const rows = db.prepare(query).all(...params);
    const contacts = rows.map((row) => ({
      ...row,
      categories: JSON.parse(row.categories || '[]'),
    }));

    return res.json(contacts);
  } catch (err) {
    console.error('[crisis/list]', err);
    return res.status(500).json({ error: 'Failed to retrieve crisis contacts.' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/crisis/categories  – list distinct categories
// ---------------------------------------------------------------------------
router.get('/categories', (req, res) => {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT categories FROM crisis_contacts').all();

    const categorySet = new Set();
    for (const row of rows) {
      const cats = JSON.parse(row.categories || '[]');
      for (const c of cats) categorySet.add(c);
    }

    return res.json([...categorySet].sort());
  } catch (err) {
    console.error('[crisis/categories]', err);
    return res.status(500).json({ error: 'Failed to retrieve categories.' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/crisis/by-category/:category  – contacts for a specific category
// ---------------------------------------------------------------------------
router.get('/by-category/:category', (req, res) => {
  try {
    const { category } = req.params;
    const db = getDb();

    // JSON stored as text; LIKE gives us a fast simple filter
    const rows = db
      .prepare('SELECT * FROM crisis_contacts WHERE categories LIKE ? ORDER BY name ASC')
      .all(`%"${category}"%`);

    const contacts = rows.map((row) => ({
      ...row,
      categories: JSON.parse(row.categories || '[]'),
    }));

    return res.json(contacts);
  } catch (err) {
    console.error('[crisis/by-category]', err);
    return res.status(500).json({ error: 'Failed to retrieve crisis contacts.' });
  }
});

module.exports = router;
