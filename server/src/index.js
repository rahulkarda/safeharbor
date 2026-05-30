'use strict';

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Route modules
const authRoutes      = require('./routes/auth');
const moodRoutes      = require('./routes/mood');
const journalRoutes   = require('./routes/journal');
const breathingRoutes = require('./routes/breathing');
const crisisRoutes    = require('./routes/crisis');
const wellnessRoutes  = require('./routes/wellness');

// Initialise DB on startup (creates tables and seeds data)
require('./db').getDb();

// ---------------------------------------------------------------------------
// App setup
// ---------------------------------------------------------------------------
const app = express();

// Security headers
app.use(helmet());

// CORS – allow the React / React Native client origins
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000,http://localhost:19006')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, server-to-server)
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// ---------------------------------------------------------------------------
// Rate limiting
// ---------------------------------------------------------------------------

// Strict limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again in 15 minutes.' },
});

// General API limiter
const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down.' },
});

app.use('/api/', generalLimiter);
app.use('/api/auth', authLimiter);

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use('/api/auth',      authRoutes);
app.use('/api/mood',      moodRoutes);
app.use('/api/journal',   journalRoutes);
app.use('/api/breathing', breathingRoutes);
app.use('/api/crisis',    crisisRoutes);
app.use('/api/wellness',  wellnessRoutes);

// Health check (no auth, no rate limiting concern)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// 404 handler
// ---------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[unhandled error]', err);

  // CORS errors
  if (err.message && err.message.startsWith('CORS:')) {
    return res.status(403).json({ error: err.message });
  }

  // JSON parse errors
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body.' });
  }

  const status = err.status || err.statusCode || 500;
  return res.status(status).json({ error: err.message || 'Internal server error.' });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
const PORT = Number(process.env.PORT) || 5001;

app.listen(PORT, () => {
  console.log(`[SafeHarbor] Server running on http://localhost:${PORT}`);
  console.log(`[SafeHarbor] Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; // for testing
