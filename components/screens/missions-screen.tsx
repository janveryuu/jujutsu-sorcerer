'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Filter, Sparkles, MessageSquare } from 'lucide-react'
import { useSorcerer } from '@/components/sorcerer-provider'
import { MissionCard } from '@/components/mission-card'
import { CursedEnergyBg } from '@/components/cursed-energy-bg'
import { AIMissionModal } from '@/components/ai-mission-modal'
import { cn } from '@/lib/utils'
import { CURSE_RANKS, MISSIONS, type CurseRankKey, type Mission } from '@/lib/sorcerer-data'

type FilterKey = 'all' | CurseRankKey

export function MissionsScreen() {
  const { state, openMission } = useSorcerer()
  const [filter, setFilter] = useState<FilterKey>('all')
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [customMissions, setCustomMissions] = useState<Mission[]>([])

  const allMissions = useMemo(
    () => [...customMissions, ...MISSIONS],
    [customMissions],
  )

  const filtered = useMemo(
    () =>
      filter === 'all'
        ? allMissions
        : allMissions.filter((m) => m.rank === filter),
    [filter, allMissions],
  )

  const chips: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All' },
    ...CURSE_RANKS.map((r) => ({ key: r.key as FilterKey, label: r.label })),
  ]

  return (
    <div className="relative">
      <CursedEnergyBg density={12} className="opacity-50" />
      <div className="relative space-y-5 px-4 pb-28 pt-6">
        <header className="space-y-1">
          <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.24em] text-muted-foreground">
            <Filter className="size-3.5" /> Mission Board
          </p>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Exorcism Missions
          </h1>
          <p className="text-sm text-muted-foreground">
            Clear curses to earn cursed energy and grow your attributes.
          </p>
        </header>

        {/* Groq Llama 3 AI Forge Banner */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="group relative overflow-hidden rounded-2xl border border-ce/50 bg-gradient-to-r from-ce/20 via-surface-2 to-ce/10 p-4 shadow-[0_0_24px_rgba(124,92,255,0.25)] transition-all hover:border-ce"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-ce px-2.5 py-0.5 font-mono text-[10px] font-bold text-white">
                  <Sparkles className="size-3" /> Groq Llama 3
                </span>
                <span className="text-xs font-semibold text-foreground">
                  AI Mission Forge & Sensei
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Generate custom exorcism workouts or ask your AI Sensei for advice.
              </p>
            </div>
            <button
              onClick={() => setAiModalOpen(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-xl bg-ce px-3.5 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-ce/90"
            >
              <Sparkles className="size-3.5" /> Forge Mission
            </button>
          </div>
        </motion.div>

        {/* Rank filters */}
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {chips.map((c) => {
            const active = filter === c.key
            return (
              <button
                key={c.key}
                onClick={() => setFilter(c.key)}
                className={cn(
                  'shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                  active
                    ? 'border-ce bg-ce/15 text-foreground'
                    : 'border-border bg-surface-2 text-muted-foreground hover:text-foreground',
                )}
              >
                {c.label}
              </button>
            )
          })}
        </div>

        {/* List */}
        <div className="grid gap-3">
          {filtered.map((m, i) => {
            const done = state.completedMissionIds.includes(m.id)
            return (
              <div key={m.id} className="relative">
                <MissionCard mission={m} variant="list" index={i} />
                {done ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-jade/15 px-2 py-1 text-[10px] font-semibold text-jade ring-1 ring-inset ring-jade/40"
                  >
                    <CheckCircle2 className="size-3" /> Cleared
                  </motion.span>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>

      <AIMissionModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onStartMission={(newMission) => {
          setCustomMissions((prev) => [newMission, ...prev])
          openMission(newMission.id)
        }}
      />
    </div>
  )
}
