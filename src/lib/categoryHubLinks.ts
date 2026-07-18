/** Related tools / hubs shown at the bottom of category listing pages. */
export const categoryHubLinks: Record<
  string,
  { title: string; links: { href: string; label: string; desc: string }[] }
> = {
  supplements: {
    title: 'Related tools for supplements',
    links: [
      { href: '/best/complete-longevity-stack', label: 'Complete stack', desc: 'Tiered dosing framework' },
      { href: '/database', label: 'Evidence database', desc: '68+ compounds scored' },
      { href: '/compare/nmn-vs-nr', label: 'NMN vs NR', desc: 'NAD+ precursor matchup' },
      { href: '/best/best-longevity-supplements', label: 'Top 10 overall', desc: 'Evidence-ranked list' },
    ],
  },
  wearables: {
    title: 'Related tools for wearables',
    links: [
      { href: '/best/best-wearables-longevity-2024', label: 'Best wearables 2026', desc: 'Ranked by use case' },
      { href: '/wearables/whoop-vs-oura-comparison', label: 'WHOOP vs Oura', desc: '6-month head-to-head' },
      { href: '/diagnostics/hrv-guide', label: 'HRV guide', desc: 'Interpret recovery scores' },
      { href: '/protocols/sleep-hygiene-protocol', label: 'Sleep protocol', desc: 'Data needs behaviour' },
    ],
  },
  recovery: {
    title: 'Related tools for recovery',
    links: [
      { href: '/recovery/best-home-saunas-infrared-2024', label: 'Best saunas', desc: 'Infrared ranked' },
      { href: '/recovery/cold-plunge-ice-bath-review', label: 'Best cold plunges', desc: 'DIY to pro' },
      { href: '/recovery/best-red-light-therapy-panels-2024', label: 'Best red light', desc: 'Irradiance first' },
      { href: '/protocols/sauna-protocol', label: 'Sauna protocol', desc: 'Dose and frequency' },
    ],
  },
  diagnostics: {
    title: 'Related tools for diagnostics',
    links: [
      { href: '/best/best-longevity-labs', label: 'Best longevity labs', desc: 'What to order first' },
      { href: '/diagnostics/longevity-biomarkers-guide', label: 'Biomarker guide', desc: 'What each number means' },
      { href: '/diagnostics/best-at-home-blood-tests-2024', label: 'At-home blood tests', desc: 'Panels compared' },
      { href: '/get-started', label: 'Beginner path', desc: 'Test before you stack' },
    ],
  },
  protocols: {
    title: 'Related tools for protocols',
    links: [
      { href: '/get-started', label: 'Build my plan', desc: 'Personalised order of ops' },
      { href: '/sleep', label: 'Sleep hub', desc: 'Circadian foundations' },
      { href: '/cardio', label: 'Zone 2 hub', desc: 'Calculator + protocol' },
      { href: '/protocols', label: 'Expert protocols', desc: 'Huberman, Sinclair, Johnson' },
    ],
  },
  best: {
    title: 'Related tools',
    links: [
      { href: '/best/complete-longevity-stack', label: 'Complete stack', desc: 'Core decision page' },
      { href: '/database', label: 'Research database', desc: 'Score every compound' },
      { href: '/compare', label: 'Comparisons', desc: 'Head-to-head guides' },
      { href: '/get-started', label: 'Beginner path', desc: 'Start in the right order' },
    ],
  },
}
