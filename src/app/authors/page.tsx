import { AnimatedSection } from '@/components/AnimatedSection'
import Link from 'next/link'
import { ArrowUpRight, BookOpen, User } from 'lucide-react'
import { authors } from '@/lib/authors'
import { getArticlesByAuthor } from '@/lib/content'
import type { Metadata } from 'next'
import { SITE, absoluteUrl } from '@/lib/site'

const url = absoluteUrl('/authors')

export const metadata: Metadata = {
  title: 'Editorial Team & Attribution Policy',
  description:
    "Learn how Longevity Intel attributes articles and records contributor credentials and medical review.",
  alternates: { canonical: url },
  openGraph: {
    title: `Editorial Team | ${SITE.name}`,
    description: 'Editorial attribution and review-status policy for Longevity Intel.',
    url,
    type: 'website',
    siteName: SITE.name,
  },
}

export default function AuthorsPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-14">
          <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-3">Accountability</p>
          <h1 className="font-display text-5xl text-ink mb-4">Our Editorial Team</h1>
          <p className="text-muted text-lg max-w-2xl leading-relaxed">
            Legacy articles are attributed to the editorial team while contributor identities,
            credentials, testing records, and article-specific review records are verified.
          </p>
        </AnimatedSection>

        <div className="space-y-5">
          {authors.map((author, i) => {
            const count = getArticlesByAuthor(author.name).length
            return (
              <AnimatedSection key={author.name} delay={i * 0.08}>
                <Link
                  href={`/authors/${author.slug}`}
                  className="group block bg-surface border border-border rounded-2xl p-6 hover:border-green/30 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-green/10 border border-green/20 flex items-center justify-center shrink-0">
                      <span className="font-mono text-lg font-medium text-green-bright">{author.initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <div>
                          <h2 className="font-display text-2xl text-ink group-hover:text-green transition-colors">
                            {author.name}
                          </h2>
                          <p className="font-mono text-xs uppercase tracking-widest text-green-bright mt-0.5">
                            {author.role}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-display text-2xl text-ink">{count || author.articles}</div>
                          <div className="font-mono text-[9px] text-muted uppercase">articles</div>
                        </div>
                      </div>
                      <p className="text-muted text-sm leading-relaxed mt-3 mb-4">{author.bio}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-3.5 h-3.5 text-muted" />
                        <span className="text-xs text-muted font-mono">{author.credentials}</span>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          {author.expertise.map(e => (
                            <span
                              key={e}
                              className="font-mono text-[10px] uppercase tracking-wider border border-border text-muted px-2.5 py-1 rounded-full"
                            >
                              {e}
                            </span>
                          ))}
                        </div>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-bright">
                          View profile <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            )
          })}
        </div>

        <AnimatedSection delay={0.35} className="mt-10 bg-surface border border-border rounded-2xl p-6">
          <h3 className="font-display text-xl text-ink mb-3">Editorial Independence</h3>
          <p className="text-muted text-sm leading-relaxed">
            Affiliate relationships are disclosed. Medical review appears only when the article has
            a documented reviewer and review date; contributor credentials are not inferred from a byline.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-green-bright hover:text-green transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Full editorial policy
          </Link>
        </AnimatedSection>
      </div>
    </div>
  )
}
