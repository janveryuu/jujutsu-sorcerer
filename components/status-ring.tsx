'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * Large circular progress ring used on the dashboard.
 * Shows daily mission completion %, with a level + XP center slot.
 */
export function StatusRing({
  progress,
  size = 208,
  stroke = 12,
  children,
}: {
  progress: number // 0-100
  size?: number
  stroke?: number
  children?: ReactNode
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = c * (1 - Math.max(0, Math.min(100, progress)) / 100)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Ambient pulse halo */}
      <span
        className="absolute inset-2 animate-ce-pulse rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(0,240,255,0.28), transparent 68%)',
        }}
        aria-hidden="true"
      />
      <svg width={size} height={size} className="relative -rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#15151C"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: dash }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          style={{ filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.65))' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  )
}
