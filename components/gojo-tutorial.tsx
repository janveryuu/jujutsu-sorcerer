'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, X, RotateCcw } from 'lucide-react'
import Image from 'next/image'

/* ------------------------------------------------------------------ */
/* Tutorial Step Definition                                             */
/* ------------------------------------------------------------------ */
type BubblePosition = 'top' | 'bottom' | 'top-left' | 'bottom-left' | 'center'

interface TutorialStep {
  id: string
  targetId: string | null
  title: string
  message: string
  gojoImage: 1 | 2
  bubblePosition: BubblePosition
  scrollTo?: boolean
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    targetId: null,
    title: "Yo, listen up! \ud83d\ude0e",
    message: "I'm Gojo Satoru \u2014 the strongest. And now I'll be your personal sensei for this app. Let me walk you through everything you need to know. Pay attention!",
    gojoImage: 1,
    bubblePosition: 'center',
  },
  {
    id: 'header',
    targetId: 'tutorial-header',
    title: 'Your Sorcerer Identity',
    message: "This is your name and rank \u2014 who you are as a Jujutsu Sorcerer. Own it. Every great sorcerer starts here. Even I had a humble beginning... well, not that humble.",
    gojoImage: 2,
    bubblePosition: 'bottom',
    scrollTo: true,
  },
  {
    id: 'cursed-energy',
    targetId: 'tutorial-ce',
    title: 'Cursed Energy (CE) \u26a1',
    message: "That glowing number? That's your Cursed Energy \u2014 earned by completing missions. CE is your power score. The more you train, the more you accumulate. Mine is infinite, by the way.",
    gojoImage: 1,
    bubblePosition: 'bottom',
    scrollTo: true,
  },
  {
    id: 'streak',
    targetId: 'tutorial-streak',
    title: 'Training Streak \ud83d\udd25',
    message: "This flame shows your consecutive training days. Consistency is EVERYTHING in Jujutsu. Miss a day and you break the chain. Don't be weak \u2014 keep that streak alive!",
    gojoImage: 2,
    bubblePosition: 'bottom',
    scrollTo: true,
  },
  {
    id: 'status-ring',
    targetId: 'tutorial-status-ring',
    title: 'Your Power Level Ring',
    message: "That spinning ring shows your current level and today's mission completion. The outer ring fills up as you crush daily missions. Hit 3 missions and you've mastered the day!",
    gojoImage: 1,
    bubblePosition: 'bottom',
    scrollTo: true,
  },
  {
    id: 'xp-bar',
    targetId: 'tutorial-xp-bar',
    title: 'XP Progress Bar',
    message: "This bar tracks your XP to the next level. Fill it up by completing missions. Level up enough and your Grade will rise \u2014 from Grade 4 all the way to Special Grade. Like me!",
    gojoImage: 2,
    bubblePosition: 'bottom',
    scrollTo: true,
  },
  {
    id: 'ai-forge',
    targetId: 'tutorial-ai-forge',
    title: '\u2728 AI Exorcism Forge',
    message: "This is your secret weapon \u2014 a Groq-powered AI that generates custom Jujutsu workout missions AND acts as your personal AI Sensei. Even I'm impressed by it.",
    gojoImage: 1,
    bubblePosition: 'bottom',
    scrollTo: true,
  },
  {
    id: 'rankings',
    targetId: 'tutorial-rankings',
    title: '\ud83c\udfc6 Cursed Rankings',
    message: "The global leaderboard. See how you stack up against other sorcerers worldwide. Spoiler: I'm #1. But don't let that stop you from trying to dethrone me. I'll be waiting.",
    gojoImage: 2,
    bubblePosition: 'bottom',
    scrollTo: true,
  },
  {
    id: 'missions-rail',
    targetId: 'tutorial-missions-rail',
    title: "Today's Missions \ud83d\udde1\ufe0f",
    message: "Your daily battle orders. Swipe through these mission cards and pick your training. Each one has different XP and CE rewards. Complete 3 per day for maximum growth!",
    gojoImage: 1,
    bubblePosition: 'top',
    scrollTo: true,
  },
  {
    id: 'nav-missions',
    targetId: 'tutorial-nav-missions',
    title: 'Missions Hub',
    message: "Tap this to access ALL available missions \u2014 from strength training to conditioning. Browse, filter by type, and choose your exorcism battles. Endless training awaits.",
    gojoImage: 2,
    bubblePosition: 'top',
  },
  {
    id: 'nav-status',
    targetId: 'tutorial-nav-status',
    title: 'Status & Stats',
    message: "Your full sorcerer breakdown \u2014 strength, stamina, agility, willpower, and more. Watch your stats grow as you train. Plus the global leaderboard lives here!",
    gojoImage: 1,
    bubblePosition: 'top',
  },
  {
    id: 'nav-domain',
    targetId: 'tutorial-nav-domain',
    title: 'Domain Expansion \ud83c\udf00',
    message: "Unlock powerful Cursed Techniques as you level up. Domain Expansion is the pinnacle of Jujutsu. Train hard enough and you'll unlock abilities worthy of a Special Grade sorcerer.",
    gojoImage: 2,
    bubblePosition: 'top',
  },
  {
    id: 'nav-profile',
    targetId: 'tutorial-nav-profile',
    title: 'Your Sorcerer Profile',
    message: "Settings, body stats, achievements, and account management all live here. You can replay this tutorial anytime from your Profile if you want me to teach you again. Lucky you!",
    gojoImage: 1,
    bubblePosition: 'top',
  },
  {
    id: 'complete',
    targetId: null,
    title: "Training Complete! \ud83d\udcaa",
    message: "That's everything! Now you have no excuse not to become the strongest. I've given you all the knowledge \u2014 the rest is up to you. Go show the world what a Jujutsu Sorcerer can do. LIMITLESS!",
    gojoImage: 1,
    bubblePosition: 'center',
  },
]

interface SpotlightRect {
  top: number
  left: number
  width: number
  height: number
}

function getElementRect(id: string): SpotlightRect | null {
  if (typeof window === 'undefined') return null
  const el = document.getElementById(id)
  if (!el) return null
  const rect = el.getBoundingClientRect()
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height,
  }
}

interface GojoTutorialProps {
  show: boolean
  onComplete: () => void
}

export function GojoTutorial({ show, onComplete }: GojoTutorialProps) {
  const [step, setStep] = useState(0)
  const [rect, setRect] = useState<SpotlightRect | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [visible, setVisible] = useState(false)
  const rafRef = useRef<number | null>(null)

  const currentStep = TUTORIAL_STEPS[step]
  const isLast = step === TUTORIAL_STEPS.length - 1

  // 1-second delayed start
  useEffect(() => {
    if (!show) {
      setVisible(false)
      setStep(0)
      return
    }
    const t = setTimeout(() => setVisible(true), 1000)
    return () => clearTimeout(t)
  }, [show])

  // Track scroll position for SVG positioning
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const updateRect = useCallback(() => {
    if (!currentStep.targetId) {
      setRect(null)
      return
    }
    setRect(getElementRect(currentStep.targetId))
  }, [currentStep.targetId])

  useEffect(() => {
    if (!visible) return

    if (currentStep.targetId && currentStep.scrollTo) {
      const el = document.getElementById(currentStep.targetId)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    const t = setTimeout(updateRect, 400)

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(updateRect)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      clearTimeout(t)
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [step, visible, currentStep, updateRect])

  const handleNext = () => {
    if (isLast) { onComplete() } else { setStep((s) => s + 1) }
  }
  const handleSkip = () => onComplete()

  if (!visible) return null

  const PAD = 10
  const BR = 16
  const spotTop    = rect ? rect.top    - scrollY - PAD : 0
  const spotLeft   = rect ? rect.left            - PAD : 0
  const spotWidth  = rect ? rect.width  + PAD * 2      : 0
  const spotHeight = rect ? rect.height + PAD * 2      : 0
  const progress   = ((step + 1) / TUTORIAL_STEPS.length) * 100

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] pointer-events-none select-none">

        {/* Overlay */}
        <motion.div
          key={`overlay-${step}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-auto absolute inset-0"
          onClick={handleNext}
        >
          {rect ? (
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <mask id="gojo-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <rect x={spotLeft} y={spotTop} width={spotWidth} height={spotHeight} rx={BR} ry={BR} fill="black" />
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="rgba(0,0,0,0.78)" mask="url(#gojo-mask)" />
              {/* Cyan glow ring */}
              <rect x={spotLeft - 2} y={spotTop - 2} width={spotWidth + 4} height={spotHeight + 4} rx={BR + 2} ry={BR + 2} fill="none" stroke="rgba(0,240,255,0.9)" strokeWidth="2.5" />
              <rect x={spotLeft - 8} y={spotTop - 8} width={spotWidth + 16} height={spotHeight + 16} rx={BR + 6} ry={BR + 6} fill="none" stroke="rgba(0,240,255,0.18)" strokeWidth="10" />
            </svg>
          ) : (
            <div className="absolute inset-0 bg-black/80" />
          )}
        </motion.div>

        {/* Bottom panel — bubble + gojo */}
        <div className="fixed bottom-0 left-0 right-0 z-10 pointer-events-auto">
          {/* Speech bubble */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`bubble-${step}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="mx-4 rounded-2xl border border-[rgba(0,240,255,0.35)] bg-[rgba(10,10,20,0.97)] p-4 shadow-[0_0_50px_rgba(0,240,255,0.12)] backdrop-blur-xl"
              style={{ marginBottom: '200px' }}
            >
              {/* Progress bar */}
              <div className="mb-3 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #00f0ff, #0284c7)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
                <span className="shrink-0 font-mono text-[10px] text-[rgba(0,240,255,0.6)]">
                  {step + 1} / {TUTORIAL_STEPS.length}
                </span>
              </div>

              <h3 className="mb-1.5 text-base font-bold leading-snug text-white">
                {currentStep.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/72">
                {currentStep.message}
              </p>

              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  onClick={handleSkip}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-white/40 transition-colors hover:text-white/70 focus-visible:outline-none"
                >
                  <X className="size-3" />
                  Skip Tutorial
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-slate-950 shadow-[0_6px_24px_-4px_rgba(0,240,255,0.55)] transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,240,255,0.8)] active:scale-95 focus-visible:outline-none"
                  style={{ background: 'linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)' }}
                >
                  {isLast ? 'Begin Training!' : <><span>Next</span><ChevronRight className="size-4" /></>}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Gojo mascot */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`gojo-img-${currentStep.gojoImage}`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
              className="absolute bottom-0 right-4 z-20 pointer-events-none"
            >
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Image
                  src={currentStep.gojoImage === 1 ? '/gojo-teaching-1.png' : '/gojo-teaching-2.png'}
                  alt="Gojo Sensei"
                  width={160}
                  height={190}
                  className="h-48 w-auto object-contain drop-shadow-[0_0_24px_rgba(0,240,255,0.35)]"
                  priority
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Completion burst particles (last step only) */}
        <AnimatePresence>
          {isLast && Array.from({ length: 18 }).map((_, i) => (
            <motion.div
              key={`burst-${i}`}
              className="pointer-events-none fixed rounded-full"
              style={{
                width: Math.random() * 8 + 4,
                height: Math.random() * 8 + 4,
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 50}%`,
                background: i % 3 === 0 ? '#00f0ff' : i % 3 === 1 ? '#D4AF6A' : '#7C5CFF',
                zIndex: 5,
              }}
              initial={{ opacity: 0, y: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], y: [-10, -70], scale: [0, 1.3, 0] }}
              transition={{ duration: 1.8, delay: i * 0.08, repeat: Infinity, repeatDelay: 0.8 }}
            />
          ))}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/* Replay Button (used in Profile screen)                              */
/* ------------------------------------------------------------------ */
export function GojoTutorialReplayButton({ onReplay }: { onReplay: () => void }) {
  return (
    <button
      onClick={onReplay}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-[rgba(0,240,255,0.06)] cursor-pointer focus-visible:outline-none"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[rgba(0,240,255,0.1)]">
        <RotateCcw className="size-4 text-[#00f0ff]" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white">Replay Gojo Tutorial</p>
        <p className="text-xs text-white/50">Let Gojo Sensei guide you again</p>
      </div>
      <span className="rounded-full bg-[rgba(0,240,255,0.1)] px-2 py-0.5 text-[10px] font-semibold text-[#00f0ff] ring-1 ring-inset ring-[rgba(0,240,255,0.3)]">
        Sensei
      </span>
    </button>
  )
}
