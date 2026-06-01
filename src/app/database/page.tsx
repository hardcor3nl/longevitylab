'use client'
import { useState, useMemo } from 'react'
import { products, allCategories, categoryGroups, evidenceBadgeColors, badgeColors, type Product, type ProductCategory } from '@/lib/products'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowUpRight, SlidersHorizontal, X, BookOpen, FlaskConical } from 'lucide-react'
import Fuse from 'fuse.js'
import { AnimatedSection } from '@/components/AnimatedSection'

function ProductCard({ p, index }: { p: Product; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      layout
      className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-green/30 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-200 flex flex-col"
    >
      {/* Card header */}
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            {p.badge && (
              <span className={`inline-block font-mono text-[9px] uppercase tracking-wider border px-2 py-0.5 rounded-full mb-2 ${badgeColors[p.badge] ?? ''}`}>
                {p.badge}
              </span>
            )}
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-0.5">{p.brand}</p>
            <h3 className="font-display text-xl text-ink leading-tight">{p.name}</h3>
            <p className="text-muted text-xs mt-0.5 italic line-clamp-1">{p.tagline}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="font-display text-2xl text-ink leading-none">{p.evidenceScore}</div>
            <div className="font-mono text-[9px] text-muted">/100</div>
          </div>
        </div>

        {/* Evidence bar */}
        <div className="h-1 bg-border rounded-full mb-3 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${p.evidenceScore}%`, backgroundColor: p.evidenceScore >= 85 ? 'var(--green-bright)' : p.evidenceScore >= 70 ? 'var(--amber)' : '#e05a3a' }} />
        </div>

        <p className="text-sm text-muted line-clamp-2 mb-3 leading-relaxed">{p.summary}</p>

        {/* Key benefits */}
        <ul className="space-y-1 mb-4">
          {p.keyBenefits.slice(0, 3).map(b => (
            <li key={b} className="flex items-start gap-1.5 text-xs text-ink">
              <span className="text-green-bright mt-0.5 shrink-0">✓</span>
              {b}
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className={`font-mono text-[9px] uppercase tracking-wider border px-2 py-0.5 rounded-full ${evidenceBadgeColors[p.evidenceLevel]}`}>
            {p.evidenceLevel}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider border border-border text-muted px-2 py-0.5 rounded-full">
            {p.price}
          </span>
        </div>
      </div>

      {/* Card footer — buttons */}
      <div className="px-5 pb-5 space-y-2">
        {p.reviewSlug && (
          <Link href={`/${p.reviewSlug}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-surface-2 border border-border text-ink rounded-xl text-sm font-medium hover:border-green/40 hover:text-green transition-colors cursor-pointer">
            <BookOpen className="w-3.5 h-3.5" />
            {p.reviewLabel ?? 'Read Full Review'}
          </Link>
        )}
        {p.affiliateUrl && (
          <Link href={p.affiliateUrl}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-green text-white rounded-xl text-sm font-medium hover:bg-green-bright transition-colors cursor-pointer">
            View Best Price <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </motion.div>
  )
}

export default function DatabasePage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [sort, setSort] = useState<'evidence' | 'price-low' | 'price-high' | 'popularity'>('evidence')

  const fuse = useMemo(() => new Fuse(products, {
    keys: ['name', 'brand', 'tagline', 'category', 'summary', 'goals'],
    threshold: 0.35,
  }), [])

  const filtered = useMemo(() => {
    let results = query.trim() ? fuse.search(query).map(r => r.item) : [...products]
    if (activeCategory) results = results.filter(p => p.category === activeCategory)
    results.sort((a, b) => {
      if (sort === 'evidence') return b.evidenceScore - a.evidenceScore
      if (sort === 'popularity') return b.popularityScore - a.popularityScore
      return 0
    })
    return results
  }, [query, activeCategory, sort, fuse])

  return (
    <div className="pt-28 pb-24 min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <AnimatedSection>
          <div className="flex items-center gap-2 mb-3">
            <FlaskConical className="w-4 h-4 text-green-bright" />
            <span className="font-mono text-xs uppercase tracking-widest text-green-bright">Product Database</span>
          </div>
          <h1 className="font-display text-5xl text-ink mb-3">Longevity Database</h1>
          <p className="text-muted text-lg max-w-2xl leading-relaxed">
            {products.length} longevity products across {allCategories.length} categories — ranked by evidence quality.
            Every review article linked directly.
          </p>
        </AnimatedSection>

        {/* Search bar */}
        <AnimatedSection delay={0.1} className="mt-8">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 flex items-center gap-2 bg-surface border border-border rounded-xl px-4 py-2.5 focus-within:border-green/40 transition-colors">
              <Search className="w-4 h-4 text-muted shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={`Search ${products.length} products — 'red light', 'sauna', 'NMN', 'HRV'...`}
                className="flex-1 bg-transparent text-sm text-ink placeholder-muted outline-none"
              />
              {query && <button onClick={() => setQuery('')} className="cursor-pointer"><X className="w-3.5 h-3.5 text-muted hover:text-ink" /></button>}
            </div>
            <div className="flex gap-2">
              <select value={sort} onChange={e => setSort(e.target.value as typeof sort)}
                className="bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-ink outline-none cursor-pointer">
                <option value="evidence">Sort: Evidence Score</option>
                <option value="popularity">Sort: Popularity</option>
              </select>
              <button onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${showFilters ? 'bg-green text-white border-green' : 'bg-surface border-border text-ink hover:border-green/40'}`}>
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:block">Categories</span>
              </button>
            </div>
          </div>

          {/* Category filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
                <div className="bg-surface border border-border rounded-2xl p-5 space-y-5">
                  {categoryGroups.map(group => (
                    <div key={group.label}>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">{group.label}</p>
                      <div className="flex flex-wrap gap-2">
                        {group.categories.map(cat => (
                          <button key={cat} onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                            className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${activeCategory === cat ? 'bg-green text-white border-green' : 'bg-cream dark:bg-[#0a0f0b] border-border text-muted hover:border-green/40 hover:text-ink'}`}>
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results count + active filter */}
          <div className="flex items-center gap-3 text-sm text-muted">
            <span>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</span>
            {activeCategory && (
              <button onClick={() => setActiveCategory(null)} className="flex items-center gap-1 text-xs border border-border px-2 py-0.5 rounded-full hover:border-green/40 cursor-pointer">
                {activeCategory} <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </AnimatedSection>
      </div>

      {/* Category group sections when no filter active */}
      {!activeCategory && !query ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {categoryGroups.map((group, gi) => (
            <AnimatedSection key={group.label} delay={gi * 0.05}>
              <h2 className="font-display text-3xl text-ink mb-2">{group.label}</h2>
              <p className="text-muted text-sm mb-6 font-mono">{group.categories.join(' · ')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.filter(p => group.categories.includes(p.category)).map((p, i) => (
                  <ProductCard key={p.id} p={p} index={i} />
                ))}
              </div>
            </AnimatedSection>
          ))}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
            </AnimatePresence>
          </motion.div>
          {filtered.length === 0 && (
            <div className="text-center py-24 text-muted">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-display">No products found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
