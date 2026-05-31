import { getArticlesByCategory } from '@/lib/content'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, ArrowUpRight } from 'lucide-react'

const categoryMeta: Record<string, { title: string; description: string }> = {
  supplements: { title: 'Supplement Reviews', description: 'Evidence-based reviews of longevity supplements, tested and ranked by our research team.' },
  wearables: { title: 'Wearable Tech Reviews', description: 'In-depth reviews of health tracking wearables, CGMs, and diagnostic devices.' },
  diagnostics: { title: 'Diagnostic Tests', description: 'Reviews of at-home and lab diagnostic panels for longevity optimization.' },
  protocols: { title: 'Longevity Protocols', description: 'Science-backed protocols for sleep, exercise, nutrition, and stress management.' },
  best: { title: 'Best Picks', description: 'Our top recommendations, curated for maximum impact on health and longevity.' },
  recovery: { title: 'Recovery & Biohacking', description: 'Expert reviews of red light therapy panels, home saunas, cold plunges, and recovery devices for longevity and performance.' },
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const articles = getArticlesByCategory(params.slug)
  const meta = categoryMeta[params.slug]
  if (!meta) notFound()

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <span className="font-mono text-xs uppercase tracking-widest text-green-bright">{params.slug}</span>
        <h1 className="font-display text-5xl text-ink mt-2 mb-4">{meta.title}</h1>
        <p className="text-muted text-lg max-w-2xl">{meta.description}</p>
      </div>

      {articles.length === 0 ? (
        <p className="text-muted">No articles yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <article key={article.slug} className="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-green/40 transition-colors">
              <div className="relative h-48">
                <Image src={article.frontmatter.image} alt={article.frontmatter.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                {article.frontmatter.score && (
                  <div className="absolute top-3 right-3 bg-green text-white font-mono text-xs px-2 py-1 rounded-full">{article.frontmatter.score}/100</div>
                )}
              </div>
              <div className="p-5">
                <h2 className="font-display text-xl text-ink group-hover:text-green transition-colors leading-tight mb-2">
                  {article.frontmatter.title}
                </h2>
                <p className="text-muted text-sm line-clamp-2 mb-4">{article.frontmatter.description}</p>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.frontmatter.readTime}</span>
                  <Link href={`/${params.slug}/${article.slug}`} className="flex items-center gap-1 hover:text-green cursor-pointer">
                    Read <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
