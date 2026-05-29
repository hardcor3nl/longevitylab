export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl text-ink mb-6">Editorial Policy</h1>
      <div className="prose prose-lg text-muted space-y-6">
        <p className="text-lg text-ink">LongevityLab publishes independent, science-backed reviews of longevity products, protocols, and diagnostics.</p>
        <h2 className="font-display text-2xl text-ink">Our Methodology</h2>
        <p>Every product we review is either purchased independently or tested for a minimum of 90 days before a verdict is issued. Our scoring system weighs mechanistic plausibility, human RCT evidence, safety profile, and effect size.</p>
        <h2 className="font-display text-2xl text-ink" id="affiliate">Affiliate Disclosure</h2>
        <p>LongevityLab participates in affiliate programs. When you click a link and purchase a product, we may earn a commission at no extra cost to you. This never influences our ratings or recommendations.</p>
        <h2 className="font-display text-2xl text-ink">Our Team</h2>
        <p>Our review team includes researchers, medical professionals, and biohackers with backgrounds in molecular biology, sports medicine, and nutrition science.</p>
      </div>
    </div>
  )
}
