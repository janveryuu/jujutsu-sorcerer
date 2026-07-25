'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  User,
  Users,
  Dumbbell,
  Flame,
  Heart,
  Shield,
  Zap,
  Target,
  Clock,
  Droplets,
  Timer,
  Calendar,
  Award,
  TrendingUp,
  AlertTriangle,
  Fingerprint,
  Brain,
  Eye,
  Swords,
  Activity,
} from 'lucide-react'
import {
  UntamedPowerIcon,
  VesselIntegrityIcon,
  RefinedFormIcon,
  StillnessOfMindIcon,
  SwornBondsIcon,
  ThrillOfTheHuntIcon,
} from './jjk-icons'
import { JujutsuLogo } from './jujutsu-logo'
import {
  FullBodyIcon,
  ChestIcon,
  BackIcon,
  ArmsIcon,
  ShouldersIcon,
  AbsIcon,
  LegsIcon,
  GlutesIcon,
} from './zone-icons'
import { Grade4SealIcon, Grade2SealIcon, Grade1SealIcon } from './rank-icons'
import { ACTIVITY_METERS } from './activity-meters'
import {
  BodyweightIcon,
  FullGymIcon,
  BarbellIcon,
  DumbbellIcon,
  KettlebellIcon,
  MachineIcon,
} from './equipment-icons'
import { CursedEnergyBg } from './cursed-energy-bg'
import { SorcererButton, GradeChip, EnergyBar } from './sorcerer-ui'
import { useSorcerer } from './sorcerer-provider'
import { useAuth } from './auth-provider'
import {
  AURAS,
  GOALS,
  GRADES,
  type AuraKey,
  type GoalKey,
  type Stats,
  type StatKey,
} from '@/lib/sorcerer-data'
import { cn } from '@/lib/utils'

/* ===================================================================
   CONSTANTS — Options for each step
   =================================================================== */

const GENDERS = [
  { key: 'male', label: 'Male', icon: User },
  { key: 'female', label: 'Female', icon: Users },
  { key: 'other', label: 'Other', icon: Sparkles },
]

const AMBITIONS = [
  {
    key: 'strength',
    label: 'Build Strength',
    desc: 'Raw power output',
  },
  {
    key: 'weight-loss',
    label: 'Lose Weight',
    desc: 'Burn fat',
  },
  {
    key: 'endurance',
    label: 'Tone Up',
    desc: 'Shape your body',
  },
  {
    key: 'general',
    label: 'General Fitness',
    desc: 'All-around mastery',
  },
]

const MOTIVATIONS = [
  {
    key: 'strength',
    label: 'Raw Strength',
    desc: 'Build maximum power output, heavy lifting capacity, and raw force.',
  },
  {
    key: 'health',
    label: 'Health',
    desc: 'Improve longevity, cardiovascular stamina, and overall body vitality.',
  },
  {
    key: 'appearance',
    label: 'Appearance',
    desc: 'Sculpt muscle definition, burn fat, and achieve an aesthetic physique.',
  },
  {
    key: 'peace',
    label: 'Mental Wellness',
    desc: 'Sharpen focus, relieve stress, and cultivate inner discipline.',
  },
  {
    key: 'bonds',
    label: 'Community / Support System',
    desc: 'Train with allies, share workout progress, and stay accountable.',
  },
  {
    key: 'thrill',
    label: 'Competition',
    desc: 'Test your limits against rivals and conquer grade leaderboards.',
  },
]

const FOCUS_AREAS = [
  { key: 'full-body', label: 'Full Body', Icon: FullBodyIcon, image: '/zones/full-body.png' },
  { key: 'chest', label: 'Chest', Icon: ChestIcon, image: '/zones/chest.png' },
  { key: 'back', label: 'Back', Icon: BackIcon, image: '/zones/back.png' },
  { key: 'arms', label: 'Arms', Icon: ArmsIcon, image: '/zones/arms.png' },
  { key: 'shoulders', label: 'Shoulders', Icon: ShouldersIcon, image: '/zones/shoulders.png' },
  { key: 'abs', label: 'Abs', Icon: AbsIcon, image: '/zones/abs.png' },
  { key: 'legs', label: 'Legs', Icon: LegsIcon, image: '/zones/legs.png' },
  { key: 'glutes', label: 'Glutes', Icon: GlutesIcon, image: '/zones/glutes.png' },
]

const FITNESS_LEVELS = [
  {
    key: 'beginner',
    label: 'Grade 4',
    subtitle: 'Beginner',
    desc: 'Just awakening to fitness. New or barely started.',
    detailedDesc: 'Grade 4 (Beginner): Ideal for newcomers. Focuses on fundamental movements, light weights, proper form, and gradual strength progression.',
    grade: 0,
  },
  {
    key: 'intermediate',
    label: 'Grade 2',
    subtitle: 'Intermediate',
    desc: 'Trained before and familiar with exercise basics.',
    detailedDesc: 'Grade 2 (Intermediate): For consistent lifters. Features moderate volume, compound lifts, progressive overload, and structured splits.',
    grade: 1,
  },
  {
    key: 'advanced',
    label: 'Grade 1',
    subtitle: 'Advanced',
    desc: 'Been training consistently with a solid athletic foundation.',
    detailedDesc: 'Grade 1 (Advanced): For experienced athletes. High-intensity workouts, heavy compound loads, challenging rest timers, and maximum output.',
    grade: 2,
  },
]

const ACTIVITY_LEVELS = [
  { key: 'sedentary', label: 'Sedentary',         desc: 'Little to no exercise.',           image: '/activity/stagnant.png' },
  { key: 'light',     label: 'Lightly Active',    desc: 'Light exercise 1–3 days a week.',  image: '/activity/flickering.png' },
  { key: 'moderate',  label: 'Moderately Active', desc: 'Moderate exercise 4–6 days a week.', image: '/activity/channeling.png' },
  { key: 'active',    label: 'Very Active',       desc: 'Intense training every day.',      image: '/activity/overflowing.png' },
]

const EQUIPMENT_OPTIONS = [
  { key: 'none',         label: 'None (Bodyweight)', sub: 'Your vessel alone',          Icon: BodyweightIcon, image: '/equipment/bodyweight.png'  },
  { key: 'full-gym',    label: 'Full Gym',           sub: 'Full arsenal',               Icon: FullGymIcon,    image: '/equipment/full-gym.png'   },
  { key: 'barbells',    label: 'Barbells',           sub: 'Raw iron weight',            Icon: BarbellIcon,    image: '/equipment/barbell.png'    },
  { key: 'dumbbells',   label: 'Dumbbells',          sub: 'Balanced power, both hands', Icon: DumbbellIcon,   image: '/equipment/dumbbell.png'   },
  { key: 'kettlebells', label: 'Kettlebells',        sub: 'Momentum and control',       Icon: KettlebellIcon, image: '/equipment/kettlebell.png' },
  { key: 'machines',    label: 'Machines',           sub: 'Guided resistance',          Icon: MachineIcon,    image: '/equipment/gym-machine.png'},
]

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const WARNING_SLIDES = [
  {
    title: 'Fitness Decline',
    desc: 'Your fitness potential declines with every day you skip training.',
    image: '/crazy-gojo-z.png',
    icon: '☁️',
    color: 'from-crimson/20',
  },
  {
    title: 'Body Neglect',
    desc: 'A neglected body silently weakens, making you more prone to injury and illness.',
    image: '/body-neglect.png',
    icon: '💔',
    color: 'from-crimson/20',
  },
  {
    title: 'Motivation Decline',
    desc: 'Inactivity chips away at your motivation and confidence over time.',
    image: '/motivation-decline.png',
    icon: '🌀',
    color: 'from-ce/20',
  },
  {
    title: 'Time for Awakening',
    desc: 'Every sorcerer\'s journey begins with a single step. Take yours now.',
    icon: '⏰',
    color: 'from-ce/20',
    positive: true,
  },
]

const OATH_QUESTIONS = [
  'Is there a version of yourself you dream of becoming?',
  'Are you willing to challenge your own limits to grow?',
  'Do you believe that small changes can lead to big transformations?',
  'Would you invest in yourself if you knew it could change your life?',
]

const GENERATION_STEPS = [
  'Physical Attributes',
  'Fitness Level',
  'Power Analysis',
  'Rank Calibration',
  'Workout Generation',
]

const TOTAL_STEPS = 22
const transition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }

/* ===================================================================
   MAIN ONBOARDING COMPONENT
   =================================================================== */

export function Onboarding() {
  const { completeProfile } = useSorcerer()
  const { status, user } = useAuth()
  const [step, setStep] = useState(0)

  // Automatically advance to System Notification if logged in
  useEffect(() => {
    if (step === 0 && status === 'authenticated' && user) {
      setStep(1)
    }
  }, [step, status, user])

  // All onboarding state
  const [name, setName] = useState('')

  // Pre-fill name from Google/Email account if available
  useEffect(() => {
    if (user?.name && !name) {
      setName(user.name)
    }
  }, [user, name])

  const [gender, setGender] = useState('')
  const [aura, setAura] = useState<AuraKey>('violet')
  const [goal, setGoal] = useState<GoalKey>('general')
  const [motivations, setMotivations] = useState<string[]>([])
  const [focusAreas, setFocusAreas] = useState<string[]>([])
  const [fitnessLevel, setFitnessLevel] = useState('intermediate')
  const [activityLevel, setActivityLevel] = useState('light')
  const [heightFt, setHeightFt] = useState(5)
  const [heightIn, setHeightIn] = useState(8)
  const [useMetric, setUseMetric] = useState(false)
  const [heightCm, setHeightCm] = useState(173)
  const [weightKg, setWeightKg] = useState(70)
  const [weightLbs, setWeightLbs] = useState(154)
  const [useLbs, setUseLbs] = useState(false)
  const [equipment, setEquipment] = useState<string[]>([])
  const [workoutDays, setWorkoutDays] = useState<string[]>(['Monday', 'Wednesday', 'Friday'])
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [oathStep, setOathStep] = useState(0)
  const [warningSlide, setWarningSlide] = useState(0)

  const assignedGradeIdx = FITNESS_LEVELS.find((l) => l.key === fitnessLevel)?.grade ?? 0

  function seedStats(): Stats {
    const base = 30 + assignedGradeIdx * 8
    const s: Stats = {
      strength: base,
      stamina: base,
      agility: base,
      endurance: base,
      willpower: base + 6,
      technique: base - 4,
    }
    const bump: Partial<Record<GoalKey, StatKey>> = {
      strength: 'strength',
      endurance: 'endurance',
      'weight-loss': 'stamina',
      general: 'willpower',
    }
    const k = bump[goal]
    if (k) s[k] = Math.min(100, s[k] + 12)
    return s
  }

  const finalHeightCm = useMetric ? heightCm : Math.round((heightFt * 12 + heightIn) * 2.54)
  const finalWeightKg = useLbs ? Math.round(weightLbs * 0.4536) : weightKg

  function finish() {
    completeProfile({
      name,
      aura,
      goal,
      grade: assignedGradeIdx,
      stats: seedStats(),
      gender,
      heightCm: finalHeightCm,
      weightKg: finalWeightKg,
      equipmentList: equipment,
      workoutDays,
      motivations,
      focusAreas,
      activityLevel,
      fitnessLevel,
      reminderEnabled,
    })
  }

  // Steps that show the progress bar (quiz steps 2-11)
  const showProgressBar = step >= 2 && step <= 11
  const progressPercent = showProgressBar ? ((step - 1) / 10) * 100 : 0

  const next = useCallback(() => setStep((s) => s + 1), [])
  const back = useCallback(() => setStep((s) => Math.max(0, s - 1)), [])

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-background">
      <CursedEnergyBg density={20} />

      {/* Progress bar for quiz steps */}
      {showProgressBar && (
        <div className="relative z-20 flex items-center gap-3 px-5 pt-4">
          <button onClick={back} className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #00f0ff, #0284c7)' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 0 && <HeroSplash key="hero" onNext={next} />}
        {step === 1 && <SystemNotification key="notif" onAccept={next} />}
        {step === 2 && <ChooseGender key="gender" value={gender} onChange={setGender} onNext={next} />}
        {step === 3 && <ChooseAmbition key="ambition" value={goal} onChange={setGoal} onNext={next} />}
        {step === 4 && <ChooseMotivation key="motivation" values={motivations} onChange={setMotivations} onNext={next} />}
        {step === 5 && <ChooseFocusAreas key="focus" values={focusAreas} onChange={setFocusAreas} onNext={next} />}
        {step === 6 && <ChooseFitnessLevel key="fitness" value={fitnessLevel} onChange={setFitnessLevel} onNext={next} />}
        {step === 7 && <ChooseActivityLevel key="activity" value={activityLevel} onChange={setActivityLevel} onNext={next} />}
        {step === 8 && (
          <HeightPicker
            key="height"
            ft={heightFt} setFt={setHeightFt}
            inches={heightIn} setInches={setHeightIn}
            cm={heightCm} setCm={setHeightCm}
            useMetric={useMetric} setUseMetric={setUseMetric}
            onNext={next}
          />
        )}
        {step === 9 && (
          <WeightPicker
            key="weight"
            kg={weightKg} setKg={setWeightKg}
            lbs={weightLbs} setLbs={setWeightLbs}
            useLbs={useLbs} setUseLbs={setUseLbs}
            onNext={next}
          />
        )}
        {step === 10 && <ChooseEquipment key="equip" values={equipment} onChange={setEquipment} onNext={next} />}
        {step === 11 && (
          <WorkoutDaysStep
            key="days"
            days={workoutDays} onChange={setWorkoutDays}
            reminder={reminderEnabled} setReminder={setReminderEnabled}
            onNext={next}
          />
        )}
        {step === 12 && (
          <SummaryPreview
            key="summary"
            heightCm={finalHeightCm} weightKg={finalWeightKg}
            fitnessLevel={fitnessLevel} activityLevel={activityLevel}
            focusAreas={focusAreas} workoutDays={workoutDays}
            onNext={next}
          />
        )}
        {step === 13 && <GeneratingPlan key="generating" onDone={next} />}
        {step === 14 && <AnalysisComplete key="analysis" onNext={next} />}
        {step === 15 && (
          <WarningCarousel
            key="warning"
            slide={warningSlide} setSlide={setWarningSlide}
            onDone={next}
          />
        )}
        {step === 16 && <SorcererStats key="stats" stats={seedStats()} onNext={next} />}
        {step === 17 && <NinetyDayProjection key="projection" gradeIdx={assignedGradeIdx} onNext={next} />}
        {step === 18 && (
          <OathQuestions
            key="oath"
            questionIdx={oathStep} setQuestionIdx={setOathStep}
            onDone={next}
          />
        )}
        {step === 19 && <LockIn key="lockin" onDone={next} />}
        {step === 20 && <TypewriterReveal key="typewriter" onDone={next} />}
        {step === 21 && (
          <ForgeIdentity
            key="forge"
            name={name} setName={setName}
            aura={aura} setAura={setAura}
            onNext={next}
          />
        )}
        {step === 22 && <GradeCeremony key="ceremony" gradeIdx={assignedGradeIdx} onDone={finish} />}
      </AnimatePresence>
    </div>
  )
}

/* ===================================================================
   STEP 0 — HERO SPLASH
   =================================================================== */
function HeroSplash({ onNext }: { onNext: () => void }) {
  const { openAuthModal, user, status } = useAuth()

  useEffect(() => {
    if (status === 'authenticated' && user) {
      const timer = setTimeout(() => {
        onNext()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [user, status, onNext])

  return (
    <motion.section
      key="hero"
      className="relative z-10 flex flex-1 flex-col items-center justify-end px-6 pb-12 pt-8 text-center min-h-dvh"
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={transition}
    >
      {/* Full-screen background image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/jujutsu-hero-bg.jpg"
          alt="Jujutsu Hero Background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Glow accent overlay */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-ce/20 blur-[100px]" />
        {/* Gradient overlay for perfect text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/40" />
      </div>


      {/* Content overlaying the silhouette */}
      <div className="relative z-20 flex flex-col items-center mt-auto w-full">
        <motion.p
          className="text-xs font-sans font-semibold uppercase tracking-[0.5em] text-white/60 mb-2 drop-shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Level Up In Real Life
        </motion.p>

        <motion.h1
          className="font-heading text-7xl tracking-[0.12em] text-white drop-shadow-[0_4px_28px_rgba(0,240,255,0.75)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, ...transition }}
        >
          JUJUTSU
        </motion.h1>

        <motion.p
          className="mt-4 max-w-[28ch] text-pretty leading-relaxed text-white/65 drop-shadow-md font-sans text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Every rep is technique. Every session moves you up the grades. Train
          until your true form awakens.
        </motion.p>

        <motion.div
          className="mt-8 w-full space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {status === 'loading' || status === 'authenticated' ? (
            <div className="flex w-full items-center justify-center py-3">
              <Sparkles className="size-5 text-ce animate-pulse" />
            </div>
          ) : (
            <SorcererButton className="w-full" icon={ChevronRight} onClick={openAuthModal}>
              Sign In to Begin
            </SorcererButton>
          )}
        </motion.div>
      </div>
    </motion.section>
  )
}

/* ===================================================================
   STEP 1 — SYSTEM NOTIFICATION
   =================================================================== */
function SystemNotification({ onAccept }: { onAccept: () => void }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.section
      key="notif"
      className="relative z-10 flex flex-1 flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={transition}
    >
      {/* Dark background with subtle energy */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-64 h-64 rounded-full bg-ce/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <AnimatePresence>
        {visible && (
          <motion.div
            className="relative glass-panel rounded-2xl p-8 max-w-sm w-full text-center"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {/* Notification icon */}
            <motion.div
              className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-ce/10 ring-1 ring-ce/30"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              <Sparkles className="size-8 text-ce" />
            </motion.div>

            <motion.p
              className="text-xs uppercase tracking-[0.3em] text-ce mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              System Notification
            </motion.p>

            <motion.p
              className="text-lg font-medium leading-relaxed text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              You have acquired the qualifications to become a{' '}
              <span className="text-ce-gradient font-bold">Sorcerer</span>.
              <br />
              <span className="text-muted-foreground text-base">Will you accept?</span>
            </motion.p>

            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <SorcererButton className="w-full" onClick={onAccept}>
                Accept
              </SorcererButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

/* ===================================================================
   STEP 2 — CHOOSE GENDER
   =================================================================== */
function ChooseGender({ value, onChange, onNext }: { value: string; onChange: (v: string) => void; onNext: () => void }) {
  return (
    <QuizStep title="Choose your vessel" onNext={onNext} canProceed={!!value}>
      <div className="flex flex-col gap-3">
        {GENDERS.map((g) => {
          const Icon = g.icon
          return (
            <SelectCard key={g.key} selected={value === g.key} onClick={() => onChange(g.key)}>
              <div className="flex items-center gap-4">
                <span className={cn(
                  'flex size-10 items-center justify-center rounded-xl transition-colors',
                  value === g.key ? 'bg-ce/20' : 'bg-surface-2'
                )}>
                  <Icon className={cn('size-5', value === g.key ? 'text-ce' : 'text-muted-foreground')} />
                </span>
                <span className="text-sm font-semibold">{g.label}</span>
              </div>
            </SelectCard>
          )
        })}
      </div>
    </QuizStep>
  )
}

/* ===================================================================
   STEP 3 — CHOOSE AMBITION (Goal)
   =================================================================== */
function ChooseAmbition({ value, onChange, onNext }: { value: GoalKey; onChange: (v: GoalKey) => void; onNext: () => void }) {
  return (
    <QuizStep title="What's your fitness goal?" onNext={onNext} canProceed={true}>
      <div className="flex flex-col gap-3">
        {AMBITIONS.map((a) => {
          return (
            <SelectCard key={a.key} selected={value === a.key} onClick={() => onChange(a.key as GoalKey)}>
              <div className="py-1">
                <p className="text-base font-bold text-white">{a.label}</p>
                <p className="text-xs text-ce mt-0.5">{a.desc}</p>
              </div>
            </SelectCard>
          )
        })}
      </div>
    </QuizStep>
  )
}

/* ===================================================================
   STEP 4 — MOTIVATIONS (Multi-select)
   =================================================================== */
function ChooseMotivation({ values, onChange, onNext }: { values: string[]; onChange: (v: string[]) => void; onNext: () => void }) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  function toggle(key: string) {
    onChange(values.includes(key) ? values.filter((v) => v !== key) : [...values, key])
  }

  const activeHoveredDesc = MOTIVATIONS.find((m) => m.key === hoveredKey)?.desc

  return (
    <QuizStep title="What motivates you?" onNext={onNext} canProceed={values.length > 0}>
      {/* Live hover/active description bar */}
      <div className="min-h-[40px] mb-3 px-3 py-2 rounded-xl bg-surface-2/80 border border-ce/20 flex items-center justify-center text-center transition-all duration-200">
        <p className="text-xs text-ce font-medium">
          {activeHoveredDesc || 'Hover or select an option to see details'}
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {MOTIVATIONS.map((m) => {
          const active = values.includes(m.key)
          return (
            <button
              key={m.key}
              onClick={() => toggle(m.key)}
              onMouseEnter={() => setHoveredKey(m.key)}
              onMouseLeave={() => setHoveredKey(null)}
              type="button"
              className={cn(
                'group relative flex flex-col p-3.5 rounded-xl border-2 transition-all duration-200 text-left',
                active
                  ? 'border-ce bg-ce/10 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                  : 'border-white/10 bg-surface hover:border-white/20 hover:bg-surface-2'
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn('text-sm font-bold transition-colors', active ? 'text-ce' : 'text-white group-hover:text-ce')}>
                  {m.label}
                </span>
                <div
                  className={cn(
                    'size-5 rounded-md flex items-center justify-center border transition-colors shrink-0',
                    active ? 'bg-ce border-ce text-slate-950' : 'border-white/20 text-transparent'
                  )}
                >
                  <Check className="size-3.5 stroke-[3]" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">
                {m.desc}
              </p>
            </button>
          )
        })}
      </div>
    </QuizStep>
  )
}

/* ===================================================================
   STEP 5 — FOCUS AREAS (Multi-select)
   =================================================================== */
function ChooseFocusAreas({ values, onChange, onNext }: { values: string[]; onChange: (v: string[]) => void; onNext: () => void }) {
  function toggle(key: string) {
    onChange(values.includes(key) ? values.filter((v) => v !== key) : [...values, key])
  }
  return (
    <QuizStep title="Choose your cursed zones" onNext={onNext} canProceed={values.length > 0}>
      <div className="grid grid-cols-2 gap-3">
        {FOCUS_AREAS.map((f) => {
          const active = values.includes(f.key)
          return (
            <button
              key={f.key}
              onClick={() => toggle(f.key)}
              type="button"
              className={cn(
                'group relative flex flex-col items-center justify-end overflow-hidden rounded-2xl border-2 transition-all duration-300 aspect-square',
                active
                  ? 'border-ce shadow-[0_0_20px_rgba(0,240,255,0.45)] scale-[0.99]'
                  : 'border-white/10 hover:border-white/20'
              )}
            >
              {/* Full-bleed image */}
              <img
                src={f.image}
                alt={f.label}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Bottom gradient overlay for label readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* Active glow overlay */}
              {active && (
                <div className="absolute inset-0 bg-ce/15 ring-inset ring-2 ring-ce/60 rounded-[14px]" />
              )}
              {/* Check badge */}
              {active && (
                <span className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-ce text-slate-950 shadow-[0_0_8px_rgba(0,240,255,0.8)]">
                  <Check className="size-3 text-white" strokeWidth={3} />
                </span>
              )}
              {/* Label */}
              <span className={cn(
                'relative z-10 mb-3 text-xs font-bold tracking-wide text-center transition-colors',
                active ? 'text-white' : 'text-gray-200 group-hover:text-white'
              )}>
                {f.label}
              </span>
            </button>
          )
        })}
      </div>
    </QuizStep>
  )
}

/* ===================================================================
   STEP 6 — FITNESS LEVEL
   =================================================================== */
function ChooseFitnessLevel({ value, onChange, onNext }: { value: string; onChange: (v: string) => void; onNext: () => void }) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  const activeLevel = FITNESS_LEVELS.find((l) => l.key === (hoveredKey || value))

  return (
    <QuizStep title="Choose your sorcerer grade" onNext={onNext} canProceed={true}>
      {/* Live hover/click explanation box */}
      <div className="min-h-[44px] mb-3 px-3 py-2.5 rounded-xl bg-surface-2/80 border border-ce/20 flex items-center justify-center text-center transition-all duration-200">
        <p className="text-xs text-ce font-medium leading-relaxed">
          {activeLevel?.detailedDesc || 'Hover or tap a grade to see training details'}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {FITNESS_LEVELS.map((l) => {
          const active = value === l.key
          return (
            <SelectCard
              key={l.key}
              selected={active}
              onClick={() => onChange(l.key)}
              onMouseEnter={() => setHoveredKey(l.key)}
              onMouseLeave={() => setHoveredKey(null)}
            >
              <div className="flex items-center justify-between py-1">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-white">{l.label}</p>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-ce/10 text-ce border border-ce/20">
                      {l.subtitle}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">{l.desc}</p>
                </div>
                {/* Clean checkmark badge instead of image */}
                <div
                  className={cn(
                    'size-6 rounded-full flex items-center justify-center border transition-colors shrink-0 ml-3',
                    active ? 'bg-ce border-ce text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.6)]' : 'border-white/20 text-transparent'
                  )}
                >
                  <Check className="size-3.5 stroke-[3]" />
                </div>
              </div>
            </SelectCard>
          )
        })}
      </div>
    </QuizStep>
  )
}

/* ===================================================================
   STEP 7 — ACTIVITY LEVEL
   =================================================================== */
function ChooseActivityLevel({ value, onChange, onNext }: { value: string; onChange: (v: string) => void; onNext: () => void }) {
  return (
    <QuizStep title="Choose your activity level" onNext={onNext} canProceed={true}>
      <div className="flex flex-col gap-3">
        {ACTIVITY_LEVELS.map((a) => {
          const active = value === a.key
          return (
            <button
              key={a.key}
              onClick={() => onChange(a.key)}
              type="button"
              className={cn(
                'group relative flex items-center gap-0 overflow-hidden rounded-2xl border-2 transition-all duration-300 text-left',
                active
                  ? 'border-ce shadow-[0_0_24px_rgba(0,240,255,0.45)]'
                  : 'border-white/10 hover:border-white/25 bg-white/[0.03]'
              )}
            >
              {/* Left: square image thumbnail */}
              <div className="relative shrink-0 w-[88px] h-[88px] overflow-hidden">
                <img
                  src={a.image}
                  alt={a.label}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Right-edge fade into card background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/60" />
                {/* Active tint */}
                {active && <div className="absolute inset-0 bg-ce/20" />}
              </div>

              {/* Right: text content */}
              <div className="flex-1 py-4 pl-4 pr-3">
                <p className={cn(
                  'text-sm font-bold leading-tight transition-colors',
                  active ? 'text-white' : 'text-gray-100 group-hover:text-white'
                )}>
                  {a.label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {a.desc}
                </p>
              </div>

              {/* Active indicator — cyan check dot on right */}
              <div className="pr-4 shrink-0">
                {active ? (
                  <span className="flex size-5 items-center justify-center rounded-full bg-ce text-slate-950 shadow-[0_0_10px_rgba(0,240,255,0.9)]">
                    <Check className="size-3 stroke-[3]" />
                  </span>
                ) : (
                  <span className="block size-5 rounded-full border border-white/20" />
                )}
              </div>

              {/* Active left accent bar */}
              {active && (
                <div className="absolute left-0 top-0 h-full w-[3px] bg-ce rounded-l-2xl shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
              )}
            </button>
          )
        })}
      </div>
    </QuizStep>
  )
}

/* ===================================================================
   STEP 8 — HEIGHT PICKER
   =================================================================== */
function HeightPicker({
  ft, setFt, inches, setInches, cm, setCm, useMetric, setUseMetric, onNext,
}: {
  ft: number; setFt: (v: number) => void;
  inches: number; setInches: (v: number) => void;
  cm: number; setCm: (v: number) => void;
  useMetric: boolean; setUseMetric: (v: boolean) => void;
  onNext: () => void;
}) {
  return (
    <QuizStep
      title="What's your vessel's height?"
      caption="Even sorcerers start somewhere."
      onNext={onNext}
      canProceed={true}
    >
      <div className="flex flex-col items-center gap-6 py-4">
        {/* Gojo height visual */}
        <div className="relative flex items-end justify-center w-full" style={{ height: 320 }}>
          <img
            src="/gojo-height-2.png"
            alt="Gojo measuring height"
            className="object-contain object-bottom select-none w-auto max-w-full"
            style={{
              height: useMetric
                ? Math.round(240 + ((cm - 120) / 100) * 80)
                : Math.round(240 + ((ft * 12 + inches - 48) / 36) * 80),
              maxHeight: 320,
              transition: 'height 0.25s ease',
              filter: 'drop-shadow(0 0 20px rgba(0,240,255,0.85)) drop-shadow(0 4px 28px rgba(0,240,255,0.5))',
            }}
          />
        </div>

        {/* Scroll pickers */}
        {useMetric ? (
          <ScrollPicker value={cm} onChange={setCm} min={120} max={220} suffix=" cm" />
        ) : (
          <div className="flex gap-6">
            <ScrollPicker value={ft} onChange={setFt} min={4} max={7} suffix="'" />
            <ScrollPicker value={inches} onChange={setInches} min={0} max={11} suffix='"' />
          </div>
        )}

        {/* Consistent violet toggle — left = cm (off), right = ft (on) */}
        <div className="flex items-center gap-3">
          <span className={cn('text-sm transition-colors', useMetric ? 'text-foreground font-medium' : 'text-muted-foreground')}>cm</span>
          <button
            onClick={() => setUseMetric(!useMetric)}
            aria-label="Toggle height unit"
            className={cn(
              'relative w-12 h-6 rounded-full transition-colors duration-200',
              !useMetric ? 'bg-ce' : 'bg-surface-2 ring-1 ring-border'
            )}
          >
            <span className={cn(
              'absolute top-0.5 size-5 rounded-full shadow transition-all duration-200',
              !useMetric ? 'left-6 bg-white' : 'left-0.5 bg-muted-foreground'
            )} />
          </button>
          <span className={cn('text-sm transition-colors', !useMetric ? 'text-foreground font-medium' : 'text-muted-foreground')}>ft</span>
        </div>
      </div>
    </QuizStep>
  )
}

/* ===================================================================
   STEP 9 — WEIGHT PICKER
   =================================================================== */
function WeightPicker({
  kg, setKg, lbs, setLbs, useLbs, setUseLbs, onNext,
}: {
  kg: number; setKg: (v: number) => void;
  lbs: number; setLbs: (v: number) => void;
  useLbs: boolean; setUseLbs: (v: boolean) => void;
  onNext: () => void;
}) {
  const currentKg = useLbs ? Math.round(lbs / 2.205) : kg
  // Orb diameter scales 80-140px across 30-200kg
  const orbSize = Math.round(80 + ((currentKg - 30) / 170) * 60)

  return (
    <QuizStep
      title="What's your vessel's mass?"
      caption="Every technique has a cost."
      onNext={onNext}
      canProceed={true}
    >
      <div className="flex flex-col items-center gap-6 py-4">
        {/* Yuji weight visual — grows slightly with mass */}
        <div className="relative flex items-end justify-center w-full" style={{ height: 320 }}>
          <img
            src="/yuji-weight.png"
            alt="Yuji on scale"
            className="object-contain object-bottom select-none w-auto max-w-full"
            style={{
              height: Math.round(240 + ((currentKg - 30) / 170) * 80),
              maxHeight: 320,
              transition: 'height 0.3s ease',
              filter: 'drop-shadow(0 0 20px rgba(0,240,255,0.85)) drop-shadow(0 4px 28px rgba(0,240,255,0.5))',
            }}
          />
        </div>

        {/* Scroll picker */}
        {useLbs ? (
          <ScrollPicker value={lbs} onChange={setLbs} min={80} max={400} suffix=" lbs" />
        ) : (
          <ScrollPicker value={kg} onChange={setKg} min={30} max={200} suffix=" kg" />
        )}

        {/* Consistent violet toggle — left = kg (off), right = lbs (on) */}
        <div className="flex items-center gap-3">
          <span className={cn('text-sm transition-colors', !useLbs ? 'text-foreground font-medium' : 'text-muted-foreground')}>kg</span>
          <button
            onClick={() => setUseLbs(!useLbs)}
            aria-label="Toggle weight unit"
            className={cn(
              'relative w-12 h-6 rounded-full transition-colors duration-200',
              useLbs ? 'bg-ce' : 'bg-surface-2 ring-1 ring-border'
            )}
          >
            <span className={cn(
              'absolute top-0.5 size-5 rounded-full shadow transition-all duration-200',
              useLbs ? 'left-6 bg-white' : 'left-0.5 bg-muted-foreground'
            )} />
          </button>
          <span className={cn('text-sm transition-colors', useLbs ? 'text-foreground font-medium' : 'text-muted-foreground')}>lbs</span>
        </div>
      </div>
    </QuizStep>
  )
}

/* ===================================================================
   STEP 10 — EQUIPMENT (Multi-select)
   =================================================================== */
function ChooseEquipment({ values, onChange, onNext }: { values: string[]; onChange: (v: string[]) => void; onNext: () => void }) {
  function toggle(key: string) {
    if (key === 'none') {
      onChange(values.includes('none') ? [] : ['none'])
      return
    }
    const next = values.filter((v) => v !== 'none')
    onChange(next.includes(key) ? next.filter((v) => v !== key) : [...next, key])
  }
  return (
    <QuizStep
      title="What tools shape your training?"
      caption="Select all that apply — more options, sharper missions."
      onNext={onNext}
      canProceed={values.length > 0}
    >
      <div className="flex flex-col gap-3">
        {EQUIPMENT_OPTIONS.map((e) => {
          const active = values.includes(e.key)
          return (
            <button
              key={e.key}
              onClick={() => toggle(e.key)}
              type="button"
              className={cn(
                'group relative flex items-center gap-4 rounded-2xl border-2 px-4 py-3 text-left transition-all duration-300',
                active
                  ? 'border-ce bg-ce/5 shadow-[0_0_22px_rgba(0,240,255,0.35)]'
                  : 'border-white/8 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
              )}
            >
              {/* Active left accent bar */}
              {active && (
                <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-ce shadow-[0_0_8px_rgba(0,240,255,0.9)]" />
              )}

              {/* Equipment image icon */}
              <span
                className="flex size-14 shrink-0 items-center justify-center rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: active
                    ? 'radial-gradient(circle, rgba(0,240,255,0.22) 0%, rgba(0,240,255,0.08) 100%)'
                    : 'rgba(255,255,255,0.04)',
                  border: active
                    ? '1.5px solid rgba(0,240,255,0.55)'
                    : '1.5px solid rgba(255,255,255,0.08)',
                  boxShadow: active
                    ? '0 0 16px rgba(0,240,255,0.35), inset 0 0 16px rgba(0,240,255,0.10)'
                    : 'none',
                }}
              >
                <img
                  src={e.image}
                  alt={e.label}
                  className="w-[80%] h-[80%] object-contain select-none transition-all duration-300"
                  style={{
                    mixBlendMode: 'lighten',
                    filter: active
                      ? 'brightness(1.6) drop-shadow(0 0 6px rgba(0,240,255,0.8))'
                      : 'brightness(0.7)',
                  }}
                />
              </span>

              {/* Label + subtext */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-sm font-bold leading-tight transition-colors',
                  active ? 'text-white' : 'text-gray-200 group-hover:text-white'
                )}>{e.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground leading-snug">{e.sub}</p>
              </div>

              {/* Checkmark */}
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
                  active
                    ? 'border-ce bg-ce text-slate-950 shadow-[0_0_10px_rgba(0,240,255,0.6)]'
                    : 'border-white/15'
                )}
              >
                {active && <Check className="size-3.5 text-white" strokeWidth={3} />}
              </span>
            </button>
          )
        })}
      </div>
    </QuizStep>
  )
}

/* ===================================================================
   STEP 11 — WORKOUT DAYS + REMINDER
   =================================================================== */
function WorkoutDaysStep({
  days, onChange, reminder, setReminder, onNext,
}: {
  days: string[]; onChange: (v: string[]) => void;
  reminder: boolean; setReminder: (v: boolean) => void;
  onNext: () => void;
}) {
  function toggleDay(day: string) {
    onChange(days.includes(day) ? days.filter((d) => d !== day) : [...days, day])
  }

  const DAY_META: Record<string, { short: string; emoji: string }> = {
    Sunday:    { short: 'SUN', emoji: '🌙' },
    Monday:    { short: 'MON', emoji: '⚡' },
    Tuesday:   { short: 'TUE', emoji: '🔥' },
    Wednesday: { short: 'WED', emoji: '💥' },
    Thursday:  { short: 'THU', emoji: '⚔️' },
    Friday:    { short: 'FRI', emoji: '🌀' },
    Saturday:  { short: 'SAT', emoji: '✨' },
  }

  const INTENSITY_LABELS = ['No days set', 'Barely awakened', 'Light output', 'Channeling', 'Surging', 'Peak domain', 'Transcendent', 'UNLIMITED VOID']
  const intensityLabel = INTENSITY_LABELS[Math.min(days.length, 7)]
  const intensityPct   = (days.length / 7) * 100
  const intensityColor =
    days.length === 0 ? '#6B6880' :
    days.length <= 2  ? '#38bdf8' :
    days.length <= 4  ? '#00f0ff' :
    days.length <= 6  ? '#0284c7'  : '#22d3ee'

  return (
    <QuizStep title="Forge your training schedule" caption="Choose the days your cursed energy flows." onNext={onNext} canProceed={days.length > 0}>

      {/* ── Day Grid ── */}
      <div className="grid grid-cols-7 gap-1.5 mb-4">
        {DAYS.map((day) => {
          const active = days.includes(day)
          const meta = DAY_META[day]
          return (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              type="button"
              className={cn(
                'relative flex flex-col items-center justify-center rounded-2xl py-3 px-0.5 transition-all duration-300 select-none min-h-[64px]',
                active ? '' : 'hover:bg-white/5'
              )}
              style={{
                background: active
                  ? 'linear-gradient(160deg, rgba(0,240,255,0.28) 0%, rgba(2,132,199,0.18) 100%)'
                  : 'rgba(255,255,255,0.04)',
                border: active
                  ? '1.5px solid rgba(0,240,255,0.75)'
                  : '1.5px solid rgba(255,255,255,0.08)',
                boxShadow: active ? '0 0 16px rgba(0,240,255,0.40)' : 'none',
              }}
            >
              <span className={cn('text-[11px] font-bold tracking-wider transition-colors mb-1.5',
                active ? 'text-white' : 'text-muted-foreground')}>
                {meta.short}
              </span>
              <div className={cn('size-4 rounded-full flex items-center justify-center transition-colors',
                active ? 'bg-ce text-slate-950 shadow-[0_0_8px_rgba(0,240,255,0.8)]' : 'border border-white/20 text-transparent')}>
                <Check className="size-2.5 stroke-[3]" />
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Training Load Bar ── */}
      <div className="mb-4 rounded-2xl p-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Cursed Energy Load</span>
          <span className="text-[11px] font-bold transition-colors" style={{ color: intensityColor }}>
            {days.length}/7 — {intensityLabel}
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.max(intensityPct, 4)}%`,
              background: `linear-gradient(90deg, #00f0ff, ${intensityColor})`,
              boxShadow: days.length > 0 ? `0 0 8px ${intensityColor}88` : 'none',
              minWidth: days.length > 0 ? 8 : 0,
            }} />
        </div>
        {days.length > 0 && (
          <p className="mt-2 text-[11px] text-muted-foreground">
            <span className="text-white/70 font-medium">Active: </span>
            {days.map(d => DAY_META[d].short).join(' · ')}
          </p>
        )}
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Sessions', value: days.length,           suffix: '/wk', color: '#00f0ff' },
          { label: 'Rest Days', value: 7 - days.length,      suffix: '/wk', color: '#38bdf8' },
          { label: 'CE earned', value: days.length * 240,    suffix: '/wk', color: intensityColor },
        ].map(({ label, value, suffix, color }) => (
          <div key={label} className="flex flex-col items-center justify-center rounded-xl py-3 px-1"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-lg font-bold leading-none" style={{ color }}>
              {value}<span className="text-[9px] text-muted-foreground font-normal ml-0.5">{suffix}</span>
            </span>
            <span className="text-[10px] text-muted-foreground mt-1 tracking-wide uppercase">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Reminder Card ── */}
      <div className="rounded-2xl p-4 transition-all duration-300"
        style={{
          background: reminder
            ? 'linear-gradient(135deg, rgba(0,240,255,0.12) 0%, rgba(2,132,199,0.06) 100%)'
            : 'rgba(255,255,255,0.03)',
          border: reminder ? '1.5px solid rgba(0,240,255,0.35)' : '1.5px solid rgba(255,255,255,0.08)',
          boxShadow: reminder ? '0 0 20px rgba(0,240,255,0.12)' : 'none',
        }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl text-base"
              style={{
                background: reminder ? 'rgba(0,240,255,0.2)' : 'rgba(255,255,255,0.05)',
                border: reminder ? '1px solid rgba(0,240,255,0.4)' : '1px solid rgba(255,255,255,0.08)',
              }}>
              {reminder ? '🔔' : '🔕'}
            </span>
            <div>
              <p className="text-sm font-bold leading-tight">Mission Alerts</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {reminder
                  ? `Active for ${days.length} session${days.length !== 1 ? 's' : ''}/week`
                  : 'Enable for sorcerer alerts'}
              </p>
            </div>
          </div>
          <button onClick={() => setReminder(!reminder)} aria-label="Toggle reminder"
            className="relative shrink-0 w-12 h-6 rounded-full transition-all duration-300"
            style={{
              background: reminder ? '#00f0ff' : 'rgba(255,255,255,0.1)',
              boxShadow: reminder ? '0 0 12px rgba(0,240,255,0.55)' : 'none',
            }}>
            <span className="absolute top-0.5 size-5 rounded-full shadow-md transition-all duration-300"
              style={{ left: reminder ? '26px' : '2px', background: reminder ? '#090d12' : '#6B6880' }} />
          </button>
        </div>

        {reminder && (
          <div className="mt-3 rounded-xl px-3 py-2.5 flex items-center gap-2"
            style={{ background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.20)' }}>
            <span className="text-base">⚡</span>
            <p className="text-[11px] text-muted-foreground leading-snug">
              <span className="text-white/80 font-semibold">90% of sorcerers</span> who enable mission alerts reach Grade 1 faster.
            </p>
          </div>
        )}
      </div>
    </QuizStep>
  )
}

/* ===================================================================
   STEP 12 — SUMMARY PREVIEW (PREMIUM REDESIGN)
   =================================================================== */
function SummaryPreview({
  heightCm, weightKg, fitnessLevel, activityLevel, focusAreas, workoutDays, onNext,
}: {
  heightCm: number; weightKg: number; fitnessLevel: string; activityLevel: string;
  focusAreas: string[]; workoutDays: string[]; onNext: () => void;
}) {
  const heightM   = heightCm / 100
  const bmi       = weightKg / (heightM * heightM)
  const bmiVal    = parseFloat(bmi.toFixed(1))
  const calories  = Math.round(weightKg * 33)
  const protein   = Math.round(weightKg * 1.8)
  const carbs     = Math.round(calories * 0.45 / 4)
  const fat       = Math.round(calories * 0.25 / 9)
  const waterCups = parseFloat((weightKg * 0.033 * 4.227).toFixed(1))

  const fitnessLabel  = FITNESS_LEVELS.find((l) => l.key === fitnessLevel)?.label  || 'Awakened'
  const activityLabel = ACTIVITY_LEVELS.find((a) => a.key === activityLevel)?.label || 'Flickering'
  const focusLabel    = focusAreas.length > 0
    ? focusAreas.map(k => FOCUS_AREAS.find(f => f.key === k)?.label).filter(Boolean).join(', ')
    : 'Full Body'

  const bmiCategory = bmiVal < 18.5 ? 'Underweight' : bmiVal < 25 ? 'Healthy' : bmiVal < 30 ? 'Overweight' : 'Obese'
  const bmiHex      = bmiVal < 18.5 ? '#6FA8FF'     : bmiVal < 25 ? '#2ED9A8' : bmiVal < 30 ? '#D4AF6A'   : '#E4283C'
  const bmiPct      = Math.min(100, Math.max(0, ((bmiVal - 10) / 30) * 100))

  const R = 42, C = 2 * Math.PI * R
  const proteinPct  = (protein * 4) / calories
  const carbsPct    = (carbs   * 4) / calories
  const fatPct      = (fat     * 9) / calories
  const proteinDash = proteinPct * C
  const carbsDash   = carbsPct   * C
  const fatDash     = fatPct     * C

  return (
    <motion.section
      key="summary"
      className="relative z-10 flex flex-1 flex-col px-5 pb-32 pt-6 overflow-y-auto no-scrollbar"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={transition}
    >
      {/* HERO HEADER */}
      <div className="relative rounded-3xl overflow-hidden mb-5 p-5"
        style={{
          background: 'linear-gradient(135deg, rgba(0,240,255,0.22) 0%, rgba(2,132,199,0.12) 50%, rgba(0,240,255,0.06) 100%)',
          border: '1.5px solid rgba(0,240,255,0.35)',
          boxShadow: '0 0 40px rgba(0,240,255,0.18)',
        }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #00f0ff, transparent)' }} />
        <div className="flex items-center gap-4">
          <div className="relative flex size-16 items-center justify-center rounded-2xl shrink-0"
            style={{ background: 'rgba(0,240,255,0.15)', border: '1.5px solid rgba(0,240,255,0.45)' }}>
            <span className="text-3xl">⚔️</span>
            <span className="absolute -bottom-1.5 -right-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md text-slate-950"
              style={{ background: '#00f0ff', border: '1px solid rgba(255,255,255,0.4)' }}>
              {fitnessLabel}
            </span>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-ce mb-0.5">Sorcerer Profile</p>
            <h2 className="font-heading text-xl font-bold leading-tight">Your Cursed Blueprint</h2>
            <p className="text-xs text-muted-foreground mt-1">{heightCm} cm · {weightKg} kg · {workoutDays.length}x/wk</p>
          </div>
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {[
            { icon: '⚡', label: activityLabel },
            { icon: '🎯', label: (focusLabel.split(',')[0] || 'Full Body') },
            { icon: '📅', label: `${workoutDays.length} days/wk` },
          ].map(({ icon, label }) => (
            <span key={label} className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium"
              style={{ background: 'rgba(0,240,255,0.12)', border: '1px solid rgba(0,240,255,0.25)', color: '#67e8f9' }}>
              {icon} {label}
            </span>
          ))}
        </div>
      </div>

      {/* BMI CARD */}
      <div className="rounded-2xl p-4 mb-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">BMI Index</p>
            <p className="font-heading text-4xl font-bold mt-0.5" style={{ color: bmiHex }}>{bmiVal}</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold" style={{ color: bmiHex }}>You&apos;re {bmiCategory}</span>
            <p className="text-xs text-muted-foreground mt-0.5">{heightCm}cm / {weightKg}kg</p>
          </div>
        </div>
        <div className="relative h-3 rounded-full overflow-hidden mb-1"
          style={{ background: 'linear-gradient(90deg, #6FA8FF 0%, #2ED9A8 30%, #D4AF6A 60%, #E4283C 100%)' }}>
          <div className="absolute top-0 h-full w-0.5 bg-white rounded-full shadow-[0_0_6px_white] transition-all duration-700"
            style={{ left: `${bmiPct}%`, transform: 'translateX(-50%)' }} />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
        </div>
      </div>

      {/* MACRO DONUT + BARS */}
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">Nutrition Plan</p>
      <div className="rounded-2xl p-4 mb-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
              <circle cx="50" cy="50" r={R} fill="none" stroke="#00f0ff" strokeWidth="14"
                strokeDasharray={`${proteinDash} ${C}`} strokeDashoffset={C * 0.25}
                strokeLinecap="round" />
              <circle cx="50" cy="50" r={R} fill="none" stroke="#38bdf8" strokeWidth="14"
                strokeDasharray={`${carbsDash} ${C}`} strokeDashoffset={C * 0.25 - proteinDash}
                strokeLinecap="round" />
              <circle cx="50" cy="50" r={R} fill="none" stroke="#22d3ee" strokeWidth="14"
                strokeDasharray={`${fatDash} ${C}`} strokeDashoffset={C * 0.25 - proteinDash - carbsDash}
                strokeLinecap="round" />
              <text x="50" y="46" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">{calories.toLocaleString()}</text>
              <text x="50" y="58" textAnchor="middle" fill="#8A8894" fontSize="8">kcal/day</text>
            </svg>
          </div>
          <div className="flex-1 space-y-2.5">
            {[
              { label: 'Protein', value: protein, color: '#00f0ff', pct: Math.round(proteinPct * 100) },
              { label: 'Carbs',   value: carbs,   color: '#38bdf8', pct: Math.round(carbsPct   * 100) },
              { label: 'Fat',     value: fat,     color: '#22d3ee', pct: Math.round(fatPct     * 100) },
            ].map(({ label, value, color, pct }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-xs font-bold" style={{ color }}>{value}g <span className="text-muted-foreground font-normal">({pct}%)</span></span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}88` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">Sorcerer Stats</p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { icon: '⚡', label: 'Fitness Grade',   value: fitnessLabel,                               color: '#00f0ff' },
          { icon: '🌀', label: 'Energy Output',   value: activityLabel,                              color: '#0284c7' },
          { icon: '🎯', label: 'Focus Zones',     value: `${focusAreas.length || 1} area${focusAreas.length !== 1 ? 's' : ''}`, color: '#38bdf8' },
          { icon: '📅', label: 'Weekly Missions', value: `${workoutDays.length} sessions`,           color: '#2ED9A8' },
        ].map(({ icon, label, value, color }) => (
          <div key={label} className="rounded-2xl p-3.5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base">{icon}</span>
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
            </div>
            <p className="text-sm font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* DAILY GOALS */}
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">Daily Goals</p>
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {[
          { icon: '💧', label: 'Water',   value: `${waterCups}`, unit: 'cups', color: '#6FA8FF' },
          { icon: '⏳', label: 'Workout', value: '50',           unit: 'min',  color: '#7C5CFF' },
          { icon: '😴', label: 'Rest',    value: '1.5',          unit: 'min',  color: '#2ED9A8' },
        ].map(({ icon, label, value, unit, color }) => (
          <div key={label} className="flex flex-col items-center justify-center rounded-2xl py-4 px-2"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <span className="text-xl mb-1">{icon}</span>
            <p className="font-heading text-xl font-bold leading-none" style={{ color }}>{value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{unit}</p>
            <p className="text-[9px] uppercase tracking-wide text-muted-foreground/60 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* ELDER'S COUNSEL */}
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">Elder&apos;s Counsel</p>
      <div className="rounded-2xl p-5 mb-3 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(124,92,255,0.14) 0%, rgba(76,44,255,0.06) 100%)',
          border: '1.5px solid rgba(124,92,255,0.30)',
          boxShadow: '0 0 30px rgba(124,92,255,0.10)',
        }}>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-20 blur-3xl"
          style={{ background: '#7C5CFF' }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex size-8 items-center justify-center rounded-lg text-sm"
              style={{ background: 'rgba(124,92,255,0.2)', border: '1px solid rgba(124,92,255,0.35)' }}>📜</span>
            <p className="font-heading text-sm font-bold text-ce">The System Speaks</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To maximize your cursed energy output, focus on{' '}
            <span className="text-white/80 font-semibold">compound exercises</span> targeting multiple muscle groups
            and prioritize <span className="text-white/80 font-semibold">progressive overload</span> for continuous growth.
            Ensure you consume enough protein to support muscle repair and allow sufficient rest for optimal recovery.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-base">⚡</span>
            <p className="text-[11px] text-ce/80 font-medium">Your custom mission plan is being forged...</p>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground/50 text-center mb-6">
        For general reference only. Not a substitute for professional medical advice.
      </p>

      {/* Sticky continue */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background via-background/90 to-transparent z-30">
        <div className="max-w-md mx-auto">
          <SorcererButton className="w-full" icon={ChevronRight} onClick={onNext}>
            Forge My Plan
          </SorcererButton>
        </div>
      </div>
    </motion.section>
  )
}

/* ===================================================================
   STEP 13 — GENERATING PLAN ANIMATION (PREMIUM REDESIGN)
   =================================================================== */
function GeneratingPlan({ onDone }: { onDone: () => void }) {
  const [percent, setPercent] = useState(0)
  const [completedSteps, setCompletedSteps] = useState(0)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((p) => {
        if (p >= 100) { clearInterval(interval); return 100 }
        return p + 1
      })
    }, 42)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timers = GENERATION_STEPS.map((_, i) => {
      const t1 = setTimeout(() => setActiveStep(i),     600 + i * 800)
      const t2 = setTimeout(() => setCompletedSteps(i + 1), 800 + i * 800)
      return [t1, t2]
    })
    const done = setTimeout(onDone, 800 + GENERATION_STEPS.length * 800 + 600)
    return () => { timers.flat().forEach(clearTimeout); clearTimeout(done) }
  }, [onDone])

  const STEP_ICONS = ['⚖️', '⚡', '🔬', '🎯', '🗡️']
  const STEP_DESCS = [
    'Measuring vessel parameters...',
    'Calibrating cursed energy flow...',
    'Analyzing output capacity...',
    'Assigning your sorcerer rank...',
    'Forging your personal missions...',
  ]

  // Radial arc
  const R = 56, circumference = 2 * Math.PI * R
  const strokeDash = (percent / 100) * circumference

  return (
    <motion.section
      key="generating"
      className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
    >
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full opacity-15 blur-[80px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00f0ff, transparent)' }} />

      {/* Circular progress ring */}
      <div className="relative flex items-center justify-center">
        <svg width="148" height="148" viewBox="0 0 148 148" className="-rotate-90">
          {/* Track */}
          <circle cx="74" cy="74" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          {/* Progress arc */}
          <circle
            cx="74" cy="74" r={R} fill="none"
            stroke="url(#ceGrad)" strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference}`}
            style={{ transition: 'stroke-dasharray 0.1s linear' }}
          />
          <defs>
            <linearGradient id="ceGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.p
            key={percent}
            className="font-heading text-4xl font-bold"
            style={{ color: percent === 100 ? '#2ED9A8' : '#ffffff' }}
          >
            {percent}%
          </motion.p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
            {percent < 100 ? 'Forging...' : 'Complete'}
          </p>
        </div>
      </div>

      <div>
        <p className="font-heading text-xl font-bold leading-snug">
          {percent < 100 ? 'Forging your cursed plan' : 'Plan ready, Sorcerer'}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {percent < 100 ? STEP_DESCS[Math.min(activeStep, STEP_DESCS.length - 1)] : 'Your mission awaits.'}
        </p>
      </div>

      {/* Step cards */}
      <div className="w-full max-w-xs space-y-2">
        {GENERATION_STEPS.map((label, i) => {
          const done    = i < completedSteps
          const current = i === activeStep && !done
          return (
            <motion.div
              key={label}
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-400"
              style={{
                background: done
                  ? 'rgba(46,217,168,0.08)'
                  : current
                    ? 'rgba(0,240,255,0.14)'
                    : 'rgba(255,255,255,0.03)',
                border: done
                  ? '1px solid rgba(46,217,168,0.25)'
                  : current
                    ? '1px solid rgba(0,240,255,0.35)'
                    : '1px solid rgba(255,255,255,0.07)',
              }}
              animate={{ opacity: i <= activeStep ? 1 : 0.35 }}
            >
              {/* icon */}
              <span className="text-lg w-6 text-center shrink-0">{STEP_ICONS[i]}</span>
              {/* label */}
              <span className={`text-sm flex-1 text-left font-medium ${done ? 'text-jade' : current ? 'text-white' : 'text-muted-foreground'}`}>
                {label}
              </span>
              {/* status */}
              {done ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <Check className="size-4 text-jade" />
                </motion.div>
              ) : current ? (
                <motion.div
                  className="w-4 h-4 rounded-full border-2 border-ce border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <div className="w-4 h-4 rounded-full border border-white/10" />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Footer badge */}
      <motion.p
        className="flex items-center gap-2 text-xs text-muted-foreground"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <Award className="size-4 text-ce" />
        Over 10,000+ Sorcerers Awakened
      </motion.p>
    </motion.section>
  )
}

/* ===================================================================
   STEP 14 — ANALYSIS COMPLETE (PREMIUM REDESIGN)
   =================================================================== */
function AnalysisComplete({ onNext }: { onNext: () => void }) {
  const [reveal, setReveal] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReveal(true), 300)
    return () => clearTimeout(t)
  }, [])

  const YOU_PCT = 72
  const AVG_PCT = 41
  const WASTED  = YOU_PCT - AVG_PCT

  // Radial for "you" indicator
  const R2 = 38, C2 = 2 * Math.PI * R2

  return (
    <motion.section
      key="analysis"
      className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-12 pt-8 text-center gap-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
    >
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full opacity-10 blur-[90px] pointer-events-none"
        style={{ background: '#E4283C' }} />

      {/* Title */}
      <motion.div className="flex items-center gap-3" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
        <h2 className="font-heading text-2xl font-bold">Analysis Complete</h2>
        <motion.span
          className="flex size-7 items-center justify-center rounded-full"
          style={{ background: 'rgba(46,217,168,0.2)', border: '1.5px solid rgba(46,217,168,0.5)' }}
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}
        >
          <Check className="size-4 text-jade" />
        </motion.span>
      </motion.div>

      {/* Comparison visual */}
      <motion.div
        className="w-full max-w-xs rounded-3xl p-5 relative overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      >
        {/* decorative glow behind you bar */}
        <div className="absolute left-10 bottom-0 w-20 h-32 rounded-full opacity-20 blur-2xl pointer-events-none"
          style={{ background: '#E4283C' }} />

        <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-4">Potential usage vs. Average</p>

        <div className="flex items-end justify-center gap-8 relative">
          {/* YOU bar */}
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold mb-2" style={{ color: '#E4283C' }}>{YOU_PCT}%</span>
            <div className="relative w-20 overflow-hidden rounded-xl" style={{ height: 160 }}>
              <div className="absolute inset-0 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} />
              <motion.div
                className="absolute bottom-0 w-full rounded-xl"
                style={{ background: 'linear-gradient(to top, #E4283C, #ff6b6b)', boxShadow: '0 0 20px rgba(228,40,60,0.5)' }}
                initial={{ height: 0 }}
                animate={{ height: reveal ? `${YOU_PCT}%` : 0 }}
                transition={{ delay: 0.6, duration: 1.0, ease: 'easeOut' }}
              />
              {/* shimmer */}
              <div className="absolute inset-0 rounded-xl"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 50%)' }} />
            </div>
            <span className="mt-2 text-sm font-bold text-white">You</span>
          </div>

          {/* vs label */}
          <div className="flex flex-col items-center pb-8">
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              vs
            </span>
          </div>

          {/* AVERAGE bar */}
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-muted-foreground mb-2">{AVG_PCT}%</span>
            <div className="relative w-20 overflow-hidden rounded-xl" style={{ height: 160 }}>
              <div className="absolute inset-0 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} />
              <motion.div
                className="absolute bottom-0 w-full rounded-xl"
                style={{ background: 'linear-gradient(to top, #3a3a4a, #4a4a5a)' }}
                initial={{ height: 0 }}
                animate={{ height: reveal ? `${AVG_PCT}%` : 0 }}
                transition={{ delay: 0.8, duration: 0.9, ease: 'easeOut' }}
              />
            </div>
            <span className="mt-2 text-sm font-medium text-muted-foreground">Average</span>
          </div>
        </div>

        {/* Wasted gap badge */}
        <motion.div
          className="mt-4 mx-auto rounded-xl px-4 py-2 inline-flex items-center gap-2"
          style={{ background: 'rgba(228,40,60,0.12)', border: '1px solid rgba(228,40,60,0.3)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        >
          <span className="text-sm font-bold" style={{ color: '#E4283C' }}>+{WASTED}%</span>
          <span className="text-xs text-muted-foreground">untapped potential above average</span>
        </motion.div>
      </motion.div>

      {/* Insight card */}
      <motion.p
        className="text-sm text-muted-foreground max-w-xs leading-relaxed"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
      >
        Based on our data,{' '}
        <span className="font-semibold" style={{ color: '#E4283C' }}>you&apos;re wasting {WASTED}% more potential</span>{' '}
        than the average sorcerer your level.
      </motion.p>

      <motion.div
        className="w-full max-w-xs rounded-2xl p-4"
        style={{ background: 'rgba(124,92,255,0.08)', border: '1px solid rgba(124,92,255,0.20)' }}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
      >
        <div className="flex items-start gap-3">
          <span className="text-xl shrink-0">⚡</span>
          <p className="text-xs text-muted-foreground text-left leading-relaxed">
            <span className="text-white/80 font-semibold">You&apos;re only using 28% of your physical capacity.</span>{' '}
            Most sorcerers your rank unlock at least 60%. Your custom plan changes that.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="w-full max-w-xs"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}
      >
        <SorcererButton className="w-full" icon={ChevronRight} onClick={onNext}>
          Unlock My Potential
        </SorcererButton>
      </motion.div>
    </motion.section>
  )
}

/* ===================================================================
   STEP 15 — WARNING CAROUSEL
   =================================================================== */
function WarningCarousel({ slide, setSlide, onDone }: { slide: number; setSlide: (v: number) => void; onDone: () => void }) {
  const current = WARNING_SLIDES[slide]
  const isLast = slide === WARNING_SLIDES.length - 1

  function handleNext() {
    if (isLast) { onDone() } else { setSlide(slide + 1) }
  }

  const isPositive = current.positive

  return (
    <motion.section
      key={`warning-${slide}`}
      className={cn(
        'relative z-10 flex flex-1 flex-col items-center justify-between px-6 py-12 h-full transition-colors duration-500 text-white',
        isPositive ? 'bg-[#04202c]' : 'bg-[#cc001b]'
      )}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={transition}
    >
      {/* Top Logo - Cinzel font with Electric Cyan flame aura text-shadow */}
      <p className="sorcerer-title-glow text-xl font-extrabold tracking-[0.25em] text-white">SORCERER</p>

      {/* Icon & Message */}
      <motion.div
        className="flex flex-col items-center text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {current.image ? (
          <div className="relative mb-6 size-32 md:size-36 flex items-center justify-center">
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-full object-contain select-none filter drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] drop-shadow-[0_8px_30px_rgba(0,0,0,0.8)]"
            />
          </div>
        ) : (
          <span className="text-7xl mb-6 drop-shadow-md">{current.icon}</span>
        )}
        <h2 className="font-heading text-2xl font-bold mb-3 text-white tracking-wide">{current.title}</h2>
        <p className="text-sm text-white/85 max-w-[28ch] leading-relaxed font-sans">{current.desc}</p>
      </motion.div>

      <div className="flex flex-col items-center gap-6 w-full max-w-xs">
        {/* Carousel Dots */}
        <div className="flex gap-2">
          {WARNING_SLIDES.map((_, i) => (
            <span
              key={i}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                i === slide
                  ? isPositive ? 'bg-ce shadow-[0_0_8px_rgba(0,240,255,0.9)]' : 'bg-white shadow-[0_0_8px_white]'
                  : 'bg-white/30'
              )}
            />
          ))}
        </div>

        {/* Action button */}
        <SorcererButton
          className={cn(
            'w-full font-bold border-none transition-all duration-300',
            isPositive
              ? 'bg-ce text-slate-950 hover:bg-ce-2 shadow-[0_0_24px_rgba(0,240,255,0.6)]'
              : 'bg-white text-slate-950 hover:bg-slate-100 shadow-[0_0_24px_rgba(255,255,255,0.4)]'
          )}
          onClick={handleNext}
        >
          {isLast ? 'Continue' : 'Next'}
        </SorcererButton>
      </div>
    </motion.section>
  )
}

/* ===================================================================
   STEP 16 — YOUR SORCERER STATS (PREMIUM REDESIGN)
   =================================================================== */
function SorcererStats({ stats, onNext }: { stats: Stats; onNext: () => void }) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 400)
    return () => clearTimeout(t)
  }, [])

  const STAT_META: { key: StatKey; label: string; icon: string; color: string; desc: string }[] = [
    { key: 'strength',  label: 'Strength',   icon: '⚔️', color: '#E4283C', desc: 'Raw physical output'   },
    { key: 'stamina',   label: 'Stamina',    icon: '🔥', color: '#D4AF6A', desc: 'Vitality & endurance'  },
    { key: 'agility',   label: 'Agility',    icon: '⚡', color: '#7C5CFF', desc: 'Speed & precision'     },
    { key: 'endurance', label: 'Endurance',  icon: '🛡️', color: '#6FA8FF', desc: 'Recovery capacity'     },
    { key: 'willpower', label: 'Willpower',  icon: '🌀', color: '#a855f7', desc: 'Mental fortitude'      },
    { key: 'technique', label: 'Technique',  icon: '🎯', color: '#2ED9A8', desc: 'Skill efficiency'      },
  ]

  const maxStat = 100

  // Radar/hexagon chart math
  const N = 6
  const CX = 90, CY = 90, RADIUS = 68
  function polarPoint(i: number, r: number) {
    const angle = (Math.PI * 2 * i) / N - Math.PI / 2
    return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) }
  }
  function toPath(points: {x:number;y:number}[]) {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z'
  }

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1.0]
  const gridPoints = rings.map(r => Array.from({ length: N }, (_, i) => polarPoint(i, RADIUS * r)))

  // Actual stat polygon
  const statValues = STAT_META.map(s => stats[s.key] / maxStat)
  const statPoints = STAT_META.map((_, i) => polarPoint(i, RADIUS * (revealed ? statValues[i] : 0)))

  // Total cursed energy score
  const totalCE = Math.round(STAT_META.reduce((sum, s) => sum + stats[s.key], 0) / STAT_META.length)
  const ceLabel = totalCE < 30 ? 'Grade 4' : totalCE < 45 ? 'Grade 3' : totalCE < 60 ? 'Grade 2' : totalCE < 75 ? 'Grade 1' : 'Special Grade'
  const ceColor = '#00f0ff'

  return (
    <motion.section
      key="stats"
      className="relative z-10 flex flex-1 flex-col items-center px-5 pt-8 pb-28 overflow-y-auto no-scrollbar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
    >
      {/* Ambient glow */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-15 blur-[80px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00f0ff, transparent)' }} />

      {/* Header */}
      <motion.div className="text-center mb-6" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
        <p className="text-[11px] uppercase tracking-[0.3em] text-ce mb-1">System Assessment</p>
        <h2 className="font-heading text-2xl font-bold">Your Sorcerer Stats</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs">
          Forged from your answers — this reflects your vessel&apos;s true cursed potential.
        </p>
      </motion.div>

      {/* Rank badge */}
      <motion.div
        className="flex items-center gap-3 rounded-2xl px-5 py-3 mb-6 w-full max-w-xs"
        style={{
          background: 'linear-gradient(135deg, rgba(0,240,255,0.14) 0%, rgba(2,132,199,0.06) 100%)',
          border: '1.5px solid rgba(0,240,255,0.40)',
          boxShadow: '0 0 20px rgba(0,240,255,0.22)',
        }}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.35, type: 'spring', stiffness: 200 }}
      >
        <span className="text-2xl">⚔️</span>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-ce/80 font-bold">Assigned Rank</p>
          <p className="font-heading text-lg font-bold text-white tracking-wide">{ceLabel}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-[10px] uppercase tracking-widest text-ce/80 font-bold">Cursed Energy</p>
          <p className="font-heading text-xl font-bold text-ce">{totalCE}<span className="text-sm font-normal text-muted-foreground">/100</span></p>
        </div>
      </motion.div>

      {/* Radar Chart */}
      <motion.div
        className="relative mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.6 }}
      >
        <svg width="180" height="180" viewBox="0 0 180 180">
          {/* Grid rings */}
          {gridPoints.map((pts, ri) => (
            <polygon key={ri} points={pts.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          ))}
          {/* Grid spokes */}
          {Array.from({ length: N }, (_, i) => {
            const outer = polarPoint(i, RADIUS)
            return <line key={i} x1={CX} y1={CY} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          })}
          {/* Filled stat area */}
          <motion.polygon
            points={statPoints.map(p => `${p.x},${p.y}`).join(' ')}
            fill="rgba(124,92,255,0.18)"
            stroke="#7C5CFF"
            strokeWidth="1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          />
          {/* Dot at each vertex */}
          {statPoints.map((p, i) => (
            <motion.circle key={i} cx={p.x} cy={p.y} r="3.5"
              fill={STAT_META[i].color} stroke="rgba(0,0,0,0.5)" strokeWidth="1"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.7 + i * 0.08, type: 'spring', stiffness: 300 }}
            />
          ))}
          {/* Labels */}
          {STAT_META.map((s, i) => {
            const labelPt = polarPoint(i, RADIUS + 16)
            return (
              <text key={i} x={labelPt.x} y={labelPt.y + 4}
                textAnchor="middle" fill="#8A8894" fontSize="7.5" fontWeight="600">
                {s.label.toUpperCase()}
              </text>
            )
          })}
          {/* Center CE value */}
          <text x={CX} y={CY - 6} textAnchor="middle" fill="white" fontSize="14" fontWeight="700">{totalCE}</text>
          <text x={CX} y={CY + 9} textAnchor="middle" fill="#8A8894" fontSize="7">CE INDEX</text>
        </svg>
      </motion.div>

      {/* Individual Stat Bars */}
      <div className="w-full max-w-sm space-y-2.5">
        {STAT_META.map((s, i) => {
          const raw = stats[s.key]
          const pct = Math.round((raw / maxStat) * 100)
          return (
            <motion.div
              key={s.key}
              className="rounded-2xl px-4 py-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base w-6 text-center">{s.icon}</span>
                  <div>
                    <p className="text-sm font-bold leading-none">{s.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{s.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold" style={{ color: s.color }}>{raw}</span>
                  <span className="text-[10px] text-muted-foreground ml-0.5">/100</span>
                </div>
              </div>
              {/* Animated bar */}
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: s.color, boxShadow: `0 0 6px ${s.color}88` }}
                  initial={{ width: 0 }}
                  animate={{ width: revealed ? `${pct}%` : '0%' }}
                  transition={{ delay: 0.55 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* CTA */}
      <motion.div
        className="mt-8 w-full max-w-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <SorcererButton className="w-full" icon={ChevronRight} onClick={onNext}>
          Show My Potential
        </SorcererButton>
      </motion.div>

      {/* Fixed continue */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background via-background/90 to-transparent z-30 pointer-events-none" />
    </motion.section>
  )
}

/* ===================================================================
   STEP 17 — 90-DAY PROJECTION
   =================================================================== */
function NinetyDayProjection({ gradeIdx, onNext }: { gradeIdx: number; onNext: () => void }) {
  const gradeLabels = ['Grade 4', 'Grade 3', 'Grade 2', 'Grade 1', 'Special']

  return (
    <motion.section
      key="projection"
      className="relative z-10 flex flex-1 flex-col items-center px-6 pt-10 pb-8 overflow-y-auto no-scrollbar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
    >
      <h2 className="font-heading text-2xl font-bold mb-6 text-center">Give yourself just 90 days</h2>

      {/* Chart */}
      <div className="w-full max-w-xs mb-8">
        <div className="relative h-48 rounded-2xl border border-border bg-surface/80 p-4">
          {/* Y-axis labels */}
          <div className="absolute left-2 top-4 bottom-4 flex flex-col justify-between text-[10px] text-muted-foreground">
            {['S', 'E', 'D', 'C', 'B', 'A'].map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
          {/* Chart lines */}
          <svg viewBox="0 0 200 120" className="w-full h-full pl-6" fill="none" preserveAspectRatio="none">
            {/* Without Sorcerer (flat gray) */}
            <path d="M0 90 Q50 85 100 80 T200 75" stroke="rgba(138,136,148,0.4)" strokeWidth="2" strokeDasharray="4 4" />
            {/* With Sorcerer (green rising) */}
            <path d="M0 90 Q40 80 80 60 T160 20 200 5" stroke="#2ed9a8" strokeWidth="2.5" />
            <text x="140" y="15" fill="#2ed9a8" fontSize="8" fontWeight="bold">with Sorcerer</text>
            <text x="140" y="80" fill="rgba(138,136,148,0.6)" fontSize="7">without Sorcerer</text>
            {/* Current point */}
            <circle cx="80" cy="60" r="4" fill="#2ed9a8" />
            <text x="72" y="75" fill="#2ed9a8" fontSize="7">month 3</text>
          </svg>
        </div>
      </div>

      {/* Benefit cards */}
      <div className="w-full max-w-xs mb-6">
        {[
          { word: 'strength', color: 'text-jade', text: 'Your strength will increase significantly', desc: 'Progressive overload training will help you lift heavier weights and build lean muscle' },
          { word: 'energy', color: 'text-jade', text: "You'll have more energy", desc: "Better conditioning means you won't get tired during daily activities" },
          { word: 'confidence', color: 'text-jade', text: 'Your confidence will drastically improve', desc: "As you transform your body, you'll feel empowered and unstoppable" },
        ].map((b, i) => (
          <motion.div
            key={b.word}
            className="w-full rounded-2xl border border-border bg-surface/80 p-4 mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
          >
            <div className="flex items-start gap-3">
              <Check className="size-5 text-jade mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">
                  Your <span className={b.color}>{b.word}</span> will increase significantly
                </p>
                <p className="text-xs text-muted-foreground mt-1">{b.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="w-full max-w-xs mt-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <SorcererButton className="w-full" onClick={onNext}>
          Unlock My Potential
        </SorcererButton>
      </motion.div>
    </motion.section>
  )
}

/* ===================================================================
   STEP 18 — OATH QUESTIONS (4 full-screen)
   =================================================================== */
function OathQuestions({ questionIdx, setQuestionIdx, onDone }: { questionIdx: number; setQuestionIdx: (v: number) => void; onDone: () => void }) {
  function handleYes() {
    if (questionIdx >= OATH_QUESTIONS.length - 1) { onDone() }
    else { setQuestionIdx(questionIdx + 1) }
  }
  function handleNo() {
    // Even "No" progresses — same as Arise
    handleYes()
  }

  const bgs = [
    'bg-gradient-to-b from-surface-2 to-background',
    'bg-gradient-to-b from-[#0d1020] to-background',
    'bg-gradient-to-b from-[#0a0d18] to-background',
    'bg-gradient-to-b from-[#0e0a14] to-background',
  ]

  const isGojoScreen = questionIdx === 0
  const isSukunaScreen = questionIdx === 1
  const isYutaScreen = questionIdx === 2
  const isTojiScreen = questionIdx === 3
  const isImageScreen = isGojoScreen || isSukunaScreen || isYutaScreen || isTojiScreen

  const currentBgImage = isGojoScreen
    ? '/gojo-bg.jpg'
    : isSukunaScreen
    ? '/sukuna-bg.jpg'
    : isYutaScreen
    ? '/yuta-bg.jpg'
    : isTojiScreen
    ? '/yuji-abs.jpg'
    : null
  const glowShadow = isGojoScreen
    ? 'shadow-[0_0_25px_rgba(124,92,255,0.65)]'
    : isSukunaScreen
    ? 'shadow-[0_0_25px_rgba(228,40,60,0.65)]'
    : isYutaScreen
    ? 'shadow-[0_0_25px_rgba(46,217,168,0.65)]'
    : isTojiScreen
    ? 'shadow-[0_0_25px_rgba(34,211,238,0.65)]'
    : ''

  return (
    <motion.section
      key={`oath-${questionIdx}`}
      className={cn(
        'relative z-10 flex flex-1 flex-col items-center justify-between px-6 py-12 overflow-hidden',
        isImageScreen ? 'min-h-screen' : bgs[questionIdx % bgs.length]
      )}
      initial={{ opacity: 0, scale: 1.03 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={transition}
    >
      {/* Background image: Gojo (Q0), Sukuna (Q1), Yuta (Q2) */}
      {isImageScreen && currentBgImage ? (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src={currentBgImage}
            alt="Character Background"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Subtle dark gradient overlay to ensure text readability while letting the artwork shine */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-black/85" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,0.65)_100%)]" />
        </div>
      ) : (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-ce/5 blur-3xl" />
        </div>
      )}

      {/* Logo */}
      <p className={cn(
        'relative z-10 font-heading text-lg font-bold text-ce-gradient tracking-wide',
        isImageScreen && 'drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]'
      )}>
        SORCERER
      </p>

      {/* Question */}
      <motion.h2
        className={cn(
          'relative z-10 font-heading text-2xl md:text-3xl font-bold text-center max-w-sm leading-snug',
          isImageScreen ? 'text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]' : 'text-foreground'
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {OATH_QUESTIONS[questionIdx]}
      </motion.h2>

      {/* No/Yes buttons */}
      <motion.div
        className="relative z-10 flex gap-4 w-full max-w-xs"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={handleNo}
          className={cn(
            'flex-[0.4] rounded-xl border py-3.5 text-sm font-semibold transition-all duration-200',
            isImageScreen
              ? 'border-white/20 bg-black/60 backdrop-blur-md text-white/90 hover:bg-white/15 hover:text-white shadow-[0_4px_15px_rgba(0,0,0,0.5)]'
              : 'border-border bg-transparent text-foreground hover:bg-surface-2'
          )}
        >
          No
        </button>
        <SorcererButton
          className={cn('flex-[0.6]', glowShadow)}
          onClick={handleYes}
        >
          Yes
        </SorcererButton>
      </motion.div>
    </motion.section>
  )
}

/* ===================================================================
   STEP 19 — LOCK IN (Hold to confirm)
   =================================================================== */
function LockIn({ onDone }: { onDone: () => void }) {
  const [holding, setHolding] = useState(false)
  const [completed, setCompleted] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Programmatically trigger play to bypass strict browser autoplay restrictions
    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.play().catch(() => {})
    }
  }, [])

  function startHold() {
    setHolding(true)
    timerRef.current = setTimeout(() => {
      setCompleted(true)
      setTimeout(onDone, 600)
    }, 2000)
  }

  function endHold() {
    if (!completed) {
      setHolding(false)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }

  return (
    <motion.section
      key="lockin"
      className="relative flex flex-1 flex-col items-center justify-between px-6 py-12 min-h-screen overflow-hidden"
      style={{ zIndex: 10 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={transition}
    >
      {/* Full-screen 4K video background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          ref={videoRef}
          src="/jjk-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Cinematic dark overlays to keep text and fingerprint crystal clear while highlighting 4K video */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/25 to-black/85" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.65) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 55%, rgba(0,240,255,0.08), transparent 70%)' }} />
      </div>

      {/* Logo */}
      <p className="relative font-heading text-lg font-bold text-ce-gradient tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]" style={{ zIndex: 2 }}>SORCERER</p>

      {/* Content */}
      <div className="relative text-center" style={{ zIndex: 2 }}>
        <motion.h2
          className="font-heading text-3xl font-bold mb-4 text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Are you ready<br />to lock in?
        </motion.h2>
        <motion.p
          className="text-sm max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-crimson font-semibold">WARNING</span>
          <span className="text-white/70"> - You&apos;ve seen the path ahead. Choose to walk it, or remain where you are.</span>
        </motion.p>
      </div>

      {/* Fingerprint hold area */}
      <motion.div
        className="relative flex flex-col items-center gap-4"
        style={{ zIndex: 2 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div
          className="relative cursor-pointer select-none"
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
        >
          {/* Outer ambient glow ring */}
          {holding && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ boxShadow: '0 0 40px 10px rgba(0,240,255,0.65)' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.15 }}
              transition={{ duration: 0.3 }}
            />
          )}
          {/* Ring animation */}
          <svg className="size-20" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0,240,255,0.25)" strokeWidth="3" />
            {holding && (
              <motion.circle
                cx="50" cy="50" r="45"
                fill="none" stroke="#00f0ff" strokeWidth="3"
                strokeDasharray="283"
                strokeDashoffset="283"
                strokeLinecap="round"
                className="animate-ring-fill"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              />
            )}
          </svg>
          <Fingerprint
            className={cn(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-10 transition-colors',
              holding ? 'text-ce' : 'text-white/60 animate-fingerprint-pulse'
            )}
          />
        </div>
        <p className="text-xs text-white/60 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
          {completed ? 'Oath bound.' : 'Tap and hold to lock in'}
        </p>
      </motion.div>
    </motion.section>
  )
}

/* ===================================================================
   STEP 20 — TYPEWRITER REVEAL
   =================================================================== */
function TypewriterReveal({ onDone }: { onDone: () => void }) {
  const text = 'Your path through the cursed realm begins now. Rise, Sorcerer.'
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
        setDone(true)
        setTimeout(onDone, 1500)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [onDone])

  return (
    <motion.section
      key="typewriter"
      className="relative z-10 flex flex-1 flex-col items-center justify-center px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
    >
      {/* Logo */}
      <p className="absolute top-12 font-heading text-lg font-bold text-ce-gradient tracking-wide">SORCERER</p>

      {/* Ambient glow */}
      <div className="absolute top-1/3 right-0 w-64 h-64 rounded-full bg-ce/5 blur-3xl" />

      <motion.p className="font-heading text-2xl font-bold leading-relaxed text-foreground">
        {displayed}
        {!done && <span className="inline-block w-0.5 h-6 bg-foreground ml-1 animate-cursor-blink" />}
      </motion.p>
    </motion.section>
  )
}

/* ===================================================================
   STEP 21 — FORGE IDENTITY (Name + Aura — moved from old Step 1)
   =================================================================== */
function ForgeIdentity({
  name, setName, aura, setAura, onNext,
}: {
  name: string; setName: (v: string) => void;
  aura: AuraKey; setAura: (v: AuraKey) => void;
  onNext: () => void;
}) {
  const AURA_META: Record<AuraKey, {
    traits: string[]; desc: string; glow: string; border: string; textColor: string;
    bgDark: string;
  }> = {
    violet: {
      traits: ['Legacy of the Six Eyes', 'Six Eyes', 'Limitless'],
      desc: 'The power of the void — absolute control over space.',
      glow: 'rgba(124,92,255,0.7)',
      border: 'rgba(124,92,255,0.85)',
      textColor: '#c4b5fd',
      bgDark: 'rgba(124,92,255,0.18)',
    },
    jade: {
      traits: ['Queen of Curses', 'Boundless', 'Eternal'],
      desc: 'An eternal cursed spirit — unconditional, limitless power.',
      glow: 'rgba(46,217,168,0.65)',
      border: 'rgba(46,217,168,0.85)',
      textColor: '#6ee7b7',
      bgDark: 'rgba(46,217,168,0.15)',
    },
    crimson: {
      traits: ['Innate Dominion', 'Reversal', 'Divine'],
      desc: 'Master of Reverse Cursed Technique — divine and unstoppable.',
      glow: 'rgba(228,40,60,0.65)',
      border: 'rgba(228,40,60,0.85)',
      textColor: '#fca5a5',
      bgDark: 'rgba(228,40,60,0.15)',
    },
    gold: {
      traits: ['Pact of Constraint', 'Peak Body', 'Zero CE'],
      desc: 'Pure physical supremacy — no cursed energy, no limits.',
      glow: 'rgba(34,211,238,0.65)',
      border: 'rgba(34,211,238,0.85)',
      textColor: '#67E8F9',
      bgDark: 'rgba(34,211,238,0.15)',
    },
  }

  const selectedMeta = AURA_META[aura]
  const selectedAura = AURAS.find(a => a.key === aura)!

  return (
    <motion.section
      key="forge"
      className="relative z-10 flex flex-1 flex-col px-4 pb-6 pt-8 overflow-y-auto no-scrollbar"
      initial={{ opacity: 0, x: 40, filter: 'blur(8px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x: -40, filter: 'blur(8px)' }}
      transition={transition}
    >
      {/* Header */}
      <div className="mb-4">
        <h2 className="font-heading text-2xl font-bold">Forge your identity</h2>
        <p className="mt-1 text-sm text-muted-foreground">How shall the record remember you?</p>
      </div>

      {/* Name input */}
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        Sorcerer name
      </label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ce mb-5"
      />

      {/* Aura section label */}
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Choose your aura
      </p>

      {/* Aura Cards Grid — 2 columns, tall cards with big images */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {AURAS.map((a, i) => {
          const meta = AURA_META[a.key as AuraKey]
          const isSelected = aura === a.key
          const imgSrc = (a as typeof a & { image: string }).image
          return (
            <motion.button
              key={a.key}
              onClick={() => setAura(a.key as AuraKey)}
              className="relative flex flex-col rounded-2xl overflow-hidden"
              style={{
                background: isSelected
                  ? `linear-gradient(180deg, ${a.from}20 0%, ${a.to}10 100%)`
                  : 'rgba(255,255,255,0.04)',
                border: isSelected
                  ? `2px solid ${meta.border}`
                  : '2px solid rgba(255,255,255,0.08)',
                boxShadow: isSelected
                  ? `0 0 28px ${meta.glow}, 0 0 8px ${meta.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`
                  : 'none',
                minHeight: '200px',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Animated shimmer bg when selected */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 60%, ${a.from}22, transparent 70%)` }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              )}

              {/* Large character image — fills the card, object-contain so full art shows */}
              <div
                className="relative w-full flex-1 flex items-center justify-center overflow-hidden"
                style={{ minHeight: '140px', background: isSelected ? meta.bgDark : 'rgba(255,255,255,0.02)' }}
              >
                {/* Outer glow halo when selected */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at 50% 80%, ${a.from}45 0%, transparent 65%)`,
                    }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                <motion.div
                  className="relative w-full h-full"
                  style={{ minHeight: '140px' }}
                  animate={isSelected ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Image
                    src={imgSrc}
                    alt={a.label}
                    fill
                    className="object-contain object-center"
                    style={{
                      filter: isSelected
                        ? `drop-shadow(0 0 12px ${a.from}) drop-shadow(0 0 24px ${a.from}88) brightness(1.1)`
                        : 'brightness(0.7) saturate(0.8)',
                      transition: 'filter 0.35s ease',
                    }}
                  />
                </motion.div>
              </div>

              {/* Bottom label area */}
              <div className="px-3 py-2.5 text-center">
                <p
                  className="text-sm font-bold leading-tight mb-1"
                  style={{ color: isSelected ? meta.textColor : 'rgba(255,255,255,0.7)' }}
                >
                  {a.label}
                </p>
                {/* Top trait tag only */}
                <span
                  className="inline-block text-[9px] font-semibold px-2 py-0.5 rounded-md"
                  style={{
                    background: isSelected ? `${a.from}30` : 'rgba(255,255,255,0.06)',
                    color: isSelected ? meta.textColor : 'rgba(255,255,255,0.4)',
                    border: isSelected ? `1px solid ${a.from}55` : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {meta.traits[0]}
                </span>
              </div>

              {/* Selected checkmark badge */}
              {isSelected && (
                <motion.div
                  className="absolute top-2 right-2 size-6 rounded-full flex items-center justify-center shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${a.from}, ${a.to})` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <Check className="size-3.5 text-white" />
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* CTA */}
      <div className="mt-5">
        <SorcererButton
          className="w-full"
          icon={ChevronRight}
          disabled={!name.trim()}
          onClick={onNext}
        >
          Continue
        </SorcererButton>
      </div>
    </motion.section>
  )
}

/* ===================================================================
   STEP 22 — GRADE CEREMONY (Final)
   =================================================================== */
function GradeCeremony({ gradeIdx, onDone }: { gradeIdx: number; onDone: () => void }) {
  const grade = GRADES[gradeIdx]
  return (
    <motion.section
      className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
    >
      <motion.p
        className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Ranking Ceremony
      </motion.p>

      <motion.div
        className="relative my-8 flex size-40 items-center justify-center"
        initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 120, damping: 12 }}
      >
        <span className="absolute inset-0 animate-ce-pulse rounded-full bg-ce/20 blur-2xl" />
        <motion.span
          className="absolute inset-0 rounded-full ring-2 ring-ce/50"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
        <span
          className="relative flex size-40 items-center justify-center rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(124,92,255,0.28), transparent 72%)',
          }}
        >
          <span className="font-heading text-6xl font-bold text-ce-gradient">
            {gradeIdx === 4 ? '★' : 4 - gradeIdx}
          </span>
        </span>
      </motion.div>

      <motion.h2
        className="font-heading text-3xl font-bold"
        initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 0.9 }}
      >
        You are a{' '}
        <span className="text-ce-gradient">{grade.label} Sorcerer</span>
      </motion.h2>
      <motion.p
        className="mt-3 max-w-[30ch] text-pretty text-sm leading-relaxed text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Your journey begins here. Complete missions to grow your cursed energy
        and ascend the ranks.
      </motion.p>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <GradeChip tone={grade.tone} label={grade.label} icon={Sparkles} />
      </motion.div>

      <motion.div
        className="mt-10 w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7 }}
      >
        <SorcererButton className="w-full" icon={ChevronRight} onClick={onDone}>
          Enter the Domain
        </SorcererButton>
      </motion.div>
    </motion.section>
  )
}

/* ===================================================================
   SHARED COMPONENTS
   =================================================================== */

/** Generic quiz step wrapper with title + continue button */
function QuizStep({
  title, caption, children, onNext, canProceed,
}: {
  title: string; caption?: string; children: React.ReactNode; onNext: () => void; canProceed: boolean;
}) {
  return (
    <motion.section
      className="relative z-10 flex flex-1 flex-col px-5 pb-8 pt-6"
      initial={{ opacity: 0, x: 40, filter: 'blur(8px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x: -40, filter: 'blur(8px)' }}
      transition={transition}
    >
      <div className="mb-6">
        <h2 className="font-heading text-xl font-bold">{title}</h2>
        {caption && (
          <p className="mt-1.5 text-xs text-muted-foreground tracking-wide">{caption}</p>
        )}
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>
      <div className="pt-6">
        <SorcererButton
          className="w-full"
          icon={ChevronRight}
          disabled={!canProceed}
          onClick={onNext}
        >
          Continue
        </SorcererButton>
      </div>
    </motion.section>
  )
}

/** Selection card with border highlight */
function SelectCard({
  selected, onClick, onMouseEnter, onMouseLeave, children,
}: {
  selected: boolean; onClick: () => void; onMouseEnter?: () => void; onMouseLeave?: () => void; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        'w-full rounded-xl border bg-surface px-4 py-3.5 text-left transition-all',
        selected ? 'border-ce/60 glow-ce bg-ce/5' : 'border-border hover:border-border/80',
      )}
    >
      {children}
    </button>
  )
}

/** Scroll-style number picker — drum-roll / iOS wheel style */
function ScrollPicker({
  value, onChange, min, max, suffix = '',
}: {
  value: number; onChange: (v: number) => void; min: number; max: number; suffix?: string;
}) {
  const ITEM_H = 56
  const VISIBLE = 5
  const CENTER = Math.floor(VISIBLE / 2)

  const containerRef = useRef<HTMLDivElement>(null)
  const dragStartY = useRef<number | null>(null)
  const dragStartVal = useRef(value)
  const velocityRef = useRef(0)
  const lastY = useRef(0)
  const lastT = useRef(0)
  const rafRef = useRef<number | null>(null)
  const [dragging, setDragging] = useState(false)

  const clamp = (v: number) => Math.max(min, Math.min(max, v))

  const fling = useCallback((vel: number) => {
    let v = vel
    const tick = () => {
      if (Math.abs(v) < 0.4) return
      dragStartVal.current = clamp(Math.round(dragStartVal.current - v * 0.06))
      onChange(dragStartVal.current)
      v *= 0.87
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [min, max, onChange])

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const steps = Math.sign(e.deltaY)
    onChange(clamp(value + steps))
  }, [value, min, max, onChange])

  const startDrag = useCallback((clientY: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    dragStartY.current = clientY
    dragStartVal.current = value
    lastY.current = clientY
    lastT.current = performance.now()
    velocityRef.current = 0
    setDragging(true)
  }, [value])

  const moveDrag = useCallback((clientY: number) => {
    if (dragStartY.current === null) return
    const now = performance.now()
    const dt = now - lastT.current
    if (dt > 0) velocityRef.current = (clientY - lastY.current) / dt * 16
    lastY.current = clientY
    lastT.current = now
    const raw = clientY - dragStartY.current
    const steps = Math.round(-raw / ITEM_H)
    onChange(clamp(dragStartVal.current + steps))
  }, [min, max, onChange])

  const endDrag = useCallback((clientY: number) => {
    if (dragStartY.current === null) return
    const raw = clientY - dragStartY.current
    const steps = Math.round(-raw / ITEM_H)
    onChange(clamp(dragStartVal.current + steps))
    dragStartVal.current = clamp(dragStartVal.current + steps)
    dragStartY.current = null
    setDragging(false)
    if (Math.abs(velocityRef.current) > 2) fling(velocityRef.current)
  }, [fling, min, max, onChange])

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: PointerEvent) => moveDrag(e.clientY)
    const onUp   = (e: PointerEvent) => endDrag(e.clientY)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup',   onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup',   onUp)
    }
  }, [dragging, moveDrag, endDrag])

  const items = Array.from({ length: VISIBLE }, (_, i) => {
    const idx = value - CENTER + i
    return { idx, label: idx >= min && idx <= max ? `${idx}${suffix}` : '' }
  })

  return (
    <div
      ref={containerRef}
      className="relative select-none touch-none overflow-hidden"
      style={{ width: 170, height: ITEM_H * VISIBLE, cursor: dragging ? 'grabbing' : 'grab' }}
      onWheel={onWheel}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        startDrag(e.clientY)
      }}
    >
      {/* top fade mask - fully transparent gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[80px]"
        style={{ background: 'linear-gradient(to bottom, rgba(9, 13, 18, 0.4) 0%, transparent 100%)' }} />
      {/* bottom fade mask - fully transparent gradient */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[80px]"
        style={{ background: 'linear-gradient(to top, rgba(9, 13, 18, 0.4) 0%, transparent 100%)' }} />

      {/* selection highlight rail - seamless transparent glow */}
      <div
        className="pointer-events-none absolute inset-x-2 z-20 rounded-full"
        style={{
          top: CENTER * ITEM_H + 2,
          height: ITEM_H - 4,
          background: 'rgba(0, 240, 255, 0.05)',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          boxShadow: '0 0 25px rgba(0, 240, 255, 0.25)',
        }}
      />

      {/* drum items */}
      <div className="flex flex-col">
        {items.map(({ idx, label }, i) => {
          const dist = Math.abs(i - CENTER)
          const isCenter = dist === 0
          const scale = isCenter ? 1 : dist === 1 ? 0.80 : 0.64
          const opacity = isCenter ? 1 : dist === 1 ? 0.40 : 0.15
          return (
            <div
              key={idx}
              onClick={() => !dragging && label && onChange(clamp(idx))}
              className="flex items-center justify-center"
              style={{
                height: ITEM_H,
                transform: `scale(${scale})`,
                opacity,
                transition: 'transform 0.12s ease, opacity 0.12s ease',
                cursor: isCenter ? 'default' : label ? 'pointer' : 'default',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-heading, inherit)',
                  fontSize: isCenter ? 32 : 22,
                  fontWeight: 700,
                  color: isCenter ? '#ffffff' : '#8A8894',
                  letterSpacing: '-0.02em',
                  transition: 'font-size 0.12s ease, color 0.12s ease',
                  userSelect: 'none',
                }}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
