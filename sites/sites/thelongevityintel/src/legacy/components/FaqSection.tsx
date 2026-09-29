import type { FaqItem } from '@/lib/faqs'
import { faqJsonLd } from '@/lib/faqs'

export function FaqSection({
  faqs,
  title = 'Frequently asked questions',
}: {
  faqs: FaqItem[]
  title?: string
}) {
  if (!faqs.length) return null
  const jsonLd = faqJsonLd(faqs)

  return (
    <section className="mt-14 pt-10 border-t border-border">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-2">FAQ</p>
      <h2 className="font-display text-2xl sm:text-3xl text-ink mb-6">{title}</h2>
      <div className="space-y-3">
        {faqs.map(f => (
          <details
            key={f.question}
            className="group bg-surface border border-border rounded-2xl px-5 py-4 open:border-green/30 transition-colors"
          >
            <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-medium text-ink">
              <span className="leading-snug pr-2">{f.question}</span>
              <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full border border-border flex items-center justify-center text-muted group-open:bg-green/10 group-open:text-green-bright group-open:border-green/25 transition-colors text-sm">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-muted leading-relaxed border-t border-border/70 pt-3">
              {f.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
