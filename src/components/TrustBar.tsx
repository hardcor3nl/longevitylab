import { Shield, BookOpen, Users, Award } from 'lucide-react'

const stats = [
  { icon: Shield, label: 'Independent — no supplement company funding' },
  { icon: BookOpen, label: '100+ science-backed reviews' },
  { icon: Users, label: '12,000+ newsletter subscribers' },
  { icon: Award, label: 'Reviewed by MDs & PhDs' },
]

export function TrustBar() {
  return (
    <div className="border-y border-border bg-surface/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {stats.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-muted">
              <Icon className="w-3.5 h-3.5 text-green-bright shrink-0" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
