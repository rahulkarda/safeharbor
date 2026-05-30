import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Heart, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react'
import apiClient from '../api/client.js'
import useAppStore from '../store/appStore.js'

export default function Auth({ mode: defaultMode = 'login' }) {
  const location = useLocation()
  const navigate = useNavigate()
  const login = useAppStore((s) => s.login)
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)

  // Derive mode from prop or path
  const [mode, setMode] = useState(
    defaultMode === 'register' || location.pathname === '/register' ? 'register' : 'login'
  )

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Basic validation
    if (!form.email || !form.password) {
      setError('Please fill in all required fields.')
      return
    }
    if (mode === 'register' && !form.name.trim()) {
      setError('Please enter your name.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register'
      const payload =
        mode === 'login'
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password }

      const { data } = await apiClient.post(endpoint, payload)
      login(data.user, data.token)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setError('')
    setForm({ name: '', email: '', password: '' })
    navigate(newMode === 'login' ? '/login' : '/register', { replace: true })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-12"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/6 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-calm/6 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-teal flex items-center justify-center shadow-glow">
              <Heart size={20} className="text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                SafeHarbor
              </h1>
              <p className="text-xs text-text-muted">You're not alone</p>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-card p-8">
          {/* Mode toggle */}
          <div className="flex bg-surface-muted rounded-xl p-1 mb-6">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={[
                  'flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  mode === m
                    ? 'bg-white text-text-primary shadow-soft'
                    : 'text-text-muted hover:text-text-secondary',
                ].join(' ')}
              >
                {m === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          {/* Heading */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mb-6"
            >
              <h2 className="text-xl font-bold text-text-primary">
                {mode === 'login' ? 'Welcome back' : 'Welcome to SafeHarbor'}
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                {mode === 'login'
                  ? 'Sign in to continue your wellness journey.'
                  : 'Create a free account to get started. No judgment here.'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2.5 bg-danger/5 border border-danger/20 rounded-xl px-4 py-3 mb-5"
              >
                <AlertCircle size={16} className="text-danger flex-shrink-0 mt-0.5" />
                <p className="text-sm text-danger">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Your name
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                    />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="What should we call you?"
                      className="input-field pl-10"
                      autoComplete="name"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'}
                  className="input-field pl-10 pr-10"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                <>
                  {mode === 'login' ? 'Sign in' : 'Create account'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer links */}
          <p className="text-center text-sm text-text-muted mt-6">
            {mode === 'login' ? (
              <>
                New here?{' '}
                <button
                  onClick={() => switchMode('register')}
                  className="text-primary font-medium hover:underline"
                >
                  Create a free account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => switchMode('login')}
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        {/* Crisis link */}
        <p className="text-center text-sm text-text-muted mt-5">
          In crisis right now?{' '}
          <Link to="/crisis" className="text-danger font-medium hover:underline">
            Find immediate support
          </Link>
        </p>
      </div>
    </motion.div>
  )
}
