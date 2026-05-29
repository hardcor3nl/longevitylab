'use client'
import Link from 'next/link'
import { useTheme } from './ThemeProvider'
import { Sun, Moon, Menu, X, FlaskConical } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Navbar() {
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '/category/supplements', label: 'Supplements' },
    { href: '/category/wearables', label: 'Wearables' },
    { href: '/category/diagnostics', label: 'Diagnostics' },
    { href: '/category/protocols', label: 'Protocols' },
    { href: '/best', label: 'Best Picks' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cream/90 dark:bg-[#0a0f0b]/90 backdrop-blur-md shadow-sm border-b border-border' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-display text-2xl text-ink flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-green-bright" />
            LongevityLab
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-muted hover:text-ink transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="p-2 rounded-full hover:bg-border transition-colors cursor-pointer" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button className="md:hidden p-2 cursor-pointer" onClick={() => setOpen(!open)} aria-label="Toggle menu">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-cream dark:bg-[#141a15] border-t border-border px-4 py-4 space-y-3">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="block text-sm font-medium text-muted hover:text-ink" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
