import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Clock } from 'lucide-react'
import { Article } from '@/lib/types'

export function RelatedArticles({
  current,
  articles,
}: {
  current: { slug: string; category: string; tags?: string[] }
  articles: Article[]
}) {
  // Score each candidate: same category = 2pts, shared tag = 1pt each, exclude self
  const scored = articles
    .filter(a => a.slug !== current.slug)
    .map(a => {
      let score = 0
      if (a.category === current.category) score += 2
      if (current.tags && a.frontmatter.tags) {
        const shared = current.tags.filter(t => a.frontmatter.tags?.includes(t))
        score += shared.length
      }
      return { article: a, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  if (scored.length === 0) return null

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-1">Continue Reading</p>
          <h2 className="font-display text-2xl text-ink">Related Articles</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {scored.map(({ article: a }) => (
          <Link
            key={a.slug}
            href={`/${a.category}/${a.slug}`}
            className="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-green/30 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300 flex flex-col cursor-pointer"
          >
            <div className="relative h-36 overflow-hidden bg-surface-2 shrink-0">
              <Image
                src={a.frontmatter.image}
                alt={a.frontmatter.title}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="absolute top-2 left-2">
                <span className="font-mono text-[10px] uppercase tracking-widest bg-ink/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                  {a.category}
                </span>
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-display text-base text-ink group-hover:text-green transition-colors leading-tight mb-2 line-clamp-2">
                {a.frontmatter.title}
              </h3>
              <p className="text-muted text-xs line-clamp-2 flex-1 mb-3">{a.frontmatter.description}</p>
              <div className="flex items-center justify-between text-xs text-muted pt-3 border-t border-border">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.frontmatter.readTime}</span>
                <span className="flex items-center gap-1 text-green-bright font-semibold">Read <ArrowUpRight className="w-3 h-3" /></span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
