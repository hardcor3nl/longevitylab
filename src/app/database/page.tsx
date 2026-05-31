'use client'
import { useState, useMemo } from 'react'
import { supplements, type Supplement, type Goal, type EvidenceLevel } from '@/lib/supplements'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, FlaskConical, ArrowUpRight, SlidersHorizontal, X } from 'lucide-react'
import Fuse from 'fuse.js'
import { AnimatedSection } from '@/components/AnimatedSection'

const goals: Goal[] = ['Longevity', 'Energy', 'Sleep', 'Cognitive', 'Cardiovascular', 'Recovery', 'Inflammation']
const evidenceLevels: EvidenceLevel[] = ['Strong', 'Moderate', 'Emerging', 'Weak']
const evidenceBadge: Record<EvidenceLevel, string> = {
  Strong: 'bg-green/10 text-green-bright border-green/25',
  Moderate: 'bg-amber/10 text-amber border-amber/25',
  Emerging: 'bg-blue-500/10 text-blue-500 border-blue-500/25',
  Weak: 'bg-red-500/10 text-red-400 border-red-500/25',
}

function SupplementCard({ s, index }: { s: Supplement; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      layout
    >
      <Link href={`/database/${s.id}`}
        className="group block bg-surface border border-border rounded-2xl p-5 hover:border-green/30 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-200 cursor-pointer h-full">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl text-ink group-hover:text-green transition-colors truncate">{s.name}</h3>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted mt-0.5">{s.category}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="font-display text-2xl text-ink">{s.evidenceScore}</div>
            <div className="font-mono text-[9px] text-muted uppercase">/100</div>
          </div>
        </div>

        {/* Evidence bar */}
        <div className="h-1 bg-border rounded-full mb-3 overflow-hidden">
          <div className="h-full bg-green-bright rounded-full transition-all" style={{ width: `${s.evidenceScore}%` }} />
        </div>

        <p className="text-sm text-muted line-clamp-2 mb-3 leading-relaxed">{s.summary}</p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            <span className={`font-mono text-[9px] uppercase tracking-wider border px-2 py-0.5 rounded-full ${evidenceBadge[s.evidenceLevel]}`}>
              {s.evidenceLevel}
            </span>
            {s.goals.slice(0, 2).map(g => (
              <span key={g} className="font-mono text-[9px] uppercase tracking-wider border border-border text-muted px-2 py-0.5 rounded-full">
                {g}
              </span>
            ))}
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-green group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
      </Link>
    </motion.div>
  )
}

export default function DatabasePage() {
  const [query, setQuery] = useState('')
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null)
  const [activeEvidence, setActiveEvidence] = useState<EvidenceLevel | null>(null)
  const [sort, setSort] = useState<'evidence' | 'safety' | 'popularity'>('evidence')
  const [showFilters, setShowFilters] = useState(false)

  const fuse = useMemo(() => new Fuse(supplements, {
    keys: ['name', 'aliases', 'category', 'goals', 'summary'],
    threshold: 0.3,
  }), [])

  const filtered = useMemo(() => {
    let results = query.trim() ? fuse.search(query).map(r => r.item) : [...supplements]
    if (activeGoal) results = results.filter(s => s.goals.includes(activeGoal))
    if (activeEvidence) results = results.filter(s => s.evidenceLevel === activeEvidence)
    results.sort((a, b) => {
      if (sort === 'evidence') return b.evidenceScore - a.evidenceScore
      if (sort === 'safety') return b.safetyScore - a.safetyScore
      return b.popularityScore - a.popularityScore
    })
    return results
  }, [query, activeGoal, activeEvidence, sort, fuse])

  const clearFilters = () => { setQuery(''); setActiveGoal(null); setActiveEvidence(null) }
  const hasFilters = query || activeGoal || activeEvidence

  return (
    <div className="pt-28 pb-24 min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <AnimatedSection>
          <div className="flex items-center gap-2 mb-3">
            <FlaskConical className="w-4 h-4 text-green-bright" />
            <span className="font-mono text-xs uppercase tracking-widest text-green-bright">Evidence Database</span>
          </div>
          <h1 className="font-display text-5xl text-ink mb-4">Supplement Database</h1>
          <p className="text-muted text-lg max-w-2xl leading-relaxed">
            {supplements.length} longevity supplements ranked by evidence quality, safety, and mechanistic plausibility.
            Updated monthly by our research team.
          </p>
        </AnimatedSection>

        {/* Search + filter bar */}
        <AnimatedSection delay={0.1} className="mt-8">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 flex items-center gap-2 bg-surface border border-border rounded-xl px-4 py-2.5">
              <Search className="w-4 h-4 text-muted shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search supplements, e.g. 'NAD+', 'sleep', 'omega-3'..."
                className="flex-1 bg-transparent text-sm text-ink placeholder-muted outline-none"
              />
              {query && <button onClick={() => setQuery('')} className="cursor-pointer"><X className="w-3.5 h-3.5 text-muted hover:text-ink" /></button>}
            </div>
            <div className="flex gap-2">
              <select
                value={sort}
                onChange={e => setSort(e.target.value as typeof sort)}
                className="bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-ink outline-none cursor-pointer"
              >
                <option value="evidence">Sort: Evidence</option>
                <option value="safety">Sort: Safety</option>
                <option value="popularity">Sort: Popularity</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${showFilters ? 'bg-green text-white border-green' : 'bg-surface border-border text-ink hover:border-green/40'}`}
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>

          {/* Filter panels */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-surface border border-border rounded-2xl p-4 mb-4 space-y-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">Goal</p>
                    <div className="flex flex-wrap gap-2">
                      {goals.map(g => (
                        <button key={g} onClick={() => setActiveGoal(activeGoal === g ? null : g)}
                          className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${activeGoal === g ? 'bg-green text-white border-green' : 'bg-cream dark:bg-[#0a0f0b] border-border text-muted hover:border-green/40 hover:text-ink'}`}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">Evidence Level</p>
                    <div className="flex flex-wrap gap-2">
                      {evidenceLevels.map(l => (
                        <button key={l} onClick={() => setActiveEvidence(activeEvidence === l ? null : l)}
                          className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${activeEvidence === l ? 'bg-green text-white border-green' : 'bg-cream dark:bg-[#0a0f0b] border-border text-muted hover:border-green/40 hover:text-ink'}`}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active filter chips + result count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted">{filtered.length} supplement{filtered.length !== 1 ? 's' : ''}</span>
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-muted hover:text-ink border border-border rounded-full px-2 py-0.5 cursor-pointer">
                  <X className="w-3 h-3" /> Clear filters
                </button>
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((s, i) => <SupplementCard key={s.id} s={s} index={i} />)}
          </AnimatePresence>
        </motion.div>
        {filtered.length === 0 && (
          <div className="text-center py-24 text-muted">
            <FlaskConical className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-display">No supplements found</p>
            <p className="text-sm mt-1">Try a different search or clear your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
