'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-cream dark:bg-[#0a0f0b]">
      {/* Grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
      }} />

      {/* Background accent */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full opacity-5 dark:opacity-10 blur-3xl"
           style={{ background: 'radial-gradient(circle, var(--green-bright), transparent)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-mono text-xs uppercase tracking-widest text-green-bright border border-green-bright/30 px-3 py-1 rounded-full">
            Evidence-Based Reviews
          </span>
          <h1 className="font-display mt-6 leading-[1.1] text-ink"
              style={{ fontSize: 'clamp(48px, 6vw, 72px)' }}>
            Science-Backed Longevity,<br />
            <em>Explained.</em>
          </h1>
          <p className="mt-6 text-muted text-lg max-w-xl leading-relaxed">
            We cut through the noise so you don&apos;t have to. Expert reviews on supplements,
            wearables, diagnostics, and protocols — backed by peer-reviewed research.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/category/supplements"
              className="px-6 py-3 bg-green text-white rounded-lg font-medium hover:bg-green-bright transition-colors cursor-pointer">
              Explore Reviews
            </Link>
            <Link href="/best"
              className="px-6 py-3 border border-border text-ink rounded-lg font-medium hover:border-green transition-colors cursor-pointer">
              Best Picks →
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 flex items-center gap-8 text-sm text-muted"
        >
          {[
            { value: '200+', label: 'Products Tested' },
            { value: '50+', label: 'Peer-reviewed Sources' },
            { value: '12K+', label: 'Newsletter Readers' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="font-display text-3xl text-ink">{stat.value}</div>
              <div className="font-mono text-xs uppercase tracking-wide mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
