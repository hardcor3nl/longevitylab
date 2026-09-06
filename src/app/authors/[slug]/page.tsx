import { notFound } from 'next/navigation'
import Link from 'next/link'
import { authors, getAuthorBySlug, editorialTeam } from '@/lib/authors'
import { getArticlesByAuthor } from '@/lib/content'
import { AnimatedSection } from '@/components/AnimatedSection'
import { ArrowLeft, ArrowUpRight, BookOpen, Clock } from 'lucide-react'
import type { Metadata } from 'next'
import { SITE, absoluteUrl } from '@/lib/site'

export function generateStaticParams() {
  return [...authors.map(a => ({ slug: a.slug })), { slug: editorialTeam.slug }]
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const author = getAuthorBySlug(params.slug)
  if (!author) return {}
  const url = absoluteUrl(`/authors/${author.slug}`)
  return {
    title: `${author.name} — ${author.role}`,
    description: `${author.bio} Credentials: ${author.credentials}`,
    alternates: { canonical: url },
    openGraph: {
      title: `${author.name} | ${SITE.name}`,
      description: author.bio,
      url,
      type: 'profile',
      siteName: SITE.name,
    },
  }
}

export default function AuthorPage({ params }: { params: { slug: string } }) {
  const author = getAuthorBySlug(params.slug)
  if (!author) notFound()

  const articles = getArticlesByAuthor(author.name)
  const all = articles.filter(
    (a, i, arr) => arr.findIndex(x => x.slug === a.slug && x.category === a.category) === i
  )

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    url: absoluteUrl(`/authors/${author.slug}`),
    worksFor: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
    knowsAbout: author.expertise,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <div className="pt-28 pb-24 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <Link
              href="/authors"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-8"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Editorial attribution
            </Link>

            <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 mb-10" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                <div className="w-20 h-20 rounded-2xl bg-green/10 border border-green/20 flex items-center justify-center shrink-0">
                  <span className="font-mono text-2xl font-medium text-green-bright">{author.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-green-bright bg-green/10 border border-green/20 px-2 py-0.5 rounded-full">
                      <BookOpen className="w-3 h-3" /> Editorial attribution
                    </span>
                  </div>
                  <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight">{author.name}</h1>
                  <p className="font-mono text-xs uppercase tracking-widest text-green-bright mt-2">{author.role}</p>
                  <p className="text-muted leading-relaxed mt-4 max-w-2xl">{author.bio}</p>
                  <p className="text-xs text-muted font-mono mt-3">{author.credentials}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {author.expertise.map(e => (
                      <span
                        key={e}
                        className="font-mono text-[10px] uppercase tracking-wider border border-border text-muted px-2.5 py-1 rounded-full"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="sm:text-right shrink-0 border border-border rounded-2xl px-4 py-3 bg-cream/40 dark:bg-surface-2/40">
                  <div className="font-display text-3xl text-ink">{all.length || author.articles}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted">articles</div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-green-bright" />
              <h2 className="font-display text-2xl text-ink">Published work</h2>
            </div>
            {all.length === 0 ? (
              <p className="text-muted text-sm">
                Articles by this contributor are attributed across collaborative reviews. See the{' '}
                <Link href="/best" className="text-green-bright hover:underline">
                  best lists
                </Link>{' '}
                and{' '}
                <Link href="/category/supplements" className="text-green-bright hover:underline">
                  supplement library
                </Link>
                .
              </p>
            ) : (
              <div className="space-y-3">
                {all.map(a => (
                  <Link
                    key={`${a.category}-${a.slug}`}
                    href={`/${a.category}/${a.slug}`}
                    className="group flex items-start justify-between gap-4 p-4 rounded-2xl border border-border bg-surface hover:border-green/30 transition-all"
                  >
                    <div className="min-w-0">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                        {a.category}
                      </span>
                      <h3 className="font-display text-lg text-ink group-hover:text-green transition-colors leading-snug mt-0.5">
                        {a.frontmatter.title}
                      </h3>
                      <p className="text-xs text-muted mt-1 line-clamp-2">{a.frontmatter.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted">
                        <Clock className="w-3 h-3" />
                        {a.frontmatter.readTime}
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-green-bright shrink-0 mt-1" />
                  </Link>
                ))}
              </div>
            )}
          </AnimatedSection>

          <AnimatedSection className="mt-10 p-5 rounded-2xl border border-border bg-surface">
            <h3 className="font-display text-lg text-ink mb-2">Independence standard</h3>
            <p className="text-sm text-muted leading-relaxed">
              Affiliate relationships are disclosed. Medical review appears only when a named
              reviewer and review date are recorded for the article.{' '}
              <Link href="/about#affiliate" className="text-green-bright hover:underline">
                Editorial policy
              </Link>
            </p>
          </AnimatedSection>
        </div>
      </div>
    </>
  )
}
