// EmotionChip.jsx — reusable chip for emotion/tag display
import { X } from 'lucide-react';

const EMOTION_COLORS = {
  // Specific known emotions
  anxious: 'bg-amber-50 text-amber-700 border-amber-200',
  sad: 'bg-blue-50 text-blue-700 border-blue-200',
  happy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  angry: 'bg-red-50 text-red-700 border-red-200',
  scared: 'bg-purple-50 text-purple-700 border-purple-200',
  hopeful: 'bg-teal-50 text-teal-700 border-teal-200',
  grateful: 'bg-green-50 text-green-700 border-green-200',
  lonely: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  overwhelmed: 'bg-orange-50 text-orange-700 border-orange-200',
  calm: 'bg-sky-50 text-sky-700 border-sky-200',
};

const DEFAULT_COLOR = 'bg-surface-muted text-text-secondary border-gray-200';

export default function EmotionChip({ label, onRemove, onClick, active = false, size = 'md' }) {
  const colorClass = EMOTION_COLORS[label?.toLowerCase()] ?? DEFAULT_COLOR;
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  const activeClass = active ? 'ring-2 ring-offset-1 ring-primary/50 shadow-sm' : '';

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full border font-medium transition-all
        ${colorClass} ${sizeClass} ${activeClass}
        ${onClick ? 'cursor-pointer hover:shadow-sm hover:scale-105' : ''}
      `}
    >
      {label}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(label); }}
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 transition-colors"
          aria-label={`Remove ${label}`}
        >
          <X size={10} strokeWidth={2.5} />
        </button>
      )}
    </span>
  );
}
