'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, RotateCcw, CheckCircle2, Brain, Zap, Moon, Apple } from 'lucide-react'

interface Question {
  id: string
  category: string
  icon: React.ElementType
  text: string
  options: { label: string; description?: string }[]
}

const questions: Question[] = [
  { id: 'sleep_hours', category: 'Sleep', icon: Moon, text: 'How many hours of sleep do you get on average per night?', options: [{ label: '< 5 hours' }, { label: '5–6 hours' }, { label: '7–8 hours' }, { label: '> 9 hours' }] },
  { id: 'sleep_quality', category: 'Sleep', icon: Moon, text: 'How would you rate your sleep quality?', options: [{ label: 'Poor, wake often' }, { label: 'Fair, some disruption' }, { label: 'Good, mostly rested' }, { label: 'Excellent, deep & consistent' }] },
  { id: 'exercise_freq', category: 'Exercise', icon: Zap, text: 'How often do you do structured exercise per week?', options: [{ label: 'Rarely / never' }, { label: '1–2 times' }, { label: '3–4 times' }, { label: '5+ times' }] },
  { id: 'strength_train', category: 'Exercise', icon: Zap, text: 'Do you include resistance/strength training?', options: [{ label: 'Never' }, { label: 'Occasionally' }, { label: 'Weekly' }, { label: '2–3x per week' }] },
  { id: 'diet_quality', category: 'Nutrition', icon: Apple, text: 'How would you describe your diet?', options: [{ label: 'Mostly processed foods' }, { label: 'Mixed: some healthy choices' }, { label: 'Mostly whole foods' }, { label: 'Strictly whole foods, Mediterranean-style' }] },
  { id: 'sugar', category: 'Nutrition', icon: Apple, text: 'How much added sugar do you consume daily?', options: [{ label: 'High (sodas, sweets daily)' }, { label: 'Moderate (occasional)' }, { label: 'Low (rarely)' }, { label: 'Almost none' }] },
  { id: 'stress', category: 'Stress', icon: Brain, text: 'How would you rate your day-to-day stress?', options: [{ label: 'Very high, constant pressure' }, { label: 'High, most days stressful' }, { label: 'Moderate, manageable' }, { label: 'Low, generally calm' }] },
  { id: 'meditation', category: 'Stress', icon: Brain, text: 'Do you practice mindfulness, meditation, or breathwork?', options: [{ label: 'Never' }, { label: 'Occasionally' }, { label: 'Weekly' }, { label: 'Daily practice' }] },
]

export default function QuizPage() {
  const [step, setStep] = useState<'intro' | 'questions' | 'results'>('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<string | null>(null)

  const currentQuestion = questions[currentQ]
  const progress = ((currentQ + 1) / questions.length) * 100

  const handleAnswer = (label: string) => {
    setSelected(label)
    setTimeout(() => {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: label }))
      if (currentQ < questions.length - 1) {
        setCurrentQ(prev => prev + 1)
        setSelected(null)
      } else {
        setStep('results')
      }
    }, 250)
  }

  const reset = () => {
    setStep('intro'); setCurrentQ(0); setAnswers({}); setSelected(null)
  }

  return (
    <div className="min-h-screen pt-24 pb-24 flex items-start justify-center">
      <div className="w-full max-w-2xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="text-center pt-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green/10 border border-green/20 mb-6">
                <Brain className="w-8 h-8 text-green-bright" />
              </div>
              <h1 className="font-display text-5xl text-ink mb-4">Health Habits Reflection</h1>
              <p className="text-muted text-lg leading-relaxed mb-8 max-w-md mx-auto">
                Answer eight questions about sleep, movement, food and stress, then review your selections. This reflection does not calculate biological age, diagnose a condition, or recommend supplements.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-10 text-center">
                {[['8', 'Questions'], ['No score', 'No age estimate'], ['Free', 'No sign-up']].map(([val, label]) => (
                  <div key={label} className="bg-surface border border-border rounded-xl p-4">
                    <div className="font-display text-2xl text-ink">{val}</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted mt-1">{label}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep('questions')}
                className="flex items-center gap-2 mx-auto px-8 py-4 bg-green text-white rounded-xl font-semibold text-base hover:bg-green-bright transition-colors cursor-pointer shadow-lg shadow-green/20">
                Start reflection <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 'questions' && currentQuestion && (
            <motion.div key={`q-${currentQ}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <div className="mb-8">
                <div className="flex items-center justify-between text-sm text-muted mb-2">
                  <span className="font-mono text-xs uppercase tracking-widest">{currentQuestion.category}</span>
                  <span>{currentQ + 1} / {questions.length}</span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <motion.div className="h-full bg-green-bright rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center">
                    <currentQuestion.icon className="w-5 h-5 text-green-bright" />
                  </div>
                  <h2 className="font-display text-2xl text-ink leading-tight">{currentQuestion.text}</h2>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((opt) => (
                  <motion.button
                    key={opt.label}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswer(opt.label)}
                    className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center justify-between ${
                      selected === opt.label
                        ? 'bg-green border-green text-white'
                        : 'bg-surface border-border text-ink hover:border-green/40 hover:bg-surface'
                    }`}
                  >
                    <span className="font-medium">{opt.label}</span>
                    {selected === opt.label && <CheckCircle2 className="w-4 h-4 shrink-0" />}
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

          {step === 'results' && (
            <motion.div key="results" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="pt-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-green/10 border border-green/20 text-green-bright px-3 py-1.5 rounded-full font-mono text-xs uppercase tracking-widest mb-4">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Reflection ready
                </div>
                <h2 className="font-display text-4xl sm:text-5xl text-ink mb-3">Your selected answers</h2>
                <p className="text-muted text-sm max-w-lg mx-auto">This is a summary of what you chose. No score or age estimate is calculated.</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 mb-8">
                {questions.map((question) => (
                  <article key={question.id} className="bg-surface border border-border rounded-2xl p-5">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-green-bright mb-2">{question.category}</p>
                    <h3 className="font-semibold text-ink text-sm leading-relaxed mb-3">{question.text}</h3>
                    <p className="text-muted text-sm">{answers[question.id]}</p>
                  </article>
                ))}
              </div>

              <div className="bg-surface border border-border rounded-2xl p-5 mb-8">
                <h3 className="font-semibold text-ink mb-2">What this reflection can tell you</h3>
                <p className="text-muted text-sm leading-relaxed">It can help you review the habits you reported. It cannot measure biological age, diagnose a health condition, predict disease, or tell you what treatment or supplement to use. Speak with a qualified clinician about personal health concerns.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/how-we-research/" className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-green text-white rounded-xl font-semibold hover:bg-green-bright transition-colors cursor-pointer">
                  How we research <ArrowRight className="w-4 h-4" />
                </Link>
                <button onClick={reset} className="flex items-center justify-center gap-2 px-5 py-3 bg-surface border border-border text-ink rounded-xl font-semibold hover:border-green/40 transition-colors cursor-pointer">
                  <RotateCcw className="w-4 h-4" /> Start again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}