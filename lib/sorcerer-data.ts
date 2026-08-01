// Terminology is kept as a swappable config so the whole app can be
// re-themed (e.g. a different anime-style skin) by editing this object.

export const LEXICON = {
  appName: 'JUJUTSU',
  energy: 'Cursed Energy',
  energyShort: 'CE',
  mission: 'Exorcism Mission',
  missions: 'Exorcism Missions',
  domain: 'Domain',
  technique: 'Domain Technique',
  channeling: 'Channeling cursed energy',
  sensing: 'Sensing cursed energy',
} as const

export type StatKey =
  | 'strength'
  | 'stamina'
  | 'agility'
  | 'endurance'
  | 'willpower'
  | 'technique'

export const STAT_META: Record<StatKey, { label: string; short: string }> = {
  strength: { label: 'Strength', short: 'STR' },
  stamina: { label: 'Stamina', short: 'STA' },
  agility: { label: 'Agility', short: 'AGI' },
  endurance: { label: 'Endurance', short: 'END' },
  willpower: { label: 'Willpower', short: 'WIL' },
  technique: { label: 'Technique', short: 'TEC' },
}

export type Stats = Record<StatKey, number>

// Grade ladder: Grade 4 (weakest) -> Special Grade (strongest)
export const GRADES = [
  { key: 'grade-4', label: 'Grade 4', tone: 'gray' },
  { key: 'grade-3', label: 'Grade 3', tone: 'blue' },
  { key: 'grade-2', label: 'Grade 2', tone: 'violet' },
  { key: 'grade-1', label: 'Grade 1', tone: 'violet' },
  { key: 'special', label: 'Special Grade', tone: 'gold' },
] as const

export type GradeTone = 'gray' | 'blue' | 'violet' | 'crimson' | 'gold'

// Curse ranks used as workout difficulty
export const CURSE_RANKS = [
  { key: 'g4', label: 'Grade 4 Curse', tone: 'gray' },
  { key: 'g3', label: 'Grade 3 Curse', tone: 'blue' },
  { key: 'g2', label: 'Grade 2 Curse', tone: 'violet' },
  { key: 'g1', label: 'Grade 1 Curse', tone: 'crimson' },
  { key: 'sg', label: 'Special Grade Curse', tone: 'gold' },
] as const

export type CurseRankKey = (typeof CURSE_RANKS)[number]['key']

export const AURAS = [
  { key: 'violet',  label: 'Hollow Purple',  from: '#7C5CFF', to: '#4C2CFF', image: '/hollow-purple.png' },
  { key: 'jade',    label: 'Rika',           from: '#2ED9A8', to: '#128a6a', image: '/rika.png' },
  { key: 'crimson', label: 'Sacred Incineration', from: '#E4283C', to: '#8f1420', image: '/divine-flow.png' },
  { key: 'gold',    label: 'Divergent Fist', from: '#22D3EE', to: '#0891B2', image: '/divergent-fist.png' },
] as const

export type AuraKey = (typeof AURAS)[number]['key']

export const GOALS = [
  { key: 'strength', label: 'Awaken Cursed Power', blurb: 'Raw power output' },
  { key: 'endurance', label: 'Temper the Vessel', blurb: 'Shape your form' },
  { key: 'weight-loss', label: 'Exorcise the Excess', blurb: 'Burn cursed residue' },
  { key: 'general', label: 'Full Domain Awakening', blurb: 'All-around mastery' },
] as const

export type GoalKey = (typeof GOALS)[number]['key']

export interface Exercise {
  name: string
  sets: number
  reps: string
  restSec: number
  targetStat: StatKey
  cue: string
}

export interface Mission {
  id: string
  name: string
  focus: string // plain-language workout summary, e.g. "Upper Body Strength · 32 min"
  durationMin: number
  rank: CurseRankKey
  ce: number
  xp: number
  exercises: Exercise[]
}

export const MISSIONS: Mission[] = [
  {
    id: 'm-shackled-arms',
    name: 'The Shackled Vessel',
    focus: 'Upper Body Strength · 32 min',
    durationMin: 32,
    rank: 'g3',
    ce: 240,
    xp: 180,
    exercises: [
      { name: 'Cursed Press', sets: 4, reps: '8–10', restSec: 75, targetStat: 'strength', cue: 'Drive through the heels, exhale at the top.' },
      { name: 'Talisman Row', sets: 4, reps: '10–12', restSec: 60, targetStat: 'strength', cue: 'Squeeze the blades, control the descent.' },
      { name: 'Binding Vow Curl', sets: 3, reps: '12', restSec: 45, targetStat: 'technique', cue: 'No swing — let the arm do the work.' },
      { name: 'Overhead Sigil', sets: 3, reps: '10', restSec: 60, targetStat: 'stamina', cue: 'Brace the core, stack the wrists.' },
    ],
  },
  {
    id: 'm-veiled-runner',
    name: 'Flight of the Veiled',
    focus: 'Conditioning & Cardio · 24 min',
    durationMin: 24,
    rank: 'g4',
    ce: 160,
    xp: 120,
    exercises: [
      { name: 'Spirit Sprint Intervals', sets: 6, reps: '30s on / 60s off', restSec: 60, targetStat: 'agility', cue: 'Explode off the line, land soft.' },
      { name: 'Phantom Skater', sets: 4, reps: '40s', restSec: 30, targetStat: 'agility', cue: 'Reach across, stay low.' },
      { name: 'Breath Control Hold', sets: 3, reps: '45s', restSec: 30, targetStat: 'endurance', cue: 'Slow the exhale, steady the heart.' },
    ],
  },
  {
    id: 'm-iron-pillar',
    name: 'The Iron Pillar',
    focus: 'Lower Body Power · 38 min',
    durationMin: 38,
    rank: 'g2',
    ce: 320,
    xp: 240,
    exercises: [
      { name: 'Grave Squat', sets: 5, reps: '6–8', restSec: 90, targetStat: 'strength', cue: 'Sit between the hips, drive the floor apart.' },
      { name: 'Reverse Hex Lunge', sets: 4, reps: '10 / side', restSec: 60, targetStat: 'endurance', cue: 'Long step, vertical shin.' },
      { name: 'Anchor Deadlift', sets: 4, reps: '6', restSec: 90, targetStat: 'strength', cue: 'Push the earth down, hinge don’t squat.' },
      { name: 'Calf Ascension', sets: 3, reps: '15', restSec: 40, targetStat: 'stamina', cue: 'Full range, pause at the top.' },
    ],
  },
  {
    id: 'm-still-mind',
    name: 'Domain of the Still Mind',
    focus: 'Mobility & Core · 20 min',
    durationMin: 20,
    rank: 'g4',
    ce: 140,
    xp: 100,
    exercises: [
      { name: 'Hollow Vessel Hold', sets: 3, reps: '30s', restSec: 30, targetStat: 'willpower', cue: 'Low back glued down, ribs in.' },
      { name: 'Serpent Flow', sets: 2, reps: '8 cycles', restSec: 20, targetStat: 'technique', cue: 'Move with the breath, no rush.' },
      { name: 'Balance Sigil', sets: 3, reps: '45s / side', restSec: 20, targetStat: 'agility', cue: 'Fix the gaze, soft knee.' },
    ],
  },
  {
    id: 'm-cursed-crucible',
    name: 'The Cursed Crucible',
    focus: 'Full Body HIIT · 28 min',
    durationMin: 28,
    rank: 'g1',
    ce: 380,
    xp: 300,
    exercises: [
      { name: 'Exorcist Burpee', sets: 5, reps: '12', restSec: 45, targetStat: 'endurance', cue: 'Chest to floor, jump with intent.' },
      { name: 'Thunderclap Thruster', sets: 4, reps: '10', restSec: 60, targetStat: 'strength', cue: 'One fluid motion, punch the ceiling.' },
      { name: 'Shadow Climber', sets: 4, reps: '40s', restSec: 30, targetStat: 'agility', cue: 'Drive knees, keep hips level.' },
      { name: 'Will of Steel Plank Pull', sets: 3, reps: '10 / side', restSec: 40, targetStat: 'willpower', cue: 'No rotation — resist the twist.' },
    ],
  },
]

export interface Technique {
  id: string
  name: string
  lore: string
  benefit: string
  requirement: string
  tier: number
  deps: string[]
  tone: GradeTone
}

// Node-based skill tree (branching by tier).
export const TECHNIQUES: Technique[] = [
  { id: 't-awaken', name: 'First Awakening', lore: 'The moment cursed energy first stirs within.', benefit: 'Baseline conditioning established — your body learns to move under load.', requirement: 'Complete your first mission', tier: 0, deps: [], tone: 'blue' },
  { id: 't-ember', name: 'Ember Reserve', lore: 'A steady flame that refuses to gutter out.', benefit: 'Improved aerobic base and recovery between sets.', requirement: 'Log 5 missions', tier: 1, deps: ['t-awaken'], tone: 'blue' },
  { id: 't-ironhide', name: 'Ironhide Skin', lore: 'Cursed energy hardens the vessel.', benefit: 'Progressive strength gains across pressing and pulling.', requirement: 'Reach a 7-day streak', tier: 1, deps: ['t-awaken'], tone: 'violet' },
  { id: 't-swiftstep', name: 'Swiftstep', lore: 'The body slips between heartbeats.', benefit: 'Sharper agility, footwork, and reaction speed.', requirement: 'Complete 3 conditioning missions', tier: 2, deps: ['t-ember'], tone: 'violet' },
  { id: 't-deepwell', name: 'Deep Well', lore: 'An endless spring of cursed energy.', benefit: 'Major endurance ceiling increase — long sessions feel easy.', requirement: 'Log 15 missions', tier: 2, deps: ['t-ember', 't-ironhide'], tone: 'violet' },
  { id: 't-unbroken', name: 'Unbroken Will', lore: 'A vow that cannot be severed.', benefit: 'Mental resilience — you finish what you start, every time.', requirement: 'Reach a 14-day streak', tier: 2, deps: ['t-ironhide'], tone: 'gold' },
  { id: 't-domain', name: 'Domain Expansion', lore: 'The self projected outward — a sure-hit space.', benefit: 'Peak-form mastery: every stat compounds. The sorcerer is realized.', requirement: 'Log 30 missions + reach Grade 1', tier: 3, deps: ['t-deepwell', 't-unbroken'], tone: 'gold' },
]

export function xpForLevel(level: number) {
  return Math.round(300 + level * 120 + level * level * 12)
}

export const TONE_CLASS: Record<
  GradeTone,
  { text: string; ring: string; bg: string; glow: string; hex: string }
> = {
  gray: { text: 'text-muted-foreground', ring: 'ring-border', bg: 'bg-muted', glow: '', hex: '#8A8894' },
  blue: { text: 'text-[#6FA8FF]', ring: 'ring-[#6FA8FF]/40', bg: 'bg-[#6FA8FF]/10', glow: '', hex: '#6FA8FF' },
  violet: { text: 'text-ce', ring: 'ring-ce/50', bg: 'bg-ce/10', glow: 'glow-ce', hex: '#7C5CFF' },
  crimson: { text: 'text-crimson', ring: 'ring-crimson/50', bg: 'bg-crimson/10', glow: 'glow-crimson', hex: '#E4283C' },
  gold: { text: 'text-gold', ring: 'ring-gold/50', bg: 'bg-gold/10', glow: 'glow-gold', hex: '#D4AF6A' },
}
