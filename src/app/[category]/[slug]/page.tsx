import { getArticleBySlug, getAllArticles } from '@/lib/content'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { ProductCard } from '@/components/ProductCard'
import { QuickVerdict } from '@/components/QuickVerdict'
import { ScoreBar } from '@/components/ScoreBar'
import { AnimatedSection } from '@/components/AnimatedSection'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Clock, Calendar, User, Tag } from 'lucide-react'

export const revalidate = 86400

export async function generateStaticParams() {
  return getAllArticles().map(a => ({ category: a.category, slug: a.slug }))
}

export async function generateMetadata({ params }: { params: { category: string; slug: string } }): Promise<Metadata> {
  const article = getArticleBySlug(params.category, params.slug)
  if (!article) return {}
  return { title: article.frontmatter.title, description: article.frontmatter.description }
}

export default function ArticlePage({ params }: { params: { category: string; slug: string } }) {
  const article = getArticleBySlug(params.category, params.slug)
  if (!article) notFound()
  const { frontmatter, content } = article

  return (
    <div className="pt-28 pb-24">
      {/* Article header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <AnimatedSection delay={0}>
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-green-bright">{frontmatter.category}</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-ink leading-tight mb-6">{frontmatter.title}</h1>
          <p className="text-muted text-lg mb-6 max-w-2xl leading-relaxed">{frontmatter.description}</p>
          <div className="flex flex-wrap items-center gap-5 text-sm text-muted pb-6 border-b border-border">
            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{frontmatter.author}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{frontmatter.readTime}</span>
          </div>
          {frontmatter.tags && (
            <div className="flex flex-wrap gap-2 mt-4">
              {frontmatter.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 font-mono text-xs text-muted border border-border px-2.5 py-1 rounded-full">
                  <Tag className="w-2.5 h-2.5" />{tag}
                </span>
              ))}
            </div>
          )}
        </AnimatedSection>
      </div>

      {/* Hero image */}
      {frontmatter.image && (
        <AnimatedSection delay={0.1}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
            <div className="relative h-64 md:h-[420px] rounded-2xl overflow-hidden">
              <Image src={frontmatter.image} alt={frontmatter.title} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>
        </AnimatedSection>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-14">
          <div>
            {frontmatter.verdict && <QuickVerdict verdict={frontmatter.verdict} score={frontmatter.score} />}

            {frontmatter.products && frontmatter.products.length > 0 && (
              <AnimatedSection delay={0.1}>
                <div className="my-10 space-y-5">
                  <h2 className="font-display text-2xl text-ink">Top Picks</h2>
                  {frontmatter.products.map((product, i) => (
                    <ProductCard key={product.name} product={product} index={i} />
                  ))}
                </div>
              </AnimatedSection>
            )}

            <div className="prose prose-lg max-w-none">
              <MDXRemote source={content} />
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-5">
              {frontmatter.score && (
                <AnimatedSection delay={0.2}>
                  <div className="bg-surface border border-border rounded-2xl p-5">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Evidence Score</h3>
                    <ScoreBar score={frontmatter.score} label="Overall" />
                  </div>
                </AnimatedSection>
              )}
              {frontmatter.verdict && (
                <AnimatedSection delay={0.3}>
                  <div className="bg-surface border border-border rounded-2xl p-5">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Our Verdict</h3>
                    <p className="text-sm text-muted leading-relaxed">{frontmatter.verdict}</p>
                  </div>
                </AnimatedSection>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
