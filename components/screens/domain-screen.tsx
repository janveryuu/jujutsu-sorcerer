'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Lock, Sparkles, X, Check, ChevronRight } from 'lucide-react'
import { useSorcerer } from '@/components/sorcerer-provider'
import { CursedEnergyBg } from '@/components/cursed-energy-bg'
import { GradeChip, Panel, SectionTitle, GlowBadge } from '@/components/sorcerer-ui'
import { TECHNIQUES, TONE_CLASS, type Technique, type GradeTone } from '@/lib/sorcerer-data'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Layout: Nodes arranged by tier in a vertical tree.                   */
/* Tier 0 at top (single node), branching down.                        */
/* ------------------------------------------------------------------ */

const TIER_Y = [60, 200, 360, 520] // vertical offset for each tier
const NODE_SIZE = 72

/**
 * Pre-compute x positions for each technique so the tree is balanced.
 * We group techniques by tier and evenly distribute them horizontally.
 */
function getNodePositions(techniques: Technique[], containerWidth: number) {
  const tiers: Record<number, Technique[]> = {}
  for (const t of techniques) {
    if (!tiers[t.tier]) tiers[t.tier] = []
    tiers[t.tier].push(t)
  }

  const positions: Record<string, { x: number; y: number }> = {}
  for (const [tierStr, techs] of Object.entries(tiers)) {
    const tier = Number(tierStr)
    const count = techs.length
    const spacing = containerWidth / (count + 1)
    techs.forEach((t, i) => {
      positions[t.id] = {
        x: spacing * (i + 1),
        y: TIER_Y[tier] ?? tier * 160 + 60,
      }
    })
  }
  return positions
}

/* ------------------------------------------------------------------ */
/* Connection lines (SVG paths between nodes).                         */
/* ------------------------------------------------------------------ */
function ConnectionLines({
  techniques,
  positions,
  unlocked,
}: {
  techniques: Technique[]
  positions: Record<string, { x: number; y: number }>
  unlocked: Set<string>
}) {
  const lines: { from: string; to: string; active: boolean }[] = []
  for (const t of techniques) {
    for (const dep of t.deps) {
      if (positions[dep] && positions[t.id]) {
        lines.push({
          from: dep,
          to: t.id,
          active: unlocked.has(dep) && unlocked.has(t.id),
        })
      }
    }
  }

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="line-active" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7C5CFF" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#4C2CFF" stopOpacity={0.4} />
        </linearGradient>
        <linearGradient id="line-locked" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#26262E" stopOpacity={0.6} />
          <stop offset="100%" stopColor="#26262E" stopOpacity={0.3} />
        </linearGradient>
        <filter id="line-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {lines.map(({ from, to, active }) => {
        const p1 = positions[from]
        const p2 = positions[to]
        if (!p1 || !p2) return null

        // Curved path from bottom of parent to top of child
        const startY = p1.y + NODE_SIZE / 2 + 4
        const endY = p2.y - NODE_SIZE / 2 - 4
        const midY = (startY + endY) / 2

        return (
          <motion.path
            key={`${from}-${to}`}
            d={`M ${p1.x} ${startY} C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${endY}`}
            fill="none"
            stroke={active ? 'url(#line-active)' : 'url(#line-locked)'}
            strokeWidth={active ? 2.5 : 1.5}
            strokeDasharray={active ? 'none' : '6 4'}
            filter={active ? 'url(#line-glow)' : undefined}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        )
      })}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Technique Node                                                      */
/* ------------------------------------------------------------------ */
function TechniqueNode({
  technique,
  position,
  isUnlocked,
  index,
  onTap,
}: {
  technique: Technique
  position: { x: number; y: number }
  isUnlocked: boolean
  index: number
  onTap: (t: Technique) => void
}) {
  const t = TONE_CLASS[technique.tone]

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.08 + 0.2,
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      onClick={() => onTap(technique)}
      className="group absolute flex flex-col items-center focus-visible:outline-none"
      style={{
        left: position.x - NODE_SIZE / 2,
        top: position.y - NODE_SIZE / 2,
        width: NODE_SIZE,
      }}
      aria-label={`${technique.name} — ${isUnlocked ? 'Unlocked' : 'Locked'}`}
    >
      {/* Outer pulse ring for unlocked nodes */}
      {isUnlocked ? (
        <motion.span
          className="absolute rounded-full"
          style={{
            width: NODE_SIZE + 12,
            height: NODE_SIZE + 12,
            left: -6,
            top: -6,
            background: `radial-gradient(circle, ${t.hex}30, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      ) : null}

      {/* Node circle */}
      <span
        className={cn(
          'relative flex items-center justify-center rounded-full transition-all duration-300',
          isUnlocked
            ? 'group-hover:scale-105'
            : 'opacity-50 group-hover:opacity-70',
        )}
        style={{
          width: NODE_SIZE,
          height: NODE_SIZE,
          background: isUnlocked
            ? `linear-gradient(135deg, ${t.hex}40, ${t.hex}15)`
            : 'rgba(21, 21, 28, 0.8)',
          border: isUnlocked
            ? `2px solid ${t.hex}80`
            : '2px solid #26262E',
          boxShadow: isUnlocked
            ? `0 0 20px -4px ${t.hex}50, inset 0 0 12px -4px ${t.hex}30`
            : 'none',
        }}
      >
        {/* Inner gradient border shine */}
        {isUnlocked ? (
          <span
            className="absolute inset-[2px] rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${t.hex}20, transparent 70%)`,
            }}
          />
        ) : null}

        {isUnlocked ? (
          <Sparkles
            className="relative size-7"
            style={{ color: t.hex }}
            strokeWidth={1.8}
          />
        ) : (
          <Lock className="relative size-5 text-muted-foreground/60" strokeWidth={2} />
        )}
      </span>

      {/* Label */}
      <span
        className={cn(
          'mt-2 text-center text-[10px] font-semibold leading-tight tracking-wide',
          isUnlocked ? t.text : 'text-muted-foreground/60',
        )}
        style={{ width: NODE_SIZE + 24 }}
      >
        {technique.name}
      </span>
    </motion.button>
  )
}

/* ------------------------------------------------------------------ */
/* Detail modal / sheet                                                */
/* ------------------------------------------------------------------ */
function TechniqueModal({
  technique,
  isUnlocked,
  onClose,
}: {
  technique: Technique
  isUnlocked: boolean
  onClose: () => void
}) {
  const t = TONE_CLASS[technique.tone]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-t-3xl border border-border bg-surface"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3">
          <span className="h-1 w-10 rounded-full bg-border" />
        </div>

        <div className="px-6 pb-8 pt-4">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full border border-border bg-surface-2 text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4">
            <span
              className="flex size-14 items-center justify-center rounded-2xl"
              style={{
                background: isUnlocked
                  ? `linear-gradient(135deg, ${t.hex}35, ${t.hex}10)`
                  : 'rgba(21, 21, 28, 0.8)',
                border: `1.5px solid ${isUnlocked ? t.hex + '60' : '#26262E'}`,
                boxShadow: isUnlocked ? `0 0 16px -4px ${t.hex}40` : 'none',
              }}
            >
              {isUnlocked ? (
                <Sparkles className="size-7" style={{ color: t.hex }} strokeWidth={1.8} />
              ) : (
                <Lock className="size-5 text-muted-foreground/60" />
              )}
            </span>
            <div>
              <GradeChip
                tone={technique.tone}
                label={isUnlocked ? 'Unlocked' : 'Locked'}
                icon={isUnlocked ? Check : Lock}
                className="mb-1"
              />
              <h2 className={cn('font-heading text-xl font-bold', t.text)}>
                {technique.name}
              </h2>
            </div>
          </div>

          {/* Lore */}
          <div className="mt-5 rounded-xl border border-border bg-surface-2/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Sorcery Lore
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90 italic">
              &ldquo;{technique.lore}&rdquo;
            </p>
          </div>

          {/* Benefit */}
          <div className="mt-3 rounded-xl border border-jade/20 bg-jade/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-jade">
              Fitness Benefit
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">
              {technique.benefit}
            </p>
          </div>

          {/* Requirement */}
          {!isUnlocked ? (
            <div className="mt-3 rounded-xl border border-border bg-surface-2/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Requirement
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-foreground/90">
                <Lock className="size-3.5 text-muted-foreground" />
                {technique.requirement}
              </p>
            </div>
          ) : null}

          {/* Tier badge */}
          <div className="mt-5 flex items-center gap-2">
            <span className="rounded-full bg-surface-2 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Tier {technique.tier}
            </span>
            {technique.deps.length > 0 ? (
              <span className="rounded-full bg-surface-2 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Requires {technique.deps.length} technique{technique.deps.length > 1 ? 's' : ''}
              </span>
            ) : null}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Main Domain Screen                                                  */
/* ------------------------------------------------------------------ */
export function DomainScreen() {
  const { state } = useSorcerer()
  const [selected, setSelected] = useState<Technique | null>(null)
  const unlockedSet = new Set(state.unlocked)
  const containerWidth = 360 // max-w-md mobile frame inner width
  const positions = getNodePositions(TECHNIQUES, containerWidth)

  const totalTechniques = TECHNIQUES.length
  const unlockedCount = TECHNIQUES.filter((t) => unlockedSet.has(t.id)).length
  const progressPct = Math.round((unlockedCount / totalTechniques) * 100)

  // Calculate tree height
  const maxTier = Math.max(...TECHNIQUES.map((t) => t.tier))
  const treeHeight = (TIER_Y[maxTier] ?? maxTier * 160 + 60) + NODE_SIZE + 60

  return (
    <div className="relative">
      <CursedEnergyBg density={14} className="opacity-40" />
      <div className="relative space-y-5 px-4 pb-28 pt-6">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Domain Techniques
          </p>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Sorcery Skill Tree
          </h1>
          <p className="text-sm text-muted-foreground">
            Unlock techniques through consistency to expand your domain.
          </p>
        </header>

        {/* Progress summary */}
        <Panel className="flex items-center gap-4 p-4">
          <div className="flex-1">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-sm font-medium text-foreground">
                Domain Mastery
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {unlockedCount}/{totalTechniques}
              </span>
            </div>
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-surface-2 ring-1 ring-inset ring-border">
              <motion.div
                className="shimmer relative h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #7C5CFF, #4C2CFF)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
          <span className="font-mono text-2xl font-bold text-ce">
            {progressPct}%
          </span>
        </Panel>

        {/* Skill tree canvas */}
        <div
          className="relative mx-auto w-full overflow-visible"
          style={{ height: treeHeight, maxWidth: containerWidth }}
        >
          {/* Connection lines */}
          <ConnectionLines
            techniques={TECHNIQUES}
            positions={positions}
            unlocked={unlockedSet}
          />

          {/* Technique nodes */}
          {TECHNIQUES.map((tech, i) => {
            const pos = positions[tech.id]
            if (!pos) return null
            return (
              <TechniqueNode
                key={tech.id}
                technique={tech}
                position={pos}
                isUnlocked={unlockedSet.has(tech.id)}
                index={i}
                onTap={setSelected}
              />
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-2">
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-3 rounded-full bg-ce/40 ring-1 ring-ce/60" />
            Unlocked
          </span>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-3 rounded-full bg-surface-2 ring-1 ring-border" />
            Locked
          </span>
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected ? (
          <TechniqueModal
            technique={selected}
            isUnlocked={unlockedSet.has(selected.id)}
            onClose={() => setSelected(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}
