// LoadingSpinner.jsx — centered spinner with gentle copy
import { motion } from 'framer-motion';

export default function LoadingSpinner({ message = 'Taking a breath...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <motion.div
        className="relative w-12 h-12"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
      >
        {/* Outer ring */}
        <span className="absolute inset-0 rounded-full border-2 border-primary-light" />
        {/* Spinning arc */}
        <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary" />
      </motion.div>

      <motion.p
        className="text-text-secondary text-sm font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {message}
      </motion.p>
    </div>
  );
}
