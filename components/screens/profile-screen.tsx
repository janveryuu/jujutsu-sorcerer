'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bell,
  ChevronRight,
  Crown,
  Flame,
  Gauge,
  Globe,
  Heart,
  LogOut,
  Moon,
  Ruler,
  Scale,
  Settings,
  Shield,
  Smartphone,
  Sparkles,
  Trophy,
  User,
  Zap,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useSorcerer } from '@/components/sorcerer-provider'
import { CursedEnergyBg } from '@/components/cursed-energy-bg'
import {
  EnergyBar,
  GlowBadge,
  GradeChip,
  Panel,
  SectionTitle,
  SorcererButton,
  gradeToneByIndex,
} from '@/components/sorcerer-ui'
import { AURAS, GRADES } from '@/lib/sorcerer-data'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Toggle switch component                                             */
/* ------------------------------------------------------------------ */
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ce',
        checked ? 'bg-ce' : 'bg-surface-2 ring-1 ring-inset ring-border',
      )}
    >
      <span
        className={cn(
          'inline-block size-4.5 rounded-full bg-white shadow-sm transition-transform duration-200',
          checked ? 'translate-x-[22px]' : 'translate-x-[3px]',
        )}
        style={{ width: 18, height: 18 }}
      />
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Settings row                                                        */
/* ------------------------------------------------------------------ */
function SettingsRow({
  icon: Icon,
  label,
  sublabel,
  action,
  tone = 'muted',
  onClick,
}: {
  icon: typeof Bell
  label: string
  sublabel?: string
  action?: React.ReactNode
  tone?: 'muted' | 'danger'
  onClick?: () => void
}) {
  const Wrapper = onClick && !action ? 'button' : 'div'
  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors',
        onClick ? 'hover:bg-surface-2/70 cursor-pointer' : '',
        tone === 'danger' ? 'text-crimson' : 'text-foreground',
      )}
    >
      <span
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-lg',
          tone === 'danger' ? 'bg-crimson/10' : 'bg-surface-2',
        )}
      >
        <Icon
          className={cn(
            'size-4',
            tone === 'danger' ? 'text-crimson' : 'text-muted-foreground',
          )}
          strokeWidth={2}
        />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{label}</p>
        {sublabel ? (
          <p className="text-xs text-muted-foreground">{sublabel}</p>
        ) : null}
      </div>
      {action ?? (
        onClick ? (
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        ) : null
      )}
    </Wrapper>
  )
}

/* ------------------------------------------------------------------ */
/* Weight trend chart                                                  */
/* ------------------------------------------------------------------ */
function WeightTrendChart({ data }: { data: { date: string; weight: number }[] }) {
  if (data.length < 2) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        Not enough data to chart yet
      </div>
    )
  }

  return (
    <div className="h-36 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2ED9A8" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#2ED9A8" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#8A8894', fontSize: 10 }}
          />
          <YAxis
            domain={['dataMin - 1', 'dataMax + 1']}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#8A8894', fontSize: 10 }}
            width={40}
          />
          <Tooltip
            cursor={{ stroke: '#2ED9A8', strokeOpacity: 0.3 }}
            contentStyle={{
              background: '#15151C',
              border: '1px solid #26262E',
              borderRadius: 12,
              fontSize: 12,
              color: '#F4F3F7',
            }}
            labelStyle={{ color: '#8A8894' }}
            formatter={(value: any) => [`${value} kg`, 'Weight']}
          />
          <Area
            type="monotone"
            dataKey="weight"
            stroke="#2ED9A8"
            strokeWidth={2}
            fill="url(#weightFill)"
            dot={{ r: 3, fill: '#2ED9A8', strokeWidth: 0 }}
            activeDot={{ r: 4.5, fill: '#2ED9A8' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Main Profile Screen                                                 */
/* ------------------------------------------------------------------ */
export function ProfileScreen() {
  const { state } = useSorcerer()
  const grade = GRADES[state.grade]
  const tone = gradeToneByIndex(state.grade)
  const aura = AURAS.find((a) => a.key === state.aura) ?? AURAS[0]

  // Settings state (local UI only)
  const [notifications, setNotifications] = useState(true)
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric')

  const statItems = [
    { icon: Zap, label: 'Total Cursed Energy', value: state.totalCe.toLocaleString(), color: 'text-ce' },
    { icon: Flame, label: 'Longest Streak', value: `${state.longestStreak} days`, color: 'text-gold' },
    { icon: Trophy, label: 'Missions Completed', value: state.workoutsLogged.toString(), color: 'text-jade' },
    { icon: Sparkles, label: 'Techniques Unlocked', value: state.unlocked.length.toString(), color: 'text-ce' },
  ]

  return (
    <div className="relative">
      <CursedEnergyBg density={10} className="opacity-40" />
      <div className="relative space-y-6 px-4 pb-28 pt-6">
        {/* Header */}
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Jujutsu Profile
          </p>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {state.name}
          </h1>
        </header>

        {/* Identity Card */}
        <Panel glow className="overflow-hidden">
          {/* Aura gradient header */}
          <div
            className="relative h-24 w-full"
            style={{
              background: `linear-gradient(135deg, ${aura.from}40, ${aura.to}20, transparent)`,
            }}
          >
            {/* Decorative cursed sigils */}
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute right-8 top-3 size-16 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${aura.from}60, transparent 70%)`,
                }}
              />
              <div
                className="absolute left-4 top-8 size-10 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${aura.to}60, transparent 70%)`,
                }}
              />
            </div>

            {/* Avatar */}
            <div className="absolute -bottom-10 left-5">
              <div className="relative">
                <motion.span
                  className="absolute inset-[-4px] rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${aura.from}, ${aura.to})`,
                  }}
                  animate={{
                    scale: [1, 1.06, 1],
                    opacity: [0.7, 0.4, 0.7],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <span
                  className="relative flex size-20 items-center justify-center rounded-full ring-2 ring-surface"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${aura.from}50, ${aura.to}30)`,
                  }}
                >
                  <User className="size-9 text-foreground/80" strokeWidth={1.5} />
                </span>
              </div>
            </div>
          </div>

          <div className="px-5 pb-5 pt-14">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold">{state.name}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {state.joinDate}
                </p>
              </div>
              <GradeChip tone={tone} label={grade.label} icon={Gauge} />
            </div>

            {/* Stat tiles */}
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {statItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2.5 rounded-xl border border-border bg-surface-2/50 p-3"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-2">
                    <item.icon className={cn('size-4', item.color)} strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <p className={cn('font-mono text-sm font-bold', item.color)}>
                      {item.value}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        {/* Body Stats */}
        <section>
          <SectionTitle>Body Stats</SectionTitle>
          <Panel className="p-4">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-sm font-medium text-foreground">
                Weight Trend
              </span>
              {state.body.length > 0 ? (
                <span className="font-mono text-sm text-jade">
                  {state.body[state.body.length - 1].weight} kg
                </span>
              ) : null}
            </div>
            <WeightTrendChart data={state.body} />
            {state.body.length >= 2 ? (
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-full bg-jade/10 px-2.5 py-1 text-[10px] font-semibold text-jade ring-1 ring-inset ring-jade/30">
                  {(state.body[0].weight - state.body[state.body.length - 1].weight).toFixed(1)} kg lost
                </span>
                <span className="text-[10px] text-muted-foreground">
                  over {state.body.length} weeks
                </span>
              </div>
            ) : null}
          </Panel>
        </section>

        {/* Special Grade Membership CTA */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Panel
            className="overflow-hidden"
            glow
          >
            <div className="relative p-5">
              {/* Ambient gold glow */}
              <div
                className="absolute -right-8 -top-8 size-32 rounded-full opacity-20"
                style={{
                  background: 'radial-gradient(circle, #D4AF6A80, transparent 70%)',
                }}
              />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-gold/15 ring-1 ring-inset ring-gold/40">
                    <Crown className="size-6 text-gold" strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                      Premium
                    </p>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      Special Grade Membership
                    </h3>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Unlock unlimited mission generation, advanced stat analytics,
                  exclusive domain techniques, and priority access to new features.
                </p>
                <SorcererButton className="mt-4 w-full" icon={Sparkles}>
                  Ascend to Special Grade
                </SorcererButton>
              </div>
            </div>
          </Panel>
        </motion.section>

        {/* Settings */}
        <section>
          <SectionTitle>
            <Settings className="size-3.5 inline mr-1" />
            Settings
          </SectionTitle>
          <Panel className="divide-y divide-border overflow-hidden">
            <SettingsRow
              icon={Bell}
              label="Notifications"
              sublabel="Mission reminders & rank-ups"
              action={
                <Toggle
                  checked={notifications}
                  onChange={setNotifications}
                  label="Toggle notifications"
                />
              }
            />
            <SettingsRow
              icon={Ruler}
              label="Units"
              sublabel={units === 'metric' ? 'Metric (kg, cm)' : 'Imperial (lbs, in)'}
              action={
                <button
                  onClick={() => setUnits((u) => (u === 'metric' ? 'imperial' : 'metric'))}
                  className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {units === 'metric' ? 'Metric' : 'Imperial'}
                </button>
              }
            />
            <SettingsRow
              icon={Smartphone}
              label="Integrations"
              sublabel="Connect health apps"
              onClick={() => {}}
            />
            <SettingsRow
              icon={Moon}
              label="Appearance"
              sublabel="Dark mode (always on)"
            />
          </Panel>
        </section>

        {/* Account */}
        <section>
          <SectionTitle>Account</SectionTitle>
          <Panel className="divide-y divide-border overflow-hidden">
            <SettingsRow
              icon={User}
              label="Edit Profile"
              sublabel="Name, aura, and fitness goal"
              onClick={() => {}}
            />
            <SettingsRow
              icon={Shield}
              label="Privacy Policy"
              onClick={() => {}}
            />
            <SettingsRow
              icon={Globe}
              label="Terms of Service"
              onClick={() => {}}
            />
            <SettingsRow
              icon={LogOut}
              label="Sign Out"
              tone="danger"
              onClick={() => {}}
            />
          </Panel>
        </section>

        {/* App info */}
        <div className="pt-2 text-center">
          <p className="text-xs text-muted-foreground/60">
            SORCERER v1.0.0
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground/40">
            Awaken your cursed energy.
          </p>
        </div>
      </div>
    </div>
  )
}
