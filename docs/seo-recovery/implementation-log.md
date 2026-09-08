# TheLongevityIntel implementation log

## Completed locally

- Added a reusable static export SEO audit at `scripts/seo-recovery-audit.mjs`.
- Added `npm run seo:audit` to the project scripts.
- Added route-specific canonical metadata for core hubs and comparison pages.
- Added a database layout canonical for the client-rendered database hub.
- Corrected sitemap detail URLs to use the reachable supplement detail route set instead of product IDs that have no generated detail pages.
- Added generated URL inventory, claims audit, and validation report artifacts.
- Removed automatic medical-review attribution; badges now require an explicit verified reviewer and review date.
- Replaced unverified named contributor profiles with an editorial-team attribution pending owner evidence.
- Removed unsupported shared study/subscriber counters and physician-review marketing copy.
- Repaired source text encoding corruption and converted the one legacy Windows-1252 MDX file to UTF-8.
- Replaced known editorial links to dead product-ID pages with substantive article or canonical supplement destinations.
- Refreshed `/compare/nmn-vs-nr` and `/diagnostics/hrv-guide` as the first controlled evidence pilot.
- Added real article modified-date support; sitemap entries no longer claim every build is a content update.
- Added provisional baseline, redirect decisions, competitor gaps, content decisions, and owner evidence queue.
- Updated the WHOOP-versus-Oura comparison from retired hardware and an undocumented first-person test to current 2026 products, official pricing/specifications, generation-labeled validation studies, funding disclosures, and explicit non-diagnostic limits.
- Rebuilt the fitness-tracker roundup around current WHOOP, Oura, Garmin, and Fitbit products; removed invented participant, measurement, correlation, purchase, and independence claims; and added a dated source record plus consumer-wearable limitations.
- Rebuilt the legacy WHOOP review around WHOOP 5 and MG documentation; removed the unverified 12-month test and fabricated comparison results, labeled validation by device generation, and retained the canonical URL.

## Deployment gate

The build and technical audit pass locally. Medical, credential, evidence-volume, and first-person testing claims remain flagged until source records, author credentials, and testing disclosures are verified. Production deployment is not approved by this artifact alone.
