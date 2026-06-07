import { getArticleBySlug, getAllArticles } from '@/lib/content'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { ProductCard } from '@/components/ProductCard'
import { QuickVerdict } from '@/components/QuickVerdict'
import { ScoreBar } from '@/components/ScoreBar'
import { AnimatedSection } from '@/components/AnimatedSection'
import { Breadcrumb } from '@/components/Breadcrumb'
import { TableOfContents } from '@/components/TableOfContents'
import { parseHeadings } from '@/lib/toc'
import { RelatedArticles } from '@/components/RelatedArticles'
import { mdxComponents } from '@/components/MdxComponents'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Clock, Calendar, User, Tag } from 'lucide-react'

const siteUrl = 'https://longevitylab-five.vercel.app'

export const revalidate = 86400

export async function generateStaticParams() {
  return getAllArticles().map(a => ({ category: a.category, slug: a.slug }))
}

export async function generateMetadata({ params }: { params: { category: string; slug: string } }): Promise<Metadata> {
  const article = getArticleBySlug(params.category, params.slug)
  if (!article) return {}
  const { frontmatter } = article
  const url = `${siteUrl}/${params.category}/${params.slug}`
  const ogImage = frontmatter.image
    ? [{ url: frontmatter.image, width: 1200, height: 630, alt: frontmatter.title }]
    : [{ url: '/og-default.png', width: 1200, height: 630, alt: frontmatter.title }]

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: { canonical: url },
    authors: [{ name: frontmatter.author }],
    openGraph: {
      type: 'article',
      url,
      title: frontmatter.title,
      description: frontmatter.description,
      images: ogImage,
      publishedTime: frontmatter.date,
      authors: [frontmatter.author],
      tags: frontmatter.tags,
      siteName: 'LongevityLab',
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.description,
      images: ogImage.map(i => i.url),
    },
  }
}

export default function ArticlePage({ params }: { params: { category: string; slug: string } }) {
  const article = getArticleBySlug(params.category, params.slug)
  if (!article) notFound()
  const { frontmatter, content } = article
  const allArticles = getAllArticles()
  const headings = parseHeadings(content)

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${siteUrl}/${params.category}/${params.slug}#article`,
        headline: frontmatter.title,
        description: frontmatter.description,
        datePublished: frontmatter.date,
        dateModified: frontmatter.date,
        author: { '@type': 'Person', name: frontmatter.author },
        publisher: {
          '@type': 'Organization',
          name: 'LongevityLab',
          url: siteUrl,
          logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
        },
        image: frontmatter.image ? { '@type': 'ImageObject', url: frontmatter.image } : undefined,
        url: `${siteUrl}/${params.category}/${params.slug}`,
        mainEntityOfPage: `${siteUrl}/${params.category}/${params.slug}`,
        keywords: frontmatter.tags?.join(', '),
        articleSection: frontmatter.category,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: frontmatter.category, item: `${siteUrl}/category/${params.category}` },
          { '@type': 'ListItem', position: 3, name: frontmatter.title, item: `${siteUrl}/${params.category}/${params.slug}` },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-28 pb-24">
        {/* Article header */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <AnimatedSection delay={0}>
            {/* Breadcrumb */}
            <div className="mb-5">
              <Breadcrumb
                items={[
                  { label: frontmatter.category, href: `/category/${params.category}` },
                  { label: frontmatter.title },
                ]}
              />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-green-bright px-2.5 py-1 bg-green/10 border border-green/20 rounded-full">
                {frontmatter.category}
              </span>
              {frontmatter.featured && (
                <span className="font-mono text-xs uppercase tracking-widest text-amber px-2.5 py-1 bg-amber/10 border border-amber/20 rounded-full">
                  Featured
                </span>
              )}
            </div>

            <h1 className="font-display text-4xl md:text-5xl text-ink leading-tight mb-6">{frontmatter.title}</h1>
            <p className="text-muted text-lg mb-6 max-w-2xl leading-relaxed">{frontmatter.description}</p>

            <div className="flex flex-wrap items-center gap-5 text-sm text-muted pb-6 border-b border-border">
              <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{frontmatter.author}</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={frontmatter.date}>
                  {new Date(frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
              </span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{frontmatter.readTime}</span>
            </div>

            {frontmatter.tags && frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {frontmatter.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 font-mono text-xs text-muted border border-border px-2.5 py-1 rounded-full hover:border-green/40 hover:text-ink transition-colors">
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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
              <div className="relative h-64 md:h-[420px] rounded-2xl overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/30">
                <Image
                  src={frontmatter.image}
                  alt={frontmatter.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1280px) 100vw, 1152px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </div>
          </AnimatedSection>
        )}

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-14">
            {/* Main content */}
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
                <MDXRemote source={content} components={mdxComponents} />
              </div>

              {/* Related articles */}
              <RelatedArticles
                current={{ slug: article.slug, category: article.category, tags: frontmatter.tags }}
                articles={allArticles}
              />
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-5">
                {/* Evidence score */}
                {frontmatter.score && (
                  <AnimatedSection delay={0.2}>
                    <div className="bg-surface border border-border rounded-2xl p-5">
                      <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Evidence Score</h3>
                      <ScoreBar score={frontmatter.score} label="Overall" />
                    </div>
                  </AnimatedSection>
                )}

                {/* Verdict */}
                {frontmatter.verdict && (
                  <AnimatedSection delay={0.3}>
                    <div className="bg-surface border border-border rounded-2xl p-5">
                      <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Our Verdict</h3>
                      <p className="text-sm text-muted leading-relaxed">{frontmatter.verdict}</p>
                    </div>
                  </AnimatedSection>
                )}

                {/* Table of contents */}
                {headings.length >= 2 && (
                  <AnimatedSection delay={0.35}>
                    <TableOfContents headings={headings} />
                  </AnimatedSection>
                )}

                {/* Share */}
                <AnimatedSection delay={0.4}>
                  <div className="bg-surface border border-border rounded-2xl p-5">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Share</h3>
                    <div className="flex gap-2">
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(frontmatter.title)}&url=${encodeURIComponent(`https://longevitylab-five.vercel.app/${params.category}/${params.slug}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 flex-1 justify-center px-3 py-2 rounded-xl border border-border hover:border-green/40 text-muted hover:text-ink transition-colors text-xs font-medium cursor-pointer"
                        aria-label="Share on X / Twitter"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
                        Tweet
                      </a>
                      <button
                        onClick={undefined}
                        aria-label="Copy link"
                        className="copy-link-btn flex items-center gap-2 flex-1 justify-center px-3 py-2 rounded-xl border border-border hover:border-green/40 text-muted hover:text-ink transition-colors text-xs font-medium cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                        Copy
                      </button>
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
