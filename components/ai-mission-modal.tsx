'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  X,
  Flame,
  Dumbbell,
  Clock,
  Shield,
  MessageSquare,
  ChevronRight,
  Zap,
  Play,
  Send,
} from 'lucide-react'
import { useSorcerer } from '@/components/sorcerer-provider'
import { Panel, SorcererButton, GradeChip } from '@/components/sorcerer-ui'
import { JujutsuLogo } from '@/components/jujutsu-logo'
import {
  GRADES,
  CURSE_RANKS,
  type Mission,
  type CurseRankKey,
} from '@/lib/sorcerer-data'

interface AIMissionModalProps {
  isOpen: boolean
  onClose: () => void
  onStartMission: (mission: Mission) => void
}

const DURATIONS = [15, 25, 40, 60]
const FOCUS_AREAS = [
  'Upper Vessel & Shoulders',
  'Core Containment & Abs',
  'Explosive Leg Agility',
  'Full Body Hypertrophy',
  'Cursed Stamina & HIIT',
]
const EQUIPMENT_OPTIONS = [
  'Bodyweight Only',
  'Dumbbells & Mat',
  'Kettlebell & Pull-up Bar',
  'Full Gym Arsenal',
]
const RANKS: CurseRankKey[] = ['g3', 'g2', 'g1', 'sg']

export function AIMissionModal({
  isOpen,
  onClose,
  onStartMission,
}: AIMissionModalProps) {
  const { state } = useSorcerer()
  const gradeLabel = GRADES[state.grade]?.label || 'Grade 3'

  const [activeTab, setActiveTab] = useState<'forge' | 'sensei'>('forge')

  // Forge state
  const [duration, setDuration] = useState(25)
  const [focus, setFocus] = useState(FOCUS_AREAS[0])
  const [equipment, setEquipment] = useState(EQUIPMENT_OPTIONS[1])
  const [rank, setRank] = useState<CurseRankKey>('g2')
  const [loading, setLoading] = useState(false)
  const [generatedMission, setGeneratedMission] = useState<Mission | null>(null)

  // Sensei state
  const [question, setQuestion] = useState('')
  const [chatLog, setChatLog] = useState<
    Array<{ sender: 'user' | 'sensei'; text: string }>
  >([
    {
      sender: 'sensei',
      text: `Greetings, Sorcerer ${state.name}. Ask me any question on vessel technique, form, or cursed energy discipline.`,
    },
  ])
  const [asking, setAsking] = useState(false)

  async function handleForgeMission() {
    setLoading(true)
    setGeneratedMission(null)

    try {
      const res = await fetch('/api/jujutsu-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-mission',
          payload: {
            durationMin: duration,
            focus,
            equipment,
            rank,
            sorcererLevel: state.level,
            sorcererName: state.name,
          },
        }),
      })
      const data = await res.json()
      if (data.success && data.mission) {
        setGeneratedMission(data.mission)
      }
    } catch (err) {
      console.error('Forge Error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAskSensei(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim() || asking) return

    const userQ = question
    setQuestion('')
    setChatLog((prev) => [...prev, { sender: 'user', text: userQ }])
    setAsking(true)

    try {
      const res = await fetch('/api/jujutsu-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sensei-advice',
          payload: {
            question: userQ,
            sorcererName: state.name,
            level: state.level,
            gradeLabel,
          },
        }),
      })
      const data = await res.json()
      if (data.success && data.answer) {
        setChatLog((prev) => [...prev, { sender: 'sensei', text: data.answer }])
      }
    } catch (err) {
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'sensei',
          text: 'Focus your technique and rest well—we will resume training shortly.',
        },
      ])
    } finally {
      setAsking(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-md sm:items-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-border bg-surface sm:rounded-3xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-surface-2/60 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-ce/15 text-ce">
                <JujutsuLogo size={24} />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-foreground">
                  Groq · Llama 3 Intelligence
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Real-Time AI Exorcism Forge & Mentor
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border bg-surface-2/30 px-5 pt-2">
            <button
              onClick={() => setActiveTab('forge')}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
                activeTab === 'forge'
                  ? 'border-ce text-ce'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="size-3.5" />
              Forge AI Mission
            </button>
            <button
              onClick={() => setActiveTab('sensei')}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
                activeTab === 'sensei'
                  ? 'border-ce text-ce'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <MessageSquare className="size-3.5" />
              Ask AI Sensei
            </button>
          </div>

          {/* Body Content */}
          <div className="no-scrollbar flex-1 overflow-y-auto p-5">
            {activeTab === 'forge' ? (
              <div className="space-y-5">
                {!generatedMission ? (
                  <>
                    {/* Duration Picker */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Mission Duration
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {DURATIONS.map((m) => (
                          <button
                            key={m}
                            onClick={() => setDuration(m)}
                            className={`rounded-xl border py-2 text-xs font-mono font-medium transition-all ${
                              duration === m
                                ? 'border-ce bg-ce/15 text-ce shadow-sm'
                                : 'border-border bg-surface-2 text-muted-foreground hover:border-ce/40'
                            }`}
                          >
                            {m} MIN
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Target Focus Area */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Target Focus Area
                      </label>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {FOCUS_AREAS.map((item) => (
                          <button
                            key={item}
                            onClick={() => setFocus(item)}
                            className={`rounded-xl border px-3.5 py-2.5 text-left text-xs font-medium transition-all ${
                              focus === item
                                ? 'border-ce bg-ce/15 text-foreground'
                                : 'border-border bg-surface-2 text-muted-foreground hover:border-ce/40'
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Equipment Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Available Equipment
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {EQUIPMENT_OPTIONS.map((item) => (
                          <button
                            key={item}
                            onClick={() => setEquipment(item)}
                            className={`rounded-xl border px-3 py-2 text-left text-xs font-medium transition-all ${
                              equipment === item
                                ? 'border-ce bg-ce/15 text-foreground'
                                : 'border-border bg-surface-2 text-muted-foreground hover:border-ce/40'
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Threat Rank */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Assigned Curse Threat Level
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {RANKS.map((rk) => {
                          const rankObj = CURSE_RANKS.find((r) => r.key === rk)
                          return (
                            <button
                              key={rk}
                              onClick={() => setRank(rk)}
                              className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                                rank === rk
                                  ? 'border-gold bg-gold/15 text-gold'
                                  : 'border-border bg-surface-2 text-muted-foreground hover:border-gold/40'
                              }`}
                            >
                              {rankObj?.label || rk}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Forge Button */}
                    <div className="pt-2">
                      <SorcererButton
                        variant="primary"
                        onClick={handleForgeMission}
                        disabled={loading}
                        className="w-full"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <Sparkles className="size-4 animate-spin text-white" />
                            Llama 3 Forging Mission...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Sparkles className="size-4" />
                            Forge AI Exorcism Mission
                          </span>
                        )}
                      </SorcererButton>
                    </div>
                  </>
                ) : (
                  /* Generated Mission Preview */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <Panel glow className="space-y-3.5 p-4">
                      <div className="flex items-center justify-between">
                        <GradeChip
                          tone="violet"
                          label={
                            CURSE_RANKS.find(
                              (r) => r.key === generatedMission.rank,
                            )?.label || 'Grade 2 Curse'
                          }
                        />
                        <span className="flex items-center gap-1 font-mono text-sm font-bold text-ce">
                          <Zap className="size-4" />
                          +{generatedMission.ce} CE
                        </span>
                      </div>
                      <div>
                        <h4 className="font-heading text-lg font-bold text-foreground">
                          {generatedMission.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {generatedMission.focus}
                        </p>
                      </div>

                      {/* Exercise list */}
                      <div className="space-y-2 border-t border-border pt-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Generated Combat Circuit (
                          {generatedMission.exercises.length} Exercises)
                        </p>
                        <div className="space-y-2">
                          {generatedMission.exercises.map((ex, idx) => (
                            <div
                              key={idx}
                              className="rounded-xl border border-border/80 bg-surface-2/70 p-3"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-foreground">
                                  {ex.name}
                                </span>
                                <span className="font-mono text-[11px] font-semibold text-ce">
                                  {ex.sets} × {ex.reps}
                                </span>
                              </div>
                              <p className="mt-1 text-[11px] italic text-muted-foreground">
                                &ldquo;{ex.cue}&rdquo;
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Panel>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setGeneratedMission(null)}
                        className="flex-1 rounded-xl border border-border bg-surface-2 py-3 text-xs font-semibold text-muted-foreground hover:text-foreground"
                      >
                        Forge Another
                      </button>
                      <SorcererButton
                        variant="primary"
                        onClick={() => {
                          onStartMission(generatedMission)
                          onClose()
                        }}
                        className="flex-[2]"
                      >
                        <Play className="size-4 fill-current" />
                        Start Exorcism Now
                      </SorcererButton>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              /* Sensei Chat Tab */
              <div className="flex h-80 flex-col justify-between space-y-3">
                <div className="no-scrollbar flex-1 space-y-2.5 overflow-y-auto pr-1">
                  {chatLog.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                          msg.sender === 'user'
                            ? 'rounded-br-sm bg-ce text-white'
                            : 'rounded-bl-sm border border-border bg-surface-2 text-foreground'
                        }`}
                      >
                        {msg.sender === 'sensei' && (
                          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-ce">
                            Llama 3 Sensei
                          </p>
                        )}
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {asking && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl border border-border bg-surface-2 px-3.5 py-2.5 text-xs text-muted-foreground">
                        Sensei is analyzing your form...
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleAskSensei} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask Sensei a question..."
                    className="flex-1 rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-ce focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={asking || !question.trim()}
                    className="flex size-10 items-center justify-center rounded-xl bg-ce text-white disabled:opacity-50"
                  >
                    <Send className="size-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
