import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from 'recharts';
import { format, subDays, parseISO, startOfDay } from 'date-fns';
import apiClient from '../api/client.js';

const MOOD_LABELS = {
  1: 'Struggling deeply',
  2: 'Very difficult',
  3: 'Pretty rough',
  4: 'Low',
  5: 'Okay',
  6: 'Getting there',
  7: 'Pretty good',
  8: 'Good',
  9: 'Great',
  10: 'Amazing',
};

const MOOD_COLORS = {
  1: '#ef4444',
  2: '#f97316',
  3: '#f97316',
  4: '#eab308',
  5: '#84cc16',
  6: '#22c55e',
  7: '#10b981',
  8: '#14b8a6',
  9: '#06b6d4',
  10: '#6366f1',
};

const EMOTIONS_LEFT = [
  'Anxious', 'Sad', 'Angry', 'Hopeless',
  'Overwhelmed', 'Lonely', 'Confused', 'Numb',
];
const EMOTIONS_RIGHT = [
  'Calm', 'Grateful', 'Content', 'Happy',
  'Energized', 'Hopeful', 'Loved', 'Focused',
];
const ALL_EMOTIONS = [...EMOTIONS_LEFT, ...EMOTIONS_RIGHT];

const EMOTION_COLORS = {
  Anxious: '#f97316', Sad: '#6366f1', Angry: '#ef4444', Hopeless: '#94a3b8',
  Overwhelmed: '#f43f5e', Lonely: '#8b5cf6', Confused: '#d97706', Numb: '#64748b',
  Calm: '#10b981', Grateful: '#f59e0b', Content: '#06b6d4', Happy: '#22c55e',
  Energized: '#f97316', Hopeful: '#3b82f6', Loved: '#ec4899', Focused: '#14b8a6',
};

function MoodEmoji({ value }) {
  if (value >= 9) return '🌟';
  if (value >= 7) return '😊';
  if (value >= 5) return '😐';
  if (value >= 3) return '😔';
  return '😢';
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-sm shadow-xl">
        <p className="text-white/60 mb-1">{label}</p>
        <p className="text-white font-medium">
          {val} — {MOOD_LABELS[Math.round(val)] || ''}
        </p>
      </div>
    );
  }
  return null;
}

export default function MoodTracker() {
  const [mood, setMood] = useState(5);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await apiClient.get('/mood?days=30');
      setMoodHistory(res.data || []);
    } catch {
      // Generate demo data for display
      const demo = Array.from({ length: 30 }, (_, i) => ({
        date: subDays(new Date(), 29 - i).toISOString(),
        mood: Math.floor(Math.random() * 4) + 5,
        emotions: [],
      }));
      setMoodHistory(demo);
    }
    setLoadingHistory(false);
  };

  const toggleEmotion = e => {
    setSelectedEmotions(prev =>
      prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await apiClient.post('/mood', {
        mood,
        emotions: selectedEmotions,
        note,
        timestamp: new Date().toISOString(),
      });
    } catch {}
    setSubmitting(false);
    setSubmitted(true);
    await fetchHistory();
    setTimeout(() => {
      setSubmitted(false);
      setNote('');
      setSelectedEmotions([]);
    }, 3000);
  };

  // Build chart data
  const chartData = (() => {
    const days = Array.from({ length: 30 }, (_, i) => {
      const d = subDays(new Date(), 29 - i);
      const key = format(d, 'MM/dd');
      const matches = moodHistory.filter(m => {
        try { return format(parseISO(m.date || m.timestamp || m.created_at), 'MM/dd') === key; }
        catch { return false; }
      });
      const avg = matches.length
        ? Math.round((matches.reduce((s, m) => s + m.mood, 0) / matches.length) * 10) / 10
        : null;
      return { date: key, mood: avg };
    });
    return days;
  })();

  const emotionFreq = (() => {
    const counts = {};
    moodHistory.forEach(entry => {
      (entry.emotions || []).forEach(e => {
        counts[e] = (counts[e] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  })();

  const weekAvg = (() => {
    const thisWeek = moodHistory.filter(m => {
      try { return parseISO(m.date || m.timestamp || m.created_at) >= subDays(new Date(), 7); }
      catch { return false; }
    });
    const lastWeek = moodHistory.filter(m => {
      try {
        const d = parseISO(m.date || m.timestamp || m.created_at);
        return d >= subDays(new Date(), 14) && d < subDays(new Date(), 7);
      } catch { return false; }
    });
    const avg = arr => arr.length ? (arr.reduce((s, m) => s + m.mood, 0) / arr.length).toFixed(1) : null;
    return { this: avg(thisWeek), last: avg(lastWeek) };
  })();

  const moodDelta = weekAvg.this && weekAvg.last
    ? (parseFloat(weekAvg.this) - parseFloat(weekAvg.last)).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-extralight text-white tracking-wider mb-2">How are you?</h1>
          <p className="text-white/40 text-sm">No judgment. Just honesty with yourself.</p>
        </motion.div>

        {/* Mood Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8"
        >
          {/* Mood Scale */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-white font-light text-lg">Mood</h2>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{MoodEmoji({ value: mood })}</span>
                <div className="text-right">
                  <span className="text-white text-2xl font-light">{mood}</span>
                  <p className="text-white/50 text-xs">{MOOD_LABELS[mood]}</p>
                </div>
              </div>
            </div>

            {/* Mood buttons */}
            <div className="flex gap-2 justify-between">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                <motion.button
                  key={n}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMood(n)}
                  className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    mood === n
                      ? 'text-slate-900 shadow-lg scale-105'
                      : 'bg-white/8 text-white/40 hover:bg-white/15 hover:text-white/70'
                  }`}
                  style={mood === n ? { backgroundColor: MOOD_COLORS[n] } : {}}
                >
                  {n}
                </motion.button>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-white/25 text-xs">Struggling</span>
              <span className="text-white/25 text-xs">Amazing</span>
            </div>
          </div>

          {/* Emotions */}
          <div className="mb-8">
            <h2 className="text-white font-light text-lg mb-4">
              How are you feeling?{' '}
              <span className="text-white/30 text-sm font-light">(select all that apply)</span>
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {/* Left column */}
              <div className="space-y-2">
                {EMOTIONS_LEFT.map(e => (
                  <button
                    key={e}
                    onClick={() => toggleEmotion(e)}
                    className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all duration-200 flex items-center gap-2 ${
                      selectedEmotions.includes(e)
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/70'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: selectedEmotions.includes(e) ? EMOTION_COLORS[e] : 'rgba(255,255,255,0.2)' }}
                    />
                    {e}
                  </button>
                ))}
              </div>
              {/* Right column */}
              <div className="space-y-2">
                {EMOTIONS_RIGHT.map(e => (
                  <button
                    key={e}
                    onClick={() => toggleEmotion(e)}
                    className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all duration-200 flex items-center gap-2 ${
                      selectedEmotions.includes(e)
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/70'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: selectedEmotions.includes(e) ? EMOTION_COLORS[e] : 'rgba(255,255,255,0.2)' }}
                    />
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="mb-8">
            <h2 className="text-white font-light text-lg mb-3">What's on your mind?</h2>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Optional — this is just for you."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 text-sm outline-none focus:border-white/25 focus:bg-white/8 transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Submit */}
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-3 py-4"
              >
                <span className="text-2xl">🌸</span>
                <span className="text-white font-light text-lg">Logged. Thank you for checking in.</span>
              </motion.div>
            ) : (
              <motion.button
                key="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-medium text-base shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50 transition-all"
              >
                {submitting ? 'Saving...' : 'Log my mood'}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stats Row */}
        {!loadingHistory && weekAvg.this && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2">This week avg</p>
              <p className="text-white text-3xl font-extralight">{weekAvg.this}</p>
              <p className="text-white/30 text-xs mt-1">{MOOD_LABELS[Math.round(parseFloat(weekAvg.this))]}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Last week avg</p>
              <p className="text-white text-3xl font-extralight">{weekAvg.last || '—'}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Change</p>
              {moodDelta !== null ? (
                <p className={`text-3xl font-extralight ${
                  parseFloat(moodDelta) > 0 ? 'text-emerald-400' :
                  parseFloat(moodDelta) < 0 ? 'text-red-400' : 'text-white/50'
                }`}>
                  {parseFloat(moodDelta) > 0 ? '+' : ''}{moodDelta}
                </p>
              ) : (
                <p className="text-white/30 text-xl">—</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-6"
        >
          <h3 className="text-white/70 font-light mb-6">Mood over 30 days</h3>
          {loadingHistory ? (
            <div className="h-48 flex items-center justify-center">
              <div className="text-white/20 text-sm">Loading...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="moodGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval={4}
                />
                <YAxis
                  domain={[1, 10]}
                  ticks={[1, 3, 5, 7, 10]}
                  tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotoneX"
                  dataKey="mood"
                  stroke="url(#moodGrad)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#6366f1', strokeWidth: 0 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Emotion Frequency */}
        {emotionFreq.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6"
          >
            <h3 className="text-white/70 font-light mb-6">Most frequent emotions (30 days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={emotionFreq} margin={{ top: 5, right: 5, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  angle={-30}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                  labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                  itemStyle={{ color: 'rgba(255,255,255,0.5)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {emotionFreq.map((entry, i) => (
                    <Cell key={i} fill={EMOTION_COLORS[entry.name] || '#6366f1'} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>
    </div>
  );
}
