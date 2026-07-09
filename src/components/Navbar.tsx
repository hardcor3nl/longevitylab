'use client'
import Link from 'next/link'
import { useTheme } from './ThemeProvider'
import { Sun, Moon, Search, X, FlaskConical, Menu, ArrowUpRight, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Fuse from 'fuse.js'

interface SearchResult {
  slug: string
  category: string
  title: string
  description: string
}

const NAV_GROUPS = [
  {
    label: 'Topics',
    items: [
      { href: '/sleep', label: 'Sleep Optimization', desc: 'Circadian rhythm & sleep stack' },
      { href: '/cardio', label: 'Zone 2 & VO₂ Max', desc: 'Cardio training science' },
      { href: '/nutrition', label: 'Nutrition', desc: 'Longevity eating frameworks' },
      { href: '/stress-resilience', label: 'Stress Resilience', desc: 'Meditation, adaptogens, breathwork' },
      { href: '/exotic-methods', label: 'Exotic Methods', desc: 'Peptides, NAD+ IV, advanced protocols' },
    ],
  },
  {
    label: 'Reviews',
    items: [
      { href: '/category/supplements', label: 'Supplements', desc: 'NMN, creatine, magnesium & more' },
      { href: '/category/wearables', label: 'Wearables', desc: 'WHOOP, Oura, Garmin, CGMs' },
      { href: '/category/recovery', label: 'Recovery Devices', desc: 'Sauna, cold plunge, red light' },
      { href: '/category/diagnostics', label: 'Diagnostics', desc: 'Blood tests, VO₂ max, biomarkers' },
      { href: '/best', label: 'Best Of', desc: 'Top-ranked picks by category' },
    ],
  },
  {
    label: 'Learn',
    items: [
      { href: '/protocols', label: 'Expert Protocols', desc: 'Huberman, Sinclair, Bryan Johnson & more' },
      { href: '/compare', label: 'Comparisons', desc: 'Head-to-head product breakdowns' },
      { href: '/database', label: 'Supplement Database', desc: 'Evidence scores for 100+ compounds' },
      { href: '/glossary', label: 'Glossary', desc: 'Longevity terms explained' },
    ],
  },
]

export function Navbar() {
  const { theme, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const searchRef = useRef<HTMLInputElement>(null)
  const fuseRef = useRef<Fuse<SearchResult> | null>(null)
  const menuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fetch('/api/search-index')
      .then(r => r.json())
      .then((data: SearchResult[]) => {
        fuseRef.current = new Fuse(data, {
          keys: ['title', 'description', 'category'],
          threshold: 0.4,
        })
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30)
      const el = document.documentElement
      const scrollTop = el.scrollTop || document.body.scrollTop
      const max = el.scrollHeight - el.clientHeight
      setProgress(max > 0 ? (scrollTop / max) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100)
  }, [searchOpen])

  const handleSearch = useCallback((q: string) => {
    setQuery(q)
    if (!q.trim() || !fuseRef.current) { setResults([]); return }
    setResults(fuseRef.current.search(q).slice(0, 6).map(r => r.item))
  }, [])

  const closeSearch = () => { setSearchOpen(false); setQuery(''); setResults([]) }

  const openMenu = (label: string) => {
    if (menuTimeout.current) clearTimeout(menuTimeout.current)
    setActiveMenu(label)
  }
  const closeMenu = () => {
    menuTimeout.current = setTimeout(() => setActiveMenu(null), 120)
  }
  const keepMenu = () => {
    if (menuTimeout.current) clearTimeout(menuTimeout.current)
  }

  return (
    <>
      {/* Reading progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[60]"
        animate={{ opacity: progress > 2 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="h-full origin-left"
          style={{ background: 'linear-gradient(to right, var(--green), var(--green-bright))', scaleX: progress / 100 }}
        />
      </motion.div>

      <nav className={`fixed top-2 left-3 right-3 z-50 rounded-2xl transition-all duration-300 ${
        scrolled
          ? 'bg-cream/90 dark:bg-[#0a0f0b]/90 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/30 border border-border'
          : 'bg-cream/70 dark:bg-[#0a0f0b]/70 backdrop-blur-md border border-border/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-5">
          <div className="flex items-center justify-between h-14">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-7 h-7 rounded-lg bg-green flex items-center justify-center group-hover:bg-green-bright transition-colors">
                <FlaskConical className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display text-xl text-ink hidden sm:block">Longevity Intel</span>
            </Link>

            {/* Desktop nav — mega-menu */}
            <div className="hidden lg:flex items-center gap-1">

              {/* Get Started CTA */}
              <Link href="/get-started"
                className="px-3 py-1.5 text-sm font-semibold text-green-bright hover:bg-green/10 rounded-lg transition-all duration-150 cursor-pointer">
                Build My Plan
              </Link>

              <div className="w-px h-4 bg-border/40 mx-1" />

              {/* Dropdown groups */}
              {NAV_GROUPS.map(group => (
                <div key={group.label} className="relative"
                  onMouseEnter={() => openMenu(group.label)}
                  onMouseLeave={closeMenu}>
                  <button
                    className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer ${
                      activeMenu === group.label
                        ? 'text-ink bg-surface/80'
                        : 'text-muted hover:text-ink hover:bg-surface/80'
                    }`}>
                    {group.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${activeMenu === group.label ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {activeMenu === group.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        onMouseEnter={keepMenu}
                        onMouseLeave={closeMenu}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-surface border border-border rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden z-50"
                      >
                        <div className="p-2">
                          {group.items.map(item => (
                            <Link key={item.href} href={item.href}
                              onClick={() => setActiveMenu(null)}
                              className="flex flex-col gap-0.5 px-3 py-2.5 rounded-xl hover:bg-surface-2 transition-colors cursor-pointer group">
                              <span className="text-sm font-medium text-ink group-hover:text-green transition-colors">{item.label}</span>
                              <span className="text-xs text-muted">{item.desc}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <div className="w-px h-4 bg-border/40 mx-1" />

              {/* Quick links */}
              <Link href="/quiz"
                className="px-3 py-1.5 text-sm font-medium text-muted hover:text-ink hover:bg-surface/80 rounded-lg transition-all duration-150 cursor-pointer">
                Bio Age Quiz
              </Link>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  {searchOpen ? (
                    <motion.div
                      key="search-input"
                      initial={{ width: 32, opacity: 0 }}
                      animate={{ width: 240, opacity: 1 }}
                      exit={{ width: 32, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center"
                    >
                      <div className="flex items-center gap-2 w-full bg-surface border border-border rounded-xl px-3 py-1.5">
                        <Search className="w-3.5 h-3.5 text-muted shrink-0" />
                        <input
                          ref={searchRef}
                          type="text"
                          value={query}
                          onChange={e => handleSearch(e.target.value)}
                          placeholder="Search..."
                          className="bg-transparent text-sm text-ink placeholder-muted outline-none w-full"
                        />
                        <button onClick={closeSearch} className="cursor-pointer">
                          <X className="w-3.5 h-3.5 text-muted hover:text-ink transition-colors" />
                        </button>
                      </div>
                      <AnimatePresence>
                        {results.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-50"
                          >
                            {results.map(r => (
                              <Link key={r.slug} href={`/${r.category}/${r.slug}`}
                                onClick={closeSearch}
                                className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-surface-2 transition-colors cursor-pointer group">
                                <div>
                                  <p className="text-sm font-medium text-ink group-hover:text-green transition-colors line-clamp-1">{r.title}</p>
                                  <p className="text-xs text-muted mt-0.5 font-mono uppercase tracking-wide">{r.category}</p>
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 text-muted shrink-0 mt-0.5" />
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="search-btn"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setSearchOpen(true)}
                      className="p-2 rounded-xl hover:bg-surface/80 transition-colors cursor-pointer"
                      aria-label="Search"
                    >
                      <Search className="w-4 h-4 text-muted" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggle}
                className="p-2 rounded-xl hover:bg-surface/80 transition-colors cursor-pointer relative overflow-hidden"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  {theme === 'dark' ? (
                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Sun className="w-4 h-4 text-amber" />
                    </motion.div>
                  ) : (
                    <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Moon className="w-4 h-4 text-muted" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-surface/80 transition-colors cursor-pointer"
                aria-label="Menu"
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-border"
            >
              <div className="px-4 py-4 space-y-5 max-h-[75vh] overflow-y-auto">
                <Link href="/get-started" onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 bg-green/10 text-green-bright font-semibold text-sm rounded-xl">
                  Build My Plan →
                </Link>

                {NAV_GROUPS.map(group => (
                  <div key={group.label}>
                    <p className="text-xs font-mono uppercase tracking-widest text-muted/60 px-3 mb-1">{group.label}</p>
                    {group.items.map(item => (
                      <Link key={item.href} href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-surface/80 transition-colors cursor-pointer group mb-0.5">
                        <div>
                          <p className="text-sm font-medium text-ink group-hover:text-green transition-colors">{item.label}</p>
                          <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}

                <Link href="/quiz" onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-muted hover:text-ink hover:bg-surface/80 rounded-xl transition-colors cursor-pointer">
                  Quiz
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
