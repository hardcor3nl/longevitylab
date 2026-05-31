'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, RotateCcw, CheckCircle2, AlertCircle, Brain, Heart, Zap, Moon, Apple } from 'lucide-react'

interface Question {
  id: string
  category: string
  icon: React.ElementType
  text: string
  options: { label: string; value: number; description?: string }[]
}

const questions: Question[] = [
  // Sleep
  { id: 'sleep_hours', category: 'Sleep', icon: Moon, text: 'How many hours of sleep do you get on average per night?', options: [{ label: '< 5 hours', value: -8 }, { label: '5–6 hours', value: -4 }, { label: '7–8 hours', value: 4 }, { label: '> 9 hours', value: 1 }] },
  { id: 'sleep_quality', category: 'Sleep', icon: Moon, text: 'How would you rate your sleep quality?', options: [{ label: 'Poor — wake often', value: -5 }, { label: 'Fair — some disruption', value: -2 }, { label: 'Good — mostly rested', value: 2 }, { label: 'Excellent — deep & consistent', value: 5 }] },
  // Exercise
  { id: 'exercise_freq', category: 'Exercise', icon: Zap, text: 'How often do you do structured exercise per week?', options: [{ label: 'Rarely / never', value: -8 }, { label: '1–2 times', value: -2 }, { label: '3–4 times', value: 5 }, { label: '5+ times', value: 4 }] },
  { id: 'strength_train', category: 'Exercise', icon: Zap, text: 'Do you include resistance/strength training?', options: [{ label: 'Never', value: -4 }, { label: 'Occasionally', value: 0 }, { label: 'Weekly', value: 3 }, { label: '2–3x per week', value: 5 }] },
  // Nutrition
  { id: 'diet_quality', category: 'Nutrition', icon: Apple, text: 'How would you describe your diet?', options: [{ label: 'Mostly processed foods', value: -8 }, { label: 'Mixed — some healthy choices', value: -2 }, { label: 'Mostly whole foods', value: 4 }, { label: 'Strictly whole foods, Mediterranean-style', value: 7 }] },
  { id: 'sugar', category: 'Nutrition', icon: Apple, text: 'How much added sugar do you consume daily?', options: [{ label: 'High (sodas, sweets daily)', value: -6 }, { label: 'Moderate (occasional)', value: -2 }, { label: 'Low (rarely)', value: 3 }, { label: 'Almost none', value: 5 }] },
  // Stress & Mental
  { id: 'stress', category: 'Mental Health', icon: Brain, text: 'How would you rate your chronic stress levels?', options: [{ label: 'Very high — constant pressure', value: -8 }, { label: 'High — most days stressful', value: -4 }, { label: 'Moderate — manageable', value: 1 }, { label: 'Low — generally calm', value: 5 }] },
  { id: 'meditation', category: 'Mental Health', icon: Brain, text: 'Do you practice mindfulness, meditation, or breathwork?', options: [{ label: 'Never', value: -1 }, { label: 'Occasionally', value: 1 }, { label: 'Weekly', value: 3 }, { label: 'Daily practice', value: 5 }] },
  // Biomarkers
  { id: 'last_bloodwork', category: 'Biomarkers', icon: Heart, text: 'When did you last have comprehensive bloodwork?', options: [{ label: 'Never or > 3 years', value: -5 }, { label: '1–3 years ago', value: -1 }, { label: 'Within the last year', value: 3 }, { label: 'Within the last 6 months', value: 5 }] },
  { id: 'supplements', category: 'Biomarkers', icon: Heart, text: 'Do you take evidence-based longevity supplements?', options: [{ label: 'None', value: -2 }, { label: '1–2 basics (Vitamin D, Omega-3)', value: 2 }, { label: '3–5 targeted supplements', value: 4 }, { label: '6+ with regular review', value: 6 }] },
]

const CATEGORIES = ['Sleep', 'Exercise', 'Nutrition', 'Mental Health', 'Biomarkers']

interface Recommendation {
  title: string
  description: string
  href: string
  label: string
}

function getRecommendations(answers: Record<string, number>): Recommendation[] {
  const recs: Recommendation[] = []
  if ((answers.sleep_hours ?? 0) < 0 || (answers.sleep_quality ?? 0) < 0) {
    recs.push({ title: 'Prioritise Sleep Quality', description: 'Magnesium glycinate and ashwagandha have strong RCT evidence for improving sleep onset and quality.', href: '/database/magnesium', label: 'View Magnesium' })
  }
  if ((answers.exercise_freq ?? 0) < 0 || (answers.strength_train ?? 0) < 0) {
    recs.push({ title: 'Add Resistance Training', description: 'Creatine monohydrate is the most evidence-backed supplement for supporting muscle health and cognitive function.', href: '/database/creatine', label: 'View Creatine' })
  }
  if ((answers.diet_quality ?? 0) < 0 || (answers.sugar ?? 0) < 0) {
    recs.push({ title: 'Reduce Metabolic Age', description: 'Berberine activates AMPK and improves insulin sensitivity — often called nature\'s metformin.', href: '/database/berberine', label: 'View Berberine' })
  }
  if ((answers.stress ?? 0) < 0) {
    recs.push({ title: 'Lower Chronic Stress', description: 'Ashwagandha (KSM-66) has strong evidence for cortisol reduction and HPA axis regulation.', href: '/database/ashwagandha', label: 'View Ashwagandha' })
  }
  recs.push({ title: 'Boost NAD+ Levels', description: 'NMN supplementation is one of the most researched longevity interventions for restoring declining NAD+ with age.', href: '/database/nmn', label: 'View NMN' })
  if ((answers.last_bloodwork ?? 0) < 0) {
    recs.push({ title: 'Get Baseline Bloodwork', description: 'Knowing your vitamin D, omega-3 index, and metabolic markers is the foundation of evidence-based longevity.', href: '/category/diagnostics', label: 'View Diagnostics' })
  }
  return recs.slice(0, 4)
}

function calculateBioAge(chronoAge: number, score: number): number {
  const maxScore = questions.reduce((sum, q) => sum + Math.max(...q.options.map(o => o.value)), 0)
  const minScore = questions.reduce((sum, q) => sum + Math.min(...q.options.map(o => o.value)), 0)
  const normalised = (score - minScore) / (maxScore - minScore)
  const delta = Math.round((0.5 - normalised) * 16)
  return Math.max(18, chronoAge + delta)
}

export default function QuizPage() {
  const [step, setStep] = useState<'intro' | 'age' | 'questions' | 'results'>('intro')
  const [chronoAge, setChronoAge] = useState('')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [selected, setSelected] = useState<number | null>(null)

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0)
  const bioAge = calculateBioAge(parseInt(chronoAge) || 35, totalScore)
  const ageDelta = bioAge - (parseInt(chronoAge) || 35)
  const currentQuestion = questions[currentQ]
  const progress = ((currentQ) / questions.length) * 100
  const categoryProgress = CATEGORIES.map(cat => ({
    name: cat,
    done: questions.filter(q => q.category === cat && answers[q.id] !== undefined).length,
    total: questions.filter(q => q.category === cat).length,
  }))

  const handleAnswer = (value: number) => {
    setSelected(value)
    setTimeout(() => {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))
      if (currentQ < questions.length - 1) {
        setCurrentQ(prev => prev + 1)
        setSelected(null)
      } else {
        setStep('results')
      }
    }, 300)
  }

  const reset = () => {
    setStep('intro'); setCurrentQ(0); setAnswers({}); setSelected(null); setChronoAge('')
  }

  return (
    <div className="min-h-screen pt-24 pb-24 flex items-start justify-center">
      <div className="w-full max-w-2xl mx-auto px-4">
        <AnimatePresence mode="wait">

          {/* INTRO */}
          {step === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="text-center pt-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green/10 border border-green/20 mb-6">
                <Brain className="w-8 h-8 text-green-bright" />
              </div>
              <h1 className="font-display text-5xl text-ink mb-4">Biological Age Quiz</h1>
              <p className="text-muted text-lg leading-relaxed mb-8 max-w-md mx-auto">
                Answer 10 science-backed questions about your lifestyle and get your estimated biological age — plus personalised supplement recommendations.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-10 text-center">
                {[['10', 'Questions'], ['2 min', 'Duration'], ['Free', 'No sign-up']].map(([val, label]) => (
                  <div key={label} className="bg-surface border border-border rounded-xl p-4">
                    <div className="font-display text-2xl text-ink">{val}</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted mt-1">{label}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep('age')}
                className="flex items-center gap-2 mx-auto px-8 py-4 bg-green text-white rounded-xl font-semibold text-base hover:bg-green-bright transition-colors cursor-pointer shadow-lg shadow-green/20">
                Start Quiz <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* AGE INPUT */}
          {step === 'age' && (
            <motion.div key="age" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="text-center pt-12">
              <h2 className="font-display text-4xl text-ink mb-3">What is your age?</h2>
              <p className="text-muted mb-8">Used only to calculate your biological age delta.</p>
              <input
                type="number"
                min="16" max="100"
                value={chronoAge}
                onChange={e => setChronoAge(e.target.value)}
                placeholder="e.g. 38"
                className="w-40 text-center text-3xl font-display bg-surface border-2 border-border focus:border-green rounded-2xl px-6 py-4 text-ink outline-none transition-colors mx-auto block mb-8"
              />
              <button
                onClick={() => { if (chronoAge && parseInt(chronoAge) > 0) { setStep('questions') } }}
                disabled={!chronoAge || parseInt(chronoAge) <= 0}
                className="flex items-center gap-2 mx-auto px-8 py-4 bg-green text-white rounded-xl font-semibold text-base hover:bg-green-bright transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-green/20">
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* QUESTIONS */}
          {step === 'questions' && currentQuestion && (
            <motion.div key={`q-${currentQ}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-sm text-muted mb-2">
                  <span className="font-mono text-xs uppercase tracking-widest">{currentQuestion.category}</span>
                  <span>{currentQ + 1} / {questions.length}</span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <motion.div className="h-full bg-green-bright rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center">
                    <currentQuestion.icon className="w-5 h-5 text-green-bright" />
                  </div>
                  <h2 className="font-display text-2xl text-ink leading-tight">{currentQuestion.text}</h2>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((opt) => (
                  <motion.button
                    key={opt.label}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswer(opt.value)}
                    className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center justify-between ${
                      selected === opt.value
                        ? 'bg-green border-green text-white'
                        : 'bg-surface border-border text-ink hover:border-green/40 hover:bg-surface'
                    }`}
                  >
                    <span className="font-medium">{opt.label}</span>
                    {selected === opt.value && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  </motion.button>
                ))}
              </div>

              {currentQ > 0 && (
                <button onClick={() => { setCurrentQ(p => p - 1); setSelected(null) }}
                  className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors cursor-pointer">
                  <ArrowLeft className="w-3.5 h-3.5" /> Previous
                </button>
              )}
            </motion.div>
          )}

          {/* RESULTS */}
          {step === 'results' && (
            <motion.div key="results" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="pt-6">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-green/10 border border-green/20 text-green-bright px-3 py-1.5 rounded-full font-mono text-xs uppercase tracking-widest mb-4">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Results ready
                </div>
                <h2 className="font-display text-5xl text-ink mb-3">Your Biological Age</h2>

                {/* Big age display */}
                <div className="inline-flex flex-col items-center bg-surface border-2 border-border rounded-3xl px-12 py-8 mb-4">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display text-[80px] leading-none text-ink"
                  >
                    {bioAge}
                  </motion.div>
                  <div className={`flex items-center gap-1.5 font-mono text-sm mt-2 ${ageDelta > 0 ? 'text-amber' : 'text-green-bright'}`}>
                    {ageDelta > 0 ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    {ageDelta === 0 ? 'Equal to your chronological age' : ageDelta > 0 ? `${ageDelta} years older than your age` : `${Math.abs(ageDelta)} years younger than your age`}
                  </div>
                </div>

                <p className="text-muted text-sm max-w-sm mx-auto">
                  Based on {questions.length} lifestyle factors. This is an estimate — get bloodwork for precision.
                </p>
              </div>

              {/* Category breakdown */}
              <div className="bg-surface border border-border rounded-2xl p-5 mb-8">
                <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Category Breakdown</h3>
                <div className="space-y-3">
                  {categoryProgress.map(cat => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <span className="text-sm text-ink">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-green-bright rounded-full" style={{ width: `${(cat.done / cat.total) * 100}%` }} />
                        </div>
                        <span className="font-mono text-xs text-muted">{cat.done}/{cat.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="mb-8">
                <h3 className="font-display text-2xl text-ink mb-4">Your Personalised Stack</h3>
                <div className="space-y-3">
                  {getRecommendations(answers).map(rec => (
                    <div key={rec.title} className="bg-surface border border-border rounded-2xl p-4 flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-green/10 border border-green/20 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-green-bright" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-ink text-sm mb-0.5">{rec.title}</p>
                        <p className="text-muted text-sm leading-relaxed">{rec.description}</p>
                      </div>
                      <Link href={rec.href} className="shrink-0 text-xs font-medium text-green-bright hover:text-green border border-green/30 px-2.5 py-1 rounded-lg hover:bg-green/5 transition-colors cursor-pointer whitespace-nowrap">
                        {rec.label}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/database" className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-green text-white rounded-xl font-semibold hover:bg-green-bright transition-colors cursor-pointer">
                  Explore Supplement Database <ArrowRight className="w-4 h-4" />
                </Link>
                <button onClick={reset} className="flex items-center justify-center gap-2 px-5 py-3 bg-surface border border-border text-ink rounded-xl font-semibold hover:border-green/40 transition-colors cursor-pointer">
                  <RotateCcw className="w-4 h-4" /> Retake Quiz
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
