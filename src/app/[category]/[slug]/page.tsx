import { getArticleBySlug, getAllArticles } from '@/lib/content'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { ProductCard } from '@/components/ProductCard'
import { QuickVerdict } from '@/components/QuickVerdict'
import { ScoreBar } from '@/components/ScoreBar'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Clock, Calendar, User } from 'lucide-react'

export const revalidate = 86400

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map(a => ({ category: a.category, slug: a.slug }))
}

export async function generateMetadata({ params }: { params: { category: string; slug: string } }): Promise<Metadata> {
  const article = getArticleBySlug(params.category, params.slug)
  if (!article) return {}
  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
  }
}

export default function ArticlePage({ params }: { params: { category: string; slug: string } }) {
  const article = getArticleBySlug(params.category, params.slug)
  if (!article) notFound()

  const { frontmatter, content } = article

  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="mb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-green-bright">
            {frontmatter.category}
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-ink leading-tight mb-6">
          {frontmatter.title}
        </h1>
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted">
          <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{frontmatter.author}</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{frontmatter.readTime}</span>
        </div>
      </div>

      {/* Featured image */}
      {frontmatter.image && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
            <Image src={frontmatter.image} alt={frontmatter.title} fill className="object-cover" />
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
          <div>
            {/* Quick verdict */}
            {frontmatter.verdict && (
              <QuickVerdict verdict={frontmatter.verdict} score={frontmatter.score} />
            )}

            {/* Product cards */}
            {frontmatter.products && frontmatter.products.length > 0 && (
              <div className="my-10 space-y-4">
                <h2 className="font-display text-2xl text-ink">Top Picks</h2>
                {frontmatter.products.map(product => (
                  <ProductCard key={product.name} product={product} />
                ))}
              </div>
            )}

            {/* Article body */}
            <div className="prose prose-lg max-w-none" style={{ maxWidth: '680px' }}>
              <MDXRemote source={content} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {frontmatter.score && (
                <div className="bg-surface border border-border rounded-2xl p-6">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Evidence Score</h3>
                  <ScoreBar score={frontmatter.score} label="Overall" />
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
