'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FlaskConical, Watch, TestTube2, BookOpen, Star, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const categories = [
  { href: '/category/supplements', label: 'Supplements',   icon: FlaskConical },
  { href: '/category/wearables',   label: 'Wearables',     icon: Watch        },
  { href: '/category/diagnostics', label: 'Diagnostics',   icon: TestTube2    },
  { href: '/category/protocols',   label: 'Guides',        icon: BookOpen     },
  { href: '/best',                 label: 'Best Picks',    icon: Star         },
  { href: '/database',             label: 'Research DB',   icon: Zap          },
]

export function CategoryNav() {
  const pathname = usePathname()

  return (
    <div className="sticky top-[60px] z-40 bg-cream/85 dark:bg-[#0a0f0b]/85 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-0 overflow-x-auto scrollbar-hide">
          {categories.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={label}
                href={href}
                className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-3.5 text-sm font-medium transition-colors duration-150 cursor-pointer border-b-2 ${
                  active
                    ? 'text-green-bright border-green-bright'
                    : 'text-muted hover:text-ink border-transparent hover:border-border'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-colors duration-150 ${active ? 'text-green-bright' : 'text-muted'}`} />
                {label}
                {active && (
                  <motion.span
                    layoutId="category-indicator"
                    className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-green-bright rounded-t-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
