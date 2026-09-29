/**
 * StoreCartel ledger: NO GSC pages file exists for storecartel.com yet, so per Job M step 2 every page is `keep`.
 * The brief's proposed merges and cuts are listed in sites/storecartel/LEDGER_REVIEW.md for the orchestrator, not applied.
 */
export const STATIC_PAGES: { url: string; reason: string; kind: string }[] = [
  { url: "/", reason: "home; rebuilt in the design step", kind: "static" },
  { url: "/reviews/", reason: "hub", kind: "static" },
  { url: "/guides/", reason: "hub", kind: "static" },
  { url: "/best/", reason: "hub", kind: "static" },
  { url: "/compare/", reason: "compare matrix, ported as an island", kind: "static" },
  { url: "/about/", reason: "rewrite: editorial name, method note, no personal name", kind: "static" },
  { url: "/contact/", reason: "static page, keep", kind: "static" },
  { url: "/affiliate-disclosure/", reason: "static page, keep", kind: "static" },
  { url: "/privacy/", reason: "static page, keep", kind: "static" },
  { url: "/terms/", reason: "static page, keep", kind: "static" },
  { url: "/sitemap/", reason: "HTML sitemap page, live URL preserved", kind: "static" },
  { url: "/shopify-app-cost-calculator/", reason: "NEW link-earning asset, built from data/storecartel/shopify-app-costs (not in the old sitemap)", kind: "new" },
];
