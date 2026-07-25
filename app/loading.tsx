import { Sparkles } from 'lucide-react'
import { CursedEnergyBg } from '@/components/cursed-energy-bg'

export default function Loading() {
  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-background">
      <CursedEnergyBg density={10} />
      
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-ce/10 ring-1 ring-ce/30 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
          <Sparkles className="size-8 text-ce animate-pulse" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ce animate-pulse">
          Channeling...
        </p>
      </div>
    </div>
  )
}
