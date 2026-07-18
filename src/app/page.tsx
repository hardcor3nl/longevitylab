import { getAllArticles } from '@/lib/content'
import { HeroSection } from '@/components/HeroSection'
import { BentoGrid } from '@/components/BentoGrid'
import { CategoryNav } from '@/components/CategoryNav'
import { EmailCapture } from '@/components/EmailCapture'
import { AnimatedSection } from '@/components/AnimatedSection'
import { DatabaseTeaser } from '@/components/DatabaseTeaser'
import { QuizTeaser } from '@/components/QuizTeaser'
import { ProtocolsTeaser } from '@/components/ProtocolsTeaser'
import { TrustBar } from '@/components/TrustBar'
import { StartHere } from '@/components/StartHere'
import { HubPillars } from '@/components/HubPillars'
import { TopGuides } from '@/components/TopGuides'
import { EditorialPromise } from '@/components/EditorialPromise'
import type { Metadata } from 'next'
import { SITE, absoluteUrl } from '@/lib/site'

export const revalidate = 86400

export const metadata: Metadata = {
  alternates: { canonical: SITE.url },
  title: {
    absolute: `${SITE.name} — Science-Backed Longevity Reviews & Protocols`,
  },
  description:
    'The independent longevity hub: physician-reviewed supplement rankings, wearables, sauna and cold plunge guides, protocols, and an evidence database — organised so you act in the right order.',
}

const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Essential Longevity Guides',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Complete Longevity Supplement Stack',
      url: absoluteUrl('/best/complete-longevity-stack'),
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Best NMN Supplements 2026',
      url: absoluteUrl('/supplements/best-nmn-supplements-2024'),
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Sleep Hygiene Protocol',
      url: absoluteUrl('/protocols/sleep-hygiene-protocol'),
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: 'Best Home Infrared Saunas',
      url: absoluteUrl('/recovery/best-home-saunas-infrared-2024'),
    },
    {
      '@type': 'ListItem',
      position: 5,
      name: 'Best Longevity Wearables',
      url: absoluteUrl('/best/best-wearables-longevity-2024'),
    },
    {
      '@type': 'ListItem',
      position: 6,
      name: 'Beginner Longevity Path',
      url: absoluteUrl('/get-started'),
    },
  ],
}

export default function HomePage() {
  const allArticles = getAllArticles()
  const latest = allArticles.slice(0, 6)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <HeroSection />
      <TrustBar />
      <CategoryNav />
      <HubPillars />
      <StartHere />
      <TopGuides />
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <BentoGrid articles={latest} />
      </AnimatedSection>
      <DatabaseTeaser />
      <ProtocolsTeaser />
      <EditorialPromise />
      <QuizTeaser />
      <EmailCapture />
    </>
  )
}
