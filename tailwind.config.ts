import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        cream: 'var(--cream)',
        green: { DEFAULT: 'var(--green)', bright: 'var(--green-bright)' },
        amber: 'var(--amber)',
        surface: 'var(--surface)',
        muted: 'var(--muted)',
        border: 'var(--border)',
      },
      fontFamily: {
        display: ['Instrument Serif', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      fontSize: {
        hero: 'clamp(48px, 6vw, 72px)',
      },
      maxWidth: {
        prose: '680px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
