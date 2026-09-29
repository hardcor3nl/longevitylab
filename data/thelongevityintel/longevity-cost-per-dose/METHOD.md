# Method: longevity-cost-per-dose

Compiled 2026-09-28. 12 compounds, 35 products (22 with a computed cost). Re-check quarterly (next: 2026-12-28), or sooner if a price moves.

**This is not dosing advice.** Doses are quoted only as "dose used in <study>" from the cited PubMed record. Nothing here says a dose is safe, effective or right for anyone; several studies were in patients (e.g. Q-SYMBIO, heart failure). Talk to a doctor or pharmacist before supplementing.

## Study doses
Found by PubMed E-utilities search; title, year and dose text read from the PubMed abstract record (each record links PubMed and DOI). Where the abstract did not state the dose, that study was not used (creatine ISSN position stand, Avgerinos 2018, Knapen 2013, Martens 2018 NR and MMFS-01 were dropped for this reason). Full texts were not reachable (PMC and Europe PMC blocked or bot-checked), so doses are limited to what abstracts state.

## Products
Price, count, active amount and testing come from the brand's own product page on the checked date (2026-09-28), in USD, as displayed for a US visitor (no coupons or subscription discounts; Momentous also shows a lower per-serving price that was ignored). Amazon and other major retailers were not used: their pages did not give readable data. Thorne prices were read from the visible page price, not its structured data (which showed a placeholder $44 on every product). Testing statements are quoted as the page states them; a generic "third-party tested" claim without a named certifier is not counted as certification. Facility certification (e.g. "NSF Certified facility") is not product certification.

## Derived: cost per study dose per month
`cost = price / servings x (study dose / active per serving) x 30`, using the first study listed for the compound (basis recorded in `costBasisDose`), same units on both sides (g converted to mg where needed), no shipping, tax or discounts, no rounding beyond cents. Cases: Thorne Glycine uses capsule count (see GAPS). Omega-3 uses the EPA+DHA amount, not oil weight: VITAL's 1 g/day Omacor capsule held 840 mg EPA+DHA (460 EPA + 380 DHA), read from the trial's principal-results paper (PMC7089819), and product cost divides that 840 mg by the label's EPA+DHA per serving. Taurine uses the lower bound (1.5 g) of the review's 1.5-3.0 g range; double it for 3 g. Currency stays USD; no conversions.

## Caveats
- NR, NMN and CoQ10 study doses are much larger than one label serving, so monthly cost is high; forms differ (Q-SYMBIO used ubiquinone; two products here are ubiquinol/liposomal).
- Spermidine study product was a wheat-germ extract at 0.9 mg/day; the retail products list a salt weight. No cost computed.
- Sample is a convenience sample of brands whose pages could be read, not a market ranking. Fewer than the 3-5 target products per compound in several rows.
