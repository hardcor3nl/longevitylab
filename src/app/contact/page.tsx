'use client'
import { useState } from 'react'
import { AnimatedSection } from '@/components/AnimatedSection'
import { Mail, MessageSquare, Handshake, FlaskConical } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: 'general', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const reasons = [
    { icon: Handshake, title: 'Brand Partnerships', desc: 'Interested in working with LongevityLab? We work with brands that align with our editorial standards.', email: 'partnerships@longevitylab.co' },
    { icon: FlaskConical, title: 'Product Review Submissions', desc: 'Want your product considered for review? We purchase products independently but welcome submissions for consideration.', email: 'reviews@longevitylab.co' },
    { icon: MessageSquare, title: 'Editorial & Press', desc: 'Media enquiries, expert commentary, or corrections to published content.', email: 'editorial@longevitylab.co' },
  ]

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-14">
          <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-3">Get in Touch</p>
          <h1 className="font-display text-5xl text-ink mb-4">Contact Us</h1>
          <p className="text-muted text-lg max-w-xl leading-relaxed">
            Have a question about our reviews, a correction to report, or interested in working together? We read every message.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact form */}
          <AnimatedSection>
            {submitted ? (
              <div className="bg-green/5 border border-green/20 rounded-2xl p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-green-bright" />
                </div>
                <h3 className="font-display text-2xl text-ink mb-2">Message Sent!</h3>
                <p className="text-muted text-sm">We typically respond within 1–2 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="font-mono text-xs uppercase tracking-widest text-muted block mb-2">Name</label>
                  <input type="text" required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-green/40 transition-colors" placeholder="Your name" />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase tracking-widest text-muted block mb-2">Email</label>
                  <input type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-green/40 transition-colors" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase tracking-widest text-muted block mb-2">Subject</label>
                  <select value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-green/40 transition-colors cursor-pointer">
                    <option value="general">General Question</option>
                    <option value="review">Product Review</option>
                    <option value="partnership">Partnership</option>
                    <option value="correction">Content Correction</option>
                    <option value="press">Press / Media</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono text-xs uppercase tracking-widest text-muted block mb-2">Message</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-green/40 transition-colors resize-none" placeholder="How can we help?" />
                </div>
                <button type="submit" className="w-full py-3 bg-green text-white rounded-xl font-semibold text-sm hover:bg-green-bright transition-colors cursor-pointer">
                  Send Message
                </button>
              </form>
            )}
          </AnimatedSection>

          {/* Contact reasons */}
          <div className="space-y-4">
            {reasons.map(({ icon: Icon, title, desc, email }, i) => (
              <AnimatedSection key={title} delay={i * 0.1}>
                <div className="bg-surface border border-border rounded-2xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-green-bright" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-ink mb-1">{title}</h3>
                      <p className="text-muted text-sm leading-relaxed mb-2">{desc}</p>
                      <a href={`mailto:${email}`} className="font-mono text-xs text-green-bright hover:text-green transition-colors">{email}</a>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
