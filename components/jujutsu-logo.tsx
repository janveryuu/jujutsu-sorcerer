import React from 'react'

export interface JujutsuLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
}

/**
 * Modern minimalist app icon logo for "Jujutsu".
 * Single-stroke abstract mark: one continuous curling line representing a wisp
 * of cursed energy that splits into three thin fractured tendrils near the top.
 */
export function JujutsuLogo({
  size = 60,
  color = '#7C5CFF',
  className,
  ...props
}: JujutsuLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Primary continuous curling energy arc (geometric abstract swoop) */}
      <path
        d="M136 384C136 384 192 448 276 432C360 416 408 336 384 248C364.8 177.6 288 160 256 160C212 160 176 196 188 256C198 306 256 328 300 292C336 262.5 330 200 304 152"
        stroke={color}
        strokeWidth="38"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Tendril 1 (Center-left upward fracture) */}
      <path
        d="M304 152C288 120 270 88 244 64"
        stroke={color}
        strokeWidth="26"
        strokeLinecap="round"
      />

      {/* Tendril 2 (Center vertical high wisp) */}
      <path
        d="M304 152C308 112 320 74 340 48"
        stroke={color}
        strokeWidth="24"
        strokeLinecap="round"
      />

      {/* Tendril 3 (Right fractured whip) */}
      <path
        d="M304 152C332 136 368 116 396 104"
        stroke={color}
        strokeWidth="22"
        strokeLinecap="round"
      />

      {/* Subtle geometric energy nodes / fractured sparks */}
      <circle cx="228" cy="48" r="11" fill={color} />
      <circle cx="418" cy="92" r="9" fill={color} />
    </svg>
  )
}
