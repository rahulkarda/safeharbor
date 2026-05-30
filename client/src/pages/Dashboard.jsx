import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format, subDays, startOfDay, isToday } from 'date-fns'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import {
  Wind,
  Layers,
  BookOpen,
  BarChart2,
  Sparkles,
  Phone,
  Sun,
  Sunset,
  Moon,
  ArrowRight,
  Plus,
  TrendingUp,
} from 'lucide-react'
import useAppStore from '../store/appStore.js'
import { useWellnessTips, useAffirmations, useMoodEntries } from '../api/hooks.js'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
}

const MOOD_LABELS = {
  1: { label: 'Very low', emoji: '😔', color: '#E05A5A' },
  2: { label: 'Low', emoji: '😞', color: '#F5A623' },
  3: { label: 'Okay', emoji: '😐', color: '#9B8EC4' },
  4: { label: 'Good', emoji: '🙂', color: '#4A9B8F' },
  5: { label: 'Great', emoji: '😊', color: '#2D7A6F' },
}

const QUICK_ACTIONS = [
  {
    icon: Wind,
    label: 'Breathe',
    sublabel: '4 techniques',
    to: '/breathe',
    color: 'bg-primary-light',
    iconColor: 'text-primary',
    border: 'border-primary/20',
  },
  {
    icon: Layers,
    label: 'Ground yourself',
    sublabel: '5-4-3-2-1',
    to: '/ground',
    color: 'bg-calm-light',
    iconColor: 'text-calm',
    border: 'border-calm/20',
  },
  {
    icon: BookOpen,
    label: 'Write in journal',
    sublabel: 'Private space',
    to: '/journal',
    color: 'bg-accent-light',
    iconColor: 'text-accent',
    border: 'border-accent/20',
  },
  {
    icon: Phone,
    label: 'Crisis support',
    sublabel: '24/7 available',
    to: '/crisis',
    color: 'bg-danger/5',
    iconColor: 'text-danger',
    border: 'border-danger/20',
  },
]

function getGreeting(name) {
  const hour = new Date().getHours()
  let greeting, Icon
  if (hour < 12) {
    greeting = 'Good morning'
    Icon = Sun
  } else if (hour < 17) {
    greeting = 'Good afternoon'
    Icon = Sunset
  } else {
    greeting = 'Good evening'
    Icon = Moon
  }
  return { greeting, Icon }
}

function buildSparklineData(moodEntries) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    return {
      date,
      label: format(date, 'EEE'),
      fullLabel: format(date, 'MMM d'),
      value: null,
    }
  })

  moodEntries.forEach((entry) => {
    const entryDate = startOfDay(new Date(entry.createdAt || entry.date))
    const dayData = days.find(
      (d) => startOfDay(d.date).getTime() === entryDate.getTime()
    )
    if (dayData) {
      dayData.value = entry.mood || entry.score || entry.value
    }
  })

  return days
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length && payload[0].value !== null) {
    const mood = MOOD_LABELS[Math.round(payload[0].value)]
    return (
      <div className="bg-white rounded-xl shadow-card border border-gray-100 px-3 py-2 text-sm">
        <p className="font-medium text-text-primary">
          {mood?.emoji} {mood?.label}
        </p>
        <p className="text-text-muted text-xs">{payload[0].payload.fullLabel}</p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const user = useAppStore((s) => s.user)
  const getMoodEntryToday = useAppStore((s) => s.getMoodEntryToday)

  const { data: moodEntriesData } = useMoodEntries()
  const { data: wellnessTips } = useWellnessTips()
  const { data: affirmations } = useAffirmations()

  const todaysMood = getMoodEntryToday()
  const moodEntries = moodEntriesData || []

  const { greeting, Icon: GreetingIcon } = getGreeting(user?.name)

  // Daily tip — pick based on day of year for consistency
  const dailyTip = useMemo(() => {
    if (!wellnessTips?.length) return null
    const dayOfYear = Math.floor(
      (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    )
    return wellnessTips[dayOfYear % wellnessTips.length]
  }, [wellnessTips])

  // Daily affirmation
  const dailyAffirmation = useMemo(() => {
    if (!affirmations?.length) return null
    const dayOfYear = Math.floor(
      (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    )
    return affirmations[(dayOfYear + 3) % affirmations.length]
  }, [affirmations])

  const sparklineData = useMemo(() => buildSparklineData(moodEntries), [moodEntries])

  const hasAnyMoodData = sparklineData.some((d) => d.value !== null)

  const moodStreak = useMemo(() => {
    let streak = 0
    const today = startOfDay(new Date())
    for (let i = 0; i < 30; i++) {
      const date = startOfDay(subDays(today, i))
      const hasEntry = moodEntries.some(
        (e) => startOfDay(new Date(e.createdAt || e.date)).getTime() === date.getTime()
      )
      if (hasEntry) streak++
      else break
    }
    return streak
  }, [moodEntries])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto"
    >
      {/* ── Greeting ─────────────────────────────────────── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-text-muted text-sm mb-1">
              <GreetingIcon size={15} />
              <span>{format(new Date(), 'EEEE, MMMM d')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
              {greeting},{' '}
              <span className="text-primary">{user?.name?.split(' ')[0] || 'friend'}</span>
            </h1>
            <p className="text-text-secondary mt-1 text-sm">
              How are you doing today? Take a moment to check in with yourself.
            </p>
          </div>
          {moodStreak > 1 && (
            <div className="flex-shrink-0 flex items-center gap-2 bg-accent-light border border-accent/20 rounded-2xl px-4 py-3 text-center">
              <TrendingUp size={16} className="text-accent" />
              <div>
                <p className="text-lg font-bold text-accent leading-none">{moodStreak}</p>
                <p className="text-2xs text-accent/80 mt-0.5">day streak</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Mood check-in prompt ──────────────────────────── */}
      {!todaysMood && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="mb-6">
          <Link
            to="/mood"
            className="block bg-gradient-teal rounded-2xl p-5 text-white hover:shadow-glow transition-shadow duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-white/70 mb-1">Daily check-in</p>
                <h2 className="text-lg font-bold">How are you feeling right now?</h2>
                <p className="text-white/80 text-sm mt-1">
                  A moment of reflection can make a big difference.
                </p>
              </div>
              <div className="flex items-center gap-1 bg-white/20 rounded-xl px-3 py-2 group-hover:bg-white/30 transition-colors">
                <Plus size={14} />
                <span className="text-sm font-medium">Log mood</span>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {todaysMood && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="mb-6">
          <div className="bg-primary-light border border-primary/20 rounded-2xl p-5 flex items-center gap-4">
            <span className="mood-emoji">
              {MOOD_LABELS[todaysMood.mood || todaysMood.score]?.emoji || '🙂'}
            </span>
            <div className="flex-1">
              <p className="text-sm text-text-muted">Today's mood</p>
              <p className="font-semibold text-text-primary">
                {MOOD_LABELS[todaysMood.mood || todaysMood.score]?.label || 'Logged'}
              </p>
            </div>
            <Link to="/mood" className="text-xs font-medium text-primary hover:underline">
              Update
            </Link>
          </div>
        </motion.div>
      )}

      {/* ── Quick Actions ─────────────────────────────────── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="mb-6">
        <h2 className="section-heading mb-3">Quick actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.to}
                to={action.to}
                className={`group rounded-2xl border p-4 transition-all duration-200 hover:shadow-card-hover ${action.color} ${action.border}`}
              >
                <div className={`inline-flex p-2 rounded-xl mb-3 bg-white/50 ${action.iconColor}`}>
                  <Icon size={18} />
                </div>
                <p className={`text-sm font-semibold ${action.to === '/crisis' ? 'text-danger' : 'text-text-primary'}`}>
                  {action.label}
                </p>
                <p className="text-xs text-text-muted mt-0.5">{action.sublabel}</p>
              </Link>
            )
          })}
        </div>
      </motion.div>

      {/* ── 7-day sparkline + affirmation ────────────────── */}
      <div className="grid sm:grid-cols-5 gap-5 mb-6">
        {/* Mood chart */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="sm:col-span-3 card"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="section-heading">7-day mood</h2>
              <p className="section-subheading">Your emotional landscape this week</p>
            </div>
            <Link
              to="/mood"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {hasAnyMoodData ? (
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={sparklineData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4A9B8F" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4A9B8F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F0F4F3" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#8FA0AD' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tick={{ fontSize: 10, fill: '#8FA0AD' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#4A9B8F"
                  strokeWidth={2.5}
                  fill="url(#moodGradient)"
                  dot={{ fill: '#4A9B8F', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#2D7A6F' }}
                  connectNulls={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-36 flex flex-col items-center justify-center text-center gap-2">
              <BarChart2 size={28} className="text-text-muted/40" />
              <p className="text-sm text-text-muted">No mood data yet.</p>
              <Link to="/mood" className="text-xs text-primary font-medium hover:underline">
                Log your first entry
              </Link>
            </div>
          )}
        </motion.div>

        {/* Affirmation */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="sm:col-span-2 bg-gradient-calm rounded-2xl p-5 text-white flex flex-col justify-between"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={15} className="text-white/80" />
            <span className="text-xs font-medium text-white/80 uppercase tracking-wide">
              Today's affirmation
            </span>
          </div>
          <p className="font-serif text-base leading-relaxed text-white italic flex-1">
            "{dailyAffirmation || 'You are worthy of care and compassion.'}"
          </p>
          <Link
            to="/affirmations"
            className="mt-4 flex items-center gap-1 text-xs font-medium text-white/70 hover:text-white transition-colors"
          >
            See all affirmations <ArrowRight size={12} />
          </Link>
        </motion.div>
      </div>

      {/* ── Wellness tip ─────────────────────────────────── */}
      {dailyTip && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5} className="mb-6">
          <div className="bg-accent-light border border-accent/20 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Sun size={18} className="text-accent" />
            </div>
            <div>
              <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">
                Daily wellness tip
              </p>
              <p className="text-sm text-text-primary leading-relaxed">{dailyTip}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Recent journal & navigate ─────────────────────── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={6}
        className="grid sm:grid-cols-2 gap-5"
      >
        <Link
          to="/journal"
          className="card-hover group flex items-center gap-4"
        >
          <div className="w-11 h-11 rounded-xl bg-calm-light flex items-center justify-center flex-shrink-0">
            <BookOpen size={20} className="text-calm" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-text-primary text-sm">Journal</p>
            <p className="text-xs text-text-muted mt-0.5">Write what's on your mind</p>
          </div>
          <ArrowRight size={16} className="text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/breathe"
          className="card-hover group flex items-center gap-4"
        >
          <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
            <Wind size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-text-primary text-sm">Breathing exercises</p>
            <p className="text-xs text-text-muted mt-0.5">Calm your nervous system</p>
          </div>
          <ArrowRight size={16} className="text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </Link>
      </motion.div>
    </motion.div>
  )
}
