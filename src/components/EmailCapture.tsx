'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowRight } from 'lucide-react'

export function EmailCapture() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section className="bg-[#0f1f13] dark:bg-[#0a1509] py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green/20 mb-6">
            <Mail className="w-5 h-5 text-green-bright" />
          </div>
          <h2 className="font-display text-4xl text-white mb-4">
            Join 12,000+ Longevity Optimizers
          </h2>
          <p className="text-[#8aad8d] text-lg mb-8">
            Weekly science summaries, protocol updates, and exclusive subscriber-only reviews. No spam, ever.
          </p>
          {submitted ? (
            <div className="text-green-bright font-medium">You&apos;re in! Check your inbox for a confirmation.</div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-green-bright text-sm"
              />
              <button type="submit" className="px-5 py-3 bg-green-bright text-white rounded-lg font-medium hover:bg-green transition-colors flex items-center gap-2 cursor-pointer">
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
