import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import apiClient from '../api/client.js';

const TECHNIQUES = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Calm your nervous system. Used by Navy SEALs.',
    phases: [
      { label: 'Inhale', duration: 4 },
      { label: 'Hold', duration: 4 },
      { label: 'Exhale', duration: 4 },
      { label: 'Hold', duration: 4 },
    ],
    color: 'from-blue-400 to-teal-500',
    glow: 'rgba(56, 189, 248, 0.4)',
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    description: 'Activate your rest-and-digest response.',
    phases: [
      { label: 'Inhale', duration: 4 },
      { label: 'Hold', duration: 7 },
      { label: 'Exhale', duration: 8 },
    ],
    color: 'from-indigo-400 to-purple-500',
    glow: 'rgba(129, 140, 248, 0.4)',
  },
  {
    id: '555',
    name: '5-5-5 Diaphragmatic',
    description: 'Deep belly breathing for grounding.',
    phases: [
      { label: 'Inhale', duration: 5 },
      { label: 'Hold', duration: 5 },
      { label: 'Exhale', duration: 5 },
    ],
    color: 'from-teal-400 to-cyan-500',
    glow: 'rgba(45, 212, 191, 0.4)',
  },
  {
    id: 'pursed',
    name: 'Pursed Lip',
    description: 'Slow breathing for anxiety relief.',
    phases: [
      { label: 'Inhale', duration: 2 },
      { label: 'Exhale', duration: 4 },
    ],
    color: 'from-sky-400 to-blue-600',
    glow: 'rgba(14, 165, 233, 0.4)',
  },
];

function PhaseCircle({ phase, countdown, total, isRunning }) {
  const controls = useAnimationControls();
  const isExpand = phase === 'Inhale';
  const isHold = phase === 'Hold';

  useEffect(() => {
    if (!isRunning) return;
    if (isExpand) {
      controls.start({ scale: 1.5, transition: { duration: total, ease: 'easeInOut' } });
    } else if (isHold) {
      controls.start({ scale: controls._currentAnimation?.scale ?? 1.25, transition: { duration: total } });
    } else {
      controls.start({ scale: 1, transition: { duration: total, ease: 'easeInOut' } });
    }
  }, [phase, isRunning, total]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>
      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 260,
          height: 260,
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
        animate={isRunning ? { opacity: [0.4, 0.8, 0.4] } : { opacity: 0.4 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Breathing circle */}
      <motion.div
        animate={controls}
        initial={{ scale: 1 }}
        className="rounded-full flex flex-col items-center justify-center"
        style={{
          width: 160,
          height: 160,
          background: 'radial-gradient(circle at 40% 35%, rgba(255,255,255,0.35), rgba(255,255,255,0.08))',
          backdropFilter: 'blur(8px)',
          border: '2px solid rgba(255,255,255,0.3)',
          boxShadow: '0 0 40px rgba(255,255,255,0.15), inset 0 0 30px rgba(255,255,255,0.1)',
        }}
      >
        <span className="text-white text-5xl font-light tracking-tight">{countdown}</span>
      </motion.div>
    </div>
  );
}

export default function BreathingExercise() {
  const [selectedTech, setSelectedTech] = useState(TECHNIQUES[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(selectedTech.phases[0].duration);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);
  const [sessionLogged, setSessionLogged] = useState(false);

  const intervalRef = useRef(null);
  const sessionRef = useRef(null);
  const phaseRef = useRef(phaseIndex);
  const countdownRef = useRef(countdown);
  const cyclesRef = useRef(cyclesCompleted);

  phaseRef.current = phaseIndex;
  countdownRef.current = countdown;
  cyclesRef.current = cyclesCompleted;

  const currentPhase = selectedTech.phases[phaseIndex];

  const clearTimers = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (sessionRef.current) clearInterval(sessionRef.current);
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const startSession = () => {
    setIsRunning(true);
    setIsPaused(false);
    setPhaseIndex(0);
    setCountdown(selectedTech.phases[0].duration);
    setSessionSeconds(0);
    setCyclesCompleted(0);
    setShowCongrats(false);
    setSessionLogged(false);

    sessionRef.current = setInterval(() => {
      setSessionSeconds(s => s + 1);
    }, 1000);

    intervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          const nextPhaseIdx = (phaseRef.current + 1) % selectedTech.phases.length;
          if (nextPhaseIdx === 0) {
            setCyclesCompleted(c => c + 1);
          }
          setPhaseIndex(nextPhaseIdx);
          return selectedTech.phases[nextPhaseIdx].duration;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseSession = () => {
    setIsPaused(true);
    clearTimers();
  };

  const resumeSession = () => {
    setIsPaused(false);
    sessionRef.current = setInterval(() => setSessionSeconds(s => s + 1), 1000);
    intervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          const nextPhaseIdx = (phaseRef.current + 1) % selectedTech.phases.length;
          if (nextPhaseIdx === 0) setCyclesCompleted(c => c + 1);
          setPhaseIndex(nextPhaseIdx);
          return selectedTech.phases[nextPhaseIdx].duration;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopSession = () => {
    clearTimers();
    setIsRunning(false);
    setIsPaused(false);
    if (sessionSeconds >= 300) setShowCongrats(true);
    else {
      setPhaseIndex(0);
      setCountdown(selectedTech.phases[0].duration);
    }
  };

  useEffect(() => {
    if (isRunning && sessionSeconds >= 300 && !showCongrats) {
      stopSession();
      setShowCongrats(true);
    }
  }, [sessionSeconds, isRunning]);

  const logSession = async () => {
    try {
      await apiClient.post('/breathing-sessions', {
        technique: selectedTech.name,
        durationSeconds: sessionSeconds,
        cyclesCompleted,
      });
      setSessionLogged(true);
    } catch {
      setSessionLogged(true);
    }
  };

  const formatTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const handleTechChange = tech => {
    if (isRunning) stopSession();
    setSelectedTech(tech);
    setPhaseIndex(0);
    setCountdown(tech.phases[0].duration);
    setShowCongrats(false);
  };

  const phaseColors = {
    Inhale: 'text-sky-200',
    Hold: 'text-purple-200',
    Exhale: 'text-teal-200',
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${selectedTech.color} via-blue-900 to-slate-900 flex flex-col items-center py-10 px-4 transition-all duration-1000`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-extralight text-white tracking-widest uppercase mb-1">Breathe</h1>
        <p className="text-white/50 text-sm tracking-wider">Let your breath guide you back to calm</p>
      </motion.div>

      {/* Technique Selector */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {TECHNIQUES.map(t => (
          <button
            key={t.id}
            onClick={() => handleTechChange(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
              selectedTech.id === t.id
                ? 'bg-white text-slate-800 border-transparent shadow-lg'
                : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Technique Description */}
      <AnimatePresence mode="wait">
        <motion.p
          key={selectedTech.id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-white/60 text-sm mb-8 text-center"
        >
          {selectedTech.description}
        </motion.p>
      </AnimatePresence>

      {/* Phase Indicator */}
      <AnimatePresence mode="wait">
        {isRunning && (
          <motion.div
            key={currentPhase.label}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mb-6 text-center"
          >
            <span className={`text-2xl font-light tracking-widest uppercase ${phaseColors[currentPhase.label] || 'text-white/80'}`}>
              {currentPhase.label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breathing Circle */}
      <div className="relative flex items-center justify-center mb-8">
        {!isRunning && !showCongrats && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center rounded-full"
            style={{
              width: 200,
              height: 200,
              background: 'radial-gradient(circle at 40% 35%, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
              border: '2px solid rgba(255,255,255,0.2)',
              boxShadow: '0 0 60px rgba(255,255,255,0.1)',
            }}
          >
            <span className="text-white/40 text-sm tracking-widest">Ready</span>
          </motion.div>
        )}
        {isRunning && (
          <PhaseCircle
            phase={currentPhase.label}
            countdown={countdown}
            total={currentPhase.duration}
            isRunning={isRunning && !isPaused}
          />
        )}
      </div>

      {/* Phase Pattern Display */}
      <div className="flex gap-3 mb-8">
        {selectedTech.phases.map((p, i) => (
          <div
            key={i}
            className={`text-center transition-all duration-300 ${
              isRunning && i === phaseIndex ? 'opacity-100 scale-110' : 'opacity-40 scale-100'
            }`}
          >
            <div className="text-white/70 text-xs uppercase tracking-wider">{p.label}</div>
            <div className="text-white text-lg font-light">{p.duration}s</div>
          </div>
        ))}
      </div>

      {/* Stats */}
      {(isRunning || sessionSeconds > 0) && !showCongrats && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-8 mb-8 text-center"
        >
          <div>
            <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Time</div>
            <div className="text-white text-xl font-light">{formatTime(sessionSeconds)}</div>
          </div>
          <div>
            <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Cycles</div>
            <div className="text-white text-xl font-light">{cyclesCompleted}</div>
          </div>
        </motion.div>
      )}

      {/* Controls */}
      {!showCongrats && (
        <div className="flex gap-4 items-center">
          {!isRunning ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={startSession}
              className="px-10 py-4 bg-white text-slate-700 rounded-full font-medium text-lg shadow-2xl hover:shadow-white/20 transition-shadow"
            >
              Begin
            </motion.button>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={isPaused ? resumeSession : pauseSession}
                className="px-8 py-3 bg-white/20 text-white rounded-full font-medium border border-white/30 hover:bg-white/30 transition-all"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={stopSession}
                className="px-8 py-3 bg-white/10 text-white/70 rounded-full font-medium border border-white/20 hover:bg-white/20 transition-all"
              >
                Stop
              </motion.button>
            </>
          )}
        </div>
      )}

      {/* Progress Hint */}
      {isRunning && !isPaused && sessionSeconds < 300 && (
        <div className="mt-6 w-64">
          <div className="flex justify-between text-white/40 text-xs mb-1">
            <span>Progress</span>
            <span>{formatTime(300 - sessionSeconds)} left</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white/40 rounded-full"
              animate={{ width: `${(sessionSeconds / 300) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Congrats Screen */}
      <AnimatePresence>
        {showCongrats && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="text-5xl mb-4">🌊</div>
              <h2 className="text-white text-2xl font-light mb-3">Beautiful work.</h2>
              <p className="text-white/70 mb-2">
                You completed {cyclesCompleted} breathing cycles in {formatTime(sessionSeconds)}.
              </p>
              <p className="text-white/50 text-sm mb-8">
                Your nervous system thanks you. Carry this calm with you.
              </p>
              <div className="flex flex-col gap-3">
                {!sessionLogged ? (
                  <button
                    onClick={logSession}
                    className="px-6 py-3 bg-white text-slate-700 rounded-full font-medium hover:bg-white/90 transition-all"
                  >
                    Log this session
                  </button>
                ) : (
                  <p className="text-teal-300 text-sm">Session logged!</p>
                )}
                <button
                  onClick={() => {
                    setShowCongrats(false);
                    setIsRunning(false);
                    setSessionSeconds(0);
                    setPhaseIndex(0);
                    setCountdown(selectedTech.phases[0].duration);
                    setCyclesCompleted(0);
                  }}
                  className="px-6 py-3 bg-white/10 text-white/70 rounded-full font-medium border border-white/20 hover:bg-white/20 transition-all"
                >
                  Breathe again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
