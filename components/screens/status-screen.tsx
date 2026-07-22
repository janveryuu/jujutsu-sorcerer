'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  Dumbbell,
  Footprints,
  Gauge,
  HeartPulse,
  Sparkles,
  Brain,
  Trophy,
  UserCheck,
} from 'lucide-react'
import { useSorcerer } from '@/components/sorcerer-provider'
import { AttributeRadar } from '@/components/attribute-radar'
import { StatusRing } from '@/components/status-ring'
import { LeaderboardView } from '@/components/leaderboard-view'
import {
  EnergyBar,
  GradeChip,
  Panel,
  SectionTitle,
  gradeToneByIndex,
} from '@/components/sorcerer-ui'
import { GRADES, STAT_META, type StatKey } from '@/lib/sorcerer-data'
import { cn } from '@/lib/utils'

const STAT_ICON: Record<StatKey, typeof Dumbbell> = {
  strength: Dumbbell,
  stamina: Activity,
  agility: Footprints,
  endurance: HeartPulse,
  willpower: Brain,
  technique: Sparkles,
}

export function StatusScreen() {
  const { state, xpToNext } = useSorcerer()
  const [subTab, setSubTab] = useState<'status' | 'rankings'>('status')
  const tone = gradeToneByIndex(state.grade)
  const grade = GRADES[state.grade]
  const statKeys = Object.keys(STAT_META) as StatKey[]
  const power = Math.round(
    statKeys.reduce((sum, k) => sum + state.stats[k], 0) / statKeys.length,
  )

  return (
    <div className="space-y-6 px-4 pb-28 pt-6">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Status Window
          </p>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {state.name}
          </h1>
        </div>

        {/* Top Right Quick Indicator */}
        <div className="flex items-center gap-1.5 rounded-full bg-surface-2 border border-border px-3 py-1 text-xs font-mono text-ce">
          <Sparkles className="size-3.5 text-ce animate-pulse" />
          <span>{state.totalCe?.toLocaleString() || 0} CE</span>
        </div>
      </header>

      {/* Sub-tab Switcher: Status vs Cursed Rankings */}
      <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-surface p-1.5 border border-border">
        <button
          onClick={() => setSubTab('status')}
          className={cn(
            'flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold tracking-wide transition-all duration-200',
            subTab === 'status'
              ? 'bg-ce text-slate-950 shadow-md shadow-ce/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/5',
          )}
        >
          <UserCheck className="size-4" />
          <span>Vessel Status</span>
        </button>
        <button
          onClick={() => setSubTab('rankings')}
          className={cn(
            'flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold tracking-wide transition-all duration-200',
            subTab === 'rankings'
              ? 'bg-ce text-slate-950 shadow-md shadow-ce/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/5',
          )}
        >
          <Trophy className="size-4" />
          <span>Cursed Rankings</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {subTab === 'rankings' ? (
          <motion.div
            key="rankings"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <LeaderboardView />
          </motion.div>
        ) : (
          <motion.div
            key="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Hero ring + identity */}
            <Panel glow className="overflow-hidden p-6">
              <div className="flex flex-col items-center gap-5 text-center">
                <StatusRing progress={(state.xp / xpToNext) * 100} size={200}>
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Level
                  </span>
                  <span className="font-mono text-5xl font-bold leading-none text-foreground">
                    {state.level}
                  </span>
                  <span className="mt-1 font-mono text-xs text-ce">{power} PWR</span>
                </StatusRing>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <GradeChip tone={tone} label={grade.label} icon={Gauge} />
                  <GradeChip
                    tone="blue"
                    label={`${state.ce.toLocaleString()} CE`}
                    icon={Sparkles}
                  />
                </div>
                <div className="w-full max-w-xs space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>XP</span>
                    <span>
                      {state.xp} / {xpToNext}
                    </span>
                  </div>
                  <EnergyBar value={(state.xp / xpToNext) * 100} tone="blue" />
                </div>
              </div>
            </Panel>

            {/* Radar */}
            <section>
              <SectionTitle>Attribute Web</SectionTitle>
              <Panel className="p-4">
                <AttributeRadar stats={state.stats} />
              </Panel>
            </section>

            {/* Attribute bars */}
            <section>
              <SectionTitle>Attributes</SectionTitle>
              <div className="grid gap-3">
                {statKeys.map((k, i) => {
                  const Icon = STAT_ICON[k]
                  return (
                    <motion.div
                      key={k}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Panel className="flex items-center gap-3 p-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-ce">
                          <Icon className="size-4" strokeWidth={2.2} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">
                              {STAT_META[k].label}
                            </span>
                            <span className="font-mono text-xs text-muted-foreground">
                              {state.stats[k]}
                            </span>
                          </div>
                          <EnergyBar value={state.stats[k]} height="h-2" />
                        </div>
                      </Panel>
                    </motion.div>
                  )
                })}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
