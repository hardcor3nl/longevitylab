import Link from 'next/link'
import { BadgeCheck, Info, ArrowUpRight } from 'lucide-react'
import { getAuthorByName, authors } from '@/lib/authors'

/* Compact trust strip shown under the article byline.
   Health (YMYL) content lives or dies on visible review credentials. */
export function ReviewedBy({ authorName }: { authorName: string }) {
  const reviewer = authors[0] // Dr. Sarah Chen — Chief Medical Reviewer
  const isSelfReviewed = authorName === reviewer.name
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 px-4 py-3 bg-green/[0.06] border border-green/15 rounded-xl">
      <div className="flex items-center gap-2">
        <BadgeCheck className="w-4 h-4 text-green-bright shrink-0" />
        <span className="text-xs text-ink">
          {isSelfReviewed ? (
            <>Written by our <strong className="font-semibold">Chief Medical Reviewer</strong></>
          ) : (
            <>Medically reviewed by{' '}
              <Link href="/authors" className="font-semibold text-green-bright hover:text-green transition-colors">
                {reviewer.name}
              </Link>, {reviewer.credentials.split('.')[0]}
            </>
          )}
        </span>
      </div>
      <span className="hidden sm:block w-px h-4 bg-green/20" />
      <span className="text-xs text-muted">
        Every claim cross-checked against peer-reviewed literature.{' '}
        <Link href="/about" className="underline underline-offset-2 hover:text-ink transition-colors">Our process</Link>
      </span>
    </div>
  )
}

/* FTC-compliant disclosure shown above product recommendations. */
export function AffiliateDisclosure() {
  return (
    <div className="flex items-start gap-2.5 px-4 py-3 bg-surface-2/60 border border-border rounded-xl mb-6">
      <Info className="w-3.5 h-3.5 text-muted shrink-0 mt-0.5" />
      <p className="text-xs text-muted leading-relaxed">
        We may earn a commission if you buy through our links — at no extra cost to you.
        Commissions never influence rankings or scores.{' '}
        <Link href="/about#affiliate" className="underline underline-offset-2 hover:text-ink transition-colors">
          How we stay independent
        </Link>
      </p>
    </div>
  )
}

/* Author bio card at the end of every article — E-E-A-T anchor. */
export function AuthorCard({ authorName }: { authorName: string }) {
  const author = getAuthorByName(authorName)
  return (
    <div className="mt-14 bg-surface border border-border rounded-2xl p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted mb-4">About the Author</p>
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-green/10 border border-green/20 flex items-center justify-center shrink-0">
          <span className="font-mono text-base font-medium text-green-bright">{author.initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-xl text-ink leading-tight">{author.name}</h3>
          <p className="font-mono text-[11px] uppercase tracking-widest text-green-bright mt-0.5 mb-2.5">{author.role}</p>
          <p className="text-sm text-muted leading-relaxed mb-3">{author.bio}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-xs text-muted font-mono">{author.credentials}</span>
            <Link href="/authors"
              className="flex items-center gap-1 text-xs font-semibold text-green-bright hover:text-green transition-colors cursor-pointer">
              Meet the team <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
