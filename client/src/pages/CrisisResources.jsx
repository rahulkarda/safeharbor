// CrisisResources.jsx — gentle but urgent crisis support page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, MessageSquare, ExternalLink, ChevronDown, ChevronUp,
  Wind, Anchor, PenLine, Heart, Shield, AlertTriangle, Clock,
} from 'lucide-react';

import LoadingSpinner from '../components/LoadingSpinner';
import { useCrisisContacts } from '../api/hooks.js';

// ─── Category definitions ─────────────────────────────────────────────────
const CATEGORIES = [
  { key: 'all',       label: 'All' },
  { key: 'suicide',   label: 'Suicide & Crisis' },
  { key: 'substance-use', label: 'Substance Use' },
  { key: 'veterans',  label: 'Veterans' },
  { key: 'lgbtq',     label: 'LGBTQ+' },
  { key: 'children',  label: 'Children' },
  { key: 'mental-health', label: 'Mental Health' },
];

// ─── Coping skills ────────────────────────────────────────────────────────
const COPING_SKILLS = [
  {
    id: 'cold-water',
    title: 'Cold water technique',
    emoji: '🧊',
    content: `When emotions feel overwhelming, your body has a built-in emergency calm switch — the dive reflex.

Hold an ice cube in your hand, or splash cold water on your face and wrists. The cold temperature triggers your body's dive response, rapidly slowing your heart rate and activating your parasympathetic nervous system.

You don't have to think through it. Just feel the cold. Let your body do the rest. Hold the sensation for 15–30 seconds and notice how your nervous system begins to settle.`,
  },
  {
    id: 'tipp',
    title: 'TIPP skills',
    emoji: '⚡',
    content: `TIPP stands for Temperature, Intense exercise, Paced breathing, and Paired muscle relaxation — four fast-acting tools from DBT.

**Temperature:** Cold water on your face, holding ice, or a cool shower.

**Intense exercise:** Sprint in place, do jumping jacks, or squeeze a pillow as hard as you can for 30 seconds. Burning off adrenaline physically shifts your emotional state.

**Paced breathing:** Breathe in for 4 counts, hold for 1, exhale for 6 counts. A longer out-breath activates your rest-and-digest system.

**Paired muscle relaxation:** Tense a muscle group tightly as you breathe in, then completely release it as you breathe out. Work through your whole body.`,
  },
  {
    id: 'safe-place',
    title: 'Safe place visualization',
    emoji: '🌿',
    content: `Find a comfortable position. If it feels okay, gently close your eyes or soften your gaze.

Picture a place where you have felt safe and at peace — real or imagined. It might be a quiet forest, a beach, your childhood bedroom, or somewhere completely made up.

Notice the details. What do you see around you? What sounds are there? What does the air smell like? Is it warm or cool? Feel the ground beneath you.

Let yourself be fully there. No one else has to be in this place. It is completely yours. Stay as long as you need.

When you're ready, take three slow breaths and gently bring your attention back to the room.`,
  },
  {
    id: 'urge-surfing',
    title: 'Urge surfing',
    emoji: '🌊',
    content: `Urges — whether to hurt yourself, use substances, or act impulsively — feel like they will last forever. They won't.

Research shows that most urges peak within 20–30 minutes and then begin to fade on their own, even if you don't act on them.

Urge surfing means watching the wave instead of being swept under it.

Sit with the urge. Notice where you feel it in your body — tightness in your chest, tension in your hands, restlessness in your legs. Name what you observe: "I notice a strong pulling sensation. I notice urgency."

You don't have to like the feeling. You just have to let it move through without acting on it. Ride the wave to its crest, then watch it begin to recede.

You've done this before. Every urge you've ever had eventually passed.`,
  },
  {
    id: 'reaching-out',
    title: "Reaching out when you can't speak",
    emoji: '💬',
    content: `Sometimes picking up the phone feels impossible — that's completely understandable.

**Texting is just as valid.** Crisis Text Line is available 24/7: text HOME to 741741. You can work through whatever you're facing entirely by text.

**Chat options.** The 988 Lifeline offers online chat at 988lifeline.org. The Trevor Project has TrevorChat for LGBTQ+ youth.

**If you need to call but words feel hard,** you can stay silent. Crisis counselors are trained to sit with you quietly. Some lines will also wait with you without needing you to explain.

You don't have to have the right words. You don't have to know what to say. Reaching out — in any form — is enough.`,
  },
];

// ─── Page transitions ──────────────────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
};

// ─── Main component ────────────────────────────────────────────────────────
export default function CrisisResources() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [openCoping, setOpenCoping] = useState(null);

  const { data: contacts = [], isLoading } = useCrisisContacts();

  const filteredContacts = contacts.filter((c) => {
    if (activeCategory === 'all') return true;
    const cats = Array.isArray(c.categories) ? c.categories : JSON.parse(c.categories || '[]');
    return cats.some((cat) =>
      cat.toLowerCase().includes(activeCategory.toLowerCase()) ||
      activeCategory.toLowerCase().includes(cat.toLowerCase())
    );
  });

  return (
    <motion.div
      className="min-h-screen bg-gradient-soft"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* ── Hero banner ─────────────────────────────────────────────────── */}
      <div className="bg-rose-50 border-b border-rose-100">
        <div className="max-w-3xl mx-auto px-4 py-6 text-center">
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-3"
          >
            <Heart size={22} className="text-rose-400" strokeWidth={1.5} />
          </motion.div>
          <h1 className="text-2xl font-semibold text-rose-700 mb-1">
            You matter. Help is available right now.
          </h1>
          <p className="text-rose-500 text-sm">
            You don't have to go through this alone.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">

        {/* ── Emergency notice ─────────────────────────────────────────── */}
        <div className="flex items-start gap-3 bg-white border border-rose-200 rounded-2xl px-5 py-4 shadow-soft">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle size={15} className="text-rose-500" />
          </div>
          <div>
            <p className="font-semibold text-text-primary text-sm mb-0.5">
              If you're in immediate danger
            </p>
            <p className="text-text-secondary text-sm leading-relaxed">
              Please call <a href="tel:911" className="font-bold text-rose-600 hover:underline">911</a> or
              go to your nearest emergency room right now.
              You deserve immediate care.
            </p>
          </div>
        </div>

        {/* ── Crisis contacts ───────────────────────────────────────────── */}
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Phone size={17} className="text-primary" />
            Crisis lines &amp; support
          </h2>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all
                  ${activeCategory === cat.key
                    ? 'bg-primary text-white border-primary shadow-soft'
                    : 'bg-white text-text-secondary border-gray-200 hover:border-primary/40 hover:bg-primary-light'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <LoadingSpinner message="Finding support near you…" />
          ) : (
            <div className="space-y-3">
              {filteredContacts.length === 0 ? (
                <p className="text-text-muted text-sm text-center py-6">
                  No contacts match this filter. Try "All" to see everything.
                </p>
              ) : (
                filteredContacts.map((contact, i) => (
                  <CrisisCard key={contact.id} contact={contact} index={i} />
                ))
              )}
            </div>
          )}
        </section>

        {/* ── While you wait ────────────────────────────────────────────── */}
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
            <Clock size={17} className="text-calm" />
            While you wait for help to connect…
          </h2>
          <p className="text-text-secondary text-sm mb-4">
            These take less than a minute and can help you feel just a little steadier right now.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <QuickActionCard
              icon={<Wind size={20} className="text-primary" />}
              label="Breathing exercise"
              description="A gentle guided breath cycle to calm your nervous system"
              color="bg-primary-light"
              onClick={() => navigate('/breathe')}
            />
            <QuickActionCard
              icon={<Anchor size={20} className="text-calm" />}
              label="Grounding exercise"
              description="5-4-3-2-1 technique to bring you back to the present"
              color="bg-calm-light"
              onClick={() => navigate('/ground')}
            />
            <QuickActionCard
              icon={<PenLine size={20} className="text-accent" />}
              label="Write in journal"
              description="Get the thoughts out of your head and onto the page"
              color="bg-accent-light"
              onClick={() => navigate('/journal/new')}
            />
          </div>
        </section>

        {/* ── Coping skills ─────────────────────────────────────────────── */}
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
            <Shield size={17} className="text-primary" />
            Coping skills for right now
          </h2>
          <p className="text-text-secondary text-sm mb-4">
            Evidence-based tools you can use this very moment, wherever you are.
          </p>
          <div className="space-y-2">
            {COPING_SKILLS.map((skill) => (
              <CopingAccordion
                key={skill.id}
                skill={skill}
                isOpen={openCoping === skill.id}
                onToggle={() => setOpenCoping(openCoping === skill.id ? null : skill.id)}
              />
            ))}
          </div>
        </section>

        {/* ── Closing message ───────────────────────────────────────────── */}
        <div className="text-center py-8 px-6">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-3xl mb-4"
          >
            🌅
          </motion.div>
          <p className="text-text-secondary text-base leading-relaxed font-serif max-w-sm mx-auto">
            You've survived every hard day so far.
          </p>
          <p className="text-text-muted text-sm mt-2 max-w-xs mx-auto">
            This one too.
          </p>
        </div>

      </div>
    </motion.div>
  );
}

// ─── Crisis contact card ──────────────────────────────────────────────────
function CrisisCard({ contact, index }) {
  const [expanded, setExpanded] = useState(false);
  const cats = Array.isArray(contact.categories)
    ? contact.categories
    : JSON.parse(contact.categories || '[]');

  const isTextLine = contact.phone?.toLowerCase().includes('text') || contact.phone?.toLowerCase().includes('741741');
  const PhoneIcon = isTextLine ? MessageSquare : Phone;
  const phoneHref = isTextLine ? null : `tel:${contact.phone?.replace(/[^0-9+]/g, '')}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden"
    >
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-primary text-base leading-snug">
              {contact.name}
            </h3>
            {/* Phone — large, tappable */}
            {phoneHref ? (
              <a
                href={phoneHref}
                className="inline-flex items-center gap-1.5 text-primary font-semibold text-lg
                  hover:text-primary-dark transition-colors mt-1"
              >
                <PhoneIcon size={15} />
                {contact.phone}
              </a>
            ) : (
              <div className="flex items-center gap-1.5 text-primary font-semibold text-base mt-1">
                <PhoneIcon size={14} />
                <span>{contact.phone}</span>
              </div>
            )}
          </div>
          {/* Hours badge */}
          {contact.available_hours && (
            <span className="flex-shrink-0 text-xs px-2.5 py-1 rounded-full
              bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              {contact.available_hours}
            </span>
          )}
        </div>

        {/* Description */}
        {contact.description && (
          <p className="text-text-secondary text-sm leading-relaxed mb-3">
            {contact.description}
          </p>
        )}

        {/* Categories */}
        {cats.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {cats.map((cat) => (
              <span
                key={cat}
                className="text-xs px-2 py-0.5 rounded-full bg-primary-light
                  text-primary border border-primary/20 font-medium capitalize"
              >
                {cat.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {phoneHref ? (
            <a
              href={phoneHref}
              className="flex items-center gap-1.5 bg-primary text-white text-sm font-medium
                px-4 py-2 rounded-xl hover:bg-primary-dark transition-all shadow-soft
                hover:shadow-glow"
            >
              <Phone size={13} />
              Call now
            </a>
          ) : (
            <span
              className="flex items-center gap-1.5 bg-primary text-white text-sm font-medium
                px-4 py-2 rounded-xl"
            >
              <MessageSquare size={13} />
              Text now
            </span>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-sm font-medium text-text-secondary
              px-4 py-2 rounded-xl border border-gray-200 hover:bg-surface-muted transition-colors"
          >
            <ExternalLink size={12} />
            Learn more
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>

        {/* Expandable extra info */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-text-secondary text-sm leading-relaxed">
                  {contact.description}
                </p>
                <p className="text-text-muted text-xs mt-2">
                  Available: {contact.available_hours || 'Check website for hours'} · US-based service
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Quick action card ────────────────────────────────────────────────────
function QuickActionCard({ icon, label, description, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`${color} rounded-2xl p-4 text-left border border-white/60
        hover:shadow-card hover:-translate-y-0.5 active:translate-y-0
        transition-all w-full`}
    >
      <div className="mb-2">{icon}</div>
      <div className="font-semibold text-text-primary text-sm mb-1">{label}</div>
      <div className="text-text-secondary text-xs leading-relaxed">{description}</div>
    </button>
  );
}

// ─── Coping skills accordion ──────────────────────────────────────────────
function CopingAccordion({ skill, isOpen, onToggle }) {
  // Format basic markdown-like bold for content display
  const formatContent = (text) => {
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <div key={i} className="h-2" />;
      // Bold text surrounded by **
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className="text-text-secondary text-sm leading-relaxed">
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j} className="text-text-primary font-semibold">{part}</strong> : part
          )}
        </p>
      );
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left
          hover:bg-surface-muted transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{skill.emoji}</span>
          <span className="font-medium text-text-primary text-sm">{skill.title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-text-muted" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-gray-50 space-y-1">
              {formatContent(skill.content)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
