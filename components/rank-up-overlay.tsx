'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CursedEnergyBg } from './cursed-energy-bg'

/**
 * Full-screen cinematic flash for rank-up moments:
 * dark vignette, radial glow burst, subtle shake, large number reveal.
 */
export function RankUpOverlay({
  open,
  gradeLabel,
  onClose,
}: {
  open: boolean
  gradeLabel: string
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-label="Rank up"
        >
          {/* Vignette */}
          <div
            className="absolute inset-0 bg-background/90"
            style={{
              background:
                'radial-gradient(circle at center, rgba(10,10,13,0.4), rgba(10,10,13,0.97))',
            }}
          />
          {/* Radial burst */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0.2, opacity: 0.9 }}
            animate={{ scale: 3.4, opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            style={{
              width: 320,
              height: 320,
              borderRadius: '9999px',
              background:
                'radial-gradient(circle, rgba(124,92,255,0.6), transparent 60%)',
            }}
          />
          <CursedEnergyBg density={40} />

          <motion.div
            className="relative flex flex-col items-center px-6 text-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: [0.9, 1.02, 1], x: [0, -4, 4, -2, 0] }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
              Rank Ascension
            </span>
            <motion.h2
              className="mt-3 font-heading text-5xl font-bold text-ce-gradient"
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              {gradeLabel}
            </motion.h2>
            <motion.p
              className="mt-4 max-w-[28ch] text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Your cursed energy has surged past its limit. A new grade is
              recognized.
            </motion.p>
            <motion.button
              onClick={onClose}
              className="mt-8 rounded-full px-6 py-2.5 text-sm font-semibold text-primary-foreground"
              style={{ background: 'linear-gradient(135deg, #7C5CFF, #4C2CFF)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Continue
            </motion.button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
