'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy,
  Sparkles,
  Crown,
  Medal,
  Award,
  ShieldAlert,
  Flame,
  User,
  Quote,
  ChevronRight,
  RefreshCw,
} from 'lucide-react'
import { useSorcerer } from '@/components/sorcerer-provider'
import { Panel, GradeChip, GlowBadge } from '@/components/sorcerer-ui'
import { cn } from '@/lib/utils'

export interface LeaderboardEntry {
  id: string
  name: string
  gradeLabel: string
  gradeIndex: number
  totalCe: number
  level: number
  aura: string
  isAI: boolean
  tagline?: string
}

export function LeaderboardView() {
  const { state } = useSorcerer()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'special' | 'g1' | 'g23'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/leaderboard')
      const data = await res.json()
      if (data.success && Array.isArray(data.leaderboard)) {
        // Ensure current user is in the list with their latest score
        const list: LeaderboardEntry[] = [...data.leaderboard]
        const userIdx = list.findIndex((e) => !e.isAI || e.id === 'user-sorcerer')
        const GRADE_LABELS = [
          'Grade 4',
          'Grade 3',
          'Grade 2',
          'Grade 1',
          'Special Grade',
        ]
        const userEntry: LeaderboardEntry = {
          id: 'user-sorcerer',
          name: state.name || 'Sorcerer (You)',
          gradeLabel: GRADE_LABELS[state.grade] || 'Grade 3',
          gradeIndex: state.grade,
          totalCe: state.totalCe || state.ce || 120,
          level: state.level || 1,
          aura: state.aura || 'violet',
          isAI: false,
          tagline: `Awakened Vessel · ${state.workoutsLogged || 0} exorcisms completed`,
        }

        if (userIdx >= 0) {
          list[userIdx] = userEntry
        } else {
          list.push(userEntry)
        }

        // Sort descending by totalCe
        list.sort((a, b) => b.totalCe - a.totalCe)
        setEntries(list)
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [state.totalCe, state.grade, state.level])

  const filtered = entries.filter((e) => {
    if (filter === 'special') return e.gradeIndex === 4 || e.gradeLabel.includes('Special')
    if (filter === 'g1') return e.gradeIndex === 3 || e.gradeLabel.includes('Grade 1')
    if (filter === 'g23') return e.gradeIndex <= 2 && !e.gradeLabel.includes('Special') && !e.gradeLabel.includes('Grade 1')
    return true
  })

  // Find user rank
  const userRank = entries.findIndex((e) => !e.isAI || e.id === 'user-sorcerer') + 1

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-ce/30 bg-gradient-to-br from-surface-2 via-surface to-ce/10 p-5 shadow-lg shadow-ce/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-xl bg-ce/15 border border-ce/40 text-ce shadow-md shadow-ce/20">
              <Trophy className="size-6 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-lg font-bold text-white tracking-wide">
                  Cursed Rankings
                </h2>
                <span className="rounded-full bg-ce/20 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-ce border border-ce/30 uppercase">
                  Global Rivals
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Compete against Special Grade legends & climb the hierarchy
              </p>
            </div>
          </div>
          <button
            onClick={fetchLeaderboard}
            disabled={loading}
            className="flex size-9 items-center justify-center rounded-xl border border-border bg-surface text-muted-foreground hover:text-ce hover:border-ce/40 transition-all"
            title="Refresh Rankings"
          >
            <RefreshCw className={cn('size-4', loading && 'animate-spin text-ce')} />
          </button>
        </div>

        {/* User Rank Callout */}
        <div className="mt-4 flex items-center justify-between rounded-xl bg-black/40 border border-white/10 px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-muted-foreground">Your Rank:</span>
            <span className="font-mono text-base font-bold text-ce">
              #{userRank > 0 ? userRank : '-'}
            </span>
            <span className="text-xs text-muted-foreground">of {entries.length} Sorcerers</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-white">
            <Sparkles className="size-3.5 text-ce" />
            <span>{state.totalCe?.toLocaleString() || 0} CE</span>
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'all', label: 'All Ranks' },
          { key: 'special', label: 'Special Grade' },
          { key: 'g1', label: 'Grade 1' },
          { key: 'g23', label: 'Grade 2 & 3' },
        ].map((tab) => {
          const active = filter === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 border',
                active
                  ? 'bg-ce text-slate-950 border-ce shadow-sm shadow-ce/30 font-bold'
                  : 'bg-surface/80 text-muted-foreground border-border/80 hover:text-foreground hover:border-border',
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {filtered.map((entry, index) => {
            const actualRank = entries.findIndex((e) => e.id === entry.id) + 1
            const isUser = !entry.isAI || entry.id === 'user-sorcerer'
            const isTop3 = actualRank <= 3
            const expanded = expandedId === entry.id

            // Podium colors
            const rankBadgeClass =
              actualRank === 1
                ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black border border-amber-300 shadow-md shadow-amber-500/30'
                : actualRank === 2
                ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-950 font-black border border-slate-200 shadow-md shadow-slate-400/20'
                : actualRank === 3
                ? 'bg-gradient-to-br from-amber-700 to-amber-900 text-white font-black border border-amber-600 shadow-md shadow-amber-800/20'
                : 'bg-surface-2 text-muted-foreground font-mono border border-border/80'

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
              >
                <div
                  onClick={() => setExpandedId(expanded ? null : entry.id)}
                  className={cn(
                    'group relative cursor-pointer overflow-hidden rounded-xl border p-3.5 transition-all duration-200 select-none',
                    isUser
                      ? 'bg-gradient-to-r from-ce/15 via-surface to-ce/5 border-ce/60 shadow-lg shadow-ce/10 ring-1 ring-ce/40'
                      : isTop3
                      ? 'bg-gradient-to-r from-surface-2/90 to-surface border-border hover:border-border/80'
                      : 'bg-surface/80 border-border/70 hover:bg-surface hover:border-border',
                  )}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Number Icon/Badge */}
                    <span
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-lg text-xs tracking-tight',
                        rankBadgeClass,
                      )}
                    >
                      {actualRank === 1 ? (
                        <Crown className="size-4 text-slate-950 animate-bounce" />
                      ) : actualRank === 2 ? (
                        <Medal className="size-4 text-slate-950" />
                      ) : actualRank === 3 ? (
                        <Award className="size-4 text-white" />
                      ) : (
                        `#${actualRank}`
                      )}
                    </span>

                    {/* Name and Tags */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            'font-heading text-sm font-bold truncate tracking-wide',
                            isUser ? 'text-ce' : 'text-foreground',
                          )}
                        >
                          {entry.name}
                        </p>
                        {isUser ? (
                          <span className="rounded bg-ce px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-950 shadow-xs">
                            YOU
                          </span>
                        ) : (
                          <span className="rounded bg-white/5 border border-white/10 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground uppercase">
                            AI Rival
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={cn(
                            'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                            entry.gradeIndex === 4 || entry.gradeLabel.includes('Special')
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : entry.gradeIndex === 3 || entry.gradeLabel.includes('Grade 1')
                              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                              : 'bg-blue-500/15 text-blue-300 border-blue-500/30',
                          )}
                        >
                          {entry.gradeLabel}
                        </span >
                        <span className="text-[10px] text-muted-foreground">
                          Lv.{entry.level}
                        </span>
                      </div>
                    </div>

                    {/* Score / CE Volume */}
                    <div className="text-right shrink-0">
                      <div className="flex items-center justify-end gap-1 font-mono text-sm font-bold text-white">
                        <Sparkles className="size-3.5 text-ce shrink-0" />
                        <span>{entry.totalCe.toLocaleString()}</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                        Cursed Output
                      </span>
                    </div>

                    <ChevronRight
                      className={cn(
                        'size-4 text-muted-foreground/60 transition-transform duration-200 shrink-0 ml-1',
                        expanded && 'rotate-90 text-ce',
                      )}
                    />
                  </div>

                  {/* Expanded Quote Box */}
                  <AnimatePresence>
                    {expanded && entry.tagline ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden border-t border-white/10 pt-3"
                      >
                        <div className="flex items-start gap-2.5 rounded-xl bg-black/40 border border-white/5 p-3 text-xs text-slate-200 leading-relaxed italic">
                          <Quote className="size-4 text-ce shrink-0 mt-0.5 opacity-80" />
                          <div>
                            <p className="text-white/90 font-medium">
                              &ldquo;{entry.tagline}&rdquo;
                            </p>
                            <p className="mt-1.5 text-[10px] text-muted-foreground not-italic">
                              {isUser
                                ? 'Your current cursed status in the Jujutsu hierarchy.'
                                : `Registered Special Grade / Rival data profile.`}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filtered.length === 0 && !loading && (
          <div className="text-center py-10 rounded-2xl border border-dashed border-border p-6 bg-surface/40">
            <ShieldAlert className="size-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium text-foreground">No Sorcerers Found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try choosing a different grade hierarchy filter.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
