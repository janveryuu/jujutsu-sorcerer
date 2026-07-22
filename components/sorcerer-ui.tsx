'use client'

import { cn } from '@/lib/utils'
import { GRADES, TONE_CLASS, type GradeTone } from '@/lib/sorcerer-data'
import type { LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

/* ------------------------------------------------------------------ */
/* Grade / rank chip                                                   */
/* ------------------------------------------------------------------ */
export function GradeChip({
  tone,
  label,
  icon: Icon,
  className,
}: {
  tone: GradeTone
  label: string
  icon?: LucideIcon
  className?: string
}) {
  const t = TONE_CLASS[tone]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
        t.bg,
        t.text,
        t.ring,
        className,
      )}
    >
      {Icon ? <Icon className="size-3.5" strokeWidth={2.2} /> : null}
      {label}
    </span>
  )
}

export function gradeToneByIndex(i: number): GradeTone {
  return GRADES[Math.max(0, Math.min(GRADES.length - 1, i))].tone
}

/* ------------------------------------------------------------------ */
/* Glowing icon badge — gradient bordered circular container           */
/* ------------------------------------------------------------------ */
export function GlowBadge({
  icon: Icon,
  size = 'md',
  tone = 'violet',
  className,
}: {
  icon: LucideIcon
  size?: 'sm' | 'md' | 'lg'
  tone?: GradeTone
  className?: string
}) {
  const dims =
    size === 'lg' ? 'size-14' : size === 'sm' ? 'size-9' : 'size-11'
  const iconSize =
    size === 'lg' ? 'size-6' : size === 'sm' ? 'size-4' : 'size-5'
  const t = TONE_CLASS[tone]
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full',
        dims,
        className,
      )}
    >
      <span
        className="absolute inset-0 rounded-full p-px"
        style={{
          background: `linear-gradient(135deg, ${t.hex}, transparent 70%)`,
        }}
      >
        <span className="block h-full w-full rounded-full bg-surface-2" />
      </span>
      <Icon className={cn('relative', iconSize, t.text)} strokeWidth={2} />
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Progress bar with animated shimmer sweep (never flat)               */
/* ------------------------------------------------------------------ */
export function EnergyBar({
  value,
  className,
  tone = 'blue',
  height = 'h-2.5',
}: {
  value: number
  className?: string
  tone?: GradeTone
  height?: string
}) {
  const t = TONE_CLASS[tone]
  const to = tone === 'violet' || tone === 'blue' ? '#0284c7' : t.hex
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-full bg-surface-2 ring-1 ring-inset ring-border',
        height,
        className,
      )}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="shimmer relative h-full rounded-full transition-[width] duration-700 ease-out"
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          background: `linear-gradient(90deg, ${t.hex}, ${to})`,
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'destructive'
  icon?: LucideIcon
}

export function SorcererButton({
  variant = 'primary',
  icon: Icon,
  className,
  children,
  ...props
}: BtnProps) {
  const base =
    'relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ce focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]'
  const variants: Record<string, string> = {
    primary:
      'text-slate-950 font-bold shadow-[0_8px_30px_-8px_rgba(0,240,255,0.65)] hover:shadow-[0_10px_36px_-6px_rgba(0,240,255,0.85)]',
    secondary:
      'bg-transparent text-foreground ring-1 ring-inset ring-border hover:ring-ce/60 hover:text-ce hover:shadow-[0_0_24px_-6px_rgba(0,240,255,0.5)]',
    destructive:
      'bg-transparent text-crimson ring-1 ring-inset ring-crimson/40 hover:bg-crimson/10',
  }
  return (
    <button
      className={cn(base, variants[variant], className)}
      style={
        variant === 'primary'
          ? { background: 'linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)' }
          : undefined
      }
      {...props}
    >
      {Icon ? <Icon className="size-4" strokeWidth={2.2} /> : null}
      {children}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Section title with kanji-inspired abstract glyph accent             */
/* ------------------------------------------------------------------ */
export function SectionTitle({
  children,
  action,
}: {
  children: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <span className="inline-block h-3 w-1 rounded-full bg-gradient-to-b from-ce to-ce-2" />
        {children}
      </h2>
      {action}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Themed card                                                         */
/* ------------------------------------------------------------------ */
export function Panel({
  children,
  className,
  glow = false,
  interactive = false,
}: {
  children: ReactNode
  className?: string
  glow?: boolean
  interactive?: boolean
}) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-border bg-surface/80 backdrop-blur-sm',
        glow && 'glow-ce',
        interactive &&
          'transition-shadow duration-300 hover:glow-ce focus-within:glow-ce',
        className,
      )}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* In-theme empty state                                                */
/* ------------------------------------------------------------------ */
export function EmptyState({
  icon: Icon,
  title,
  hint,
}: {
  icon: LucideIcon
  title: string
  hint?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/70 px-6 py-12 text-center">
      <span className="relative flex size-14 items-center justify-center rounded-full bg-surface-2">
        <span className="absolute inset-0 animate-ce-pulse rounded-full ring-1 ring-ce/30" />
        <Icon className="size-6 text-muted-foreground" />
      </span>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {hint ? <p className="max-w-[24ch] text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
