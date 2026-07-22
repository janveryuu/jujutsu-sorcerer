'use client'

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import { STAT_META, type Stats, type StatKey } from '@/lib/sorcerer-data'

export function AttributeRadar({ stats }: { stats: Stats }) {
  const data = (Object.keys(STAT_META) as StatKey[]).map((k) => ({
    stat: STAT_META[k].short,
    value: stats[k],
  }))

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <defs>
            <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.50} />
              <stop offset="100%" stopColor="#0284c7" stopOpacity={0.15} />
            </radialGradient>
          </defs>
          <PolarGrid stroke="rgba(0,240,255,0.12)" />
          <PolarAngleAxis
            dataKey="stat"
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
          />
          <Radar
            dataKey="value"
            stroke="#00f0ff"
            strokeWidth={2}
            fill="url(#radarFill)"
            fillOpacity={1}
            isAnimationActive
            animationDuration={900}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
