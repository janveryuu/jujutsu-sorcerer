'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  Crown,
  Flame,
  Globe,
  Heart,
  Info,
  Laptop,
  LogOut,
  Moon,
  RefreshCw,
  Ruler,
  Shield,
  Smartphone,
  Sparkles,
  Trash2,
  User,
  X,
  Zap,
} from 'lucide-react'
import { useSorcerer } from '@/components/sorcerer-provider'
import { SorcererButton, GradeChip } from '@/components/sorcerer-ui'
import { AURAS, GOALS, type AuraKey, type GoalKey } from '@/lib/sorcerer-data'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Modal backdrop wrapper                                              */
/* ------------------------------------------------------------------ */
export function ModalWrapper({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
  subtitle?: string
}) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-t-3xl sm:rounded-3xl border border-border/80 bg-surface/95 backdrop-blur-xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground">{title}</h3>
              {subtitle ? (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              ) : null}
            </div>
            <button
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-full bg-surface-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[75vh] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-surface-2">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/* Special Grade Membership Modal                                     */
/* ------------------------------------------------------------------ */
export function SpecialGradeModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const { state, updateState } = useSorcerer()
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('yearly')
  const [loading, setLoading] = useState(false)
  const [activated, setActivated] = useState(false)

  const isAlreadySpecial = state.grade === 4 || state.isSpecialGrade

  const handleSubscribe = () => {
    setLoading(true)
    setTimeout(() => {
      updateState({
        grade: 4, // Special Grade index
        isSpecialGrade: true,
      })
      setLoading(false)
      setActivated(true)
      onSuccess()
    }, 1200)
  }

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Special Grade Membership"
      subtitle="Unlock the pinnacle of Jujutsu fitness intelligence"
    >
      <div className="space-y-5">
        {/* Shimmer Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/15 via-gold/5 to-surface-2 p-5 text-center shadow-[0_0_30px_-5px_rgba(212,175,106,0.3)]">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gold/20 ring-1 ring-gold/40">
            <Crown className="size-8 text-gold animate-bounce" strokeWidth={1.8} />
          </div>
          <h4 className="mt-3 font-heading text-xl font-bold tracking-wide text-gold">
            {isAlreadySpecial ? 'Special Grade Active' : 'Ascend Your Cursed Energy'}
          </h4>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto">
            {isAlreadySpecial
              ? 'You hold the highest sorcerer classification. Unlimited power unlocked.'
              : 'Join the top 1% of sorcerers with unlimited AI mission generation and custom domain analytics.'}
          </p>
        </div>

        {/* Plan Switcher */}
        {!isAlreadySpecial && !activated ? (
          <div className="grid grid-cols-2 gap-3 p-1 bg-surface-2/60 rounded-xl border border-border">
            <button
              onClick={() => setPlan('monthly')}
              className={cn(
                'py-2.5 px-3 rounded-lg text-xs font-semibold transition-all',
                plan === 'monthly'
                  ? 'bg-ce text-slate-950 shadow-md font-bold'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Monthly ($9.99/mo)
            </button>
            <button
              onClick={() => setPlan('yearly')}
              className={cn(
                'relative py-2.5 px-3 rounded-lg text-xs font-semibold transition-all',
                plan === 'yearly'
                  ? 'bg-ce text-slate-950 shadow-md font-bold'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Annual ($99/yr)
              <span className="absolute -top-2 -right-1 bg-gold text-slate-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                Save 17%
              </span>
            </button>
          </div>
        ) : null}

        {/* Benefits list */}
        <div className="space-y-3 rounded-xl border border-border bg-surface-2/30 p-4">
          <p className="text-xs uppercase font-semibold tracking-wider text-gold">
            Included Sorcerer Privileges
          </p>
          <ul className="space-y-2.5 text-xs text-foreground/90">
            <li className="flex items-center gap-2.5">
              <span className="flex size-5 items-center justify-center rounded-full bg-gold/20 text-gold">
                <Check className="size-3" strokeWidth={2.5} />
              </span>
              Unlimited AI Cursed Energy Mission Generation
            </li>
            <li className="flex items-center gap-2.5">
              <span className="flex size-5 items-center justify-center rounded-full bg-gold/20 text-gold">
                <Check className="size-3" strokeWidth={2.5} />
              </span>
              Advanced Radar & Attribute Growth Analytics
            </li>
            <li className="flex items-center gap-2.5">
              <span className="flex size-5 items-center justify-center rounded-full bg-gold/20 text-gold">
                <Check className="size-3" strokeWidth={2.5} />
              </span>
              Exclusive Special Grade Domain Expansion Techniques
            </li>
            <li className="flex items-center gap-2.5">
              <span className="flex size-5 items-center justify-center rounded-full bg-gold/20 text-gold">
                <Check className="size-3" strokeWidth={2.5} />
              </span>
              Gold Aura Badge & High-Rank Leaderboard Priority
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        {isAlreadySpecial || activated ? (
          <div className="text-center p-3 rounded-xl bg-jade/10 border border-jade/30 text-jade text-sm font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="size-4" />
            Special Grade Status Active
          </div>
        ) : (
          <SorcererButton
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full text-slate-950 bg-gradient-to-r from-gold via-amber-400 to-yellow-300 shadow-[0_0_25px_rgba(212,175,106,0.5)] hover:shadow-[0_0_35px_rgba(212,175,106,0.8)]"
            icon={loading ? RefreshCw : Sparkles}
          >
            {loading ? 'Manifesting Vow...' : `Ascend Now (${plan === 'yearly' ? '$99/yr' : '$9.99/mo'})`}
          </SorcererButton>
        )}
      </div>
    </ModalWrapper>
  )
}

/* ------------------------------------------------------------------ */
/* Edit Profile Modal                                                 */
/* ------------------------------------------------------------------ */
export function EditProfileModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: (msg: string) => void
}) {
  const { state, updateState } = useSorcerer()

  const [name, setName] = useState(state.name || '')
  const [aura, setAura] = useState<AuraKey>(state.aura || 'violet')
  const [goal, setGoal] = useState<GoalKey>(state.goal || 'general')
  const [heightCm, setHeightCm] = useState(state.heightCm || 170)
  const [weightKg, setWeightKg] = useState(state.weightKg || 70)

  const handleSave = () => {
    updateState({
      name: name.trim() || 'Sorcerer',
      aura,
      goal,
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
    })
    onSuccess('Profile updated successfully!')
    onClose()
  }

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Sorcerer Profile"
      subtitle="Customize your sorcerer identity and training stats"
    >
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Sorcerer Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Satoru Gojo"
            className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-foreground focus:border-ce focus:outline-none"
          />
        </div>

        {/* Aura Selection */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            Cursed Energy Aura
          </label>
          <div className="grid grid-cols-4 gap-2">
            {AURAS.map((a) => (
              <button
                key={a.key}
                type="button"
                onClick={() => setAura(a.key as AuraKey)}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition-all',
                  aura === a.key
                    ? 'border-ce bg-ce/10 text-foreground ring-1 ring-ce'
                    : 'border-border bg-surface-2/40 text-muted-foreground hover:bg-surface-2',
                )}
              >
                <span
                  className="size-5 rounded-full shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${a.from}, ${a.to})`,
                  }}
                />
                <span className="text-[10px] font-medium leading-none">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Goal Selection */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            Fitness Focus / Domain Goal
          </label>
          <div className="space-y-1.5">
            {GOALS.map((g) => (
              <button
                key={g.key}
                type="button"
                onClick={() => setGoal(g.key as GoalKey)}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-xs transition-all',
                  goal === g.key
                    ? 'border-ce bg-ce/10 text-foreground ring-1 ring-ce font-semibold'
                    : 'border-border bg-surface-2/40 text-muted-foreground hover:bg-surface-2',
                )}
              >
                <span>{g.label}</span>
                {goal === g.key ? <Check className="size-4 text-ce" /> : null}
              </button>
            ))}
          </div>
        </div>

        {/* Height & Weight */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-foreground focus:border-ce focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-foreground focus:border-ce focus:outline-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <SorcererButton onClick={handleSave} className="w-full mt-2" icon={Check}>
          Save Profile Changes
        </SorcererButton>
      </div>
    </ModalWrapper>
  )
}

/* ------------------------------------------------------------------ */
/* Integrations Modal                                                 */
/* ------------------------------------------------------------------ */
export function IntegrationsModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: (msg: string) => void
}) {
  const { state, updateState } = useSorcerer()

  const [integrations, setIntegrations] = useState<Record<string, boolean>>(() => ({
    appleHealth: true,
    googleFit: false,
    strava: true,
    myFitnessPal: false,
    ...state.integrations,
  }))

  const [syncing, setSyncing] = useState(false)

  const toggleApp = (key: string) => {
    const updated = { ...integrations, [key]: !integrations[key] }
    setIntegrations(updated)
    updateState({ integrations: updated })
    onSuccess(`${key} status updated`)
  }

  const handleSyncNow = () => {
    setSyncing(true)
    setTimeout(() => {
      setSyncing(false)
      const addedCe = 320
      updateState({ ce: state.ce + addedCe, totalCe: state.totalCe + addedCe })
      onSuccess(`Synced +${addedCe} Cursed Energy from health apps!`)
    }, 1200)
  }

  const apps = [
    { key: 'appleHealth', label: 'Apple Health', desc: 'Syncs Workouts & Active Energy' },
    { key: 'googleFit', label: 'Google Health Connect', desc: 'Syncs Daily Steps & Heart Rate' },
    { key: 'strava', label: 'Strava', desc: 'Syncs Runs & Cycling Missions' },
    { key: 'myFitnessPal', label: 'MyFitnessPal', desc: 'Syncs Nutrition & Macros' },
  ]

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Health App Integrations"
      subtitle="Connect health & fitness trackers to auto-generate Cursed Energy"
    >
      <div className="space-y-4">
        <div className="space-y-2.5">
          {apps.map((app) => (
            <div
              key={app.key}
              className="flex items-center justify-between rounded-xl border border-border bg-surface-2/40 p-3.5"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{app.label}</p>
                <p className="text-xs text-muted-foreground">{app.desc}</p>
              </div>
              <button
                onClick={() => toggleApp(app.key)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                  integrations[app.key]
                    ? 'bg-jade/20 text-jade border border-jade/40'
                    : 'bg-surface-2 text-muted-foreground border border-border hover:text-foreground',
                )}
              >
                {integrations[app.key] ? 'Connected' : 'Connect'}
              </button>
            </div>
          ))}
        </div>

        <SorcererButton
          onClick={handleSyncNow}
          disabled={syncing}
          variant="secondary"
          className="w-full"
          icon={RefreshCw}
        >
          {syncing ? 'Syncing Health Telemetry...' : 'Sync Health Data Now'}
        </SorcererButton>
      </div>
    </ModalWrapper>
  )
}

/* ------------------------------------------------------------------ */
/* Appearance & Theme Modal                                           */
/* ------------------------------------------------------------------ */
export function AppearanceModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: (msg: string) => void
}) {
  const { state, updateState } = useSorcerer()

  const [activeTheme, setActiveTheme] = useState(state.theme || 'cursedChild')

  const themes = [
    {
      key: 'cursedChild',
      label: 'Cursed Child (Pink)',
      desc: 'Neon Rose & Crimson Aura',
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
      color: '#ec4899',
    },
    {
      key: 'limitless',
      label: 'Limitless (Red & Blue)',
      desc: 'Dual Infinity Spectrum Gradient',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #3b82f6 100%)',
      color: '#3b82f6',
    },
    {
      key: 'divergentFist',
      label: 'Divergent Fist (Cyan Blue)',
      desc: 'Electric Cursed Impact Cyan',
      gradient: 'linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)',
      color: '#00f0ff',
    },
    {
      key: 'idleDeathGamble',
      label: 'Idle Death Gamble (Emerald Green)',
      desc: 'Jackpot Casino Emerald Glow',
      gradient: 'linear-gradient(135deg, #10b981 0%, #2ed9a8 100%)',
      color: '#10b981',
    },
    {
      key: 'idleTransfiguration',
      label: 'Idle Transfiguration (Soul Violet)',
      desc: 'Ethereal Soul Transfiguration Violet',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
      color: '#a855f7',
    },
    {
      key: 'malevolentShrine',
      label: 'Malevolent Shrine (Crimson Red)',
      desc: 'Domain Shrine Blood Flame Red',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
      color: '#dc2626',
    },
  ]

  const selectTheme = (t: typeof themes[number]) => {
    setActiveTheme(t.key)
    updateState({ theme: t.key })
    onSuccess(`Theme updated to ${t.label}!`)
  }

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Appearance & Theme"
      subtitle="Select your modern sorcerer visual theme preset"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2.5">
            Sorcerer Visual Theme
          </label>
          <div className="space-y-2.5">
            {themes.map((t) => {
              const isSelected = activeTheme === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => selectTheme(t)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl border p-3.5 text-xs transition-all duration-200',
                    isSelected
                      ? 'border-ce bg-surface-2/90 text-foreground ring-1 ring-ce shadow-lg'
                      : 'border-border bg-surface-2/40 text-muted-foreground hover:bg-surface-2 hover:text-foreground',
                  )}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      className="size-7 shrink-0 rounded-lg shadow-md ring-1 ring-white/20 transition-transform group-hover:scale-105"
                      style={{ background: t.gradient }}
                    />
                    <div className="text-left min-w-0">
                      <p className="font-semibold text-sm text-foreground leading-tight">
                        {t.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {t.desc}
                      </p>
                    </div>
                  </div>
                  {isSelected ? (
                    <span className="flex size-6 items-center justify-center rounded-full bg-ce/20 text-ce ring-1 ring-ce">
                      <Check className="size-3.5" strokeWidth={2.5} />
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface-2/40 p-3 text-xs text-muted-foreground flex items-center gap-2">
          <Moon className="size-4 text-ce shrink-0" />
          Dark Mode is permanently active to preserve sorcerer focus & battery.
        </div>
      </div>
    </ModalWrapper>
  )
}

/* ------------------------------------------------------------------ */
/* Privacy Policy Modal                                               */
/* ------------------------------------------------------------------ */
export function PrivacyPolicyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Privacy Policy"
      subtitle="Protection of Sorcerer Telemetry & Cursed Data"
    >
      <div className="space-y-3.5 text-xs text-muted-foreground leading-relaxed">
        <div className="rounded-xl border border-border bg-surface-2/40 p-3 text-foreground">
          <p className="font-semibold mb-1 text-ce">1. Data Encryption & Local Storage</p>
          All your workout logs, cursed energy progress, and profile details are encrypted using local AES-256 standards. Your biometric stats remain strictly private.
        </div>

        <div className="rounded-xl border border-border bg-surface-2/40 p-3 text-foreground">
          <p className="font-semibold mb-1 text-ce">2. Zero Third-Party Sharing</p>
          We do not sell, rent, or distribute sorcerer fitness data to external entities or rival curse factions.
        </div>

        <div className="rounded-xl border border-border bg-surface-2/40 p-3 text-foreground">
          <p className="font-semibold mb-1 text-ce">3. Leaderboard Telemetry</p>
          Leaderboard rankings display only your chosen Sorcerer Name, Grade, and Cursed Energy scores. Personal metrics like weight and height are never publicly exposed.
        </div>

        <SorcererButton onClick={onClose} className="w-full mt-2">
          I Understand & Agree
        </SorcererButton>
      </div>
    </ModalWrapper>
  )
}

/* ------------------------------------------------------------------ */
/* Terms of Service Modal                                             */
/* ------------------------------------------------------------------ */
export function TermsOfServiceModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Terms of Service"
      subtitle="Sorcerer Oath & Code of Conduct"
    >
      <div className="space-y-3.5 text-xs text-muted-foreground leading-relaxed">
        <div className="rounded-xl border border-border bg-surface-2/40 p-3 text-foreground">
          <p className="font-semibold mb-1 text-gold">Binding Vow I: Oath of Training</p>
          By creating an account, you enter a Binding Vow to log workouts truthfully and pursue physical conditioning with honor.
        </div>

        <div className="rounded-xl border border-border bg-surface-2/40 p-3 text-foreground">
          <p className="font-semibold mb-1 text-gold">Binding Vow II: Fair Competition</p>
          Manipulating or spoofing mission completions on global leaderboards will result in immediate rank demotion to Grade 4.
        </div>

        <div className="rounded-xl border border-border bg-surface-2/40 p-3 text-foreground">
          <p className="font-semibold mb-1 text-gold">Binding Vow III: Domain Expansion Protocol</p>
          Special Grade membership features are subject to domain guidelines. Memberships may be cancelled anytime through settings.
        </div>

        <SorcererButton onClick={onClose} className="w-full mt-2">
          Accept Sorcerer Vows
        </SorcererButton>
      </div>
    </ModalWrapper>
  )
}

/* ------------------------------------------------------------------ */
/* Sign Out Modal                                                     */
/* ------------------------------------------------------------------ */
export function SignOutModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { signOut } = useSorcerer()

  const handleSignOut = () => {
    signOut()
    onClose()
  }

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Sign Out of Sorcerer"
      subtitle="Are you sure you want to exit your active sorcerer session?"
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-crimson/30 bg-crimson/10 p-4 text-xs text-crimson leading-relaxed">
          <p className="font-semibold mb-1">Confirm Account Logout</p>
          Your current cursed energy stats and unlock status are preserved in local memory. You can log back in or awaken your profile anytime.
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-surface-2 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSignOut}
            className="flex-1 py-3 rounded-xl bg-crimson text-white text-xs font-bold shadow-md hover:bg-crimson/90 transition-colors"
          >
            Sign Out Now
          </button>
        </div>
      </div>
    </ModalWrapper>
  )
}

/* ------------------------------------------------------------------ */
/* Interactive Toast Feedback                                         */
/* ------------------------------------------------------------------ */
export function ToastNotification({
  message,
  onClose,
}: {
  message: string | null
  onClose: () => void
}) {
  if (!message) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="fixed top-5 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2.5 rounded-full border border-ce/50 bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-ce shadow-[0_0_20px_rgba(0,240,255,0.4)] backdrop-blur-md"
      >
        <Sparkles className="size-4 animate-spin text-ce" />
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-1 text-muted-foreground hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
