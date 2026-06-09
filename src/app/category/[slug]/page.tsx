import { getArticlesByCategory } from '@/lib/content'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, ArrowUpRight, FlaskConical, Watch, TestTube2, BookOpen, Star, Zap } from 'lucide-react'
import { AnimatedSection } from '@/components/AnimatedSection'
import type { Metadata } from 'next'

const categoryMeta: Record<string, { title: string; description: string; icon: React.ElementType; color: string }> = {
  supplements: { title: 'Supplement Reviews', description: 'Evidence-based reviews of longevity supplements, tested and ranked by our research team.', icon: FlaskConical, color: 'text-green-bright' },
  wearables: { title: 'Wearable Tech Reviews', description: 'In-depth reviews of health tracking wearables, CGMs, and diagnostic devices.', icon: Watch, color: 'text-blue-400' },
  diagnostics: { title: 'Diagnostic Tests', description: 'Reviews of at-home and lab diagnostic panels for longevity optimisation.', icon: TestTube2, color: 'text-purple-400' },
  protocols: { title: 'Longevity Protocols', description: 'Science-backed protocols for sleep, exercise, nutrition, and stress management.', icon: BookOpen, color: 'text-amber' },
  recovery: { title: 'Recovery & Biohacking', description: 'Expert reviews of red light therapy panels, home saunas, cold plunges, and recovery devices.', icon: Zap, color: 'text-orange-400' },
  best: { title: 'Best Picks', description: 'Our top recommendations, curated for maximum impact on health and longevity.', icon: Star, color: 'text-amber' },
}

export async function generateStaticParams() {
  return Object.keys(categoryMeta).map(slug => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const meta = categoryMeta[params.slug]
  if (!meta) return {}
  const url = `https://longevitylab-five.vercel.app/category/${params.slug}`
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: { title: meta.title, description: meta.description, url, type: 'website', siteName: 'LongevityLab' },
  }
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const articles = getArticlesByCategory(params.slug)
  const meta = categoryMeta[params.slug]
  if (!meta) notFound()

  const Icon = meta.icon
  const featured = articles.find(a => a.frontmatter.featured) ?? articles[0]
  const rest = articles.filter(a => a.slug !== featured?.slug)

  return (
    <div className="pt-24 pb-24 min-h-screen">
      {/* Category header */}
      <div className="border-b border-border bg-surface/30 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AnimatedSection className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center shrink-0 ${meta.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted mb-1">{articles.length} articles</p>
              <h1 className="font-display text-4xl sm:text-5xl text-ink mb-3">{meta.title}</h1>
              <p className="text-muted text-lg max-w-2xl leading-relaxed">{meta.description}</p>
            </div>
          </AnimatedSection>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {articles.length === 0 ? (
          <AnimatedSection className="text-center py-24">
            <Icon className="w-12 h-12 mx-auto mb-4 text-muted opacity-30" />
            <p className="font-display text-2xl text-muted">Coming soon</p>
            <p className="text-muted text-sm mt-2">We&apos;re working on articles for this category.</p>
          </AnimatedSection>
        ) : (
          <div className="space-y-5">
            {/* Featured article — wide card */}
            {featured && (
              <AnimatedSection>
                <Link href={`/${featured.category}/${featured.slug}`}
                  className="group block bg-surface border border-border rounded-2xl overflow-hidden hover:border-green/30 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300 cursor-pointer">
                  <div className="grid md:grid-cols-2">
                    <div className="relative h-56 md:h-72 overflow-hidden bg-surface-2">
                      <Image src={featured.frontmatter.image} alt={featured.frontmatter.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" sizes="50vw" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-widest bg-green/90 text-white px-2.5 py-1 rounded-full">Featured</span>
                      </div>
                      {featured.frontmatter.score && (
                        <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm border border-border font-mono text-xs px-2 py-1 rounded-full">{featured.frontmatter.score}/100</div>
                      )}
                    </div>
                    <div className="p-7 flex flex-col justify-center">
                      <h2 className="font-display text-3xl text-ink group-hover:text-green transition-colors leading-tight mb-3">{featured.frontmatter.title}</h2>
                      <p className="text-muted leading-relaxed mb-5 line-clamp-3">{featured.frontmatter.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted">
                        <div className="flex items-center gap-3">
                          <span className="font-mono">{featured.frontmatter.author}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featured.frontmatter.readTime}</span>
                        </div>
                        <span className="flex items-center gap-1.5 text-green-bright font-semibold">Read article <ArrowUpRight className="w-3.5 h-3.5" /></span>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            )}

            {/* Rest of articles */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map((article, i) => (
                  <AnimatedSection key={article.slug} delay={i * 0.07}>
                    <article className="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-green/30 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300 cursor-pointer h-full flex flex-col">
                      <Link href={`/${article.category}/${article.slug}`} className="flex flex-col flex-1">
                        <div className="relative h-48 overflow-hidden bg-surface-2">
                          <Image src={article.frontmatter.image} alt={article.frontmatter.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" sizes="(max-width: 640px) 100vw, 33vw" />
                          {article.frontmatter.score && (
                            <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm border border-border font-mono text-xs px-2 py-1 rounded-full">{article.frontmatter.score}/100</div>
                          )}
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <h2 className="font-display text-xl text-ink group-hover:text-green transition-colors leading-tight mb-2 flex-1">{article.frontmatter.title}</h2>
                          <p className="text-muted text-sm line-clamp-2 mb-4">{article.frontmatter.description}</p>
                          <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted">
                            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{article.frontmatter.readTime}</span>
                            <span className="flex items-center gap-1.5 text-green-bright font-semibold">Read article <ArrowUpRight className="w-3.5 h-3.5" /></span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
