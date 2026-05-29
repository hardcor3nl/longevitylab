'use client'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

export function QuickVerdict({ verdict }: { verdict: string; score?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-green/5 border border-green/20 rounded-2xl p-6 mb-8"
    >
      <div className="flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-bright mt-0.5 shrink-0" />
        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest text-green-bright mb-2">Quick Verdict</h3>
          <p className="text-ink leading-relaxed">{verdict}</p>
        </div>
      </div>
    </motion.div>
  )
}
