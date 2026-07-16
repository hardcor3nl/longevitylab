import Link from 'next/link'
import { ArrowUpRight, BookOpen, Database, GitCompare, Layers, Map, Star } from 'lucide-react'
import { clusterLinksFor, contentClusters, type ClusterLink } from '@/lib/contentClusters'

const kindIcon: Record<ClusterLink['kind'], React.ElementType> = {
  hub: Map,
  guide: BookOpen,
  best: Star,
  database: Database,
  compare: GitCompare,
  protocol: Layers,
}

const kindLabel: Record<ClusterLink['kind'], string> = {
  hub: 'Hub',
  guide: 'Guide',
  best: 'Best Of',
  database: 'Database',
  compare: 'Compare',
  protocol: 'Protocol',
}

type Props = {
  slug?: string
  category?: string
  tags?: string[]
  title?: string
  path?: string
  /** Compact sidebar variant */
  variant?: 'section' | 'sidebar'
  limit?: number
}

export function ContentCluster({
  slug,
  category,
  tags,
  title,
  path,
  variant = 'section',
  limit = 5,
}: Props) {
  const matched = clusterLinksFor({ slug, category, tags, title, path }, limit)
  if (!matched) return null
  const { cluster, links } = matched

  if (variant === 'sidebar') {
    return (
      <div className="bg-surface border border-border rounded-2xl p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted mb-1">
          Explore more
        </p>
        <h3 className="font-display text-lg text-ink mb-4 leading-tight">{cluster.name}</h3>
        <ul className="space-y-2.5">
          {links.map(link => {
            const Icon = kindIcon[link.kind]
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group flex items-start gap-2.5 rounded-xl p-2 -mx-2 hover:bg-surface-2 transition-colors cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5 text-green-bright mt-0.5 shrink-0" />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-ink group-hover:text-green transition-colors leading-snug">
                      {link.label}
                    </span>
                    <span className="block text-[11px] text-muted mt-0.5 leading-snug">
                      {link.desc}
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <section className="mt-14 pt-10 border-t border-border">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-1">
            Related in {cluster.name}
          </p>
          <h2 className="font-display text-2xl text-ink">Continue your research</h2>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {links.map(link => {
          const Icon = kindIcon[link.kind]
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col gap-2 p-4 rounded-2xl border border-border bg-surface hover:border-green/30 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                  <Icon className="w-3 h-3 text-green-bright" />
                  {kindLabel[link.kind]}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-green-bright transition-colors" />
              </div>
              <span className="font-display text-base text-ink group-hover:text-green transition-colors leading-snug">
                {link.label}
              </span>
              <span className="text-xs text-muted leading-relaxed">{link.desc}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

/** Standalone cluster strip for topic hubs (pass cluster id). */
export function HubClusterStrip({
  clusterId,
  title = 'Start with these guides',
}: {
  clusterId: string
  title?: string
}) {
  const cluster = contentClusters.find(c => c.id === clusterId)
  if (!cluster) return null

  return (
    <section className="mt-12 mb-4">
      <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-2">{title}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cluster.links.slice(0, 6).map((link: ClusterLink) => {
          const Icon = kindIcon[link.kind]
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-start gap-3 p-4 rounded-2xl border border-border bg-surface hover:border-green/30 transition-all cursor-pointer"
            >
              <Icon className="w-4 h-4 text-green-bright mt-0.5 shrink-0" />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink group-hover:text-green transition-colors">
                  {link.label}
                </span>
                <span className="block text-xs text-muted mt-0.5">{link.desc}</span>
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
