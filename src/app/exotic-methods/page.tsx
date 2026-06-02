import { AnimatedSection } from '@/components/AnimatedSection'
import { ArrowLeft, AlertTriangle, Zap } from 'lucide-react'
import Link from 'next/link'

export default function ExoticMethodsProtocol() {
  return (
    <div className="pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_340px] gap-12">
          {/* Main Content */}
          <div>
            <AnimatedSection>
              <Link href="/protocols" className="inline-flex items-center gap-1.5 text-muted hover:text-ink text-sm mb-6 transition-colors cursor-pointer">
                <ArrowLeft className="w-3.5 h-3.5" /> All Protocols
              </Link>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <span className="inline-block font-mono text-[10px] uppercase tracking-wider border border-red-500/30 px-2.5 py-1 rounded-full bg-red-500/5 text-red-400 mb-3">Advanced Protocol</span>
                  <h1 className="font-display text-5xl text-ink mb-2">Exotic Biohacking Methods</h1>
                  <p className="text-muted max-w-2xl text-lg">Advanced interventions for longevity: psychedelics, peptides, IV therapies, and emerging technologies for the committed biohacker.</p>
                </div>
              </div>

              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 mb-8">
                <p className="text-sm text-ink">
                  <strong>Disclaimer:</strong> This section covers research-stage and legally complex interventions. Legality varies by region. Medical supervision is mandatory for most of these approaches. This is educational content, not medical advice.
                </p>
              </div>

              {/* Psilocybin */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Psilocybin: Treatment-Resistant Depression & Existential Anxiety</h2>
                <p className="text-muted mb-6">
                  Psilocybin shows promise in clinical trials for depression, end-of-life anxiety, and PTSD. Mechanism: serotonin receptor activation + neuroplasticity induction.
                </p>

                <div className="space-y-4">
                  {[
                    { protocol: 'Therapeutic Psilocybin (Clinical)', dose: '20–30 mg in supervised setting', legality: 'Legal in clinical trials (Johns Hopkins, MAPS, Imperial College)', duration: '1–3 sessions spaced 2–4 weeks apart', outcome: '50–70% remission in treatment-resistant depression. Single-dose effect persists 6+ months.' },
                    { protocol: 'Microdosing (Legal Grey Area)', dose: '0.1–0.3 g dried (~5–10 mg psilocybin)', frequency: '1–3 days on, 2–3 days off', legality: 'Decriminalized in Oregon, Denver, some Canadian cities. Illegal most places.', outcome: 'Improved mood, creativity, neuroplasticity. No tolerance buildup. Limited RCT data (mostly anecdotal).' },
                    { protocol: 'Retreat-Based (Legal in Some Jurisdictions)', location: 'Peru, Ecuador, Netherlands (legal psilocybin truffles)', dose: 'High-dose ceremony (15–30 mg) with guides', duration: '3–7 day retreat + integration', outcome: 'Profound meaning, reduced death anxiety, perspective shift. Anecdotal; limited research.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-5">
                      <h3 className="font-display text-lg text-ink mb-3">{item.protocol}</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Dose:</strong> <span className="text-muted">{item.dose}</span></p>
                        <p><strong>Legality:</strong> <span className="text-amber">{item.legality}</span></p>
                        {item.frequency && <p><strong>Frequency:</strong> <span className="text-muted">{item.frequency}</span></p>}
                        {item.duration && <p><strong>Duration:</strong> <span className="text-muted">{item.duration}</span></p>}
                        <p><strong>Outcome:</strong> <span className="text-muted">{item.outcome}</span></p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-amber/5 border border-amber/20 rounded-lg p-4 mt-6">
                  <p className="text-sm text-ink">
                    <strong>Safety:</strong> Not for active mania, schizophrenia family history, or HPPD (hallucinogen persisting perception disorder). Integration therapy is critical post-dose.
                  </p>
                </div>
              </div>

              {/* Ketamine */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Ketamine-Assisted Therapy: Rapid Antidepressant Effect</h2>
                <p className="text-muted mb-6">
                  Legal in clinical settings. Rapid dissociative effect breaks rumination cycles. Evidence strong for treatment-resistant depression.
                </p>

                <div className="bg-surface border border-border rounded-lg p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-ink mb-2">Clinical Ketamine-Assisted Psychotherapy (KAP)</p>
                      <p className="text-muted text-sm mb-2">Professional setting: 0.5–1 mg/kg IV or IM, 1–2 sessions/week for 4–6 weeks</p>
                      <p className="text-muted text-sm"><strong>Effect:</strong> Rapid antidepressant response (within hours); breaks rumination. 50–70% remission rate in treatment-resistant depression.</p>
                    </div>
                    <div className="border-t border-border pt-4">
                      <p className="text-sm font-semibold text-ink mb-2">Home-Use Ketamine (Prescribed, At-Home)</p>
                      <p className="text-muted text-sm mb-2">Nasal ketamine (Esketamine/Spravato): 2x/week + weekly therapy. Legal in some jurisdictions for TRD.</p>
                      <p className="text-muted text-sm"><strong>Cost:</strong> $2,000–$5,000/month therapy + medication</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted italic border-l-2 border-border pl-4 mt-6">
                  <strong>Legality:</strong> Legal only in supervised clinical settings. DIY ketamine is illegal and risky (purity unknown, addiction risk, inadequate integration).
                </p>
              </div>

              {/* NAD+ IV */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">NAD+ IV Therapy: Mitochondrial Restoration</h2>
                <p className="text-muted mb-6">
                  NAD+ (nicotinamide adenine dinucleotide) is a critical coenzyme for energy production. IV delivery bypasses absorption limits of oral supplements.
                </p>

                <div className="bg-surface border border-border rounded-lg p-6">
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-ink">NAD+ IV Protocol</p>
                      <p className="text-muted mt-1">Dose: 500–1000 mg IV infusion, 1–2x/month</p>
                      <p className="text-muted mt-1">Cost: $300–$800/infusion</p>
                      <p className="text-muted mt-1">Claims: Energy, cognitive clarity, athletic recovery, cellular repair</p>
                    </div>
                    <div className="border-t border-border pt-3">
                      <p className="text-muted"><strong>Evidence Quality:</strong> Oral NAD+ precursors (NMN, NR) have RCT support. IV NAD+ lacks RCT evidence; mostly clinician-reported.</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted italic border-l-2 border-border pl-4 mt-6">
                  <strong>Legality:</strong> Legal in US clinics. IV therapies require licensed medical practitioner. Verify clinic credentials.
                </p>
              </div>

              {/* Peptides */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Peptides: Emerging Frontier</h2>
                <p className="text-muted mb-6">
                  Synthetic peptides target specific signaling pathways. Research-stage; limited human data. Legal status varies.
                </p>

                <div className="space-y-4">
                  {[
                    { peptide: 'BPC-157 (Body Protective Compound)', mechanism: 'Gut healing, neuroprotection, systemic repair', route: 'Injectable or oral (limited absorption)', evidence: 'Strong animal data; minimal human studies; anecdotal reports of recovery acceleration', legality: 'Grey area (research chemical, not approved by FDA)' },
                    { peptide: 'Semax / Selank (Russian Neuropeptides)', mechanism: 'Cognitive enhancement, stress resilience, neuroprotection', route: 'Intranasal spray or injection', evidence: 'Used in Russia/CIS for decades; some human studies; Western adoption growing', legality: 'Legal in Russia, grey in US (research chemical)' },
                    { peptide: 'TB-500 / Thymosin Beta-4', mechanism: 'Tissue repair, wound healing, muscle recovery', route: 'Subcutaneous injection', evidence: 'Animal studies robust; human data sparse; anecdotal athlete use', legality: 'Banned in sport; research chemical status in US' },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="font-display text-lg text-ink">{item.peptide}</h3>
                      </div>
                      <div className="space-y-2 text-sm text-muted">
                        <p><strong>Mechanism:</strong> {item.mechanism}</p>
                        <p><strong>Route:</strong> {item.route}</p>
                        <p><strong>Evidence:</strong> {item.evidence}</p>
                        <p className="text-amber"><strong>Legality:</strong> {item.legality}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 mt-6">
                  <p className="text-sm text-ink">
                    <strong>Caution:</strong> Peptides purchased outside clinical settings often have unknown purity, sterility, or active content. Counterfeit peptides are common in grey markets.
                  </p>
                </div>
              </div>

              {/* Stem Cells / Exosomes */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Stem Cells & Exosomes: Frontier Medicine</h2>
                <p className="text-muted mb-6">
                  The most experimental approaches. High cost, limited regulation, promising early data but few long-term human studies.
                </p>

                <div className="space-y-4">
                  {[
                    { approach: 'Autologous Stem Cell Therapy', source: 'Your own bone marrow or adipose tissue', cost: '$15,000–$50,000+', claims: 'Tissue repair, joint recovery, systemic rejuvenation', evidence: 'Anecdotal athlete / biohacker use; limited RCT data; mechanism plausible but unproven in humans', regulation: 'Clinic-dependent; largely unregulated in US' },
                    { approach: 'Exosome Therapy', source: 'Mesenchymal stem cell-derived exosomes', cost: '$5,000–$15,000 per infusion', claims: 'Cellular signaling, immune modulation, tissue repair', evidence: 'Promising bench science; almost no human RCT data; mechanism speculative', regulation: 'FDA enforcement gray area; marketed as "research" or "wellness"' },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-5">
                      <h3 className="font-display text-lg text-ink mb-3">{item.approach}</h3>
                      <div className="space-y-2 text-sm text-muted">
                        <p><strong>Source:</strong> {item.source}</p>
                        <p><strong>Cost:</strong> {item.cost}</p>
                        <p><strong>Claims:</strong> {item.claims}</p>
                        <p><strong>Evidence:</strong> {item.evidence}</p>
                        <p className="text-amber"><strong>Regulation:</strong> {item.regulation}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 mt-6">
                  <p className="text-sm text-ink">
                    <strong>⚠️ Critical Warning:</strong> Many stem cell clinics make unsubstantiated claims. Beware of &quot;cure-all&quot; marketing. Ask for peer-reviewed publications, not anecdotes. Risk of infection, allergic reaction, or ineffective treatment is real.
                  </p>
                </div>
              </div>

              {/* Final Disclaimer */}
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-red-600 mb-2">Critical Disclaimer</p>
                    <p className="text-sm text-ink leading-relaxed">
                      This is educational content ONLY. Do not attempt any of these interventions without professional medical guidance. Psilocybin and ketamine are controlled substances in most jurisdictions. Peptides and stem cells lack regulatory approval. Serious risks include: legal consequences, medical complications, addiction, and death. Consult medical professionals—not biohacker forums—before pursuing ANY of these approaches.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-28 space-y-5">
              <div className="bg-surface border border-border rounded-lg p-5">
                <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Key Takeaway</h3>
                <p className="text-sm text-ink">
                  These methods are at the frontier. Evidence is limited, legality is complex, risk is real. Only for those who have optimized basics (sleep, exercise, nutrition) and seek expert medical supervision.
                </p>
              </div>

              <Link href="/stress-resilience"
                className="block w-full text-center px-4 py-3 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors cursor-pointer">
                ← Back to Stress Protocol
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
