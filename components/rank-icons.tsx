/**
 * Rank Insignia Icons — Jujutsu Fitness App
 *
 * Three thin-stroke seal icons representing ascending sorcerer experience tiers.
 * Design language: circular talisman seals that grow in complexity.
 * Each tier visually escalates: one seal → two overlapping → three interlocking.
 * Stroke: 1.8–2px, monochrome (adapts to color prop), no fills.
 */

import React from 'react'

interface RankIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
}

/* ──────────────────────────────────────────────────────────────────────────
   TIER 1 — Grade 4 (Dormant / Lowest)
   One circular talisman seal with a single notch cut and an inner sigil mark.
   Reads as: latent, contained, just beginning to stir.
   ────────────────────────────────────────────────────────────────────────── */
export function Grade4SealIcon({ size = 24, color = 'currentColor', ...props }: RankIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Outer seal ring with a break/notch at the top */}
      <path
        d="M50 14 A36 36 0 1 1 50 86 A36 36 0 1 1 50 14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="198 12"
        strokeDashoffset="-6"
      />
      {/* Inner tick mark — single line sigil, like a resting mark */}
      <line x1="50" y1="32" x2="50" y2="68" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      {/* Small horizontal crossbar — forming a talisman mark */}
      <line x1="38" y1="50" x2="62" y2="50" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      {/* Top notch termination dots */}
      <circle cx="50" cy="14" r="2" fill={color} />
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   TIER 2 — Grade 2 (Awakened / Mid)
   Two overlapping circular seals offset diagonally, forming a lens emblem.
   Inner overlap creates a shared eye-shaped space — a Jujutsu binding sigil.
   ────────────────────────────────────────────────────────────────────────── */
export function Grade2SealIcon({ size = 24, color = 'currentColor', ...props }: RankIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Left seal ring */}
      <circle cx="40" cy="50" r="26" stroke={color} strokeWidth="1.8" />
      {/* Right seal ring */}
      <circle cx="60" cy="50" r="26" stroke={color} strokeWidth="1.8" />
      {/* Inner horizontal binding bar — sealing the two seals together */}
      <line x1="40" y1="50" x2="60" y2="50" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      {/* Left inner sigil dot */}
      <circle cx="40" cy="50" r="3" fill={color} />
      {/* Right inner sigil dot */}
      <circle cx="60" cy="50" r="3" fill={color} />
      {/* Top node — convergence point */}
      <circle cx="50" cy="26" r="2" fill={color} />
      {/* Bottom node */}
      <circle cx="50" cy="74" r="2" fill={color} />
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   TIER 3 — Grade 1 (Refined / Highest)
   Three interlocking talisman seals arranged in a triangular formation.
   The overlapping creates a central void — suggesting Domain Expansion.
   Still readable at small sizes due to clear geometric structure.
   ────────────────────────────────────────────────────────────────────────── */
export function Grade1SealIcon({ size = 24, color = 'currentColor', ...props }: RankIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Top seal */}
      <circle cx="50" cy="36" r="22" stroke={color} strokeWidth="1.8" />
      {/* Bottom-left seal */}
      <circle cx="34" cy="64" r="22" stroke={color} strokeWidth="1.8" />
      {/* Bottom-right seal */}
      <circle cx="66" cy="64" r="22" stroke={color} strokeWidth="1.8" />

      {/* Triangle binding frame connecting the three seal centers */}
      <polygon
        points="50,36 34,64 66,64"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* Center convergence sigil — small circle at centroid */}
      <circle cx="50" cy="55" r="4.5" stroke={color} strokeWidth="1.6" />
      {/* Central dot — the eye of the domain */}
      <circle cx="50" cy="55" r="1.8" fill={color} />

      {/* Corner seal nodes */}
      <circle cx="50" cy="36" r="2.5" fill={color} />
      <circle cx="34" cy="64" r="2.5" fill={color} />
      <circle cx="66" cy="64" r="2.5" fill={color} />
    </svg>
  )
}
