'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FlaskConical, Watch, TestTube2, BookOpen, Star, Zap } from 'lucide-react'

const categories = [
  { href: '/category/supplements', label: 'Supplements', icon: FlaskConical },
  { href: '/category/wearables', label: 'Wearables', icon: Watch },
  { href: '/category/diagnostics', label: 'Diagnostics', icon: TestTube2 },
  { href: '/category/protocols', label: 'Protocols', icon: BookOpen },
  { href: '/best', label: 'Best Picks', icon: Star },
  { href: '/category/protocols', label: 'New Research', icon: Zap },
]

export function CategoryNav() {
  const pathname = usePathname()

  return (
    <div className="sticky top-[60px] z-40 bg-cream/80 dark:bg-[#0a0f0b]/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2.5">
          {categories.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                  active
                    ? 'bg-green text-white shadow-sm'
                    : 'text-muted hover:text-ink hover:bg-surface'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
