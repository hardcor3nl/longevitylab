'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatedSection } from '@/components/AnimatedSection'
import { ArrowRight, CheckCircle2, Zap } from 'lucide-react'

type Answer = 'beginner' | 'intermediate' | 'advanced' | null
type Goal = 'sleep' | 'cardio' | 'recovery' | 'supplements' | 'overall' | null

export default function GetStarted() {
  const [step, setStep] = useState<'welcome' | 'goal' | 'level' | 'budget' | 'results'>('welcome')
  const [goal, setGoal] = useState<Goal>(null)
  const [experienceLevel, setExperienceLevel] = useState<Answer>(null)
  const [budget, setBudget] = useState<'budget' | 'balanced' | 'unlimited' | null>(null)

  const handleStart = () => setStep('goal')
  const handleGoal = (g: Goal) => {
    setGoal(g)
    setStep('level')
  }
  const handleLevel = (level: Answer) => {
    setExperienceLevel(level)
    setStep('budget')
  }
  const handleBudget = (b: 'budget' | 'balanced' | 'unlimited') => {
    setBudget(b)
    setStep('results')
  }

  const reset = () => {
    setStep('welcome')
    setGoal(null)
    setExperienceLevel(null)
    setBudget(null)
  }

  // Generate recommendations
  const getRecommendations = () => {
    const recs: Array<{
      title: string
      description: string
      href: string
      icon: string
      color: string
    }> = []

    if (goal === 'sleep') {
      recs.push({
        title: 'Sleep Optimization Protocol',
        description: 'Circadian rhythm mastery, sleep architecture, environmental optimization, and supplement timing.',
        href: '/sleep',
        icon: '🌙',
        color: 'bg-blue-500/10 border-blue-500/25',
      })
      if (experienceLevel === 'advanced') {
        recs.push({
          title: 'Advanced Sleep Tracking',
          description: 'Deep dive into wearables (WHOOP, Oura) and biometric optimization.',
          href: '/database?category=wearables',
          icon: '📊',
          color: 'bg-indigo-500/10 border-indigo-500/25',
        })
      }
    }

    if (goal === 'cardio') {
      recs.push({
        title: 'Zone 2 Cardio Protocol',
        description: 'VO₂ max training, periodization, and longevity-focused aerobic development.',
        href: '/cardio',
        icon: '❤️',
        color: 'bg-red-500/10 border-red-500/25',
      })
      if (budget !== 'budget') {
        recs.push({
          title: 'Cardio Gear & Wearables',
          description: 'Best equipment for tracking and optimizing your training.',
          href: '/database?category=cardio-gear',
          icon: '⚙️',
          color: 'bg-orange-500/10 border-orange-500/25',
        })
      }
    }

    if (goal === 'recovery') {
      recs.push({
        title: 'Recovery Devices Protocol',
        description: 'Saunas, cold plunges, red light, and massage for optimal recovery.',
        href: '/database?category=recovery',
        icon: '🛀',
        color: 'bg-purple-500/10 border-purple-500/25',
      })
    }

    if (goal === 'supplements') {
      recs.push({
        title: 'Supplement Database',
        description: 'Curated supplements with evidence scores and protocol recommendations.',
        href: '/database',
        icon: '💊',
        color: 'bg-green-500/10 border-green-500/25',
      })
      if (experienceLevel === 'advanced') {
        recs.push({
          title: 'Expert Protocols',
          description: 'See how Peter Attia, Bryan Johnson, Huberman, and Sinclair stack supplements.',
          href: '/protocols',
          icon: '🔬',
          color: 'bg-emerald-500/10 border-emerald-500/25',
        })
      }
    }

    if (goal === 'overall') {
      recs.push(
        {
          title: 'Sleep Optimization',
          description: 'Master circadian rhythm and sleep quality.',
          href: '/sleep',
          icon: '🌙',
          color: 'bg-blue-500/10 border-blue-500/25',
        },
        {
          title: 'Zone 2 Cardio Protocol',
          description: 'Build aerobic base and VO₂ max for longevity.',
          href: '/cardio',
          icon: '❤️',
          color: 'bg-red-500/10 border-red-500/25',
        },
        {
          title: 'Supplement Stack',
          description: 'Core supplements for health and longevity.',
          href: '/database',
          icon: '💊',
          color: 'bg-green-500/10 border-green-500/25',
        },
        {
          title: 'Expert Protocols',
          description: 'Learn from Peter Attia, Bryan Johnson, and others.',
          href: '/protocols',
          icon: '🔬',
          color: 'bg-emerald-500/10 border-emerald-500/25',
        }
      )
    }

    return recs
  }

  return (
    <div className="pt-24 pb-24 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Screen */}
        {step === 'welcome' && (
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="w-16 h-16 rounded-full bg-green/10 border border-green/25 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-green-bright" />
              </div>
              <h1 className="font-display text-5xl text-ink mb-4">Find Your Longevity Path</h1>
              <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed mb-8">
                In 3 minutes, we&apos;ll help you discover the personalized protocols that matter most for your longevity journey.
              </p>
              <button
                onClick={handleStart}
                className="px-8 py-4 bg-green text-white rounded-xl font-semibold text-lg hover:bg-green-bright transition-colors cursor-pointer inline-flex items-center gap-2">
                Start Quiz <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-12 pt-12 border-t border-border">
              <h3 className="font-display text-lg text-ink mb-4">What You&apos;ll Learn</h3>
              <div className="space-y-3">
                {[
                  'Your #1 priority protocol (sleep, cardio, recovery, supplements, or overall fitness)',
                  'How deep to go based on your experience level (beginner, intermediate, advanced)',
                  'Budget-friendly options vs. premium tools and wearables',
                  'Curated recommendations tailored to your goal and budget',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-bright shrink-0 mt-0.5" />
                    <span className="text-ink">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Goal Selection */}
        {step === 'goal' && (
          <AnimatedSection>
            <div className="mb-12">
              <h2 className="font-display text-3xl text-ink mb-2">What&apos;s Your #1 Priority?</h2>
              <p className="text-muted mb-8">Choose the area where you want to focus first.</p>

              <div className="space-y-3">
                {[
                  { value: 'sleep' as const, label: '🌙 Sleep Quality', description: 'Master circadian rhythm and deep sleep' },
                  { value: 'cardio' as const, label: '❤️ Cardiovascular Health', description: 'Build aerobic capacity and VO₂ max' },
                  { value: 'recovery' as const, label: '🛀 Recovery & Regeneration', description: 'Saunas, cold plunges, red light therapy' },
                  { value: 'supplements' as const, label: '💊 Supplement Stack', description: 'Evidence-based supplements and protocols' },
                  { value: 'overall' as const, label: '🎯 Complete Longevity Plan', description: 'Balanced approach across all areas' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleGoal(option.value)}
                    className="w-full text-left px-6 py-4 bg-surface border border-border rounded-lg hover:border-green/30 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-display text-lg text-ink group-hover:text-green transition-colors">{option.label}</h3>
                        <p className="text-muted text-sm mt-1">{option.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted group-hover:text-green transition-colors shrink-0 mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Experience Level */}
        {step === 'level' && (
          <AnimatedSection>
            <div className="mb-12">
              <h2 className="font-display text-3xl text-ink mb-2">What&apos;s Your Experience Level?</h2>
              <p className="text-muted mb-8">This helps us customize depth and complexity.</p>

              <div className="space-y-3">
                {[
                  { value: 'beginner' as const, label: 'Beginner', description: 'New to longevity protocols, want foundational guidance' },
                  { value: 'intermediate' as const, label: 'Intermediate', description: 'Familiar with fitness/supplements, looking to optimize' },
                  { value: 'advanced' as const, label: 'Advanced', description: 'Deep knowledge, optimizing biometrics, tracking metrics' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleLevel(option.value)}
                    className="w-full text-left px-6 py-4 bg-surface border border-border rounded-lg hover:border-green/30 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display text-lg text-ink group-hover:text-green transition-colors">{option.label}</h3>
                        <p className="text-muted text-sm mt-1">{option.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted group-hover:text-green transition-colors shrink-0 mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Budget Selection */}
        {step === 'budget' && (
          <AnimatedSection>
            <div className="mb-12">
              <h2 className="font-display text-3xl text-ink mb-2">What&apos;s Your Budget?</h2>
              <p className="text-muted mb-8">We&apos;ll recommend options that fit your spending comfort.</p>

              <div className="space-y-3">
                {[
                  { value: 'budget' as const, label: 'Budget-Conscious', description: 'Free and low-cost options, DIY solutions' },
                  { value: 'balanced' as const, label: 'Balanced', description: 'Core investments in tools, supplements, wearables ($500–$2k)' },
                  { value: 'unlimited' as const, label: 'Premium', description: 'Best-in-class everything (wearables, devices, professional services)' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleBudget(option.value)}
                    className="w-full text-left px-6 py-4 bg-surface border border-border rounded-lg hover:border-green/30 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display text-lg text-ink group-hover:text-green transition-colors">{option.label}</h3>
                        <p className="text-muted text-sm mt-1">{option.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted group-hover:text-green transition-colors shrink-0 mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Results */}
        {step === 'results' && (
          <AnimatedSection>
            <div className="mb-12 text-center">
              <div className="w-16 h-16 rounded-full bg-green/10 border border-green/25 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-bright" />
              </div>
              <h1 className="font-display text-4xl text-ink mb-4">Your Personalized Path</h1>
              <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">
                Based on your answers, here are the protocols and tools we recommend for you.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-12">
              {getRecommendations().map((rec, i) => (
                <Link
                  key={i}
                  href={rec.href}
                  className={`block px-6 py-6 border rounded-lg hover:shadow-md transition-all cursor-pointer group ${rec.color}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{rec.icon}</span>
                        <h3 className="font-display text-lg text-ink group-hover:text-green transition-colors">{rec.title}</h3>
                      </div>
                      <p className="text-muted text-sm">{rec.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted group-hover:text-green transition-colors shrink-0 mt-1" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={reset}
                className="px-6 py-3 border border-border rounded-lg font-semibold text-ink hover:border-green/30 transition-colors cursor-pointer">
                Retake Quiz
              </button>
              <Link
                href="/database"
                className="px-6 py-3 bg-green text-white rounded-lg font-semibold hover:bg-green-bright transition-colors cursor-pointer">
                Browse All Products →
              </Link>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  )
}
