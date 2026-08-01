'use client'

import { motion } from 'framer-motion'
import { Home, Swords, User, Gauge, Network } from 'lucide-react'
import { useSorcerer, type Tab } from './sorcerer-provider'
import { cn } from '@/lib/utils'

const ITEMS: { key: Tab; label: string; icon: typeof Home }[] = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'missions', label: 'Missions', icon: Swords },
  { key: 'status', label: 'Status', icon: Gauge },
  { key: 'domain', label: 'Domain', icon: Network },
  { key: 'profile', label: 'Profile', icon: User },
]

export function BottomNav() {
  const { tab, setTab } = useSorcerer()
  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 z-30 border-t border-border bg-background/85 backdrop-blur-xl"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        {ITEMS.map((item) => {
          const active = tab === item.key
          const Icon = item.icon
          return (
            <li key={item.key} className="flex-1">
              <button
                id={`tutorial-nav-${item.key}`}
                onClick={() => setTab(item.key)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group relative flex w-full flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-medium tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ce',
                  active ? 'text-ce' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span className="relative flex size-6 items-center justify-center">
                  {active ? (
                    <motion.span
                      layoutId="nav-glow"
                      className="absolute inset-[-6px] rounded-full bg-ce/15 ring-1 ring-ce/40"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  ) : null}
                  <Icon className="relative size-5" strokeWidth={active ? 2.4 : 2} />
                </span>
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
