'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Microscope, TrendingUp, Users } from 'lucide-react'

export function HeroSection() {
  const stats = [
    { icon: Microscope, value: '200+', label: 'Products Tested' },
    { icon: TrendingUp, value: '50+', label: 'Studies Cited' },
    { icon: Users, value: '12K+', label: 'Subscribers' },
  ]

  return (
    <section className="grain relative min-h-[92vh] flex items-center overflow-hidden bg-cream dark:bg-[#0a0f0b] pt-20">
      {/* Radial green glow */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(45,158,88,0.08), transparent 65%)' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at bottom left, rgba(193,125,42,0.05), transparent 65%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-green/10 border border-green/20 text-green-bright px-3 py-1.5 rounded-full font-mono text-xs uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-green-bright animate-pulse" />
                Evidence-Based Reviews
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-ink leading-[1.05] mb-6"
              style={{ fontSize: 'clamp(44px, 5.5vw, 72px)' }}
            >
              Science-Backed<br />
              Longevity,{' '}
              <em className="text-green dark:text-green-bright not-italic">Explained.</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted text-lg leading-relaxed mb-10 max-w-lg"
            >
              Expert reviews on supplements, wearables, diagnostics, and protocols —
              backed by peer-reviewed research, tested by our team.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-14"
            >
              <Link href="/category/supplements"
                className="group flex items-center gap-2 px-5 py-2.5 bg-green text-white rounded-xl font-medium text-sm hover:bg-green-bright transition-colors cursor-pointer">
                Explore Reviews
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/best"
                className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-border text-ink rounded-xl font-medium text-sm hover:border-green/40 hover:text-green transition-colors cursor-pointer">
                Best Picks
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex items-center gap-8"
            >
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-green" />
                  </div>
                  <div>
                    <div className="font-display text-xl text-ink leading-none">{value}</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted mt-0.5">{label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — decorative cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:block relative h-[480px]"
          >
            {/* Main card */}
            <div className="absolute top-0 left-8 right-0 bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/40">
              <div className="h-48 bg-gradient-to-br from-green/20 via-green/5 to-amber/10 flex items-center justify-center">
                <div className="font-display text-6xl text-green/20 dark:text-green/10 select-none">NMN</div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-green-bright">Supplements</span>
                  <span className="font-mono text-xs bg-green/10 text-green-bright px-2 py-0.5 rounded-full">88/100</span>
                </div>
                <p className="font-display text-lg text-ink leading-tight">Best NMN Supplements of 2024: Expert-Tested &amp; Ranked</p>
                <div className="mt-3 h-1.5 bg-border rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-green-bright rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '88%' }}
                    transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            </div>

            {/* Floating score badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-24 left-0 bg-surface border border-border rounded-xl p-3 shadow-xl"
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">Evidence Score</div>
              <div className="font-display text-2xl text-ink">92<span className="text-sm text-muted">/100</span></div>
              <div className="text-xs text-green-bright font-medium mt-0.5">★ Top Rated</div>
            </motion.div>

            {/* Floating tag */}
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-8 right-4 bg-green text-white rounded-xl px-3 py-2 text-xs font-medium shadow-lg"
            >
              ✓ Third-party tested
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--cream))' }} />
    </section>
  )
}
