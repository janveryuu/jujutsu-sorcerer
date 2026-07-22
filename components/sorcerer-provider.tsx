'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  AURAS,
  MISSIONS,
  TECHNIQUES,
  xpForLevel,
  type AuraKey,
  type GoalKey,
  type Mission,
  type Stats,
  type StatKey,
} from '@/lib/sorcerer-data'

export type Tab = 'home' | 'missions' | 'status' | 'domain' | 'profile'
export type WorkoutScreen = 'detail' | 'active' | 'complete'

export interface WorkoutFlow {
  missionId: string
  screen: WorkoutScreen
}

export interface RankUpEvent {
  gradeLabel: string
}

export interface BodyStat {
  date: string
  weight: number
}

export interface SorcererState {
  onboarded: boolean
  name: string
  aura: AuraKey
  goal: GoalKey
  level: number
  xp: number
  ce: number
  streak: number
  grade: number // index into GRADES
  stats: Stats
  workoutsLogged: number
  conditioningLogged: number
  joinDate: string
  totalCe: number
  longestStreak: number
  unlocked: string[]
  weekly: number[] // 7 days of CE volume
  body: BodyStat[]
  completedMissionIds: string[]
  // Expanded onboarding fields
  gender: string
  heightCm: number
  weightKg: number
  equipmentList: string[]
  workoutDays: string[]
  motivations: string[]
  focusAreas: string[]
  activityLevel: string
  fitnessLevel: string
  reminderEnabled: boolean
}

interface CompleteResult {
  ce: number
  xp: number
  rankUp: boolean
  gradeLabel: string
  newTechniques: string[]
  statGains: Partial<Stats>
}

interface Ctx {
  state: SorcererState
  tab: Tab
  setTab: (t: Tab) => void
  flow: WorkoutFlow | null
  openMission: (id: string) => void
  startActive: (id: string) => void
  finishMission: (id: string) => CompleteResult
  closeFlow: () => void
  goToComplete: (id: string) => void
  completeProfile: (p: {
    name: string
    aura: AuraKey
    goal: GoalKey
    grade: number
    stats: Stats
    gender?: string
    heightCm?: number
    weightKg?: number
    equipmentList?: string[]
    workoutDays?: string[]
    motivations?: string[]
    focusAreas?: string[]
    activityLevel?: string
    fitnessLevel?: string
    reminderEnabled?: boolean
  }) => void
  getMission: (id: string) => Mission | undefined
  lastResult: CompleteResult | null
  xpToNext: number
}

const SorcererContext = createContext<Ctx | null>(null)

const INITIAL: SorcererState = {
  onboarded: false,
  name: 'Sorcerer',
  aura: 'violet',
  goal: 'general',
  level: 7,
  xp: 420,
  ce: 1240,
  streak: 5,
  grade: 1,
  stats: {
    strength: 62,
    stamina: 54,
    agility: 48,
    endurance: 58,
    willpower: 66,
    technique: 44,
  },
  workoutsLogged: 23,
  conditioningLogged: 4,
  joinDate: 'Awakened 41 days ago',
  totalCe: 18240,
  longestStreak: 12,
  unlocked: ['t-awaken', 't-ember', 't-ironhide'],
  weekly: [320, 0, 480, 240, 0, 380, 160],
  body: [
    { date: 'Wk 1', weight: 82.5 },
    { date: 'Wk 2', weight: 81.8 },
    { date: 'Wk 3', weight: 81.1 },
    { date: 'Wk 4', weight: 80.4 },
    { date: 'Wk 5', weight: 79.9 },
    { date: 'Wk 6', weight: 79.2 },
  ],
  completedMissionIds: [],
  gender: '',
  heightCm: 170,
  weightKg: 70,
  equipmentList: [],
  workoutDays: [],
  motivations: [],
  focusAreas: [],
  activityLevel: '',
  fitnessLevel: '',
  reminderEnabled: true,
}

function checkUnlocks(s: SorcererState): string[] {
  const unlocked = new Set(s.unlocked)
  const gained: string[] = []
  const rules: Record<string, boolean> = {
    't-awaken': s.workoutsLogged >= 1,
    't-ember': s.workoutsLogged >= 5,
    't-ironhide': s.longestStreak >= 7,
    't-swiftstep': s.conditioningLogged >= 3,
    't-deepwell': s.workoutsLogged >= 15,
    't-unbroken': s.longestStreak >= 14,
    't-domain': s.workoutsLogged >= 30 && s.grade >= 3,
  }
  for (const t of TECHNIQUES) {
    const depsMet = t.deps.every((d) => unlocked.has(d))
    if (!unlocked.has(t.id) && depsMet && rules[t.id]) {
      unlocked.add(t.id)
      gained.push(t.id)
    }
  }
  return gained
}

export function SorcererProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SorcererState>(INITIAL)
  const [tab, setTab] = useState<Tab>('home')
  const [flow, setFlow] = useState<WorkoutFlow | null>(null)
  const [lastResult, setLastResult] = useState<CompleteResult | null>(null)

  // Hydrate from localStorage first for immediate UI response, then sync from backend
  useEffect(() => {
    try {
      const cached = localStorage.getItem('sorcerer_state_v1')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed && typeof parsed === 'object') {
          setState((prev) => ({ ...prev, ...parsed }))
        }
      }
    } catch {
      // Ignore localStorage errors
    }

    // Fetch authoritative state from backend API
    fetch('/api/sorcerer/state')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.state) {
          setState(data.state)
          try {
            localStorage.setItem('sorcerer_state_v1', JSON.stringify(data.state))
          } catch {}
        }
      })
      .catch((err) => console.error('Failed to sync from backend:', err))
  }, [])

  const getMission = useCallback(
    (id: string) => MISSIONS.find((m) => m.id === id),
    [],
  )

  const openMission = useCallback((id: string) => {
    setFlow({ missionId: id, screen: 'detail' })
  }, [])

  const startActive = useCallback((id: string) => {
    setFlow({ missionId: id, screen: 'active' })
  }, [])

  const goToComplete = useCallback((id: string) => {
    setFlow({ missionId: id, screen: 'complete' })
  }, [])

  const closeFlow = useCallback(() => setFlow(null), [])

  const finishMission = useCallback(
    (id: string): CompleteResult => {
      const mission = MISSIONS.find((m) => m.id === id)
      if (!mission) {
        const empty: CompleteResult = {
          ce: 0,
          xp: 0,
          rankUp: false,
          gradeLabel: '',
          newTechniques: [],
          statGains: {},
        }
        setLastResult(empty)
        return empty
      }

      let result: CompleteResult = {
        ce: mission.ce,
        xp: mission.xp,
        rankUp: false,
        gradeLabel: '',
        newTechniques: [],
        statGains: {},
      }

      setState((prev) => {
        // Stat gains derived from the exercises in the mission
        const statGains: Partial<Stats> = {}
        for (const ex of mission.exercises) {
          statGains[ex.targetStat] = (statGains[ex.targetStat] ?? 0) + 1
        }
        const stats = { ...prev.stats }
        ;(Object.keys(statGains) as StatKey[]).forEach((k) => {
          stats[k] = Math.min(100, stats[k] + (statGains[k] ?? 0))
        })

        let level = prev.level
        let xp = prev.xp + mission.xp
        while (xp >= xpForLevel(level)) {
          xp -= xpForLevel(level)
          level += 1
        }

        const streak = prev.streak + 1
        const longestStreak = Math.max(prev.longestStreak, streak)
        const isConditioning =
          mission.focus.toLowerCase().includes('cardio') ||
          mission.focus.toLowerCase().includes('conditioning')

        let next: SorcererState = {
          ...prev,
          stats,
          level,
          xp,
          ce: prev.ce + mission.ce,
          totalCe: prev.totalCe + mission.ce,
          streak,
          longestStreak,
          workoutsLogged: prev.workoutsLogged + 1,
          conditioningLogged: prev.conditioningLogged + (isConditioning ? 1 : 0),
          weekly: [...prev.weekly.slice(1), mission.ce],
          completedMissionIds: [...prev.completedMissionIds, id],
        }

        // Rank up when crossing a level threshold that maps to grades
        const gradeThresholds = [0, 5, 10, 16, 24] // level required per grade index
        let grade = prev.grade
        while (
          grade < gradeThresholds.length - 1 &&
          next.level >= gradeThresholds[grade + 1]
        ) {
          grade += 1
        }
        const rankUp = grade > prev.grade
        next = { ...next, grade }

        const gained = checkUnlocks(next)
        next = { ...next, unlocked: [...next.unlocked, ...gained] }

        const GRADE_LABELS = [
          'Grade 4',
          'Grade 3',
          'Grade 2',
          'Grade 1',
          'Special Grade',
        ]
        result = {
          ce: mission.ce,
          xp: mission.xp,
          rankUp,
          gradeLabel: GRADE_LABELS[grade],
          newTechniques: gained,
          statGains,
        }

        try {
          localStorage.setItem('sorcerer_state_v1', JSON.stringify(next))
        } catch {}

        // Asynchronously persist completed mission to backend server & sync authoritative state
        setTimeout(() => {
          fetch('/api/missions/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ missionId: id }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success && data.result?.updatedState) {
                setState(data.result.updatedState)
                try {
                  localStorage.setItem(
                    'sorcerer_state_v1',
                    JSON.stringify(data.result.updatedState),
                  )
                } catch {}
              }
            })
            .catch((err) => console.error('Failed to log mission to backend:', err))
        }, 0)

        return next
      })

      setLastResult(result)
      return result
    },
    [],
  )

  const completeProfile = useCallback<Ctx['completeProfile']>((p) => {
    const nextState: SorcererState = {
      ...state,
      onboarded: true,
      name: p.name || 'Sorcerer',
      aura: p.aura,
      goal: p.goal,
      grade: p.grade,
      stats: p.stats,
      level: 1,
      xp: 40,
      ce: 120,
      streak: 0,
      longestStreak: 0,
      workoutsLogged: 0,
      conditioningLogged: 0,
      totalCe: 120,
      joinDate: 'Awakened today',
      unlocked: [],
      weekly: [0, 0, 0, 0, 0, 0, 0],
      completedMissionIds: [],
      gender: p.gender || '',
      heightCm: p.heightCm || 170,
      weightKg: p.weightKg || 70,
      equipmentList: p.equipmentList || [],
      workoutDays: p.workoutDays || [],
      motivations: p.motivations || [],
      focusAreas: p.focusAreas || [],
      activityLevel: p.activityLevel || '',
      fitnessLevel: p.fitnessLevel || '',
      reminderEnabled: p.reminderEnabled ?? true,
    }

    setState(nextState)
    setTab('home')

    try {
      localStorage.setItem('sorcerer_state_v1', JSON.stringify(nextState))
    } catch {}

    // Persist profile to backend API
    fetch('/api/sorcerer/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates: nextState }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.state) {
          setState(data.state)
        }
      })
      .catch((err) => console.error('Failed to save profile to backend:', err))
  }, [state])

  const xpToNext = useMemo(() => xpForLevel(state.level), [state.level])

  const value = useMemo<Ctx>(
    () => ({
      state,
      tab,
      setTab,
      flow,
      openMission,
      startActive,
      finishMission,
      closeFlow,
      goToComplete,
      completeProfile,
      getMission,
      lastResult,
      xpToNext,
    }),
    [
      state,
      tab,
      flow,
      openMission,
      startActive,
      finishMission,
      closeFlow,
      goToComplete,
      completeProfile,
      getMission,
      lastResult,
      xpToNext,
    ],
  )

  return (
    <SorcererContext.Provider value={value}>
      {children}
    </SorcererContext.Provider>
  )
}

export function useSorcerer() {
  const ctx = useContext(SorcererContext)
  if (!ctx) throw new Error('useSorcerer must be used within SorcererProvider')
  return ctx
}

export { AURAS }
