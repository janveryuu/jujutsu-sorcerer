import { NextResponse } from 'next/server'
import {
  MISSIONS,
  TECHNIQUES,
  xpForLevel,
  type StatKey,
  type Stats,
  type Mission,
} from '@/lib/sorcerer-data'
import { SorcererStore } from '@/lib/backend/store'
import type { SorcererState } from '@/components/sorcerer-provider'

const GRADE_LABELS = [
  'Grade 4',
  'Grade 3',
  'Grade 2',
  'Grade 1',
  'Special Grade',
]

function checkServerUnlocks(s: SorcererState): string[] {
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

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId = 'default', missionId, customMission } = body

    if (!missionId && !customMission) {
      return NextResponse.json(
        { success: false, error: 'Missing mission identifier or payload' },
        { status: 400 },
      )
    }

    // 1. Resolve mission definition
    let mission: Mission | undefined = MISSIONS.find((m) => m.id === missionId)
    if (!mission && customMission && customMission.id) {
      mission = customMission
    }
    if (!mission) {
      const customList = await SorcererStore.getCustomMissions(userId)
      mission = customList.find((m) => m.id === missionId)
    }

    if (!mission) {
      return NextResponse.json(
        { success: false, error: 'Mission definition not found' },
        { status: 404 },
      )
    }

    // 2. Fetch current user state
    const prev = await SorcererStore.getProfile(userId)

    // 3. Compute stat gains
    const statGains: Partial<Stats> = {}
    for (const ex of mission.exercises) {
      statGains[ex.targetStat] = (statGains[ex.targetStat] ?? 0) + 1
    }
    const stats: Stats = { ...prev.stats }
    ;(Object.keys(statGains) as StatKey[]).forEach((k) => {
      stats[k] = Math.min(100, stats[k] + (statGains[k] ?? 0))
    })

    // 4. Compute XP & Level progression
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

    let nextState: SorcererState = {
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
      completedMissionIds: [...prev.completedMissionIds, mission.id],
    }

    // 5. Rank up when crossing a level threshold that maps to grades
    const gradeThresholds = [0, 5, 10, 16, 24]
    let grade = prev.grade
    while (
      grade < gradeThresholds.length - 1 &&
      nextState.level >= gradeThresholds[grade + 1]
    ) {
      grade += 1
    }
    const rankUp = grade > prev.grade
    nextState = { ...nextState, grade }

    // 6. Check technique unlocks server-side
    const gained = checkServerUnlocks(nextState)
    nextState = {
      ...nextState,
      unlocked: Array.from(new Set([...nextState.unlocked, ...gained])),
    }

    // 7. Persist updated profile
    await SorcererStore.saveProfile(userId, nextState)

    // 8. Automatically sync user to leaderboard
    await SorcererStore.syncLeaderboard({
      id: userId === 'default' ? 'user-sorcerer' : userId,
      name: nextState.name || 'Sorcerer',
      gradeLabel: GRADE_LABELS[grade] || 'Grade 3',
      gradeIndex: grade,
      totalCe: nextState.totalCe,
      level: nextState.level,
      aura: nextState.aura,
      isAI: false,
      tagline: `Awakened Sorcerer · ${nextState.workoutsLogged} exorcisms completed`,
    })

    const result = {
      ce: mission.ce,
      xp: mission.xp,
      rankUp,
      gradeLabel: GRADE_LABELS[grade] || 'Grade 3',
      newTechniques: gained,
      statGains,
      updatedState: nextState,
    }

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Error logging completed mission:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to log mission completion' },
      { status: 500 },
    )
  }
}
