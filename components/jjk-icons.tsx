import React from 'react'

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
}

/**
 * (1) Untamed Power — a clenched fist wrapped in jagged cursed-energy tendrils
 */
export function UntamedPowerIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Fist outline */}
      <path d="M10 14v-4a1.5 1.5 0 0 1 3 0v4" />
      <path d="M13 14v-3.5a1.5 1.5 0 0 1 3 0v3.5" />
      <path d="M7 14v-2.5a1.5 1.5 0 0 1 3 0v2.5" />
      <path d="M7 14c-1.5 0-2.5 1-2.5 3 0 2.5 2 4.5 5 4.5h4c3.5 0 6-2 6-5.5v-3a1.5 1.5 0 0 0-3 0" />
      {/* Jagged cursed-energy aura tendrils around fist */}
      <path d="M4 8l2.5-3.5L9 6l3.5-4.5L15 5l4-3.5" stroke="#7C5CFF" strokeWidth="1.5" />
      <path d="M2.5 13l-1.5-2 2-1.5" stroke="#7C5CFF" strokeWidth="1.5" />
      <path d="M21.5 13l1.5-2-2-1.5" stroke="#7C5CFF" strokeWidth="1.5" />
      {/* Sigil spark */}
      <circle cx="12" cy="1.5" r="0.75" fill="#7C5CFF" />
    </svg>
  )
}

/**
 * (2) Vessel Integrity — a torso silhouette outlined by a glowing containment ring
 */
export function VesselIntegrityIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Containment Ring (Cursed Sigil Boundary) */}
      <circle cx="12" cy="12" r="10" stroke="#7C5CFF" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* Core Vessel Torso & Head Silhouette */}
      <circle cx="12" cy="7" r="2.5" />
      <path d="M7 17.5v-2.5a3.5 3.5 0 0 1 3.5-3.5h3a3.5 3.5 0 0 1 3.5 3.5v2.5" />
      {/* Inner Cursed Core Glow */}
      <path d="M12 13v3" stroke="#7C5CFF" strokeWidth="2" />
      <path d="M10.5 14.5h3" stroke="#7C5CFF" strokeWidth="1.5" />
    </svg>
  )
}

/**
 * (3) Refined Form — a single flowing brushstroke shaping a humanoid figure
 */
export function RefinedFormIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Calligraphic Brushstroke Head/Aura */}
      <path d="M12 3.5c1.8 0 3 1.2 3 3s-1.5 3-3 3c-1.5 0-2.8-1-2.5-2.8.2-1.3 1.2-3.2 2.5-3.2Z" />
      {/* Flowing Brushstroke Body Sweep */}
      <path d="M15 10.5C18 12 19.5 15 18 19c-1 2.5-4 2.5-6 2.5S7 21.5 6 19c-1.5-4 0-7 3-8.5" />
      {/* Cursed Energy Wisp Accent */}
      <path d="M10 13c1.5 1.5 2.5 3.5 2 6" stroke="#7C5CFF" strokeWidth="1.5" />
      <path d="M17 6c1.5-1.5 3.5-1 4.5.5" stroke="#7C5CFF" strokeWidth="1.5" />
    </svg>
  )
}

/**
 * (4) Stillness of Mind — a meditative figure with a calm energy spiral above the head
 */
export function StillnessOfMindIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Calm Energy Spiral / Domain Sigil Above Head */}
      <path d="M12 2a3 3 0 0 1 3 3c0 1.5-1.2 2.5-2.5 2.5A1.5 1.5 0 0 1 11 6c0-.8.7-1.5 1.5-1.5" stroke="#7C5CFF" strokeWidth="1.5" />
      {/* Meditating Head */}
      <circle cx="12" cy="10" r="2" />
      {/* Seated Lotus Meditation Silhouette */}
      <path d="M6 20c0-3 2.5-5.5 6-5.5s6 2.5 6 5.5" />
      <path d="M4 19c1.5-1 3.5-1.5 5.5-1.5" />
      <path d="M20 19c-1.5-1-3.5-1.5-5.5-1.5" />
      {/* Floating Zen Orb */}
      <circle cx="12" cy="17.5" r="1" fill="#7C5CFF" stroke="none" />
    </svg>
  )
}

/**
 * (5) Sworn Bonds — two interlocking cursed-energy threads forming a knot (binding vow motif)
 */
export function SwornBondsIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Binding Vow Interlocking Knot Loop Left */}
      <path d="M9 12a4 4 0 1 1 0-8c2.5 0 4.5 4 6 8" />
      {/* Binding Vow Interlocking Knot Loop Right */}
      <path d="M15 12a4 4 0 1 1 0 8c-2.5 0-4.5-4-6-8" />
      {/* Sigil Thread Accents */}
      <path d="M4 12h2" stroke="#7C5CFF" strokeWidth="1.75" />
      <path d="M18 12h2" stroke="#7C5CFF" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="1.5" fill="#7C5CFF" stroke="none" />
    </svg>
  )
}

/**
 * (6) Thrill of the Hunt — a clawed/curved slash mark with motion lines (curse-exorcism strike)
 */
export function ThrillOfTheHuntIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Primary Curse Exorcism Slash */}
      <path d="M19 4L5 18" strokeWidth="2.25" />
      {/* Secondary Parallel Slash */}
      <path d="M14 3L3 14" stroke="#7C5CFF" strokeWidth="1.75" />
      {/* Third Claw Slash */}
      <path d="M21 10L10 21" stroke="#7C5CFF" strokeWidth="1.75" />
      {/* Impact Spark / Motion Flash */}
      <path d="M18 15l2 2m-2-2l2-2" stroke="#7C5CFF" strokeWidth="1.5" />
      <path d="M6 9L4 7m2 2l-2 2" stroke="#7C5CFF" strokeWidth="1.5" />
    </svg>
  )
}
