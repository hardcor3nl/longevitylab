import Link from 'next/link'
import { FlaskConical } from 'lucide-react'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-7 h-7 rounded-lg bg-green flex items-center justify-center group-hover:bg-green-bright transition-colors">
                <FlaskConical className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display text-lg text-ink">LongevityLab</span>
            </Link>
            <p className="text-muted text-sm leading-relaxed mb-4">Science-backed longevity reviews and guides.</p>
            <div className="flex items-center gap-2">
              <a href="#" className="p-2 rounded-lg border border-border hover:border-green/40 text-muted hover:text-ink transition-colors cursor-pointer" aria-label="Twitter">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
              </a>
              <a href="https://github.com/hardcor3nl/longevitylab" className="p-2 rounded-lg border border-border hover:border-green/40 text-muted hover:text-ink transition-colors cursor-pointer" aria-label="GitHub">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </a>
            </div>
          </div>

          {[
            { title: 'Reviews', links: [['Supplements', '/category/supplements'], ['Wearables', '/category/wearables'], ['Diagnostics', '/category/diagnostics'], ['Protocols', '/category/protocols']] as [string, string][] },
            { title: 'Best Picks', links: [['All Lists', '/best'], ['Top Supplements', '/best/best-longevity-supplements']] as [string, string][] },
            { title: 'Company', links: [['About', '/about'], ['Editorial Policy', '/about'], ['Affiliate Disclosure', '/about#affiliate']] as [string, string][] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-muted mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-muted hover:text-ink transition-colors cursor-pointer">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted font-mono">
          <p>© {year} LongevityLab. All rights reserved.</p>
          <p>Content for informational purposes only — not medical advice.</p>
        </div>
      </div>
    </footer>
  )
}
