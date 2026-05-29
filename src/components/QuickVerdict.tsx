'use client'
import { motion } from 'framer-motion'
import { CheckCircle2, Star } from 'lucide-react'

export function QuickVerdict({ verdict, score }: { verdict: string; score?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden bg-gradient-to-br from-green/8 to-green/3 border border-green/20 rounded-2xl p-6 mb-10"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'var(--green-bright)' }} />

      <div className="relative flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-green/15 border border-green/25 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-green-bright" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-green-bright">Quick Verdict</h3>
            {score && (
              <div className="flex items-center gap-1.5 bg-green/10 border border-green/20 px-2.5 py-1 rounded-full">
                <Star className="w-3 h-3 text-amber fill-amber" />
                <span className="font-mono text-xs text-ink font-medium">{score}/100</span>
              </div>
            )}
          </div>
          <p className="text-ink leading-relaxed">{verdict}</p>
        </div>
      </div>
    </motion.div>
  )
}
