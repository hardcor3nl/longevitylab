import { Shield, BookOpen, Users, Award, Microscope, HeartPulse } from 'lucide-react'

const items = [
  { icon: Shield,      label: 'Independent — no brand-funded scores' },
  { icon: BookOpen,    label: '100+ science-backed reviews' },
  { icon: Microscope,  label: '6,000+ studies referenced' },
  { icon: Users,       label: '12,000+ longevity optimisers' },
  { icon: Award,       label: 'Physician-reviewed editorial process' },
  { icon: HeartPulse,  label: 'Evidence hierarchy: sleep → train → stack' },
]

// Duplicate for seamless loop
const allItems = [...items, ...items]

export function TrustBar() {
  return (
    <div className="border-y border-border bg-surface/60 dark:bg-surface/40 overflow-hidden">
      <div className="relative flex">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--surface), transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--surface), transparent)' }} />

        <div className="flex animate-marquee gap-0 py-3">
          {allItems.map(({ icon: Icon, label }, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-7 border-r border-border/50 whitespace-nowrap"
            >
              <div className="w-6 h-6 rounded-md bg-green/10 border border-green/20 flex items-center justify-center shrink-0">
                <Icon className="w-3 h-3 text-green-bright" />
              </div>
              <span className="text-xs font-medium text-muted">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
