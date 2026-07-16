import Link from 'next/link'
import { FlaskConical } from 'lucide-react'
import { SITE } from '@/lib/site'

const links = {
  Topics: [
    ['Sleep Optimization', '/sleep'],
    ['Zone 2 & VO₂ Max', '/cardio'],
    ['Nutrition', '/nutrition'],
    ['Stress Resilience', '/stress-resilience'],
    ['Exotic Methods', '/exotic-methods'],
  ],
  Reviews: [
    ['Supplements', '/category/supplements'],
    ['Wearables', '/category/wearables'],
    ['Recovery', '/category/recovery'],
    ['Diagnostics', '/category/diagnostics'],
    ['Best Picks', '/best'],
  ],
  Tools: [
    ['Build My Plan', '/get-started'],
    ['Research Database', '/database'],
    ['Expert Protocols', '/protocols'],
    ['Bio Age Quiz', '/quiz'],
    ['Comparisons', '/compare'],
    ['Glossary', '/glossary'],
  ],
  Company: [
    ['About', '/about'],
    ['Our Experts', '/authors'],
    ['Contact', '/contact'],
    ['Affiliate Disclosure', '/about#affiliate'],
    ['Privacy Policy', '/privacy'],
    ['Terms of Service', '/terms'],
  ],
}

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-surface border-t border-border">
      <div
        className="h-px w-full"
        style={{
          background: 'linear-gradient(to right, transparent, var(--green-bright), transparent)',
          opacity: 0.4,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-14">
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="w-8 h-8 rounded-xl bg-green flex items-center justify-center group-hover:bg-green-bright transition-colors duration-200">
                <FlaskConical className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-xl text-ink tracking-tight">{SITE.name}</span>
            </Link>
            <p className="text-muted text-sm leading-relaxed mb-5 max-w-[260px]">
              Independent, science-backed longevity reviews. Physician-reviewed. Never sponsored by
              supplement companies.
            </p>

            <div className="flex items-center gap-2 mb-6">
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-border hover:border-green/40 hover:bg-green/5 text-muted hover:text-ink transition-all duration-150 cursor-pointer"
                aria-label="View on GitHub"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>

            <div className="flex flex-col gap-2">
              {['Independent — no brand funding', 'Physician-reviewed content'].map(t => (
                <div key={t} className="flex items-center gap-1.5 text-xs text-muted">
                  <div className="w-3 h-3 rounded-full bg-green/20 border border-green/30 flex items-center justify-center shrink-0">
                    <div className="w-1 h-1 rounded-full bg-green-bright" />
                  </div>
                  {t}
                </div>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted/70 mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {items.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-muted hover:text-ink transition-colors duration-150 cursor-pointer hover:translate-x-0.5 inline-block"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted font-mono">
              <span>
                © {year} {SITE.name}
              </span>
              <Link href="/privacy" className="hover:text-ink transition-colors duration-150">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-ink transition-colors duration-150">
                Terms
              </Link>
              <Link href="/about#affiliate" className="hover:text-ink transition-colors duration-150">
                Affiliate Disclosure
              </Link>
              <Link href="/contact" className="hover:text-ink transition-colors duration-150">
                Contact
              </Link>
            </div>
            <p className="text-xs text-muted font-mono">
              Content for informational purposes only — not medical advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
