import { AnimatedSection } from '@/components/AnimatedSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for using Longevity Intel.',
}

export default function TermsPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-3">Legal</p>
          <h1 className="font-display text-5xl text-ink mb-4">Terms of Service</h1>
          <p className="text-muted">Last updated: January 2025</p>
        </AnimatedSection>

        <div className="space-y-8 text-muted leading-relaxed">
          {[
            {
              title: '1. Acceptance of Terms',
              body: 'By accessing and using Longevity Intel, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.'
            },
            {
              title: '2. Content and Information',
              body: 'All content on Longevity Intel is provided for informational and educational purposes only. We make no warranties about the accuracy, completeness, or suitability of any information. The content is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider before starting any supplement, diet, or health programme.'
            },
            {
              title: '3. Affiliate Relationships',
              body: 'Longevity Intel participates in affiliate marketing programmes. We earn commissions when you click our links and make purchases. These commissions fund our operations and independent research. Our editorial content is never influenced by affiliate relationships — we review products based solely on merit. All affiliate relationships are disclosed.'
            },
            {
              title: '4. Intellectual Property',
              body: 'All content on Longevity Intel — including text, images, graphics, and code — is the property of Longevity Intel and protected by copyright. You may share our content with attribution and a link back to the source. Commercial reproduction without permission is prohibited.'
            },
            {
              title: '5. Limitation of Liability',
              body: 'Longevity Intel is not liable for any damages arising from your use of, or inability to use, our website or content. We are not responsible for the accuracy or completeness of information on third-party sites linked from our pages. Health decisions made based on our content are your sole responsibility.'
            },
            {
              title: '6. User Conduct',
              body: 'You agree not to use Longevity Intel for any unlawful purpose, to attempt to access restricted areas of our systems, to scrape or harvest data without permission, or to misrepresent your identity or affiliation.'
            },
            {
              title: '7. Changes to Terms',
              body: 'We reserve the right to update these terms at any time. Continued use of the site after changes constitutes acceptance of the updated terms.'
            },
            {
              title: '8. Governing Law',
              body: 'These terms are governed by applicable law. Any disputes will be resolved through good-faith negotiation first, then through appropriate legal channels.'
            },
            {
              title: '9. Contact',
              body: 'For questions about these terms, contact us at legal@thelongevityintel.com'
            },
          ].map((section, i) => (
            <AnimatedSection key={section.title} delay={i * 0.03}>
              <div className="bg-surface border border-border rounded-2xl p-6">
                <h2 className="font-display text-xl text-ink mb-3">{section.title}</h2>
                <p className="text-sm">{section.body}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  )
}
