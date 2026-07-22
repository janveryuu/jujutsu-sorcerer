'use client'

import { useEffect, useRef } from 'react'

interface Props {
  density?: number
  className?: string
  color?: string
}

/**
 * Subtle, performance-safe cursed-energy particle drift.
 * Low opacity, capped particle count, pauses when tab is hidden.
 */
export function CursedEnergyBg({
  density = 26,
  className = '',
  color = '0, 240, 255',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const particles = Array.from({ length: density }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.4,
      vy: -(Math.random() * 0.08 + 0.02),
      vx: (Math.random() - 0.5) * 0.03,
      o: Math.random() * 0.4 + 0.1,
      tw: Math.random() * Math.PI * 2,
    }))

    const resize = () => {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const newW = Math.round(rect.width * dpr)
      const newH = Math.round(rect.height * dpr)
      if (newW === 0 || newH === 0) return
      w = rect.width
      h = rect.height
      if (canvas.width !== newW || canvas.height !== newH) {
        canvas.width = newW
        canvas.height = newH
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
    }
    resize()

    let resizeTimer = 0
    const ro = new ResizeObserver(() => {
      if (resizeTimer) return
      resizeTimer = window.setTimeout(() => {
        resizeTimer = 0
        resize()
      }, 60)
    })
    ro.observe(canvas.parentElement || canvas)

    let running = true
    let lastTime = performance.now()

    const loop = (now: number) => {
      if (!running) return
      raf = requestAnimationFrame(loop)

      const dt = now - lastTime
      if (dt < 33) return
      lastTime = now - (dt % 33)

      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.y += (p.vy * dt) / 1600
        p.x += (p.vx * dt) / 1600
        p.tw += (0.02 * dt) / 16
        if (p.y < -0.05) {
          p.y = 1.05
          p.x = Math.random()
        }
        if (p.x < -0.05) p.x = 1.05
        if (p.x > 1.05) p.x = -0.05
        const twinkle = (Math.sin(p.tw) + 1) / 2
        const px = p.x * w
        const py = p.y * h
        const grad = ctx.createRadialGradient(px, py, 0, px, py, p.r * 4)
        grad.addColorStop(0, `rgba(${color}, ${p.o * (0.6 + twinkle * 0.4)})`)
        grad.addColorStop(1, `rgba(${color}, 0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(px, py, p.r * 4, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const onVis = () => {
      const isVisible = !document.hidden
      if (isVisible && !running) {
        running = true
        lastTime = performance.now()
        raf = requestAnimationFrame(loop)
      } else if (!isVisible) {
        running = false
        cancelAnimationFrame(raf)
      }
    }
    document.addEventListener('visibilitychange', onVis)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      if (resizeTimer) clearTimeout(resizeTimer)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [density, color])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  )
}
