'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Lock, CheckCircle2 } from 'lucide-react'

const perks = [
  'Weekly evidence summaries',
  'Protocol deep-dives',
  'Exclusive subscriber reviews',
  'Early access to the research DB',
]

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
    <section className="relative overflow-hidden py-24 px-4"
      style={{ background: 'linear-gradient(145deg, #061409 0%, #0e2016 40%, #07160b 100%)' }}>

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.14]"
        style={{ backgroundImage: 'radial-gradient(circle, #2d9e58 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-12 left-[10%] w-48 h-48 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(45,158,88,0.10)' }}
        animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-12 right-[8%] w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(193,125,42,0.07)' }}
        animate={{ y: [0, 16, 0], scale: [1, 0.92, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <div className="relative max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-center">

          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 border border-green/30 bg-green/10 text-green-bright px-3 py-1.5 rounded-full font-mono text-xs uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-bright animate-pulse" />
              Weekly Newsletter
            </div>

            <h2 className="font-display text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>
              Join 12,000+<br />
              <span style={{
                background: 'linear-gradient(135deg, #4dc478 0%, #2d9e58 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Longevity Optimisers</span>
            </h2>

            <p className="text-[#6a9c70] text-lg leading-relaxed mb-8 max-w-md">
              The best longevity research, distilled into a weekly read.
              No noise. No sponsorships. Unsubscribe anytime.
            </p>

            <ul className="space-y-2.5">
              {perks.map(p => (
                <li key={p} className="flex items-center gap-2.5 text-sm text-white/60">
                  <div className="w-4 h-4 rounded-full bg-green/25 border border-green/40 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-2.5 h-2.5 text-green-bright" />
                  </div>
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right — Form card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="bg-white/[0.04] border border-white/10 backdrop-blur-md rounded-2xl p-7"
              style={{ boxShadow: '0 24px 48px rgba(0,0,0,0.3)' }}>

              <h3 className="font-display text-white text-xl mb-1">Subscribe for free</h3>
              <p className="text-white/40 text-sm mb-6">Get the weekly digest in your inbox.</p>

              {submitted ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-3 py-6 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-green/20 border border-green/30 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-bright" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">You&apos;re in!</p>
                    <p className="text-white/50 text-sm mt-0.5">Check your inbox to confirm.</p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label htmlFor="email-capture" className="sr-only">Email address</label>
                    <input
                      id="email-capture"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/6 border border-white/12 text-white placeholder-white/30 focus:outline-none focus:border-green-bright/50 focus:bg-white/8 text-sm transition-all duration-150"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 px-5 py-3 bg-green-bright text-white rounded-xl font-semibold text-sm hover:bg-green transition-all duration-200 disabled:opacity-60 cursor-pointer"
                    style={{ boxShadow: '0 4px 16px rgba(45,158,88,0.30)' }}
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Subscribe — it&apos;s free <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-5 flex items-center gap-2 text-xs text-white/25">
                <Lock className="w-3 h-3 shrink-0" />
                <span>No spam, ever. Unsubscribe with one click.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
