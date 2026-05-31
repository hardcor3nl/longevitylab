'use client'
import Link from 'next/link'
import { useTheme } from './ThemeProvider'
import { Sun, Moon, Search, X, FlaskConical, Menu, ArrowUpRight } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Fuse from 'fuse.js'

interface SearchResult {
  slug: string
  category: string
  title: string
  description: string
}

export function Navbar() {
  const { theme, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const searchRef = useRef<HTMLInputElement>(null)
  const fuseRef = useRef<Fuse<SearchResult> | null>(null)

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
    setResults(fuseRef.current.search(q).slice(0, 5).map(r => r.item))
  }, [])

  const closeSearch = () => { setSearchOpen(false); setQuery(''); setResults([]) }

  const links = [
    { href: '/category/supplements', label: 'Supplements' },
    { href: '/category/wearables', label: 'Wearables' },
    { href: '/database', label: 'Database' },
    { href: '/protocols', label: 'Protocols' },
    { href: '/quiz', label: 'Bio Age Quiz' },
    { href: '/best', label: 'Best Picks' },
  ]

  return (
    <>
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[60]" style={{ background: 'var(--border)' }}>
        <motion.div
          className="h-full origin-left"
          style={{ background: 'var(--green-bright)', scaleX: progress / 100 }}
        />
      </div>

      <nav className={`fixed top-2 left-3 right-3 z-50 rounded-2xl transition-all duration-300 ${
        scrolled
          ? 'bg-cream/80 dark:bg-[#0a0f0b]/80 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/30 border border-border'
          : 'bg-cream/60 dark:bg-[#0a0f0b]/60 backdrop-blur-md border border-border/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-5">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-7 h-7 rounded-lg bg-green flex items-center justify-center group-hover:bg-green-bright transition-colors">
                <FlaskConical className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display text-xl text-ink hidden sm:block">LongevityLab</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {links.map(l => (
                <Link key={l.href} href={l.href}
                  className="px-3 py-1.5 text-sm font-medium text-muted hover:text-ink hover:bg-surface/80 rounded-lg transition-all duration-150 cursor-pointer">
                  {l.label}
                </Link>
              ))}
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
                      animate={{ width: 220, opacity: 1 }}
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
                          placeholder="Search articles..."
                          className="bg-transparent text-sm text-ink placeholder-muted outline-none w-full"
                        />
                        <button onClick={closeSearch} className="cursor-pointer">
                          <X className="w-3.5 h-3.5 text-muted hover:text-ink transition-colors" />
                        </button>
                      </div>
                      {/* Results dropdown */}
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

              {/* Mobile menu */}
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
              <div className="px-4 py-3 space-y-1">
                {links.map(l => (
                  <Link key={l.href} href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-muted hover:text-ink hover:bg-surface/80 rounded-xl transition-colors cursor-pointer">
                    {l.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
