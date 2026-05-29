import Link from 'next/link'
import { FlaskConical } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-display text-xl text-ink mb-3">
              <FlaskConical className="w-4 h-4 text-green-bright" />
              LongevityLab
            </div>
            <p className="text-muted text-sm leading-relaxed">Science-backed longevity reviews and guides.</p>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Reviews</h4>
            <ul className="space-y-2 text-sm">
              {['Supplements', 'Wearables', 'Diagnostics', 'Protocols'].map(c => (
                <li key={c}><Link href={`/category/${c.toLowerCase()}`} className="text-muted hover:text-ink transition-colors">{c}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Best Picks</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/best" className="text-muted hover:text-ink transition-colors">All Best Lists</Link></li>
              <li><Link href="/best/best-longevity-supplements" className="text-muted hover:text-ink transition-colors">Longevity Supplements</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted hover:text-ink transition-colors">About</Link></li>
              <li><Link href="/about#affiliate" className="text-muted hover:text-ink transition-colors">Affiliate Disclosure</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted">
          <p>© {new Date().getFullYear()} LongevityLab. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Content is for informational purposes only — not medical advice.</p>
        </div>
      </div>
    </footer>
  )
}
