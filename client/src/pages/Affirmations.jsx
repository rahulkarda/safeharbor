import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AFFIRMATIONS = [
  // Self-Worth
  { id: 1, text: "I am enough, exactly as I am right now.", category: "Self-Worth" },
  { id: 2, text: "My worth is not determined by my productivity.", category: "Self-Worth" },
  { id: 3, text: "I deserve kindness — especially from myself.", category: "Self-Worth" },
  { id: 4, text: "I am worthy of love without having to earn it.", category: "Self-Worth" },
  { id: 5, text: "My feelings are valid, always.", category: "Self-Worth" },
  { id: 6, text: "I am whole. I don't need to be fixed.", category: "Self-Worth" },
  { id: 7, text: "My past does not define who I am today.", category: "Self-Worth" },
  { id: 8, text: "I honor my needs without apology.", category: "Self-Worth" },

  // Strength
  { id: 9, text: "I have survived every hard day so far.", category: "Strength" },
  { id: 10, text: "I am stronger than what I'm going through.", category: "Strength" },
  { id: 11, text: "Asking for help is one of the bravest things I can do.", category: "Strength" },
  { id: 12, text: "I can do difficult things, one breath at a time.", category: "Strength" },
  { id: 13, text: "My resilience grows every time I keep going.", category: "Strength" },
  { id: 14, text: "I choose courage over comfort today.", category: "Strength" },
  { id: 15, text: "I am not my anxiety. I am bigger than it.", category: "Strength" },
  { id: 16, text: "Every step forward matters, no matter how small.", category: "Strength" },

  // Healing
  { id: 17, text: "Healing is not linear, and that's okay.", category: "Healing" },
  { id: 18, text: "I give myself permission to rest.", category: "Healing" },
  { id: 19, text: "I am allowed to take up space in this world.", category: "Healing" },
  { id: 20, text: "I release what I cannot control with gentle hands.", category: "Healing" },
  { id: 21, text: "Today I choose to be gentle with myself.", category: "Healing" },
  { id: 22, text: "I am in the process of becoming.", category: "Healing" },
  { id: 23, text: "My body is doing its best, and I am grateful.", category: "Healing" },
  { id: 24, text: "Every day I am finding my way back to myself.", category: "Healing" },

  // Hope
  { id: 25, text: "This moment will pass. Easier times are ahead.", category: "Hope" },
  { id: 26, text: "I have more good days ahead of me than behind.", category: "Hope" },
  { id: 27, text: "Things can change. Things do change.", category: "Hope" },
  { id: 28, text: "I am open to joy finding me today.", category: "Hope" },
  { id: 29, text: "There is still beauty waiting for me.", category: "Hope" },
  { id: 30, text: "My story isn't over. The best chapters may still come.", category: "Hope" },
  { id: 31, text: "I trust that I will find my way through this.", category: "Hope" },
  { id: 32, text: "Hope is always available to me, even in small doses.", category: "Hope" },

  // Mindfulness
  { id: 33, text: "Right now, in this moment, I am okay.", category: "Mindfulness" },
  { id: 34, text: "I breathe in calm. I breathe out tension.", category: "Mindfulness" },
  { id: 35, text: "The present moment is where I find peace.", category: "Mindfulness" },
  { id: 36, text: "I don't have to solve everything today.", category: "Mindfulness" },
  { id: 37, text: "I choose to notice the small beautiful things.", category: "Mindfulness" },
  { id: 38, text: "My breath is an anchor I always carry with me.", category: "Mindfulness" },
  { id: 39, text: "I am here. I am present. That is enough.", category: "Mindfulness" },
  { id: 40, text: "Thoughts are clouds — I watch them pass.", category: "Mindfulness" },
];

const CATEGORIES = ['All', 'Self-Worth', 'Strength', 'Healing', 'Hope', 'Mindfulness'];

const CARD_GRADIENTS = [
  'from-rose-800 via-pink-900 to-purple-950',
  'from-indigo-800 via-blue-900 to-slate-950',
  'from-teal-800 via-emerald-900 to-slate-950',
  'from-amber-800 via-orange-900 to-slate-950',
  'from-purple-800 via-violet-900 to-indigo-950',
  'from-cyan-800 via-sky-900 to-slate-950',
  'from-fuchsia-800 via-pink-900 to-slate-950',
  'from-emerald-800 via-teal-900 to-cyan-950',
];

const STORAGE_KEY = 'safeharbor_fav_affirmations';

function getGradient(index) {
  return CARD_GRADIENTS[index % CARD_GRADIENTS.length];
}

function getDailyAffirmation() {
  const dayOfYear = Math.floor(
    (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  return AFFIRMATIONS[dayOfYear % AFFIRMATIONS.length];
}

function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function AffirmationCard({ affirmation, index, isFavorite, onToggleFav, large = false }) {
  const gradient = getGradient(affirmation.id);
  return (
    <div className={`relative bg-gradient-to-br ${gradient} rounded-3xl overflow-hidden border border-white/10 ${large ? 'p-10' : 'p-6'}`}>
      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 60%)',
        }}
      />
      <div className="relative">
        <span className="inline-block text-xs uppercase tracking-widest text-white/40 mb-4 font-medium">
          {affirmation.category}
        </span>
        <p className={`text-white font-light leading-relaxed ${large ? 'text-2xl mb-6' : 'text-base mb-4'}`}>
          "{affirmation.text}"
        </p>
        <button
          onClick={() => onToggleFav(affirmation.id)}
          className={`transition-all duration-200 ${isFavorite ? 'text-rose-400' : 'text-white/25 hover:text-white/50'}`}
        >
          <HeartIcon filled={isFavorite} />
        </button>
      </div>
    </div>
  );
}

export default function Affirmations() {
  const daily = getDailyAffirmation();
  const [currentIdx, setCurrentIdx] = useState(AFFIRMATIONS.findIndex(a => a.id === daily.id));
  const [category, setCategory] = useState('All');
  const [gridPage, setGridPage] = useState(0);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  });
  const [direction, setDirection] = useState(1);

  const currentAffirmation = AFFIRMATIONS[currentIdx];

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)); }
    catch {}
  }, [favorites]);

  const toggleFav = id => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const goNext = () => {
    setDirection(1);
    setCurrentIdx(i => (i + 1) % AFFIRMATIONS.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrentIdx(i => (i - 1 + AFFIRMATIONS.length) % AFFIRMATIONS.length);
  };

  const filtered = category === 'All'
    ? AFFIRMATIONS
    : AFFIRMATIONS.filter(a => a.category === category);

  const gridItems = filtered.slice(gridPage * 6, gridPage * 6 + 6);
  const totalPages = Math.ceil(filtered.length / 6);

  const handleCategoryChange = cat => {
    setCategory(cat);
    setGridPage(0);
  };

  const slideVariants = {
    enter: dir => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: dir => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-extralight text-white tracking-wider mb-2">Affirmations</h1>
          <p className="text-white/40 text-sm">Words that remind you of who you truly are</p>
        </motion.div>

        {/* Today's Affirmation - Daily Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <p className="text-white/30 text-xs uppercase tracking-widest text-center mb-3">Today's affirmation</p>
          <div className="relative">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={currentIdx}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <AffirmationCard
                  affirmation={currentAffirmation}
                  index={currentIdx}
                  isFavorite={favorites.includes(currentAffirmation.id)}
                  onToggleFav={toggleFav}
                  large
                />
              </motion.div>
            </AnimatePresence>

            {/* Nav arrows */}
            <button
              onClick={goPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white/60 hover:bg-white/20 hover:text-white transition-all flex items-center justify-center shadow-lg"
            >
              ‹
            </button>
            <button
              onClick={goNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white/60 hover:bg-white/20 hover:text-white transition-all flex items-center justify-center shadow-lg"
            >
              ›
            </button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-1.5 mt-5">
            {Array.from({ length: Math.min(AFFIRMATIONS.length, 10) }).map((_, i) => {
              const dotIdx = Math.floor((currentIdx / AFFIRMATIONS.length) * 10);
              return (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === dotIdx ? 'w-4 h-1.5 bg-white/70' : 'w-1.5 h-1.5 bg-white/20'
                  }`}
                />
              );
            })}
          </div>
        </motion.div>

        {/* Category Filter Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 justify-center my-8"
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                category === cat
                  ? 'bg-white text-slate-800 border-transparent shadow-lg'
                  : 'bg-white/8 text-white/60 border-white/15 hover:bg-white/15 hover:text-white/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Favorites section */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mb-8"
          >
            <h3 className="text-white/40 text-xs uppercase tracking-widest mb-4 text-center">
              Your saved favorites ({favorites.length})
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {AFFIRMATIONS.filter(a => favorites.includes(a.id)).slice(0, 3).map((a, i) => (
                <AffirmationCard
                  key={a.id}
                  affirmation={a}
                  index={i}
                  isFavorite
                  onToggleFav={toggleFav}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* More Affirmations Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/50 text-xs uppercase tracking-widest">
              More affirmations
              {category !== 'All' && <span className="text-white/30 ml-2">— {category}</span>}
            </h3>
            {filtered.length === 0 && (
              <span className="text-white/25 text-xs">None in this category yet</span>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${category}-${gridPage}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 gap-4"
            >
              {gridItems.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <AffirmationCard
                    affirmation={a}
                    index={i}
                    isFavorite={favorites.includes(a.id)}
                    onToggleFav={toggleFav}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setGridPage(p => Math.max(0, p - 1))}
                disabled={gridPage === 0}
                className="px-5 py-2 rounded-full bg-white/8 text-white/50 border border-white/15 hover:bg-white/15 disabled:opacity-20 transition-all text-sm"
              >
                Previous
              </button>
              <span className="text-white/30 text-sm">
                {gridPage + 1} / {totalPages}
              </span>
              <button
                onClick={() => setGridPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={gridPage >= totalPages - 1}
                className="px-5 py-2 rounded-full bg-white/8 text-white/50 border border-white/15 hover:bg-white/15 disabled:opacity-20 transition-all text-sm"
              >
                Next
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
