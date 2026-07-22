'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, Zap, Sparkles, Trophy, ChevronRight } from 'lucide-react'
import { useSorcerer } from '../sorcerer-provider'
import { CursedEnergyBg } from '../cursed-energy-bg'
import { StatusRing } from '../status-ring'
import { WeeklyChart } from '../weekly-chart'
import { MissionCard } from '../mission-card'
import { AIMissionModal } from '../ai-mission-modal'
import {
  EnergyBar,
  GradeChip,
  Panel,
  SectionTitle,
  gradeToneByIndex,
} from '../sorcerer-ui'
import { GRADES, MISSIONS, type Mission } from '@/lib/sorcerer-data'

export function HomeScreen() {
  const { state, xpToNext, setTab, openMission } = useSorcerer()
  const [aiModalOpen, setAiModalOpen] = useState(false)

  const grade = GRADES[state.grade]
  const xpPct = (state.xp / xpToNext) * 100

  // daily mission completion: based on how many of today's 3 featured done
  const featured = MISSIONS.slice(0, 4)
  const doneToday = state.completedMissionIds.filter((id) =>
    featured.some((m) => m.id === id),
  ).length
  const dailyPct = Math.min(100, (doneToday / 3) * 100)

  return (
    <div className="relative">
      <CursedEnergyBg density={18} className="opacity-70" />
      <div className="relative space-y-7 px-5 pb-8 pt-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Jujutsu Sorcerer
            </p>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {state.name}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-sm font-bold text-ce">
              <Zap className="size-4" fill="currentColor" strokeWidth={0} />
              {state.ce.toLocaleString()}
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-sm text-gold">
              <Flame className="size-4" />
              {state.streak}d
            </span>
          </div>
        </header>

        {/* Status Ring */}
        <div className="flex flex-col items-center">
          <StatusRing progress={dailyPct}>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Level
            </span>
            <span className="font-mono text-5xl font-bold leading-none text-foreground">
              {state.level}
            </span>
            <span className="mt-1 text-[11px] text-muted-foreground">
              {doneToday}/3 missions today
            </span>
          </StatusRing>

          <div className="mt-5 w-full max-w-xs">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-mono text-muted-foreground">XP</span>
              <span className="font-mono text-muted-foreground">
                {state.xp} / {xpToNext}
              </span>
            </div>
            <EnergyBar value={xpPct} />
          </div>
        </div>

        {/* AI Mission Forge Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setAiModalOpen(true)}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-ce/50 bg-gradient-to-r from-ce/20 via-surface-2 to-ce/10 p-4 shadow-[0_0_20px_rgba(124,92,255,0.2)] transition-all hover:border-ce"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-ce px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                  <Sparkles className="size-3" /> Groq · Llama 3
                </span>
                <span className="text-xs font-semibold text-foreground">
                  AI Exorcism Forge & Mentor
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Forge custom Jujutsu workouts or consult your AI Sensei.
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 rounded-xl bg-ce px-3.5 py-2 text-xs font-semibold text-white shadow-md transition-all group-hover:bg-ce/90">
              <Sparkles className="size-3.5" /> Open
            </span>
          </div>
        </motion.div>

        {/* Global Cursed Rankings Preview Banner on Home Screen */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setTab('status')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/15 via-surface to-surface-2 p-4 shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all hover:border-amber-400"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/30">
                <Trophy className="size-5 animate-pulse" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-sm font-bold text-white tracking-wide">
                    Cursed Rankings
                  </h3>
                  <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[9px] font-black uppercase text-amber-300 border border-amber-500/30">
                    Live Leaderboard
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Top Rivals: Satoru Gojo (#1) · Ryomen Sukuna (#2) · You
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:translate-x-0.5 transition-transform">
              <span>View</span>
              <ChevronRight className="size-4" />
            </div>
          </div>
        </motion.div>

        {/* Today's missions rail */}
        <section>
          <SectionTitle
            action={
              <button
                onClick={() => setTab('missions')}
                className="text-xs font-medium text-ce transition-colors hover:text-ce/80"
              >
                View all
              </button>
            }
          >
            Today&apos;s Missions
          </SectionTitle>
          <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1">
            {featured.map((m, i) => (
              <div key={m.id} className="snap-start">
                <MissionCard mission={m} variant="rail" index={i} />
              </div>
            ))}
          </div>
        </section>
        {/* Weekly cursed energy */}
        <section>
          <SectionTitle>Weekly Cursed Energy</SectionTitle>
          <Panel glow className="p-4">
            <WeeklyChart data={state.weekly} />
          </Panel>
        </section>

        {/* Sorcerer Attributes */}
        <section>
          <SectionTitle>Vessel Attributes</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <Panel className="p-3.5">
              <p className="text-xs text-muted-foreground">Cursed Output</p>
              <p className="font-mono text-xl font-bold text-ce">
                Grade {state.grade + 1}
              </p>
            </Panel>
            <Panel className="p-3.5">
              <p className="text-xs text-muted-foreground">Domain Mastery</p>
              <p className="font-mono text-xl font-bold text-gold">
                {state.unlocked.length} / 12
              </p>
            </Panel>
          </div>
        </section>
      </div>

      <AIMissionModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onStartMission={(mission) => openMission(mission.id)}
      />
    </div>
  )
}
