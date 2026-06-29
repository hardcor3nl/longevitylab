import { AnimatedSection } from '@/components/AnimatedSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How LongevityLab collects, uses, and protects your personal data.',
}

export default function PrivacyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, such as when you subscribe to our newsletter, contact us, or interact with our content.

**Information you provide:**
- Email address (when subscribing to our newsletter)
- Name (optional, if provided)
- Any information you include in messages sent to us

**Information collected automatically:**
- Usage data (pages visited, time spent, referring URLs)
- Device information (browser type, operating system, screen resolution)
- IP address (anonymised)
- Cookie data (see Cookie Policy below)`
    },
    {
      title: 'How We Use Your Information',
      content: `We use the information we collect to:
- Send our weekly longevity newsletter (only if you subscribed)
- Respond to your questions and comments
- Improve our content and user experience
- Analyse traffic patterns to understand what content is most useful
- Comply with legal obligations

We do not sell your personal information to third parties.`
    },
    {
      title: 'Affiliate Links & Tracking',
      content: `LongevityLab participates in affiliate programmes including Amazon Associates and direct brand partnerships. When you click an affiliate link, the merchant may set a cookie to track the referral.

**What this means for you:**
- Clicking our affiliate links may result in a tracking cookie being set by the merchant
- We earn a commission if you make a purchase — at no extra cost to you
- This commission funding enables us to continue independent research and testing
- Our editorial recommendations are never influenced by commission rates

We disclose all affiliate relationships clearly on every page that contains them.`
    },
    {
      title: 'Cookies',
      content: `We use cookies to improve your experience on LongevityLab.

**Types of cookies we use:**
- **Essential cookies:** Required for the site to function (e.g., theme preference)
- **Analytics cookies:** We use privacy-respecting analytics to understand traffic patterns (no personal identification)
- **Affiliate cookies:** Set by third-party merchants when you click affiliate links

**Your choices:**
You can control cookies through your browser settings. Disabling cookies may affect some site functionality (e.g., dark/light mode preference will not persist).`
    },
    {
      title: 'Third-Party Services',
      content: `We use the following third-party services:
- **Vercel:** Website hosting and performance analytics
- **Google Fonts:** Typography (Instrument Serif, DM Sans, DM Mono)
- **Unsplash:** Stock photography
- **Amazon Associates:** Affiliate programme
- **Beehiiv (planned):** Email newsletter management

Each service has its own privacy policy governing their data use.`
    },
    {
      title: 'Data Retention',
      content: `We retain newsletter subscriber data for as long as you remain subscribed. You can unsubscribe at any time using the link in any newsletter email, and your data will be deleted within 30 days.

Analytics data is retained in anonymised, aggregated form for up to 24 months.`
    },
    {
      title: 'Your Rights',
      content: `Depending on your location, you may have the right to:
- Access the personal data we hold about you
- Request correction of inaccurate data
- Request deletion of your data
- Object to processing of your data
- Data portability

To exercise any of these rights, contact us at privacy@longevitylab.co`
    },
    {
      title: 'Medical Disclaimer',
      content: `The content on LongevityLab is for informational and educational purposes only. It does not constitute medical advice and should not be used as a substitute for professional medical consultation, diagnosis, or treatment.

Always seek the advice of your physician or qualified healthcare provider with any questions you may have regarding a medical condition or health supplements.`
    },
    {
      title: 'Changes to This Policy',
      content: `We may update this privacy policy from time to time. The date of the most recent revision appears at the bottom of this page. We encourage you to review this policy periodically.`
    },
  ]

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-3">Legal</p>
          <h1 className="font-display text-5xl text-ink mb-4">Privacy Policy</h1>
          <p className="text-muted leading-relaxed">Last updated: January 2025</p>
          <p className="text-muted leading-relaxed mt-3">
            LongevityLab (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy.
            This policy explains how we collect, use, and safeguard your information when you visit thelongevityintel.com.
          </p>
        </AnimatedSection>

        <div className="space-y-10">
          {sections.map((section, i) => (
            <AnimatedSection key={section.title} delay={i * 0.04}>
              <div className="bg-surface border border-border rounded-2xl p-6">
                <h2 className="font-display text-2xl text-ink mb-4">{section.title}</h2>
                <div className="text-muted text-sm leading-relaxed space-y-3">
                  {section.content.split('\n\n').map((para, j) => (
                    <p key={j} className={para.startsWith('**') ? 'font-medium text-ink' : ''}>
                      {para.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </p>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.4} className="mt-10 bg-amber/5 border border-amber/20 rounded-2xl p-5">
          <p className="text-sm text-muted">
            <strong className="text-ink">Questions?</strong> Contact us at{' '}
            <a href="mailto:privacy@longevitylab.co" className="text-green-bright hover:text-green transition-colors">
              privacy@longevitylab.co
            </a>
          </p>
        </AnimatedSection>
      </div>
    </div>
  )
}
