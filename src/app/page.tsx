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

export const revalidate = 86400

export default function HomePage() {
  const allArticles = getAllArticles()
  return (
    <>
      <HeroSection />
      <TrustBar />
      <CategoryNav />
      <StartHere />
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <BentoGrid articles={allArticles.slice(0, 6)} />
      </AnimatedSection>
      <DatabaseTeaser />
      <ProtocolsTeaser />
      <QuizTeaser />
      <EmailCapture />
    </>
  )
}
