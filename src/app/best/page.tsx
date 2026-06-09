import { getArticlesByCategory } from '@/lib/content'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ArrowUpRight, Clock } from 'lucide-react'
import { AnimatedSection } from '@/components/AnimatedSection'
import type { Metadata } from 'next'

const url = 'https://longevitylab-five.vercel.app/best'

export const metadata: Metadata = {
  title: 'Best Longevity Products & Protocols — Expert-Ranked Picks',
  description:
    'Our top-ranked longevity supplements, wearables, recovery devices, and protocols — curated and scored by our physician-reviewed research team.',
  alternates: { canonical: url },
  openGraph: {
    title: 'Best Longevity Products & Protocols — Expert-Ranked Picks',
    description: 'Top-ranked longevity picks, curated and scored by our research team.',
    url,
    type: 'website',
    siteName: 'LongevityLab',
  },
}

export default function BestPage() {
  const articles = getArticlesByCategory('best')
  const featured = articles.filter(a => a.frontmatter.featured)
  const rest = articles.filter(a => !a.frontmatter.featured)
  const ordered = [...featured, ...rest]

  return (
    <div className="pt-24 pb-24 min-h-screen">
      {/* Header band — consistent with category pages */}
      <div className="border-b border-border bg-surface/30 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AnimatedSection>
            <div className="section-rule" />
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-amber fill-amber" />
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-amber">Best Picks · {articles.length} guides</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-ink mb-3 leading-tight">The Best in Longevity</h1>
            <p className="text-muted text-lg max-w-2xl leading-relaxed">
              Top-ranked products, protocols, and tools for every longevity goal —
              independently tested and scored by our research team.
            </p>
          </AnimatedSection>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ordered.map((article, i) => (
            <AnimatedSection key={article.slug} delay={Math.min(i, 6) * 0.06}>
              <Link href={`/best/${article.slug}`}
                className="group flex flex-col h-full bg-surface border border-border rounded-2xl overflow-hidden hover:border-amber/40 transition-all duration-300 cursor-pointer"
                style={{ boxShadow: 'var(--shadow-sm)' }}>
                <div className="relative h-48 overflow-hidden bg-surface-2 shrink-0">
                  <Image src={article.frontmatter.image} alt={article.frontmatter.title} fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest bg-amber/90 text-white px-2.5 py-1 rounded-full">
                      <Star className="w-2.5 h-2.5 fill-white" /> Best Of
                    </span>
                  </div>
                  {article.frontmatter.score && (
                    <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm border border-border font-mono text-xs px-2 py-1 rounded-full text-ink">
                      {article.frontmatter.score}/100
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="font-display text-xl text-ink group-hover:text-amber transition-colors leading-tight mb-2">{article.frontmatter.title}</h2>
                  <p className="text-muted text-sm line-clamp-2 flex-1 mb-4">{article.frontmatter.description}</p>
                  <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted">
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{article.frontmatter.readTime}</span>
                    <span className="flex items-center gap-1.5 text-amber font-semibold">Read the list <ArrowUpRight className="w-3.5 h-3.5" /></span>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
          {articles.length === 0 && <p className="text-muted col-span-3">Best picks coming soon.</p>}
        </div>
      </div>
    </div>
  )
}
