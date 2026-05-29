'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

export function ScoreBar({ score, label }: { score: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    if (!inView) return
    const timer = setTimeout(() => {
      let start = 0
      const duration = 1200
      const step = (timestamp: number) => {
        if (!start) start = timestamp
        const progress = Math.min((timestamp - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayed(Math.round(eased * score))
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, 200)
    return () => clearTimeout(timer)
  }, [inView, score])

  const color = score >= 85 ? '#2d9e58' : score >= 70 ? '#c17d2a' : '#e05a3a'
  const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : 'C'

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">{label}</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-medium px-1.5 py-0.5 rounded"
            style={{ background: `${color}20`, color }}>
            {grade}
          </span>
          <span className="font-display text-2xl text-ink leading-none">
            {displayed}<span className="text-muted text-sm">/100</span>
          </span>
        </div>
      </div>
      <div className="h-2 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${score}%` } : {}}
          transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
}
