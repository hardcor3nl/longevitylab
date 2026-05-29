import { getAllArticles } from '@/lib/content'
import { HeroSection } from '@/components/HeroSection'
import { BentoGrid } from '@/components/BentoGrid'
import { CategoryNav } from '@/components/CategoryNav'
import { EmailCapture } from '@/components/EmailCapture'

export const revalidate = 86400

export default function HomePage() {
  const allArticles = getAllArticles()

  return (
    <>
      <HeroSection />
      <CategoryNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <BentoGrid articles={allArticles.slice(0, 6)} />
      </div>
      <EmailCapture />
    </>
  )
}
