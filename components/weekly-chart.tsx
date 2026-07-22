'use client'

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function WeeklyChart({ data }: { data: number[] }) {
  const chartData = data.map((v, i) => ({ day: DAYS[i] ?? '', ce: v }))
  return (
    <div className="h-28 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="ceArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C5CFF" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#4C2CFF" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#8A8894', fontSize: 11 }}
            interval={0}
          />
          <Tooltip
            cursor={{ stroke: '#7C5CFF', strokeOpacity: 0.3 }}
            contentStyle={{
              background: '#15151C',
              border: '1px solid #26262E',
              borderRadius: 12,
              fontSize: 12,
              color: '#F4F3F7',
            }}
            labelStyle={{ color: '#8A8894' }}
            formatter={(value: any) => [`${value} CE`, 'Cursed Energy']}
          />
          <Area
            type="monotone"
            dataKey="ce"
            stroke="#7C5CFF"
            strokeWidth={2}
            fill="url(#ceArea)"
            dot={{ r: 2.5, fill: '#7C5CFF', strokeWidth: 0 }}
            activeDot={{ r: 4, fill: '#7C5CFF' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
