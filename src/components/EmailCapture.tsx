'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export function EmailCapture() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <section className="relative overflow-hidden py-24 px-4" style={{ background: 'linear-gradient(135deg, #0a1a0d 0%, #0f2014 50%, #091508 100%)' }}>
      {/* Subtle dot grid pattern */}
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle, #2d9e58 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-10"
        style={{ background: '#2d9e58' }} />

      <div className="relative max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 border border-green/30 text-green-bright px-3 py-1.5 rounded-full font-mono text-xs uppercase tracking-widest mb-6">
            <Sparkles className="w-3 h-3" />
            Weekly Newsletter
          </div>

          <h2 className="font-display text-4xl sm:text-5xl text-white mb-4 leading-tight">
            Join 12,000+<br />
            <em>Longevity Optimizers</em>
          </h2>
          <p className="text-[#7aad7d] text-lg mb-10 leading-relaxed">
            Weekly science summaries, protocol deep-dives, and exclusive reviews.<br className="hidden sm:block" />
            No noise. Unsubscribe anytime.
          </p>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 text-green-bright font-medium bg-green/10 border border-green/20 px-5 py-3 rounded-xl"
            >
              <span className="text-xl">✓</span> You&apos;re in! Check your inbox.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 rounded-xl bg-white/8 border border-white/15 text-white placeholder-white/35 focus:outline-none focus:border-green-bright/60 text-sm transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-green-bright text-white rounded-xl font-medium text-sm hover:bg-green transition-colors disabled:opacity-60 cursor-pointer whitespace-nowrap"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Subscribe <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}

          <div className="mt-5 flex items-center justify-center gap-6 text-xs text-white/30">
            <span className="flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
              No spam, ever
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              Unsubscribe anytime
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              12,000+ readers
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
