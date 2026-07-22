import fs from 'fs/promises'
import path from 'path'
import type { AuraKey, GoalKey, Mission, Stats } from '@/lib/sorcerer-data'
import type { SorcererState, BodyStat } from '@/components/sorcerer-provider'

export interface LeaderboardEntry {
  id: string
  name: string
  gradeLabel: string
  gradeIndex: number
  totalCe: number
  level: number
  aura: AuraKey
  isAI: boolean
  tagline?: string
}

export interface StoreData {
  profiles: Record<string, SorcererState>
  customMissions: Record<string, Mission[]>
  leaderboard: LeaderboardEntry[]
}

const DEFAULT_STATS: Stats = {
  strength: 62,
  stamina: 54,
  agility: 48,
  endurance: 58,
  willpower: 66,
  technique: 44,
}

const DEFAULT_PROFILE: SorcererState = {
  onboarded: false,
  name: 'Sorcerer',
  aura: 'violet',
  goal: 'general',
  level: 7,
  xp: 420,
  ce: 1240,
  streak: 5,
  grade: 1,
  stats: DEFAULT_STATS,
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

const PRESEED_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'ai-gojo',
    name: 'Satoru Gojo',
    gradeLabel: 'Special Grade',
    gradeIndex: 4,
    totalCe: 999999,
    level: 99,
    aura: 'violet',
    isAI: true,
    tagline: 'Throughout Heaven and Earth, I alone am the honored one.',
  },
  {
    id: 'ai-sukuna',
    name: 'Ryomen Sukuna',
    gradeLabel: 'Special Grade',
    gradeIndex: 4,
    totalCe: 950000,
    level: 99,
    aura: 'crimson',
    isAI: true,
    tagline: 'Know your place, fool.',
  },
  {
    id: 'ai-yuta',
    name: 'Yuta Okkotsu',
    gradeLabel: 'Special Grade',
    gradeIndex: 4,
    totalCe: 420000,
    level: 84,
    aura: 'jade',
    isAI: true,
    tagline: "I won't let my friends die again.",
  },
  {
    id: 'ai-maki',
    name: "Maki Zen'in",
    gradeLabel: 'Special Grade',
    gradeIndex: 4,
    totalCe: 380000,
    level: 78,
    aura: 'crimson',
    isAI: true,
    tagline: 'I left everything behind.',
  },
  {
    id: 'ai-hakari',
    name: 'Kinji Hakari',
    gradeLabel: 'Grade 1',
    gradeIndex: 3,
    totalCe: 210000,
    level: 65,
    aura: 'gold',
    isAI: true,
    tagline: 'Always bet on Hakari.',
  },
  {
    id: 'ai-todo',
    name: 'Aoi Todo',
    gradeLabel: 'Grade 1',
    gradeIndex: 3,
    totalCe: 185000,
    level: 62,
    aura: 'gold',
    isAI: true,
    tagline: 'What kind of woman is your type?',
  },
  {
    id: 'ai-nanami',
    name: 'Kento Nanami',
    gradeLabel: 'Grade 1',
    gradeIndex: 3,
    totalCe: 160000,
    level: 58,
    aura: 'jade',
    isAI: true,
    tagline: 'Overtime starts now.',
  },
  {
    id: 'ai-yuji',
    name: 'Yuji Itadori',
    gradeLabel: 'Grade 1',
    gradeIndex: 3,
    totalCe: 125000,
    level: 50,
    aura: 'crimson',
    isAI: true,
    tagline: "I won't lose. Not until I die surrounded by others.",
  },
  {
    id: 'ai-megumi',
    name: 'Megumi Fushiguro',
    gradeLabel: 'Grade 2',
    gradeIndex: 2,
    totalCe: 92000,
    level: 45,
    aura: 'violet',
    isAI: true,
    tagline: 'With this treasure I summon...',
  },
  {
    id: 'ai-nobara',
    name: 'Nobara Kugisaki',
    gradeLabel: 'Grade 3',
    gradeIndex: 1,
    totalCe: 54000,
    level: 32,
    aura: 'crimson',
    isAI: true,
    tagline: "I love myself when I'm pretty and when I'm strong!",
  },
]

// In-memory cache for fast operations and fallback when running on serverless
let memoryStore: StoreData = {
  profiles: { default: { ...DEFAULT_PROFILE } },
  customMissions: { default: [] },
  leaderboard: [...PRESEED_LEADERBOARD],
}

const DATA_DIR = path.join(process.cwd(), 'data')
const STORE_FILE = path.join(DATA_DIR, 'sorcerer-store.json')

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch {
    // Ignore error if dir exists or if filesystem is read-only in serverless
  }
}

async function loadStore(): Promise<StoreData> {
  // Check Supabase if configured
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/sorcerer_store?id=eq.global&select=data`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      })
      if (res.ok) {
        const rows = await res.json()
        if (rows && rows.length > 0 && rows[0].data) {
          memoryStore = rows[0].data
          return memoryStore
        }
      }
    } catch (err) {
      console.error('Supabase load fallback:', err)
    }
  }

  // Fallback to local JSON file
  try {
    const raw = await fs.readFile(STORE_FILE, 'utf-8')
    const parsed = JSON.parse(raw) as StoreData
    if (parsed && parsed.leaderboard) {
      memoryStore = parsed
      return memoryStore
    }
  } catch {
    // If file doesn't exist yet, save initialized memoryStore
    await saveStore(memoryStore)
  }

  return memoryStore
}

async function saveStore(data: StoreData): Promise<void> {
  memoryStore = data

  // Check Supabase if configured
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/sorcerer_store`, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify([{ id: 'global', data }]),
      })
      return
    } catch (err) {
      console.error('Supabase save fallback:', err)
    }
  }

  // Fallback to local JSON file
  try {
    await ensureDataDir()
    await fs.writeFile(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch {
    // In read-only serverless environment, memory cache is used
  }
}

export const SorcererStore = {
  async getProfile(userId = 'default'): Promise<SorcererState> {
    const store = await loadStore()
    if (!store.profiles[userId]) {
      store.profiles[userId] = { ...DEFAULT_PROFILE }
      await saveStore(store)
    }
    return store.profiles[userId]
  },

  async saveProfile(userId = 'default', updates: Partial<SorcererState>): Promise<SorcererState> {
    const store = await loadStore()
    const current = store.profiles[userId] || { ...DEFAULT_PROFILE }
    const updated: SorcererState = {
      ...current,
      ...updates,
    }
    store.profiles[userId] = updated
    await saveStore(store)
    return updated
  },

  async getCustomMissions(userId = 'default'): Promise<Mission[]> {
    const store = await loadStore()
    return store.customMissions[userId] || []
  },

  async saveCustomMission(userId = 'default', mission: Mission): Promise<Mission[]> {
    const store = await loadStore()
    const current = store.customMissions[userId] || []
    // Avoid exact duplicate ID
    const filtered = current.filter((m) => m.id !== mission.id)
    const updated = [mission, ...filtered]
    store.customMissions[userId] = updated
    await saveStore(store)
    return updated
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const store = await loadStore()
    const list = store.leaderboard || [...PRESEED_LEADERBOARD]
    return [...list].sort((a, b) => b.totalCe - a.totalCe)
  },

  async syncLeaderboard(entry: LeaderboardEntry): Promise<LeaderboardEntry[]> {
    const store = await loadStore()
    const current = store.leaderboard || [...PRESEED_LEADERBOARD]
    const filtered = current.filter((e) => e.id !== entry.id)
    const updated = [...filtered, entry].sort((a, b) => b.totalCe - a.totalCe)
    store.leaderboard = updated
    await saveStore(store)
    return updated
  },

  async logBodyWeight(userId = 'default', dateStr: string, weightKg: number): Promise<BodyStat[]> {
    const store = await loadStore()
    const profile = store.profiles[userId] || { ...DEFAULT_PROFILE }
    const updatedBody = [...profile.body, { date: dateStr, weight: weightKg }]
    profile.body = updatedBody
    profile.weightKg = weightKg
    store.profiles[userId] = profile
    await saveStore(store)
    return updatedBody
  },
}
