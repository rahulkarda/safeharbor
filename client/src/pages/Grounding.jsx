import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  {
    count: 5,
    sense: 'SEE',
    icon: '👁',
    prompt: 'Look around you. Name 5 things you can see.',
    sub: 'A lamp, a window, your hands — anything at all.',
    color: 'from-amber-700 via-orange-800 to-stone-900',
    dot: 'bg-amber-400',
    accent: 'text-amber-300',
    placeholder: 'e.g. the ceiling, my hands, a plant...',
  },
  {
    count: 4,
    sense: 'TOUCH',
    icon: '✋',
    prompt: 'Feel 4 things you can physically touch.',
    sub: 'The texture of your clothes, the floor under your feet.',
    color: 'from-stone-700 via-amber-900 to-stone-950',
    dot: 'bg-orange-300',
    accent: 'text-orange-300',
    placeholder: 'e.g. the chair, my shirt, the table...',
  },
  {
    count: 3,
    sense: 'HEAR',
    icon: '👂',
    prompt: 'Listen for 3 things you can hear right now.',
    sub: 'Even the quietest sounds — your breath, distant traffic.',
    color: 'from-stone-800 via-stone-700 to-amber-950',
    dot: 'bg-yellow-400',
    accent: 'text-yellow-300',
    placeholder: 'e.g. my breathing, a fan, birds outside...',
  },
  {
    count: 2,
    sense: 'SMELL',
    icon: '👃',
    prompt: 'Notice 2 things you can smell.',
    sub: "If you can't smell anything, notice what the air feels like.",
    color: 'from-amber-950 via-stone-800 to-stone-900',
    dot: 'bg-amber-500',
    accent: 'text-amber-200',
    placeholder: 'e.g. fresh air, coffee, my shampoo...',
  },
  {
    count: 1,
    sense: 'TASTE',
    icon: '👅',
    prompt: 'Bring your awareness to 1 thing you can taste.',
    sub: 'Even the taste of your own mouth right now.',
    color: 'from-stone-950 via-amber-900 to-stone-800',
    dot: 'bg-orange-400',
    accent: 'text-orange-200',
    placeholder: 'e.g. mint from toothpaste, coffee, nothing...',
  },
];

const STORAGE_KEY = 'safeharbor_grounding_responses';

const encouragements = [
  'Great. Keep going.',
  "You're doing amazing.",
  'Stay with it. You\'re safe.',
  'Each breath brings you closer to ground.',
  "You're doing beautifully.",
];

function InputRow({ index, value, onChange, placeholder, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="flex items-center gap-3"
    >
      <span className={`text-sm font-light w-5 text-right ${accent} opacity-60`}>{index + 1}</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(index, e.target.value)}
        placeholder={index === 0 ? placeholder : ''}
        className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/25 text-sm outline-none focus:border-white/40 focus:bg-white/15 transition-all"
      />
    </motion.div>
  );
}

export default function Grounding() {
  const [stepIndex, setStepIndex] = useState(0);
  const [responses, setResponses] = useState(STEPS.map(s => Array(s.count).fill('')));
  const [showEnd, setShowEnd] = useState(false);
  const [started, setStarted] = useState(false);
  const navigate = useNavigate();

  const step = STEPS[stepIndex];

  useEffect(() => {
    if (started) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
      } catch {}
    }
  }, [responses, started]);

  const handleInput = (rowIdx, val) => {
    setResponses(prev => {
      const next = prev.map(arr => [...arr]);
      next[stepIndex][rowIdx] = val;
      return next;
    });
  };

  const canAdvance = responses[stepIndex].some(v => v.trim() !== '');

  const advance = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(s => s + 1);
    } else {
      setShowEnd(true);
    }
  };

  const back = () => {
    if (stepIndex > 0) setStepIndex(s => s - 1);
  };

  const encouragement = encouragements[stepIndex % encouragements.length];

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-stone-900 to-slate-900 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <div className="text-6xl mb-6">🌿</div>
          <h1 className="text-4xl font-extralight text-white tracking-wide mb-4">Grounding</h1>
          <p className="text-white/60 text-lg mb-3 font-light">
            When the world feels like too much, your senses can anchor you.
          </p>
          <p className="text-white/40 text-sm mb-10">
            The 5-4-3-2-1 technique gently brings your attention back to the present moment.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setStarted(true)}
            className="px-10 py-4 bg-white text-stone-800 rounded-full font-medium text-lg shadow-2xl"
          >
            I'm ready
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (showEnd) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-stone-800 via-amber-900 to-stone-950 flex flex-col items-center justify-center px-6 text-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-md"
        >
          <div className="text-6xl mb-6">🌱</div>
          <h2 className="text-3xl font-extralight text-white mb-4">You're grounded.</h2>
          <p className="text-white/70 text-xl font-light mb-2">You're safe.</p>
          <p className="text-white/60 mb-10">You did it.</p>

          <div className="bg-white/8 border border-white/15 rounded-2xl p-5 mb-8 text-left space-y-3">
            {STEPS.map((s, si) => (
              <div key={si} className="flex gap-3">
                <span className="text-lg">{s.icon}</span>
                <div>
                  <span className={`text-xs uppercase tracking-widest ${s.accent} font-medium`}>{s.sense}: </span>
                  <span className="text-white/60 text-sm">
                    {responses[si].filter(v => v.trim()).join(', ') || '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/mood')}
              className="px-8 py-3 bg-white text-stone-800 rounded-full font-medium hover:bg-white/90 transition-all"
            >
              Log my mood
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/breathe')}
              className="px-8 py-3 bg-white/10 text-white/70 rounded-full font-medium border border-white/20 hover:bg-white/20 transition-all"
            >
              Go to breathing exercise
            </motion.button>
            <button
              onClick={() => {
                setStepIndex(0);
                setResponses(STEPS.map(s => Array(s.count).fill('')));
                setShowEnd(false);
              }}
              className="text-white/30 text-sm hover:text-white/50 transition-colors mt-2"
            >
              Start over
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`min-h-screen bg-gradient-to-br ${step.color} flex flex-col px-6 py-10`}
      >
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-12">
          {STEPS.map((s, i) => (
            <motion.div
              key={i}
              className={`rounded-full transition-all duration-500 ${
                i === stepIndex
                  ? `w-6 h-2 ${step.dot}`
                  : i < stepIndex
                  ? `w-2 h-2 bg-white/50`
                  : `w-2 h-2 bg-white/15`
              }`}
            />
          ))}
        </div>

        <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
          {/* Step Number + Icon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="text-6xl mb-4">{step.icon}</div>
            <div className={`text-sm uppercase tracking-widest font-medium mb-2 ${step.accent}`}>
              Step {stepIndex + 1} of {STEPS.length}
            </div>
            <h2 className="text-3xl font-extralight text-white mb-3">
              {step.count} thing{step.count !== 1 ? 's' : ''} you can{' '}
              <span className={step.accent}>{step.sense}</span>
            </h2>
            <p className="text-white/60 text-base font-light">{step.sub}</p>
          </motion.div>

          {/* Prompt */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/8 border border-white/12 rounded-2xl p-5 mb-6"
          >
            <p className="text-white/80 text-center font-light leading-relaxed">{step.prompt}</p>
          </motion.div>

          {/* Input rows */}
          <div className="space-y-3 mb-8">
            {Array.from({ length: step.count }).map((_, i) => (
              <InputRow
                key={i}
                index={i}
                value={responses[stepIndex][i]}
                onChange={handleInput}
                placeholder={step.placeholder}
                accent={step.accent}
              />
            ))}
          </div>

          {/* Encouragement */}
          <AnimatePresence mode="wait">
            {responses[stepIndex].some(v => v.trim()) && (
              <motion.p
                key={stepIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-center text-sm italic mb-6 ${step.accent} opacity-80`}
              >
                {encouragement}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 mt-auto">
            {stepIndex > 0 && (
              <button
                onClick={back}
                className="px-6 py-3 bg-white/10 text-white/60 rounded-full font-medium border border-white/15 hover:bg-white/15 transition-all"
              >
                Back
              </button>
            )}
            <motion.button
              whileHover={canAdvance ? { scale: 1.03 } : {}}
              whileTap={canAdvance ? { scale: 0.97 } : {}}
              onClick={advance}
              disabled={!canAdvance}
              className={`flex-1 py-3 rounded-full font-medium transition-all ${
                canAdvance
                  ? 'bg-white text-stone-800 shadow-lg hover:shadow-white/10'
                  : 'bg-white/10 text-white/25 cursor-not-allowed'
              }`}
            >
              {stepIndex === STEPS.length - 1 ? 'Finish' : 'Continue'}
            </motion.button>
          </div>

          {/* Skip */}
          <button
            onClick={advance}
            className="text-white/25 text-sm text-center mt-4 hover:text-white/40 transition-colors"
          >
            Skip this step
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
