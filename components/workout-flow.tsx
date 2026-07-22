'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  Pause,
  Play,
  Sparkles,
  Timer,
  X,
  Zap,
} from 'lucide-react'
import { useSorcerer } from '@/components/sorcerer-provider'
import { CursedEnergyBg } from '@/components/cursed-energy-bg'
import {
  EnergyBar,
  GradeChip,
  SorcererButton,
  gradeToneByIndex,
} from '@/components/sorcerer-ui'
import {
  CURSE_RANKS,
  STAT_META,
  TECHNIQUES,
  TONE_CLASS,
  type Mission,
  type StatKey,
} from '@/lib/sorcerer-data'
import { cn } from '@/lib/utils'

export function WorkoutFlow({
  onRankUp,
}: {
  onRankUp?: (gradeLabel: string) => void
} = {}) {
  const { flow, getMission, closeFlow } = useSorcerer()
  const mission = flow ? getMission(flow.missionId) : undefined

  return (
    <AnimatePresence>
      {flow && mission ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-stretch justify-center bg-background/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative mx-auto flex w-full max-w-md flex-col overflow-hidden">
            <CursedEnergyBg density={16} className="opacity-60" />
            <AnimatePresence mode="wait">
              {flow.screen === 'detail' ? (
                <DetailView key="detail" mission={mission} onClose={closeFlow} />
              ) : flow.screen === 'active' ? (
                <ActiveView key="active" mission={mission} />
              ) : (
                <CompleteView key="complete" mission={mission} />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/* Phase 1 — Mission briefing / exercise list                          */
/* ------------------------------------------------------------------ */
function DetailView({
  mission,
  onClose,
}: {
  mission: Mission
  onClose: () => void
}) {
  const { startActive } = useSorcerer()
  const rank = CURSE_RANKS.find((r) => r.key === mission.rank)!

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative flex h-full flex-col"
    >
      <div className="flex items-center justify-between px-4 pb-2 pt-5">
        <button
          onClick={onClose}
          className="flex size-9 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Close mission"
        >
          <ArrowLeft className="size-4" />
        </button>
        <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Mission Briefing
        </span>
        <span className="size-9" />
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-40">
        <div className="mb-4 flex items-center gap-2">
          <GradeChip tone={rank.tone} label={rank.label} icon={Zap} />
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3.5" /> {mission.durationMin} min
          </span>
        </div>
        <h1 className="text-balance font-heading text-3xl font-bold leading-tight text-foreground">
          {mission.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{mission.focus}</p>

        <div className="mt-4 flex gap-3">
          <div className="flex-1 rounded-xl border border-ce/25 bg-ce/5 p-3 text-center">
            <p className="font-mono text-lg font-bold text-ce">+{mission.ce}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Cursed Energy
            </p>
          </div>
          <div className="flex-1 rounded-xl border border-gold/25 bg-gold/5 p-3 text-center">
            <p className="font-mono text-lg font-bold text-gold">
              +{mission.xp}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Experience
            </p>
          </div>
        </div>

        <h2 className="mb-3 mt-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <span className="inline-block h-3 w-1 rounded-full bg-gradient-to-b from-ce to-ce-2" />
          The Ritual · {mission.exercises.length} moves
        </h2>
        <ol className="space-y-2.5">
          {mission.exercises.map((ex, i) => (
            <motion.li
              key={ex.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-3 rounded-xl border border-border bg-surface p-3"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 font-mono text-sm text-ce">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-foreground">{ex.name}</p>
                  <span className="shrink-0 rounded-md bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {STAT_META[ex.targetStat].short}
                  </span>
                </div>
                <p className="mt-0.5 font-mono text-xs text-ce/90">
                  {ex.sets} × {ex.reps} · {ex.restSec}s rest
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {ex.cue}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Sticky CTA */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/95 to-transparent px-5 pb-7 pt-10">
        <SorcererButton
          className="pointer-events-auto w-full py-4 text-base"
          icon={Play}
          onClick={() => startActive(mission.id)}
        >
          Enter the Domain
        </SorcererButton>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Phase 2 — Active guided session                                     */
/* ------------------------------------------------------------------ */
function ActiveView({ mission }: { mission: Mission }) {
  const { goToComplete, closeFlow } = useSorcerer()
  const [idx, setIdx] = useState(0)
  const [resting, setResting] = useState(false)
  const [rest, setRest] = useState(0)
  const [paused, setPaused] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  const total = mission.exercises.length
  const ex = mission.exercises[idx]
  const progress = ((idx + (resting ? 0.5 : 0)) / total) * 100

  // Session elapsed timer
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(t)
  }, [paused])

  // Rest countdown
  useEffect(() => {
    if (!resting || paused) return
    if (rest <= 0) {
      setResting(false)
      return
    }
    const t = setTimeout(() => setRest((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [resting, rest, paused])

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  function completeSet() {
    if (idx < total - 1) {
      setRest(ex.restSec)
      setResting(true)
      setIdx((i) => i + 1)
    } else {
      goToComplete(mission.id)
    }
  }

  function skipRest() {
    setResting(false)
    setRest(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="relative flex h-full flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pb-3 pt-5">
        <button
          onClick={closeFlow}
          className="flex size-9 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:text-crimson"
          aria-label="Abandon mission"
        >
          <X className="size-4" />
        </button>
        <span className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground">
          <Timer className="size-4" /> {fmt(elapsed)}
        </span>
        <button
          onClick={() => setPaused((p) => !p)}
          className="flex size-9 items-center justify-center rounded-full border border-border bg-surface text-foreground"
          aria-label={paused ? 'Resume' : 'Pause'}
        >
          {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </button>
      </div>

      {/* Progress */}
      <div className="px-5">
        <div className="mb-1 flex justify-between text-xs text-muted-foreground">
          <span>
            Move {idx + 1} of {total}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <EnergyBar value={progress} />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          {resting ? (
            <motion.div
              key="rest"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="flex flex-col items-center"
            >
              <p className="mb-2 text-xs uppercase tracking-[0.28em] text-jade">
                Recover Cursed Energy
              </p>
              <div className="relative flex size-52 items-center justify-center">
                <span className="absolute inset-0 animate-ce-pulse rounded-full bg-jade/10" />
                <span className="absolute inset-4 rounded-full ring-1 ring-jade/40" />
                <span className="font-mono text-6xl font-bold text-jade">
                  {rest}
                </span>
              </div>
              <p className="mt-4 max-w-[28ch] text-sm text-muted-foreground">
                Next: <span className="text-foreground">{ex.name}</span>
              </p>
              <button
                onClick={skipRest}
                className="mt-6 flex items-center gap-1 text-sm font-medium text-ce hover:text-ce/80"
              >
                Skip rest <ChevronRight className="size-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`ex-${idx}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="flex flex-col items-center"
            >
              <span className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-ce/10 text-ce ring-1 ring-inset ring-ce/30">
                <Dumbbell className="size-7" strokeWidth={2} />
              </span>
              <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Targets {STAT_META[ex.targetStat as StatKey].label}
              </span>
              <h1 className="mt-3 text-balance font-heading text-3xl font-bold leading-tight text-foreground">
                {ex.name}
              </h1>
              <p className="mt-3 font-mono text-2xl font-bold text-ce">
                {ex.sets} × {ex.reps}
              </p>
              <p className="mt-4 max-w-[30ch] text-pretty text-sm leading-relaxed text-muted-foreground">
                {ex.cue}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="px-5 pb-8 pt-4">
        {resting ? (
          <SorcererButton
            variant="secondary"
            className="w-full py-4 text-base"
            icon={ChevronRight}
            onClick={skipRest}
          >
            I&apos;m Ready
          </SorcererButton>
        ) : (
          <SorcererButton
            className="w-full py-4 text-base"
            icon={Check}
            onClick={completeSet}
          >
            {idx < total - 1 ? 'Complete Move' : 'Seal the Curse'}
          </SorcererButton>
        )}
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Phase 3 — Completion / rewards                                      */
/* ------------------------------------------------------------------ */
function CompleteView({ mission }: { mission: Mission }) {
  const { finishMission, closeFlow, state } = useSorcerer()
  const ranRef = useRef(false)
  const [result, setResult] = useState<ReturnType<
    typeof finishMission
  > | null>(null)

  // Commit the mission exactly once when this view mounts.
  useEffect(() => {
    if (ranRef.current) return
    ranRef.current = true
    setResult(finishMission(mission.id))
  }, [finishMission, mission.id])

  const tone = gradeToneByIndex(state.grade)
  const gains = result?.statGains ?? {}
  const gainKeys = Object.keys(gains) as StatKey[]
  const newTechs = useMemo(
    () =>
      (result?.newTechniques ?? [])
        .map((id) => TECHNIQUES.find((t) => t.id === id))
        .filter(Boolean),
    [result],
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative flex h-full flex-col items-center justify-center px-6 pb-10 pt-6 text-center"
    >
      {/* Burst */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
        className="relative mb-6 flex size-28 items-center justify-center"
      >
        <span className="absolute inset-0 animate-ce-pulse rounded-full bg-ce/20" />
        <span className="absolute inset-0 rounded-full ring-2 ring-ce/50" />
        <Sparkles className="size-12 text-ce" strokeWidth={1.6} />
      </motion.div>

      <p className="text-xs uppercase tracking-[0.3em] text-jade">
        Curse Exorcised
      </p>
      <h1 className="mt-2 text-balance font-heading text-3xl font-bold text-foreground">
        {mission.name}
      </h1>

      {/* Reward tiles */}
      <div className="mt-6 grid w-full grid-cols-2 gap-3">
        <RewardTile
          icon={Zap}
          value={`+${result?.ce ?? mission.ce}`}
          label="Cursed Energy"
          tone="ce"
        />
        <RewardTile
          icon={Flame}
          value={`+${result?.xp ?? mission.xp}`}
          label="Experience"
          tone="gold"
        />
      </div>

      {/* Stat gains */}
      {gainKeys.length ? (
        <div className="mt-5 w-full rounded-2xl border border-border bg-surface p-4 text-left">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Attribute Growth
          </p>
          <div className="flex flex-wrap gap-2">
            {gainKeys.map((k) => (
              <span
                key={k}
                className="flex items-center gap-1 rounded-full bg-ce/10 px-2.5 py-1 text-xs font-medium text-ce ring-1 ring-inset ring-ce/30"
              >
                {STAT_META[k].label} +{gains[k]}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* Newly unlocked techniques */}
      {newTechs.length ? (
        <div className="mt-4 w-full space-y-2">
          {newTechs.map((t) => {
            const tt = TONE_CLASS[t!.tone]
            return (
              <motion.div
                key={t!.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  'flex items-center gap-3 rounded-2xl border p-3 text-left',
                  tt.bg,
                )}
                style={{ borderColor: `${tt.hex}55` }}
              >
                <Sparkles className={cn('size-5', tt.text)} />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Technique Unlocked
                  </p>
                  <p className={cn('font-heading font-bold', tt.text)}>
                    {t!.name}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : null}

      <div className="mt-auto w-full pt-8">
        <GradeChip
          tone={tone}
          label={`Streak · ${state.streak} days`}
          icon={Flame}
          className="mb-4"
        />
        <SorcererButton
          className="w-full py-4 text-base"
          icon={Check}
          onClick={closeFlow}
        >
          Return to Base
        </SorcererButton>
      </div>
    </motion.div>
  )
}

function RewardTile({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: typeof Zap
  value: string
  label: string
  tone: 'ce' | 'gold'
}) {
  const isCe = tone === 'ce'
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-2xl border p-4',
        isCe ? 'border-ce/30 bg-ce/5' : 'border-gold/30 bg-gold/5',
      )}
    >
      <Icon
        className={cn('mx-auto mb-1 size-5', isCe ? 'text-ce' : 'text-gold')}
      />
      <p
        className={cn(
          'font-mono text-2xl font-bold',
          isCe ? 'text-ce' : 'text-gold',
        )}
      >
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </motion.div>
  )
}
