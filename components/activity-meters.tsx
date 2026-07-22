/**
 * Cursed Energy Intensity Meter Icons — Jujutsu Fitness App
 *
 * 4-segment vertical bar icons representing escalating activity levels.
 * Each tier fills one more segment with increasing violet intensity & glow.
 *
 * Segment specs: 6px wide, 14px tall, 3px corner radius, 3px gap between segs.
 * Total canvas: 24px wide × 72px tall (centered segments + wisp space on tier 4).
 *
 * Tier 1 — Stagnant:    1 segment, dim gray-violet, static
 * Tier 2 — Flickering:  2 segments, uneven opacity suggesting inconsistency
 * Tier 3 — Channeling:  3 segments, full steady violet with soft even glow
 * Tier 4 — Overflowing: 4 segments, max brightness, glow bleeds past top edge
 */

import React from 'react'

interface MeterProps extends React.SVGProps<SVGSVGElement> {
  size?: number
  active?: boolean
}

/* shared palette */
const EMPTY  = '#1e1e28'
const DIM    = '#4a4560'
const FAINT1 = 'rgba(124, 92, 255, 0.45)'
const FAINT2 = 'rgba(124, 92, 255, 0.65)'
const FULL   = '#7C5CFF'
const BRIGHT = '#9C88FF'

/** Renders one pill segment */
function Seg({
  x, y, fill, glowId,
}: {
  x: number; y: number; fill: string; glowId?: string
}) {
  return (
    <rect
      x={x}
      y={y}
      width={6}
      height={14}
      rx={3}
      ry={3}
      fill={fill}
      filter={glowId ? `url(#${glowId})` : undefined}
    />
  )
}

/* Segment positions (bottom → top): y coords within a 72px tall viewBox */
const S = [52, 36, 20, 4] // seg 1 = bottom, seg 4 = top
const X = 9              // single column of segments, centred in 24px canvas

/* ──────────────────────────────────────────────────────────────────────────
   TIER 1 — STAGNANT
   1 segment filled, no glow, no life.
   ────────────────────────────────────────────────────────────────────────── */
export function StagnantMeter({ size = 28, active, ...props }: MeterProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 72" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Seg x={X} y={S[0]} fill={DIM} />
      <Seg x={X} y={S[1]} fill={EMPTY} />
      <Seg x={X} y={S[2]} fill={EMPTY} />
      <Seg x={X} y={S[3]} fill={EMPTY} />
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   TIER 2 — FLICKERING
   2 segments filled, uneven opacity (one slightly dimmer), faint glow.
   ────────────────────────────────────────────────────────────────────────── */
export function FlickeringMeter({ size = 28, active, ...props }: MeterProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 72" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <filter id="flicker-glow" x="-60%" y="-20%" width="220%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Bottom seg — slightly dimmer, "inconsistent" */}
      <Seg x={X} y={S[0]} fill={FAINT1} glowId="flicker-glow" />
      {/* Second seg — brighter, the "flicker" moment */}
      <Seg x={X} y={S[1]} fill={FAINT2} glowId="flicker-glow" />
      <Seg x={X} y={S[2]} fill={EMPTY} />
      <Seg x={X} y={S[3]} fill={EMPTY} />
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   TIER 3 — CHANNELING
   3 segments filled, full even violet, stable controlled glow.
   ────────────────────────────────────────────────────────────────────────── */
export function ChannelingMeter({ size = 28, active, ...props }: MeterProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 72" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <filter id="channel-glow" x="-80%" y="-30%" width="260%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <Seg x={X} y={S[0]} fill={FULL} glowId="channel-glow" />
      <Seg x={X} y={S[1]} fill={FULL} glowId="channel-glow" />
      <Seg x={X} y={S[2]} fill={FULL} glowId="channel-glow" />
      <Seg x={X} y={S[3]} fill={EMPTY} />
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   TIER 4 — OVERFLOWING
   All 4 segments filled, max brightness, glow bleeds past the top edge.
   A small cursed wisp escapes upward — energy the container can't contain.
   ────────────────────────────────────────────────────────────────────────── */
export function OverflowingMeter({ size = 28, active, ...props }: MeterProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 72" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        {/* Wide outer glow for all segments */}
        <filter id="overflow-glow" x="-100%" y="-40%" width="300%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Extra bright top bloom for top segment */}
        <filter id="top-bloom" x="-160%" y="-80%" width="420%" height="280%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Wisp glow */}
        <filter id="wisp-glow" x="-200%" y="-200%" width="600%" height="600%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Bottom 3 segments — full violet */}
      <Seg x={X} y={S[0]} fill={FULL} glowId="overflow-glow" />
      <Seg x={X} y={S[1]} fill={FULL} glowId="overflow-glow" />
      <Seg x={X} y={S[2]} fill={FULL} glowId="overflow-glow" />

      {/* Top segment — bright core, blooms upward */}
      <Seg x={X} y={S[3]} fill={BRIGHT} glowId="top-bloom" />

      {/* Escaping energy wisp — curling tendril above top segment */}
      <path
        d="M12 3 C12 1.5 10.5 0.5 11 -1"
        stroke={BRIGHT}
        strokeWidth="1.4"
        strokeLinecap="round"
        filter="url(#wisp-glow)"
      />
      <path
        d="M12 3 C13.5 1.2 14.5 0 14 -2"
        stroke={FULL}
        strokeWidth="1.2"
        strokeLinecap="round"
        filter="url(#wisp-glow)"
        opacity={0.7}
      />
      {/* Tiny particle escaping */}
      <circle cx="11.5" cy="-2" r="1" fill={BRIGHT} filter="url(#wisp-glow)" opacity={0.85} />
    </svg>
  )
}

/** Map a tier key to its meter component */
export const ACTIVITY_METERS: Record<
  string,
  React.ComponentType<MeterProps>
> = {
  sedentary: StagnantMeter,
  light: FlickeringMeter,
  moderate: ChannelingMeter,
  active: OverflowingMeter,
}
