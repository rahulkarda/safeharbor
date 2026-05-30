// JournalEntry.jsx — full-screen journal entry editor
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import {
  ArrowLeft, Save, Trash2, Lightbulb, ChevronDown, ChevronUp,
  Check, Loader2, X, Tag,
} from 'lucide-react';

import MoodBadge from '../components/MoodBadge';
import EmotionChip from '../components/EmotionChip';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  useJournalEntry,
  useCreateJournalEntry,
  useUpdateJournalEntry,
  useDeleteJournalEntry,
} from '../api/hooks.js';

// ─── Journaling prompts ────────────────────────────────────────────────────
const PROMPTS = [
  "What am I feeling right now, and where do I feel it in my body?",
  "What do I need most in this moment?",
  "What would I say to a dear friend going through this?",
  "What am I grateful for today, even something tiny?",
  "What was challenging today, and what did I learn from it?",
];

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
};

// ─── Main component ────────────────────────────────────────────────────────
export default function JournalEntry() {
  const { id } = useParams();          // 'new' or an entry id
  const isNew = !id || id === 'new';
  const navigate = useNavigate();

  const [title, setTitle]           = useState('');
  const [content, setContent]       = useState('');
  const [moodScore, setMoodScore]   = useState(null);
  const [tags, setTags]             = useState([]);
  const [tagInput, setTagInput]     = useState('');
  const [promptsOpen, setPromptsOpen] = useState(false);
  const [saveState, setSaveState]   = useState('idle'); // idle | saving | saved | error
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isDirty, setIsDirty]       = useState(false);

  const savedContentRef = useRef('');
  const autoSaveTimer   = useRef(null);

  // ── Load existing entry ──────────────────────────────────────────────────
  const { data: existingEntry, isLoading } = useJournalEntry(
    isNew ? null : id,
  );

  // Populate form from fetched data
  useEffect(() => {
    if (existingEntry && !isNew) {
      setTitle(existingEntry.title || '');
      setContent(existingEntry.content || '');
      setMoodScore(existingEntry.mood_score ?? null);
      const t = Array.isArray(existingEntry.tags)
        ? existingEntry.tags
        : JSON.parse(existingEntry.tags || '[]');
      setTags(t);
      savedContentRef.current = existingEntry.content || '';
    }
  }, [existingEntry, isNew]);

  // ── Mutations ────────────────────────────────────────────────────────────
  const createMut = useCreateJournalEntry();
  const updateMut = useUpdateJournalEntry(id);
  const deleteMut = useDeleteJournalEntry();

  const isSaving = createMut.isPending || updateMut.isPending;

  // Handle create success — redirect to the new entry's page
  useEffect(() => {
    if (createMut.isSuccess && createMut.data) {
      navigate(`/journal/${createMut.data.id}`, { replace: true });
      setSaveState('saved');
      setIsDirty(false);
    }
  }, [createMut.isSuccess, createMut.data, navigate]);

  // Handle update success
  useEffect(() => {
    if (updateMut.isSuccess) {
      setSaveState('saved');
      setIsDirty(false);
      savedContentRef.current = content;
    }
  }, [updateMut.isSuccess, content]);

  // Handle mutation errors
  useEffect(() => {
    if (createMut.isError || updateMut.isError) setSaveState('error');
  }, [createMut.isError, updateMut.isError]);

  // Handle delete success
  useEffect(() => {
    if (deleteMut.isSuccess) navigate('/journal', { replace: true });
  }, [deleteMut.isSuccess, navigate]);

  // ── Save handler ─────────────────────────────────────────────────────────
  const doSave = useCallback(() => {
    if (!title && !content) return;
    setSaveState('saving');
    const payload = {
      title: title.trim() || 'Untitled',
      content,
      mood_score: moodScore,
      tags,
    };
    if (isNew) {
      createMut.mutate(payload);
    } else {
      updateMut.mutate(payload);
    }
  }, [isNew, title, content, moodScore, tags, createMut, updateMut]);

  // ── Auto-save every 30 s if content changed ──────────────────────────────
  useEffect(() => {
    if (!isDirty) return;
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      if (content !== savedContentRef.current) doSave();
    }, 30_000);
    return () => clearTimeout(autoSaveTimer.current);
  }, [content, isDirty, doSave]);

  // ── Auto-hide "saved" indicator ──────────────────────────────────────────
  useEffect(() => {
    if (saveState === 'saved') {
      const t = setTimeout(() => setSaveState('idle'), 2500);
      return () => clearTimeout(t);
    }
  }, [saveState]);

  // ── Cleanup ──────────────────────────────────────────────────────────────
  useEffect(() => () => clearTimeout(autoSaveTimer.current), []);

  // ── Field change helpers ──────────────────────────────────────────────────
  const handleContentChange = (val) => { setContent(val); setIsDirty(true); };
  const handleTitleChange   = (val) => { setTitle(val);   setIsDirty(true); };

  // ── Tag input ────────────────────────────────────────────────────────────
  const handleTagKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase().replace(/,/g, '');
      if (newTag && !tags.includes(newTag)) {
        setTags((prev) => [...prev, newTag]);
        setIsDirty(true);
      }
      setTagInput('');
    }
    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
      setIsDirty(true);
    }
  };

  const removeTag = (tag) => {
    setTags((prev) => prev.filter((t) => t !== tag));
    setIsDirty(true);
  };

  // ── Prompt insertion ─────────────────────────────────────────────────────
  const insertPrompt = (prompt) => {
    const prefix = content.trim() ? `${content.trim()}\n\n` : '';
    handleContentChange(`${prefix}${prompt}\n`);
    setPromptsOpen(false);
  };

  if (!isNew && isLoading) {
    return <LoadingSpinner message="Opening your entry…" />;
  }

  const createdDate = existingEntry?.created_at
    ? format(parseISO(existingEntry.created_at), "EEEE, MMMM d, yyyy 'at' h:mm a")
    : null;

  return (
    <motion.div
      className="min-h-screen bg-gradient-soft"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <button
            onClick={() => navigate('/journal')}
            className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Journal
          </button>

          <div className="flex items-center gap-2">
            {/* Save state indicator */}
            <AnimatePresence mode="wait">
              {(saveState === 'saving' || isSaving) && (
                <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Loader2 size={12} className="animate-spin" />
                  Saving…
                </motion.span>
              )}
              {saveState === 'saved' && !isSaving && (
                <motion.span key="saved" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs text-emerald-600">
                  <Check size={12} />
                  Saved
                </motion.span>
              )}
              {saveState === 'error' && (
                <motion.span key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-xs text-red-500">
                  Couldn't save
                </motion.span>
              )}
            </AnimatePresence>

            {/* Delete button for existing entries */}
            {!isNew && (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="p-2 text-text-muted hover:text-danger hover:bg-danger-light rounded-lg transition-all"
                title="Delete entry"
              >
                <Trash2 size={15} />
              </button>
            )}

            {/* Save button */}
            <button
              onClick={doSave}
              disabled={isSaving || (!title && !content)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium
                hover:bg-primary-dark transition-all shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={14} />
              {isNew ? 'Save entry' : 'Save changes'}
            </button>
          </div>
        </div>

        {/* Created date for existing entries */}
        {createdDate && (
          <p className="text-xs text-text-muted mb-5 text-center">
            Written {createdDate}
          </p>
        )}

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Give this entry a title…"
          className="w-full text-2xl font-semibold text-text-primary placeholder:text-text-muted
            bg-transparent border-none outline-none mb-6 leading-snug"
        />

        {/* Mood score */}
        <div className="bg-surface-card rounded-2xl border border-gray-100 shadow-soft p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-text-secondary">
              Mood right now
            </label>
            <div className="flex items-center gap-2">
              {moodScore && <MoodBadge score={moodScore} showLabel size="sm" />}
              {moodScore && (
                <button
                  onClick={() => { setMoodScore(null); setIsDirty(true); }}
                  className="text-text-muted hover:text-text-secondary"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={moodScore ?? 5}
            onChange={(e) => { setMoodScore(Number(e.target.value)); setIsDirty(true); }}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary"
            style={{
              background: moodScore
                ? `linear-gradient(to right, #4A9B8F ${(moodScore - 1) * 11.1}%, #E8F5F3 ${(moodScore - 1) * 11.1}%)`
                : '#E8F5F3',
            }}
          />

          <div className="flex justify-between mt-1.5 text-2xs text-text-muted select-none">
            <span>1 · Terrible</span>
            <span>5 · Okay</span>
            <span>10 · Amazing</span>
          </div>
        </div>

        {/* Tags input */}
        <div className="bg-surface-card rounded-2xl border border-gray-100 shadow-soft p-4 mb-4">
          <div className="flex items-center gap-2 mb-2.5">
            <Tag size={13} className="text-text-muted" />
            <span className="text-sm font-medium text-text-secondary">Tags</span>
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            {tags.map((tag) => (
              <EmotionChip key={tag} label={tag} onRemove={removeTag} />
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder={tags.length === 0 ? "Type a tag and press Enter…" : "Add another…"}
              className="flex-1 min-w-[140px] text-sm bg-transparent outline-none text-text-primary
                placeholder:text-text-muted"
            />
          </div>
        </div>

        {/* Journaling prompts */}
        <div className="mb-4">
          <button
            onClick={() => setPromptsOpen((v) => !v)}
            className="flex items-center gap-2 text-sm font-medium text-text-secondary
              hover:text-primary transition-colors"
          >
            <Lightbulb size={14} className="text-accent" />
            Need a prompt to get started?
            {promptsOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          <AnimatePresence>
            {promptsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-2">
                  {PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => insertPrompt(prompt)}
                      className="w-full text-left text-sm text-text-secondary bg-surface-card
                        border border-gray-100 rounded-xl px-4 py-3
                        hover:border-primary/40 hover:bg-primary-light hover:text-primary
                        transition-all leading-relaxed shadow-soft"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content textarea */}
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Write freely here. There's no right or wrong way to do this…"
          rows={18}
          className="w-full bg-surface-card border border-gray-100 rounded-2xl shadow-soft
            p-5 text-base font-serif text-text-primary leading-8
            placeholder:text-text-muted placeholder:font-sans
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
            transition-all resize-none"
        />

        {/* Bottom action bar */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => navigate('/journal')}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            ← Back to journal
          </button>
          <button
            onClick={doSave}
            disabled={isSaving || (!title && !content)}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm
              font-medium hover:bg-primary-dark transition-all shadow-soft hover:shadow-glow
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={14} />
            {isNew ? 'Save entry' : 'Save changes'}
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end sm:items-center
              justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteConfirm(false)}
          >
            <motion.div
              className="bg-surface-card rounded-3xl shadow-card p-6 w-full max-w-sm"
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-5">
                <div className="w-12 h-12 rounded-full bg-danger-light flex items-center justify-center mx-auto mb-3">
                  <Trash2 size={20} className="text-danger" />
                </div>
                <h3 className="font-semibold text-text-primary mb-1">Delete this entry?</h3>
                <p className="text-sm text-text-secondary">
                  This can't be undone. Your words will be gone permanently.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium
                    text-text-secondary hover:bg-surface-muted transition-colors"
                >
                  Keep it
                </button>
                <button
                  onClick={() => deleteMut.mutate(id)}
                  disabled={deleteMut.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-danger text-white text-sm font-medium
                    hover:bg-red-600 transition-colors disabled:opacity-60"
                >
                  {deleteMut.isPending ? 'Deleting…' : 'Yes, delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
