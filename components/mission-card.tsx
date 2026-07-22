'use client'

import { motion } from 'framer-motion'
import { Clock, Zap, ChevronRight } from 'lucide-react'
import { CURSE_RANKS, type Mission, TONE_CLASS } from '@/lib/sorcerer-data'
import { GradeChip, SorcererButton } from './sorcerer-ui'
import { useSorcerer } from './sorcerer-provider'
import { cn } from '@/lib/utils'

export function MissionCard({
  mission,
  variant = 'rail',
  index = 0,
}: {
  mission: Mission
  variant?: 'rail' | 'list'
  index?: number
}) {
  const { openMission } = useSorcerer()
  const rank = CURSE_RANKS.find((r) => r.key === mission.rank)!
  const tone = TONE_CLASS[rank.tone]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'clip-talisman group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-4 transition-shadow duration-300 hover:glow-ce',
        variant === 'rail' ? 'w-[264px] shrink-0' : 'w-full',
      )}
    >
      {/* rank accent line */}
      <span
        className="absolute left-0 top-0 h-full w-1"
        style={{ background: `linear-gradient(${tone.hex}, transparent)` }}
        aria-hidden="true"
      />
      <div className="mb-3 flex items-start justify-between gap-2">
        <GradeChip tone={rank.tone} label={rank.label} icon={Zap} />
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3.5" /> {mission.durationMin}m
        </span>
      </div>

      <h3 className="text-pretty font-heading text-lg font-bold leading-tight">
        {mission.name}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">{mission.focus}</p>

      <div className="mt-4 flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-mono text-sm text-ce">
          <Zap className="size-4" fill="currentColor" strokeWidth={0} />+
          {mission.ce} CE
        </span>
        <SorcererButton
          className="px-3.5 py-2 text-xs"
          icon={ChevronRight}
          onClick={() => openMission(mission.id)}
          aria-label={`Begin exorcism: ${mission.name}`}
        >
          Begin Exorcism
        </SorcererButton>
      </div>
    </motion.div>
  )
}
