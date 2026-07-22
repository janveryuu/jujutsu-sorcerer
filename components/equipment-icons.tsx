/**
 * Equipment Icons — Jujutsu Fitness App
 *
 * 6 custom thin single-weight line icons representing training equipment types.
 * Style: 1.5–2px stroke, monochrome (adapts to color prop), no fills.
 * Designed to sit inside a circular dark badge (48px, #1a1a1f background).
 * Consistent stroke weight, badge size, and level of detail across all 6.
 *
 * Icons:
 * 1. Bodyweight  — humanoid silhouette wrapped in a thin cursed-energy outline
 * 2. Full Gym    — minimal rack/frame suggesting multiple apparatus together
 * 3. Barbells    — straight bar with two end-plates (clean geometric linework)
 * 4. Dumbbells   — short bar with two rounded weights at a slight angle
 * 5. Kettlebells — rounded bell with handle loop, line-only
 * 6. Machines    — cable-and-pulley frame, abstracted rather than literal
 */

import React from 'react'

interface EquipIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
  active?: boolean
}

const SVG = (size: number | string = 24, color: string, props: EquipIconProps) => ({
  width: size,
  height: size,
  viewBox: '0 0 100 100' as const,
  fill: 'none' as const,
  xmlns: 'http://www.w3.org/2000/svg' as const,
  stroke: color,
  strokeWidth: 5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
})

/* ──────────────────────────────────────────────────────────────────────────
   1. BODYWEIGHT — Humanoid vessel silhouette wrapped in a cursed-energy line
   No equipment, just the body. Simple symmetrical figure.
   ────────────────────────────────────────────────────────────────────────── */
export function BodyweightIcon({ size = 24, color = 'currentColor', active, ...props }: EquipIconProps) {
  return (
    <svg {...SVG(size, color, props as EquipIconProps)}>
      {/* Head circle */}
      <circle cx="50" cy="20" r="8" />
      {/* Torso */}
      <line x1="50" y1="28" x2="50" y2="62" />
      {/* Arms — spread slightly outward */}
      <path d="M50 38 L30 52 M50 38 L70 52" />
      {/* Legs */}
      <path d="M50 62 L36 84 M50 62 L64 84" />
      {/* Cursed energy wisp wrapping the figure — left shoulder */}
      <path d="M36 44 C28 38 26 28 30 20" strokeWidth={3.5} />
      <path d="M30 20 C32 12 28 8 26 4" strokeWidth={2.5} />
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   2. FULL GYM — Minimal power rack frame: two uprights, two cross-bars, J-hooks
   Suggests the full iron arsenal in a simple geometric frame.
   ────────────────────────────────────────────────────────────────────────── */
export function FullGymIcon({ size = 24, color = 'currentColor', active, ...props }: EquipIconProps) {
  return (
    <svg {...SVG(size, color, props as EquipIconProps)}>
      {/* Left upright */}
      <line x1="22" y1="14" x2="22" y2="88" />
      {/* Right upright */}
      <line x1="78" y1="14" x2="78" y2="88" />
      {/* Top cross-bar (pull-up bar) */}
      <line x1="22" y1="14" x2="78" y2="14" />
      {/* Mid cross-bar (safety/spotter) */}
      <line x1="22" y1="54" x2="78" y2="54" />
      {/* Base cross-bar */}
      <line x1="22" y1="88" x2="78" y2="88" />
      {/* Barbell resting on J-hooks */}
      <line x1="14" y1="40" x2="86" y2="40" />
      {/* Left J-hook */}
      <path d="M28 40 L28 48 L33 48" strokeWidth={4} />
      {/* Right J-hook */}
      <path d="M72 40 L72 48 L67 48" strokeWidth={4} />
      {/* Left plate */}
      <rect x="8" y="33" width="6" height="14" rx="2" />
      {/* Right plate */}
      <rect x="86" y="33" width="6" height="14" rx="2" />
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   3. BARBELLS — Clean geometric straight bar with two circular end-plates
   Iconic, unmistakeable, simplified to pure geometry.
   ────────────────────────────────────────────────────────────────────────── */
export function BarbellIcon({ size = 24, color = 'currentColor', active, ...props }: EquipIconProps) {
  return (
    <svg {...SVG(size, color, props as EquipIconProps)}>
      {/* Main bar */}
      <line x1="10" y1="50" x2="90" y2="50" />
      {/* Left outer plate */}
      <rect x="8" y="34" width="7" height="32" rx="3" />
      {/* Left inner plate */}
      <rect x="18" y="39" width="5" height="22" rx="2" />
      {/* Right inner plate */}
      <rect x="77" y="39" width="5" height="22" rx="2" />
      {/* Right outer plate */}
      <rect x="85" y="34" width="7" height="32" rx="3" />
      {/* Center collar knurl marks */}
      <line x1="44" y1="44" x2="44" y2="56" strokeWidth={3} />
      <line x1="50" y1="44" x2="50" y2="56" strokeWidth={3} />
      <line x1="56" y1="44" x2="56" y2="56" strokeWidth={3} />
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   4. DUMBBELLS — Short bar with two rounded weights, viewed at a slight angle
   Both hands implied by the compact bilateral symmetry.
   ────────────────────────────────────────────────────────────────────────── */
export function DumbbellIcon({ size = 24, color = 'currentColor', active, ...props }: EquipIconProps) {
  return (
    <svg {...SVG(size, color, props as EquipIconProps)}>
      {/* Main dumbbell 1 — angled upward left */}
      {/* Handle */}
      <line x1="28" y1="42" x2="52" y2="30" />
      {/* Left weight head */}
      <ellipse cx="20" cy="46" rx="8" ry="10" transform="rotate(-25 20 46)" />
      {/* Right weight head */}
      <ellipse cx="60" cy="26" rx="8" ry="10" transform="rotate(-25 60 26)" />

      {/* Second dumbbell — offset below, mirrored angle */}
      {/* Handle */}
      <line x1="48" y1="70" x2="72" y2="58" />
      {/* Left weight head */}
      <ellipse cx="40" cy="74" rx="8" ry="10" transform="rotate(-25 40 74)" />
      {/* Right weight head */}
      <ellipse cx="80" cy="54" rx="8" ry="10" transform="rotate(-25 80 54)" />
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   5. KETTLEBELLS — Classic rounded bell silhouette with a handle loop, line-only
   The loop handle is what makes this unmistakeable at small sizes.
   ────────────────────────────────────────────────────────────────────────── */
export function KettlebellIcon({ size = 24, color = 'currentColor', active, ...props }: EquipIconProps) {
  return (
    <svg {...SVG(size, color, props as EquipIconProps)}>
      {/* Bell body — teardrop circle bottom-heavy */}
      <circle cx="50" cy="66" r="26" />
      {/* Handle arch */}
      <path d="M32 50 C32 30 68 30 68 50" />
      {/* Handle base left connector */}
      <line x1="32" y1="50" x2="38" y2="48" />
      {/* Handle base right connector */}
      <line x1="68" y1="50" x2="62" y2="48" />
      {/* Subtle center window line on bell */}
      <line x1="50" y1="50" x2="50" y2="72" strokeWidth={3.5} />
      {/* Weight flat bottom suggestion */}
      <path d="M32 84 Q50 90 68 84" />
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   6. MACHINES — Cable-and-pulley resistance frame: tower, cable, pulley wheel
   Abstracted rather than literal — a clean geometric frame-and-cable system.
   ────────────────────────────────────────────────────────────────────────── */
export function MachineIcon({ size = 24, color = 'currentColor', active, ...props }: EquipIconProps) {
  return (
    <svg {...SVG(size, color, props as EquipIconProps)}>
      {/* Vertical frame tower */}
      <line x1="24" y1="12" x2="24" y2="88" />
      {/* Top horizontal arm extending right */}
      <line x1="24" y1="18" x2="62" y2="18" />
      {/* Top pulley wheel at the arm tip */}
      <circle cx="62" cy="18" r="7" />
      {/* Cable running from pulley down to handle */}
      <path d="M62 25 C62 50 54 62 50 72" />
      {/* Handle D-ring at bottom of cable */}
      <path d="M44 72 Q50 80 56 72" />
      <line x1="44" y1="72" x2="56" y2="72" />
      {/* Weight stack — rectangles on left tower */}
      <rect x="14" y="36" width="20" height="6" rx="2" />
      <rect x="14" y="46" width="20" height="6" rx="2" />
      <rect x="14" y="56" width="20" height="6" rx="2" />
      <rect x="14" y="66" width="20" height="6" rx="2" />
      {/* Weight stack selector pin */}
      <line x1="34" y1="52" x2="44" y2="52" strokeWidth={3} />
      {/* Base */}
      <line x1="10" y1="88" x2="50" y2="88" />
    </svg>
  )
}
