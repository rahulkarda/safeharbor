import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wind, Phone, BarChart2, BookOpen, Layers, Heart, Sparkles, ArrowRight, Shield } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
}

const CTA_CARDS = [
  {
    icon: Wind,
    title: 'I need to breathe',
    body: 'Guided breathing exercises to calm your nervous system right now.',
    to: '/breathe',
    color: 'bg-primary-light border-primary/20',
    iconColor: 'text-primary bg-primary/10',
    badge: 'Instant relief',
    badgeColor: 'bg-primary/10 text-primary',
  },
  {
    icon: Phone,
    title: 'Talk to someone now',
    body: 'You don\'t have to face this alone. Crisis lines are available 24/7.',
    to: '/crisis',
    color: 'bg-danger/5 border-danger/20',
    iconColor: 'text-danger bg-danger/10',
    badge: '24/7 support',
    badgeColor: 'bg-danger/10 text-danger',
  },
  {
    icon: BarChart2,
    title: 'Track how I\'m feeling',
    body: 'Check in with yourself. Small moments of reflection build resilience.',
    to: '/mood',
    color: 'bg-calm-light border-calm/20',
    iconColor: 'text-calm bg-calm/10',
    badge: 'Self-awareness',
    badgeColor: 'bg-calm/10 text-calm',
  },
]

const FEATURES = [
  {
    icon: BarChart2,
    title: 'Mood Tracking',
    body: 'Log how you\'re feeling each day. Spot patterns, celebrate progress, and understand yourself better over time.',
    color: 'bg-calm-light',
    iconColor: 'text-calm',
  },
  {
    icon: Wind,
    title: 'Guided Breathing',
    body: 'Four science-backed breathing techniques — Box, 4-7-8, Deep Belly, and Coherent breathing — available any time.',
    color: 'bg-primary-light',
    iconColor: 'text-primary',
  },
  {
    icon: Layers,
    title: 'Grounding Exercises',
    body: 'The 5-4-3-2-1 technique and other evidence-based methods to bring you back to the present moment.',
    color: 'bg-accent-light',
    iconColor: 'text-accent',
  },
  {
    icon: BookOpen,
    title: 'Private Journal',
    body: 'A safe, private space to process your thoughts and feelings. Your words belong only to you.',
    color: 'bg-calm-light',
    iconColor: 'text-calm',
  },
  {
    icon: Phone,
    title: 'Crisis Support',
    body: 'Immediate access to crisis hotlines and resources. Because sometimes you need a real human voice.',
    color: 'bg-danger/5',
    iconColor: 'text-danger',
  },
  {
    icon: Sparkles,
    title: 'Daily Affirmations',
    body: 'Compassionate reminders of your worth and strength, delivered gently each day.',
    color: 'bg-accent-light',
    iconColor: 'text-accent',
  },
]

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-white"
    >
      {/* ── Nav ──────────────────────────────────────────── */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-teal flex items-center justify-center shadow-soft">
              <Heart size={15} className="text-white" fill="white" />
            </div>
            <span className="text-base font-bold text-text-primary">SafeHarbor</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
            <Link to="/register" className="btn-primary text-sm">Get started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 sm:py-28">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-calm/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-1.5 mb-6"
          >
            <Shield size={13} className="text-primary" />
            <span className="text-xs font-medium text-primary">Private, compassionate, free</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-tight tracking-tight"
          >
            You're not alone.
            <br />
            <span className="text-primary">SafeHarbor is here.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-6 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            A gentle companion for your mental health journey. Breathe, ground yourself,
            track your mood, and find support — all in one safe place.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link to="/register" className="btn-primary text-base px-6 py-3 shadow-glow">
              Start your journey
              <ArrowRight size={16} />
            </Link>
            <Link to="/crisis" className="btn-ghost text-base px-6 py-3 text-danger font-medium">
              <Phone size={16} />
              I need help now
            </Link>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mt-4 text-xs text-text-muted"
          >
            Free to use. No credit card required. Your data stays private.
          </motion.p>
        </div>
      </section>

      {/* ── CTA Cards ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid sm:grid-cols-3 gap-5"
        >
          {CTA_CARDS.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.div key={card.to} variants={fadeUp} custom={i}>
                <Link
                  to={card.to}
                  className={`group block rounded-2xl border p-6 hover:shadow-card-hover transition-all duration-300 ${card.color}`}
                >
                  <div className={`inline-flex p-2.5 rounded-xl mb-4 ${card.iconColor}`}>
                    <Icon size={22} />
                  </div>
                  <span className={`badge mb-3 ${card.badgeColor}`}>{card.badge}</span>
                  <h3 className="text-base font-semibold text-text-primary mb-2">{card.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{card.body}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-text-secondary group-hover:gap-2 transition-all">
                    <span>Open</span>
                    <ArrowRight size={14} />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* ── Feature Grid ─────────────────────────────────── */}
      <section className="bg-surface-muted py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.div variants={fadeUp} custom={0} className="text-center mb-12">
              <h2 className="text-3xl font-bold text-text-primary mb-3">
                Everything you need, gently in one place
              </h2>
              <p className="text-text-secondary max-w-xl mx-auto">
                SafeHarbor brings together the tools and resources that mental health professionals
                recommend — designed with warmth, not clinical coldness.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.title}
                    variants={fadeUp}
                    custom={i + 1}
                    className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-card transition-shadow duration-300"
                  >
                    <div className={`inline-flex p-2.5 rounded-xl mb-4 ${feature.color}`}>
                      <Icon size={20} className={feature.iconColor} />
                    </div>
                    <h3 className="text-base font-semibold text-text-primary mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{feature.body}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Compassion Banner ─────────────────────────────── */}
      <section className="bg-gradient-teal py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-5"
            >
              <Heart size={28} className="text-white" fill="white" />
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl font-bold text-white mb-4"
            >
              Recovery is not a straight line.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-white/80 text-lg leading-relaxed mb-8"
            >
              There will be hard days. But you deserve support on all of them.
              SafeHarbor meets you wherever you are — without judgment, without pressure,
              without a clock running.
            </motion.p>
            <motion.div variants={fadeUp} custom={3}>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-7 py-3 rounded-xl hover:bg-primary-light transition-colors shadow-md"
              >
                Begin today
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart size={14} className="text-primary" fill="currentColor" />
            <span className="text-sm text-text-muted">SafeHarbor — Built with care for those who need it</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-text-muted">
            <Link to="/crisis" className="hover:text-danger transition-colors">Crisis Resources</Link>
            <Link to="/login" className="hover:text-primary transition-colors">Sign in</Link>
            <Link to="/register" className="hover:text-primary transition-colors">Get started</Link>
          </div>
        </div>
      </footer>
    </motion.div>
  )
}
