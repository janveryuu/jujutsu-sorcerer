'use client'

import { useEffect } from 'react'
import { Sparkles, AlertTriangle, RotateCcw } from 'lucide-react'
import { CursedEnergyBg } from '@/components/cursed-energy-bg'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-background px-6">
      <CursedEnergyBg density={20} />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center">
        <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-crimson/10 ring-1 ring-crimson/30 shadow-[0_0_40px_rgba(220,38,38,0.2)]">
          <AlertTriangle className="size-10 text-crimson" />
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-crimson">
          Domain Expansion Failed
        </p>

        <h1 className="font-heading text-3xl font-bold text-foreground">
          Cursed Energy Disrupted
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          An anomaly occurred while channeling your cursed energy. The connection was lost or the technique failed to execute.
        </p>

        <button
          onClick={reset}
          className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-ce/50 bg-ce/10 px-6 py-3 font-semibold text-ce transition-all hover:bg-ce/20 active:scale-95"
        >
          <RotateCcw className="size-4" />
          Re-cast Technique
        </button>
      </div>
    </div>
  )
}
