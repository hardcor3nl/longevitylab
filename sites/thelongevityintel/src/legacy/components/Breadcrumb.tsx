import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 flex-wrap">
      <Link href="/" className="font-mono text-xs text-muted hover:text-ink transition-colors">
        Home
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="w-3 h-3 text-muted/50 shrink-0" />
          {item.href && i < items.length - 1 ? (
            <Link href={item.href} className="font-mono text-xs text-muted hover:text-ink transition-colors capitalize">
              {item.label}
            </Link>
          ) : (
            <span className="font-mono text-xs text-ink/70 capitalize line-clamp-1 max-w-[240px]">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
