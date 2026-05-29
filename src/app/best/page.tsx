import { getArticlesByCategory } from '@/lib/content'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ArrowUpRight } from 'lucide-react'

export default function BestPage() {
  const articles = getArticlesByCategory('best')

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-5 h-5 text-amber fill-amber" />
          <span className="font-mono text-xs uppercase tracking-widest text-amber">Best Picks</span>
        </div>
        <h1 className="font-display text-5xl text-ink mb-4">The Best in Longevity</h1>
        <p className="text-muted text-lg max-w-2xl">Top-ranked products, protocols, and tools for every longevity goal — curated by our research team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map(article => (
          <article key={article.slug} className="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-amber/40 transition-colors">
            <div className="relative h-56">
              <Image src={article.frontmatter.image} alt={article.frontmatter.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="font-display text-2xl text-white leading-tight">{article.frontmatter.title}</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-muted text-sm mb-4">{article.frontmatter.description}</p>
              <Link href={`/best/${article.slug}`} className="flex items-center gap-1.5 text-sm font-medium text-amber hover:text-amber/80 transition-colors cursor-pointer">
                Read the full list <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </article>
        ))}
        {articles.length === 0 && <p className="text-muted col-span-2">Best picks coming soon.</p>}
      </div>
    </div>
  )
}
