import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  LayoutDashboard,
  Wind,
  Layers,
  BarChart2,
  BookOpen,
  Phone,
  Sparkles,
  LogOut,
  Menu,
  X,
  Heart,
} from 'lucide-react'
import useAppStore from '../store/appStore.js'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/breathe', label: 'Breathe', icon: Wind },
  { to: '/ground', label: 'Ground', icon: Layers },
  { to: '/mood', label: 'Mood', icon: BarChart2 },
  { to: '/journal', label: 'Journal', icon: BookOpen },
  { to: '/affirmations', label: 'Affirmations', icon: Sparkles },
]

const CRISIS_ITEM = { to: '/crisis', label: 'Crisis Help', icon: Phone }

function NavItem({ to, label, icon: Icon, crisis = false, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
          crisis
            ? isActive
              ? 'bg-danger text-white shadow-md'
              : 'text-danger hover:bg-danger/10'
            : isActive
            ? 'bg-primary text-white shadow-soft'
            : 'text-text-secondary hover:bg-primary-light hover:text-primary',
        ].join(' ')
      }
    >
      <Icon size={18} strokeWidth={isActive => (isActive ? 2.5 : 2)} />
      <span>{label}</span>
    </NavLink>
  )
}

function MobileNavItem({ to, label, icon: Icon, crisis = false }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex flex-col items-center gap-1 py-2 px-3 rounded-xl text-xs font-medium transition-all duration-200 min-w-0 flex-1',
          crisis
            ? isActive
              ? 'text-danger'
              : 'text-danger/70'
            : isActive
            ? 'text-primary'
            : 'text-text-muted',
        ].join(' ')
      }
    >
      <Icon size={20} />
      <span className="truncate">{label}</span>
    </NavLink>
  )
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const user = useAppStore((s) => s.user)
  const logout = useAppStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-100 shadow-soft flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-gradient-teal flex items-center justify-center shadow-soft">
            <Heart size={18} className="text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-text-primary leading-none">SafeHarbor</h1>
            <p className="text-2xs text-text-muted mt-0.5">You're not alone</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
          <div className="pt-3 mt-3 border-t border-gray-100">
            <NavItem {...CRISIS_ITEM} crisis />
          </div>
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-muted transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-teal flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {user?.name || 'Friend'}
              </p>
              <p className="text-2xs text-text-muted truncate">{user?.email || ''}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
              title="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile Sidebar Overlay ──────────────────────── */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="md:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-teal flex items-center justify-center">
              <Heart size={18} className="text-white" fill="white" />
            </div>
            <span className="text-base font-bold text-text-primary">SafeHarbor</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg text-text-muted hover:bg-surface-muted transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} onClick={() => setSidebarOpen(false)} />
          ))}
          <div className="pt-3 mt-3 border-t border-gray-100">
            <NavItem {...CRISIS_ITEM} crisis onClick={() => setSidebarOpen(false)} />
          </div>
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-teal flex items-center justify-center">
              <span className="text-xs font-bold text-white">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary">{user?.name || 'Friend'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-danger font-medium px-2 py-1 rounded-lg hover:bg-danger/10 transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      </motion.aside>

      {/* ── Main Content ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-text-secondary hover:bg-surface-muted transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-primary" fill="currentColor" />
            <span className="font-bold text-text-primary">SafeHarbor</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-teal flex items-center justify-center">
            <span className="text-xs font-bold text-white">{initials}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Mobile bottom tab bar */}
        <nav className="md:hidden flex items-center bg-white border-t border-gray-100 px-2 py-1 safe-area-pb">
          {[...NAV_ITEMS.slice(0, 4), CRISIS_ITEM].map((item) => (
            <MobileNavItem
              key={item.to}
              {...item}
              crisis={item.to === CRISIS_ITEM.to}
            />
          ))}
        </nav>
      </div>
    </div>
  )
}
