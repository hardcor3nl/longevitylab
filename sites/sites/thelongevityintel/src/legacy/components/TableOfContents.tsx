'use client'
import { useEffect, useState } from 'react'
import { List } from 'lucide-react'
import type { Heading } from '@/lib/toc'

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const ids = headings.map(h => h.id)
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '-10% 0% -80% 0%', threshold: 0 }
    )
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 2) return null

  return (
    <div className="bg-surface border border-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <List className="w-3.5 h-3.5 text-muted" />
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted">Contents</h3>
      </div>
      <nav aria-label="Table of contents">
        <ul className="space-y-1">
          {headings.map(h => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={e => {
                  e.preventDefault()
                  document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className={`block text-xs leading-snug py-1 transition-colors cursor-pointer ${
                  h.level === 3 ? 'pl-3 border-l border-border' : ''
                } ${
                  active === h.id
                    ? 'text-green-bright font-medium'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
