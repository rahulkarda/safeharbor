import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import Landing from './pages/Landing.jsx'
import Auth from './pages/Auth.jsx'
import Dashboard from './pages/Dashboard.jsx'
import MoodTracker from './pages/MoodTracker.jsx'
import BreathingExercise from './pages/BreathingExercise.jsx'
import Grounding from './pages/Grounding.jsx'
import Journal from './pages/Journal.jsx'
import JournalEntry from './pages/JournalEntry.jsx'
import CrisisResources from './pages/CrisisResources.jsx'
import Affirmations from './pages/Affirmations.jsx'

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/register" element={<Auth mode="register" />} />

        {/* Protected routes inside app shell */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mood" element={<MoodTracker />} />
            <Route path="/breathe" element={<BreathingExercise />} />
            <Route path="/ground" element={<Grounding />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/:id" element={<JournalEntry />} />
            <Route path="/crisis" element={<CrisisResources />} />
            <Route path="/affirmations" element={<Affirmations />} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  )
}
