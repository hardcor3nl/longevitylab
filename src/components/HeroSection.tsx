'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Microscope, TrendingUp, Users, Shield, Brain, Activity } from 'lucide-react'

const floatingCards = [
  { icon: Shield,   label: 'NAD+ Level',     value: '+34%',   color: 'text-green-bright', bg: 'bg-green/10 border-green/20',         delay: 0   },
  { icon: Activity, label: 'Recovery Score', value: '94/100', color: 'text-amber',         bg: 'bg-amber/10 border-amber/20',         delay: 0.5 },
  { icon: Brain,    label: 'HRV Trend',      value: '↑ 12ms', color: 'text-blue-400',      bg: 'bg-blue-500/10 border-blue-500/20',  delay: 1   },
]

const stats = [
  { icon: Microscope,  value: '100+', label: 'Reviews Published'   },
  { icon: TrendingUp,  value: '6K+',  label: 'Studies Referenced'  },
  { icon: Users,       value: '12K+', label: 'Subscribers'         },
]

export function HeroSection() {
  return (
    <section className="grain relative min-h-[94vh] flex items-center overflow-hidden bg-cream dark:bg-[#0a0f0b] pt-16">
      {/* Background glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(45,158,88,0.07), transparent 60%)' }} />
      <div className="absolute bottom-0 left-0 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at bottom left, rgba(193,125,42,0.05), transparent 60%)' }} />
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* ── LEFT — Copy ──────────────────────────────── */}
          <div>
            {/* Eyebrow badge */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <div className="inline-flex items-center gap-2.5 mb-7">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green/15 border border-green/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-bright animate-pulse" />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-green-bright">Evidence-Based · Physician-Reviewed</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="font-display text-ink leading-[1.04] mb-6"
              style={{ fontSize: 'clamp(42px, 5vw, 68px)' }}
            >
              Science-Backed<br />
              Longevity,{' '}
              <em className="not-italic" style={{
                background: 'linear-gradient(135deg, var(--green-bright) 0%, var(--green) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Explained.</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="text-muted text-lg leading-relaxed mb-10 max-w-lg"
            >
              Expert reviews on supplements, wearables, diagnostics and protocols —
              backed by peer-reviewed research, tested by our physician team.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="flex flex-wrap gap-3 mb-14"
            >
              <Link href="/category/supplements"
                className="group flex items-center gap-2 px-6 py-3 bg-green text-white rounded-xl font-semibold text-sm hover:bg-green-bright transition-all duration-200 cursor-pointer"
                style={{ boxShadow: 'var(--shadow-green)' }}
              >
                Explore Reviews
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
              </Link>
              <Link href="/best"
                className="flex items-center gap-2 px-6 py-3 bg-surface border border-border text-ink rounded-xl font-semibold text-sm hover:border-green/40 hover:text-green-bright transition-all duration-200 cursor-pointer"
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                Best Picks
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.42 }}
              className="flex items-center gap-6"
            >
              {stats.map(({ icon: Icon, value, label }, i) => (
                <div key={label} className="flex items-center gap-3 group">
                  {i > 0 && <div className="w-px h-8 bg-border" />}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0 group-hover:border-green/30 transition-colors duration-200">
                      <Icon className="w-3.5 h-3.5 text-green" />
                    </div>
                    <div>
                      <div className="font-display text-xl text-ink leading-none">{value}</div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-muted mt-0.5">{label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT — Visual ───────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block relative h-[540px]"
          >
            {/* Main image */}
            <div className="absolute inset-4 rounded-3xl overflow-hidden border border-border"
              style={{ boxShadow: '0 24px 64px rgba(15,20,16,0.14), 0 8px 20px rgba(15,20,16,0.08)' }}>
              <Image
                src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=900&q=85"
                alt="Longevity science research"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/55 via-black/10 to-transparent" />

              {/* Scan line */}
              <motion.div
                className="absolute left-0 right-0 h-px opacity-30"
                style={{ background: 'linear-gradient(to right, transparent, var(--green-bright), transparent)' }}
                animate={{ top: ['10%', '90%', '10%'] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Bottom label */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/50 mb-0.5">Featured Review</p>
                  <p className="text-white text-sm font-semibold leading-snug">Best NMN Supplements of 2025: Expert-Tested &amp; Ranked</p>
                </div>
              </div>
            </div>

            {/* Floating metric cards */}
            {floatingCards.map(({ icon: Icon, label, value, color, bg, delay }, i) => (
              <motion.div
                key={label}
                className={`absolute border backdrop-blur-sm rounded-xl px-3 py-2.5 flex items-center gap-2.5 ${bg} bg-surface/85`}
                style={{
                  top: `${18 + i * 28}%`,
                  right: i % 2 === 0 ? '-18px' : undefined,
                  left:  i % 2 !== 0 ? '-18px' : undefined,
                  boxShadow: 'var(--shadow-md)',
                }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay }}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted leading-none mb-0.5">{label}</p>
                  <p className={`font-display text-base leading-none ${color}`}>{value}</p>
                </div>
              </motion.div>
            ))}

            {/* Evidence badge */}
            <motion.div
              className="absolute top-2 left-0 bg-surface/92 backdrop-blur-md border border-border rounded-xl px-3 py-2"
              style={{ boxShadow: 'var(--shadow-sm)' }}
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            >
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted mb-1">Evidence Rating</p>
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map(s => (
                  <div key={s} className="w-4 h-1.5 rounded-full transition-colors"
                    style={{ background: s <= 4 ? 'var(--green-bright)' : 'var(--border)' }} />
                ))}
                <span className="font-mono text-xs text-green-bright ml-1 font-medium">Strong</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--cream))' }} />
    </section>
  )
}
