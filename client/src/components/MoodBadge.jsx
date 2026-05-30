// MoodBadge.jsx — colored dot + number, scale from red (1) to green (10)
const getMoodColor = (score) => {
  if (score <= 2) return { dot: 'bg-red-400', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };
  if (score <= 3) return { dot: 'bg-orange-400', text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' };
  if (score <= 4) return { dot: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
  if (score <= 5) return { dot: 'bg-yellow-400', text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' };
  if (score <= 6) return { dot: 'bg-lime-400', text: 'text-lime-700', bg: 'bg-lime-50', border: 'border-lime-200' };
  if (score <= 7) return { dot: 'bg-green-400', text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' };
  if (score <= 8) return { dot: 'bg-emerald-400', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
  return { dot: 'bg-teal-400', text: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200' };
};

const moodLabel = (score) => {
  if (score <= 2) return 'Very low';
  if (score <= 4) return 'Low';
  if (score <= 6) return 'Okay';
  if (score <= 8) return 'Good';
  return 'Great';
};

export default function MoodBadge({ score, showLabel = false, size = 'md' }) {
  if (!score) return null;
  const colors = getMoodColor(score);
  const sizeClasses = size === 'sm'
    ? 'text-xs px-2 py-0.5 gap-1'
    : 'text-sm px-2.5 py-1 gap-1.5';
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${colors.bg} ${colors.border} ${colors.text} ${sizeClasses}`}
      title={`Mood: ${score}/10 — ${moodLabel(score)}`}
    >
      <span className={`rounded-full flex-shrink-0 ${colors.dot} ${dotSize}`} />
      <span>{score}</span>
      {showLabel && <span className="opacity-70">{moodLabel(score)}</span>}
    </span>
  );
}
