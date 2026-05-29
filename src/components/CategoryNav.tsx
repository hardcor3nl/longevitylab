'use client'
import Link from 'next/link'
import { FlaskConical, Watch, TestTube, BookOpen, Star } from 'lucide-react'

const categories = [
  { href: '/category/supplements', label: 'Supplements', icon: FlaskConical },
  { href: '/category/wearables', label: 'Wearables', icon: Watch },
  { href: '/category/diagnostics', label: 'Diagnostics', icon: TestTube },
  { href: '/category/protocols', label: 'Protocols', icon: BookOpen },
  { href: '/best', label: 'Best Picks', icon: Star },
]

export function CategoryNav() {
  return (
    <div className="border-y border-border bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 overflow-x-auto py-3">
          {categories.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-ink hover:bg-border/50 transition-colors cursor-pointer"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
