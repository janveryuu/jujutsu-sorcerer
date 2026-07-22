'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSorcerer } from './sorcerer-provider'
import { Onboarding } from './onboarding'
import { BottomNav } from './bottom-nav'
import { RankUpOverlay } from './rank-up-overlay'
import { HomeScreen } from './screens/home-screen'
import { MissionsScreen } from './screens/missions-screen'
import { StatusScreen } from './screens/status-screen'
import { DomainScreen } from './screens/domain-screen'
import { ProfileScreen } from './screens/profile-screen'
import { WorkoutFlow } from './workout-flow'

export function AppShell() {
  const { state, tab, flow } = useSorcerer()
  const [rankUp, setRankUp] = useState<string | null>(null)

  if (!state.onboarded) {
    return <Onboarding />
  }

  const screens: Record<string, React.ReactNode> = {
    home: <HomeScreen />,
    missions: <MissionsScreen />,
    status: <StatusScreen />,
    domain: <DomainScreen />,
    profile: <ProfileScreen />,
  }

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <main className="flex-1 pb-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, filter: 'blur(6px)', y: 8 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, filter: 'blur(6px)', y: -8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {screens[tab]}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav />

      {/* Workout flow overlay */}
      <AnimatePresence>
        {flow ? <WorkoutFlow onRankUp={(g) => setRankUp(g)} /> : null}
      </AnimatePresence>

      <RankUpOverlay
        open={rankUp !== null}
        gradeLabel={rankUp ?? ''}
        onClose={() => setRankUp(null)}
      />
    </div>
  )
}
