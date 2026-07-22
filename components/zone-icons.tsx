/**
 * Cursed Zone Icons — Jujutsu Fitness App
 * Modern minimalist single-stroke SVG marks, violet (#7C5CFF) on transparent.
 * Styled with cursed-energy visual language: wisps, containment rings, sigil marks.
 * Each icon reads clearly at 60px and scales to 512px.
 */

import React from 'react'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
  active?: boolean
}

const base = (size: number | string = 24, color = '#7C5CFF') => ({
  width: size,
  height: size,
  viewBox: '0 0 100 100' as const,
  fill: 'none' as const,
  xmlns: 'http://www.w3.org/2000/svg' as const,
  stroke: color,
  strokeWidth: 4.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

/* ──────────────────────────────────────────────────────────────────────────
   FULL BODY — Humanoid outline with energy wisps radiating outward
   ────────────────────────────────────────────────────────────────────────── */
export function FullBodyIcon({ size = 24, color = '#7C5CFF', active, ...props }: IconProps) {
  const c = active ? '#7C5CFF' : color
  return (
    <svg {...base(size, c)} {...props}>
      {/* Head */}
      <circle cx="50" cy="18" r="7" stroke={c} />
      {/* Torso */}
      <path d="M50 25 L50 58" stroke={c} />
      {/* Arms */}
      <path d="M50 35 L28 50 M50 35 L72 50" stroke={c} />
      {/* Legs */}
      <path d="M50 58 L35 80 M50 58 L65 80" stroke={c} />
      {/* Cursed energy wisp — left shoulder flare */}
      <path d="M33 42 C26 36 20 30 22 22" stroke={c} strokeWidth={3} />
      <path d="M22 22 C21 16 17 14 14 10" stroke={c} strokeWidth={2.5} />
      <path d="M22 22 C24 15 28 13 30 8" stroke={c} strokeWidth={2} />
      {/* Right subtle wisp */}
      <path d="M67 42 C73 37 78 32 76 25" stroke={c} strokeWidth={2} />
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   CHEST — Pectoral containment arc with a central talisman seal mark
   ────────────────────────────────────────────────────────────────────────── */
export function ChestIcon({ size = 24, color = '#7C5CFF', active, ...props }: IconProps) {
  const c = active ? '#7C5CFF' : color
  return (
    <svg {...base(size, c)} {...props}>
      {/* Outer containment arc */}
      <path d="M18 45 C18 20 82 20 82 45" stroke={c} />
      {/* Left pec curve */}
      <path d="M18 45 C18 62 36 68 50 62" stroke={c} />
      {/* Right pec curve */}
      <path d="M82 45 C82 62 64 68 50 62" stroke={c} />
      {/* Central sternum line */}
      <path d="M50 26 L50 62" stroke={c} strokeWidth={3} />
      {/* Talisman seal — small sigil at center */}
      <path d="M44 40 L50 33 L56 40 L50 47 Z" stroke={c} strokeWidth={3} />
      {/* Energy wisp from top center */}
      <path d="M50 26 C48 18 44 14 42 8" stroke={c} strokeWidth={2.5} />
      <path d="M50 26 C52 17 56 13 58 7" stroke={c} strokeWidth={2} />
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   BACK — Wide shield-like dorsal arc with spine line and cursed lattice
   ────────────────────────────────────────────────────────────────────────── */
export function BackIcon({ size = 24, color = '#7C5CFF', active, ...props }: IconProps) {
  const c = active ? '#7C5CFF' : color
  return (
    <svg {...base(size, c)} {...props}>
      {/* Shoulder width arc */}
      <path d="M20 30 C20 18 80 18 80 30" stroke={c} />
      {/* Left lat sweep */}
      <path d="M20 30 L25 72" stroke={c} />
      {/* Right lat sweep */}
      <path d="M80 30 L75 72" stroke={c} />
      {/* Lower back connect */}
      <path d="M25 72 C30 80 70 80 75 72" stroke={c} />
      {/* Spine */}
      <path d="M50 20 L50 72" stroke={c} strokeWidth={3} />
      {/* Cross-hatched cursed lattice lines */}
      <path d="M30 42 L70 42" stroke={c} strokeWidth={2.5} />
      <path d="M28 56 L72 56" stroke={c} strokeWidth={2} />
      {/* Shoulder energy nodes */}
      <circle cx="20" cy="30" r="3.5" fill={c} stroke="none" />
      <circle cx="80" cy="30" r="3.5" fill={c} stroke="none" />
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   ARMS — Single curling arm-flex silhouette with a cursed tendril whip
   ────────────────────────────────────────────────────────────────────────── */
export function ArmsIcon({ size = 24, color = '#7C5CFF', active, ...props }: IconProps) {
  const c = active ? '#7C5CFF' : color
  return (
    <svg {...base(size, c)} {...props}>
      {/* Main arm arc — bicep curve */}
      <path d="M22 68 C14 52 18 28 36 22 C52 16 64 24 68 40" stroke={c} />
      {/* Forearm */}
      <path d="M68 40 C74 52 70 64 60 72" stroke={c} />
      {/* Fist suggestion */}
      <path d="M60 72 C56 78 50 80 46 76" stroke={c} />
      {/* Bicep peak marker */}
      <circle cx="36" cy="38" r="4" stroke={c} strokeWidth={3} />
      {/* Cursed energy whip / tendril from fist */}
      <path d="M60 72 C68 78 78 72 82 64" stroke={c} strokeWidth={3} />
      <path d="M82 64 C86 56 84 48 80 44" stroke={c} strokeWidth={2} />
      <path d="M80 44 C78 38 80 32 84 28" stroke={c} strokeWidth={1.8} />
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   SHOULDERS — Dual shoulder caps with energy arcing between them
   ────────────────────────────────────────────────────────────────────────── */
export function ShouldersIcon({ size = 24, color = '#7C5CFF', active, ...props }: IconProps) {
  const c = active ? '#7C5CFF' : color
  return (
    <svg {...base(size, c)} {...props}>
      {/* Left shoulder dome */}
      <path d="M14 52 C14 34 34 24 42 36" stroke={c} />
      {/* Right shoulder dome */}
      <path d="M86 52 C86 34 66 24 58 36" stroke={c} />
      {/* Trapezius connector */}
      <path d="M42 36 C46 30 54 30 58 36" stroke={c} />
      {/* Deltoid drops */}
      <path d="M14 52 L20 72" stroke={c} />
      <path d="M86 52 L80 72" stroke={c} />
      {/* Neck / collarbone */}
      <path d="M42 36 L42 22 M58 36 L58 22" stroke={c} strokeWidth={3} />
      <path d="M42 22 L58 22" stroke={c} strokeWidth={3} />
      {/* Cursed arc spark between shoulder caps */}
      <path d="M20 44 C30 26 70 26 80 44" stroke={c} strokeWidth={2.5} strokeDasharray="4 3" />
      {/* Energy nodes at cap peaks */}
      <circle cx="14" cy="52" r="3" fill={c} stroke="none" />
      <circle cx="86" cy="52" r="3" fill={c} stroke="none" />
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   ABS — Six-section core grid with a central sealing spiral
   ────────────────────────────────────────────────────────────────────────── */
export function AbsIcon({ size = 24, color = '#7C5CFF', active, ...props }: IconProps) {
  const c = active ? '#7C5CFF' : color
  return (
    <svg {...base(size, c)} {...props}>
      {/* Outer torso boundary */}
      <path d="M34 15 C26 18 22 28 22 40 L22 72 C22 78 28 82 34 82 L66 82 C72 82 78 78 78 72 L78 40 C78 28 74 18 66 15 Z" stroke={c} />
      {/* Linea alba — center vertical */}
      <path d="M50 15 L50 82" stroke={c} strokeWidth={3} />
      {/* Horizontal tendinous intersections */}
      <path d="M22 36 L78 36" stroke={c} strokeWidth={2.5} />
      <path d="M22 56 L78 56" stroke={c} strokeWidth={2.5} />
      {/* Sealing spiral at center */}
      <path d="M50 46 C50 46 44 42 46 38 C48 34 54 36 54 42 C54 48 48 50 46 46" stroke={c} strokeWidth={2.5} />
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   LEGS — Dynamic stride silhouette with a cursed energy coil around the knee
   ────────────────────────────────────────────────────────────────────────── */
export function LegsIcon({ size = 24, color = '#7C5CFF', active, ...props }: IconProps) {
  const c = active ? '#7C5CFF' : color
  return (
    <svg {...base(size, c)} {...props}>
      {/* Left quad */}
      <path d="M30 10 C22 10 18 22 20 40 L26 62" stroke={c} />
      {/* Left shin */}
      <path d="M26 62 C24 74 28 84 34 88" stroke={c} />
      {/* Right quad */}
      <path d="M50 14 C58 14 66 24 64 44 L60 62" stroke={c} />
      {/* Right shin */}
      <path d="M60 62 C62 76 58 86 52 90" stroke={c} />
      {/* Hip connection */}
      <path d="M30 10 C38 8 44 10 50 14" stroke={c} strokeWidth={3} />
      {/* Cursed coil at knee — left */}
      <path d="M18 56 C14 52 16 46 22 46 C28 46 30 52 26 56" stroke={c} strokeWidth={2.5} />
      {/* Energy tendril from knee outward */}
      <path d="M18 56 C12 62 8 72 10 80" stroke={c} strokeWidth={2} />
      <path d="M10 80 C8 84 10 88 8 92" stroke={c} strokeWidth={1.8} />
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   GLUTES — Sweeping arch mark with a contained power seal at the base
   ────────────────────────────────────────────────────────────────────────── */
export function GlutesIcon({ size = 24, color = '#7C5CFF', active, ...props }: IconProps) {
  const c = active ? '#7C5CFF' : color
  return (
    <svg {...base(size, c)} {...props}>
      {/* Left glute sweep */}
      <path d="M16 32 C16 14 42 10 50 24" stroke={c} />
      {/* Right glute sweep */}
      <path d="M84 32 C84 14 58 10 50 24" stroke={c} />
      {/* Bottom boundary */}
      <path d="M16 32 C16 58 30 72 50 72" stroke={c} />
      <path d="M84 32 C84 58 70 72 50 72" stroke={c} />
      {/* Gluteal crease */}
      <path d="M16 40 C28 42 36 42 50 40 C64 38 72 38 84 40" stroke={c} strokeWidth={2.5} />
      {/* Central power containment seal */}
      <path d="M50 24 L44 46 L50 54 L56 46 Z" stroke={c} strokeWidth={3} />
      <circle cx="50" cy="38" r="5" stroke={c} strokeWidth={2.5} />
    </svg>
  )
}
