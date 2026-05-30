// Journal.jsx — private, safe journaling space
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { PenLine, Search, Lock, Tag, X } from 'lucide-react';

import MoodBadge from '../components/MoodBadge';
import EmotionChip from '../components/EmotionChip';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useJournalEntries } from '../api/hooks.js';

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.25 } },
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  exit:    { opacity: 0, scale: 0.95 },
};

export default function Journal() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState(null);

  const { data: entries = [], isLoading, isError } = useJournalEntries();

  // Collect all unique tags across entries
  const allTags = useMemo(() => {
    const tagSet = new Set();
    entries.forEach((e) => {
      const tags = Array.isArray(e.tags) ? e.tags : JSON.parse(e.tags || '[]');
      tags.forEach((t) => tagSet.add(t));
    });
    return [...tagSet];
  }, [entries]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return entries.filter((e) => {
      const tags = Array.isArray(e.tags) ? e.tags : JSON.parse(e.tags || '[]');
      const matchesSearch = !q || e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q);
      const matchesTag = !activeTag || tags.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  }, [entries, search, activeTag]);

  return (
    <motion.div
      className="min-h-screen bg-gradient-soft"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Lock size={14} className="text-primary opacity-70" />
              <span className="text-xs font-medium text-primary tracking-wide uppercase">
                Private Journal
              </span>
            </div>
            <h1 className="text-3xl font-semibold text-text-primary leading-tight">
              Your Entries
            </h1>
            <p className="text-text-secondary text-sm mt-1.5">
              Your private sanctuary. Only you can read this.
            </p>
          </div>

          <button
            onClick={() => navigate('/journal/new')}
            className="flex-shrink-0 flex items-center gap-2 bg-primary text-white px-4 py-2.5
              rounded-xl font-medium shadow-soft hover:bg-primary-dark hover:shadow-glow
              hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm"
          >
            <PenLine size={16} />
            New Entry
          </button>
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your entries…"
            className="w-full pl-10 pr-10 py-2.5 bg-surface-card border border-gray-200 rounded-xl
              text-sm text-text-primary placeholder:text-text-muted
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
              transition-all shadow-soft"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveTag(null)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-medium transition-all
                ${!activeTag
                  ? 'bg-primary text-white border-primary shadow-soft'
                  : 'bg-surface-card text-text-secondary border-gray-200 hover:border-primary/40'}`}
            >
              <Tag size={11} />
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              >
                <EmotionChip
                  label={tag}
                  active={activeTag === tag}
                  size="sm"
                />
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <LoadingSpinner message="Opening your journal…" />
        ) : isError ? (
          <div className="text-center py-12 text-text-secondary">
            Couldn't load your entries right now. Please try again.
          </div>
        ) : entries.length === 0 ? (
          <EmptyState
            icon="📖"
            title="Your journal is waiting"
            message="This is your private space — no judgment, no audience. Just you and your thoughts. Write your first entry whenever you're ready."
            ctaLabel="Write your first entry"
            ctaIcon={<PenLine size={14} />}
            onCta={() => navigate('/journal/new')}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No entries found"
            message="Try a different search or clear the tag filter."
            ctaLabel="Clear filters"
            onCta={() => { setSearch(''); setActiveTag(null); }}
          />
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-3">
              {filtered.map((entry, i) => (
                <JournalCard
                  key={entry.id}
                  entry={entry}
                  index={i}
                  onClick={() => navigate(`/journal/${entry.id}`)}
                  activeTag={activeTag}
                  onTagClick={(tag) => setActiveTag(activeTag === tag ? null : tag)}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

function JournalCard({ entry, index, onClick, activeTag, onTagClick }) {
  const tags = Array.isArray(entry.tags) ? entry.tags : JSON.parse(entry.tags || '[]');
  const preview = entry.content?.slice(0, 80) + (entry.content?.length > 80 ? '…' : '');
  const dateStr = entry.created_at
    ? format(parseISO(entry.created_at), 'MMM d, yyyy')
    : '';
  const dayStr = entry.created_at
    ? format(parseISO(entry.created_at), 'EEEE')
    : '';

  return (
    <motion.article
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ delay: index * 0.04, duration: 0.25 }}
      onClick={onClick}
      className="bg-surface-card rounded-2xl border border-gray-100 shadow-soft p-5
        cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5 transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-text-primary text-base truncate group-hover:text-primary transition-colors">
            {entry.title || 'Untitled entry'}
          </h3>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {entry.mood_score && <MoodBadge score={entry.mood_score} size="sm" />}
        </div>
      </div>

      {preview && (
        <p className="text-text-secondary text-sm leading-relaxed line-clamp-2 mb-3 font-serif">
          {preview}
        </p>
      )}

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {tags.map((tag) => (
            <button key={tag} onClick={(e) => { e.stopPropagation(); onTagClick(tag); }}>
              <EmotionChip label={tag} size="sm" active={activeTag === tag} />
            </button>
          ))}
        </div>
        <time className="text-xs text-text-muted flex-shrink-0">
          {dayStr && <span className="mr-1">{dayStr},</span>}
          {dateStr}
        </time>
      </div>
    </motion.article>
  );
}
