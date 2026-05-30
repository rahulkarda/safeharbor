// EmptyState.jsx — reusable empty state with icon, title, message, optional CTA
import { motion } from 'framer-motion';

export default function EmptyState({
  icon,
  title,
  message,
  ctaLabel,
  onCta,
  ctaIcon,
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Icon slot */}
      {icon && (
        <motion.div
          className="w-20 h-20 rounded-full bg-gradient-soft flex items-center justify-center mb-5 shadow-soft"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-4xl">{icon}</span>
        </motion.div>
      )}

      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>

      {message && (
        <p className="text-text-secondary text-sm max-w-xs leading-relaxed mb-6">
          {message}
        </p>
      )}

      {ctaLabel && onCta && (
        <button
          onClick={onCta}
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5
            rounded-xl font-medium hover:bg-primary-dark transition-all shadow-soft
            hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0"
        >
          {ctaIcon && <span>{ctaIcon}</span>}
          {ctaLabel}
        </button>
      )}
    </motion.div>
  );
}
