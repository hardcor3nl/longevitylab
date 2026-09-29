/** keep / merge / cut decisions for Vibe Coding Intel. Defaults from BRIEF.md, ruled on by the orchestrator in program/sites/vibecodingintel/LEDGER_RULING_2026-09-29.md (binding rule in program/gsc/README.md). */
export interface Decision { decision: "keep" | "merge" | "cut"; target?: string; reason: string }

const H2H_BUILDERS = "/guides/lovable-vs-bolt-vs-v0/";
const H2H_BASE44 = "/guides/base44-vs-lovable/";
const H2H_EDITORS = "/guides/claude-code-vs-cursor/";
const H2H_COPILOT = "/guides/claude-code-vs-github-copilot/";

const GUIDES: Record<string, Decision> = {
  // Priority pages (brief): keep and rebuild around evidence
  "base44-vs-lovable": { decision: "keep", reason: "priority 1: 751 impressions, pos 56; the Base44 head-to-head target" },
  "best-ai-website-builder-2026": { decision: "keep", reason: "priority 2: 642 impressions, pos 79; title says Top 7, body ranks 4" },
  "cursor-pricing-explained": { decision: "keep", reason: "priority 3: 579 impressions, pos 43; becomes a Pricing Index child page" },
  "boltnew-alternatives": { decision: "keep", reason: "priority 4: 539 impressions, pos 76; per-product alternatives page" },
  // Head-to-head set the brief keeps
  "lovable-vs-bolt-vs-v0": { decision: "keep", reason: "head-to-head target (Lovable vs Bolt vs v0)" },
  "claude-code-vs-cursor": { decision: "keep", reason: "head-to-head target; 'claude code vs cursor' has volume" },
  "claude-code-vs-github-copilot": { decision: "keep", reason: "ruling 29 Sep: survivor of the Copilot head-to-head (135 impr); covers Cursor and Claude Code" },
  "cursor-vs-github-copilot": { decision: "merge", target: H2H_COPILOT, reason: "ruling 29 Sep: merge direction reversed (2 impr into 135 impr)" },
  // Short X-vs-Y pages: merge into the head-to-heads (brief: merge ~20 short vs pages, 301 each)
  "v0-vs-lovable": { decision: "merge", target: H2H_BUILDERS, reason: "short vs template; same builders covered by the three-way page" },
  "replit-agent-vs-lovable": { decision: "merge", target: H2H_BUILDERS, reason: "short vs template (<400 words)" },
  "base44-vs-boltnew": { decision: "keep", reason: "ruling 29 Sep: merge/cut rejected (pos 3.1); keep and improve" },
  "atoms-vs-lovable": { decision: "keep", reason: "ruling 29 Sep: merge/cut rejected (pos 9.1); keep and improve" },
  "cursor-vs-windsurf": { decision: "merge", target: H2H_EDITORS, reason: "short vs template; editor head-to-head" },
  "windsurf-vs-claude-code": { decision: "merge", target: H2H_EDITORS, reason: "short vs template; editor head-to-head" },
  "bubble-vs-lovable": { decision: "keep", reason: "distinct task (no-code vs vibe coding) but only ~600 words: improve or re-decide with GSC data" },
  "base44-vs-replit": { decision: "keep", reason: "2,000+ words, distinct pairing; re-decide with GSC data" },
  "lovable-vs-cursor": { decision: "keep", reason: "2,000+ words, distinct task (builder vs editor)" },
  // Thin or generic: brief says cut/merge
  "vibe-coding-statistics-2026": { decision: "cut", target: "/guides/what-is-vibe-coding/", reason: "statistics page with no original numbers (brief: cut)" },
  "micro-saas-ideas-ai-app-builders": { decision: "keep", reason: "ruling 29 Sep: merge/cut rejected (3 clicks); keep and improve" },
  "vibe-coding-jobs-2026": { decision: "cut", target: "/guides/what-is-vibe-coding/", reason: "generic guide, no distinct task, under 800 words" },
  "best-language-to-learn-for-vibe-coding": { decision: "keep", reason: "ruling 29 Sep: merge/cut rejected (147 impr, pos 15.9); keep and improve" },
  "cost-to-build-app-with-ai-2026": { decision: "merge", target: "/guides/how-to-build-a-saas-with-ai/", reason: "under 400 words, no numbers of its own; fold into the SaaS build guide (a cost calculator island replaces it later)" },
  "custom-domain-for-ai-built-app": { decision: "keep", reason: "ruling 29 Sep: merge/cut rejected (183 impr; hosting/custom domain always optional); keep and improve" },
  "cursor-agent-mode-workflow": { decision: "merge", target: "/reviews/cursor/", reason: "under 400 words; fold into the Cursor review" },
  "protecting-context-window-long-builds": { decision: "keep", reason: "ruling 29 Sep: merge/cut rejected (pos 5.2); keep and improve" },
  "best-free-ai-coding-tools-2026": { decision: "keep", reason: "ruling 29 Sep: merge/cut rejected (pos 6.7); keep and improve" },
  // Practical short guides worth keeping (linked from several pages or distinct task)
  "getting-started-with-lovable": { decision: "keep", reason: "distinct task; 7 internal links point here" },
  "connecting-supabase-to-any-builder": { decision: "keep", reason: "distinct task; 7 internal links point here" },
  "stripe-billing-in-a-vibe-coded-saas": { decision: "keep", reason: "distinct task; 6 internal links point here" },
  "is-vibe-coding-safe-security-risks": { decision: "keep", reason: "distinct task; 6 internal links point here" },
  "best-free-ai-app-builder": { decision: "keep", reason: "query 'free ai app builder' has volume (brief)" },
  "what-is-vibe-coding": { decision: "keep", reason: "head term; also the redirect target for cut generic pages" },
  "best-ai-app-builder-2026": { decision: "keep", reason: "roundup hub; 11 internal links point here" },
  "best-ai-code-editor-2026": { decision: "keep", reason: "roundup hub" },
};

export function decideGuide(id: string, words: number): Decision {
  if (GUIDES[id]) return GUIDES[id];
  if (words >= 800) return { decision: "keep", reason: `long practical guide (${words} words); rebuild around evidence` };
  return { decision: "keep", reason: `under 800 words (${words}); distinct task, no GSC page data in the export yet: re-decide with impressions` };
}

export function decideReview(id: string, hasArticle: boolean): Decision {
  if (hasArticle) return { decision: "keep", reason: "full review article; remove star ratings/Review schema until rubrics exist (brief)" };
  return { decision: "merge", target: "/reviews/", reason: "no full article; thin fallback layout" };
}

export const STATIC_PAGES = [
  { url: "/", reason: "home; rebuilt in design checkpoint" },
  { url: "/reviews/", reason: "hub" },
  { url: "/guides/", reason: "hub" },
  { url: "/bridges/", reason: "hub for Supabase/Neon/Stripe/Hostinger integration tools" },
  { url: "/prompts/", reason: "prompts.json (24 prompts) exported to src/data/prompts.json" },
  { url: "/compare/", reason: "Compare matrix, to be ported as an island" },
  { url: "/about/", reason: "rewrite: no 'hands-on' claim, editorial name, method note" },
  { url: "/affiliate-disclosure/", reason: "static page, keep" },
  { url: "/privacy/", reason: "static page, keep" },
];
