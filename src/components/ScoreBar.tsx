'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export function ScoreBar({ score, label }: { score: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  const color = score >= 80 ? '#2d9e58' : score >= 60 ? '#c17d2a' : '#e05a3a'

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted font-mono text-xs uppercase tracking-wide">{label}</span>
        <span className="font-display text-xl text-ink">{score}<span className="text-muted text-sm">/100</span></span>
      </div>
      <div className="h-2 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${score}%` } : { width: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
      </div>
    </div>
  )
}
