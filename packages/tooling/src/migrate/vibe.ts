/**
 * Vibe Coding Intel content export (P1 checkpoint 2).
 * usage: node --experimental-strip-types src/migrate/vibe.ts --repo <old repo> --site <sites/vibecodingintel>
 * Emits MDX (guides, reviews), data JSON, and content-ledger.csv. Never retypes content:
 * body text is the old strings, with mechanical link normalisation only.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import { PRICE_RE } from "@portfolio/schema";
import { csvCell } from "../util.ts";
import { loadOldData } from "./load-old.ts";
import { decideGuide, decideReview, STATIC_PAGES } from "./vibe-ledger.ts";

const args = process.argv.slice(2);
const opt = (n: string, d: string) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const repo = opt("--repo", "/home/user/vibecodinghub");
const site = opt("--site", "sites/vibecodingintel");
const EDITORIAL = "Vibe Coding Intel editorial";
const LIVE = ["atoms", "softgen", "base44"];
const TRACKED: [string, string][] = [
  ["https://atoms.dev/?utm_source=affiliate&via=", "atoms"],
  ["https://softgen.ai/?referral=", "softgen"],
  ["https://base44.pxf.io/c/4720878/2049275/25619", "base44"],
];

// ---------------------------------------------------------------- git dates
const git = (a: string[]) => execFileSync("git", ["-C", repo, ...a], { encoding: "utf8", maxBuffer: 1 << 28 }).trim();
const fileFirst = (file: string) => git(["log", "--diff-filter=A", "--format=%aI", "--", file]).split("\n").filter(Boolean).at(-1)?.slice(0, 10);
/** Per-entry: first commit in which the entry's id line appears (pickaxe). Falls back to the file's first commit. */
function firstSeen(needle: string, file: string): { date: string; approx: boolean } {
  const out = git(["log", "-S" + needle, "--format=%aI", "--reverse", "--", "src"]).split("\n").filter(Boolean);
  if (out.length) return { date: out[0].slice(0, 10), approx: false };
  return { date: fileFirst(file) ?? "2026-01-01", approx: true };
}

// ------------------------------------------------------------ text helpers
const esc = (s: string) =>
  s.split(/(`[^`\n]*`)/).map((part, i) => (i % 2 ? part : part.replace(/([{}])/g, "\\$1").replace(/<(?=[a-zA-Z/!])/g, "\\<"))).join("");
const cell = (s: string) => esc(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
function normLinks(s: string): string {
  return s
    .replace(/\]\((\/[^)\s#?]*?)(?<!\/)([?#][^)\s]*)?\)/g, (_m, p, tail) => `](${p === "" ? "/" : p}/${tail ?? ""})`)
    .replace(/\]\((https?:\/\/[^)\s]+)\)/g, (m, url) => {
      const t = TRACKED.find(([prefix]) => url.startsWith(prefix));
      return t ? `](/go/${t[1]}/)` : m;
    });
}
const P = (s: string) => normLinks(esc(s));
const wordsOf = (s: string) => s.replace(/```[\s\S]*?```/g, " ").replace(/[#>*|`\\\[\]()_-]/g, " ").split(/\s+/).filter(Boolean).length;

function extractSources(raw: string[], checked: string, approx: boolean) {
  const seen = new Map<string, { title: string; url: string; checked: string; approx?: boolean }>();
  for (const text of raw)
    for (const m of text.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)) {
      const url = m[2].replace(/[.,;]$/, "");
      if (TRACKED.some(([p]) => url.startsWith(p)) || /vibecodingintel\.com/.test(url)) continue;
      if (!seen.has(url)) seen.set(url, { title: m[1].replace(/\*+/g, "").trim(), url, checked, ...(approx ? { approx: true } : {}) });
    }
  return [...seen.values()];
}
/** "July 2026" -> 2026-07-01 (approximate; flagged approx). */
function monthToIso(s?: string): string | null {
  const m = s && /([A-Za-z]+)\s+(\d{4})/.exec(s);
  if (!m) return null;
  const mo = ["january","february","march","april","may","june","july","august","september","october","november","december"].indexOf(m[1].toLowerCase());
  return mo < 0 ? null : `${m[2]}-${String(mo + 1).padStart(2, "0")}-01`;
}
function targetQuery(id: string, seoTitle: string): { q: string; source: string } {
  const override: Record<string, string> = {
    "guides/base44-vs-lovable": "base44 vs lovable", "guides/best-ai-website-builder-2026": "best ai website builder",
    "guides/cursor-pricing-explained": "cursor pricing", "guides/boltnew-alternatives": "bolt.new alternatives",
    "reviews/atoms": "atoms dev review", "guides/best-free-ai-app-builder": "free ai app builder",
    "guides/claude-code-vs-cursor": "claude code vs cursor", "guides/v0-alternatives": "v0 alternatives",
  };
  if (override[id]) return { q: override[id], source: "brief" };
  const q = seoTitle.split(/[:|]|\s[-–]\s/)[0].replace(/\(?\b20\d\d\b\)?/g, "").replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  return { q, source: "derived" };
}

function frontmatterText(fm: Record<string, unknown>): string {
  return YAML.stringify(fm, { lineWidth: 0 }).replace(/^(\s*-?\s*)(published|updated|checked|date): (\d{4}-\d\d-\d\d\S*)$/gm, '$1$2: "$3"');
}

// ----------------------------------------------------------- body renderers
function renderSection(s: any, uses: { callout: boolean }): string {
  const out: string[] = [`## ${esc(s.heading)}`];
  for (const p of s.paragraphs ?? []) out.push(P(p));
  if (s.steps?.length) out.push(s.steps.map((st: any, i: number) => `${i + 1}. **${esc(st.title)}**: ${P(st.detail)}`).join("\n"));
  if (s.bullets?.length)
    out.push(s.bullets.map((b: any) => (typeof b === "string" ? `- ${P(b)}` : `- **${esc(b.label)}** ${P(b.text)}`)).join("\n"));
  if (s.code) out.push("```" + (s.code.lang ?? "") + "\n" + s.code.content.replace(/\n$/, "") + "\n```");
  if (s.table) {
    const t = s.table;
    out.push(
      [`| ${t.headers.map(cell).join(" | ")} |`, `| ${t.headers.map(() => "---").join(" | ")} |`, ...t.rows.map((r: string[]) => `| ${r.map((c) => normLinks(cell(c))).join(" | ")} |`)].join("\n"),
    );
    if (t.caption) out.push(`*${P(t.caption)}*`);
  }
  if (s.callout) {
    uses.callout = true;
    out.push(`<Callout type="${s.callout.type}">\n\n${P(s.callout.text)}\n\n</Callout>`);
  }
  return out.join("\n\n");
}
const faqSection = (faqs: any[]) => `## Common questions\n\n` + faqs.map((f) => `### ${esc(f.question)}\n\n${P(f.answer)}`).join("\n\n");

function textPieces(g: any): string[] {
  const t: string[] = [...(g.intro ?? []), ...(g.keyTakeaways ?? []), ...(g.faqs ?? []).map((f: any) => f.answer), ...(g.verdict ?? [])];
  for (const s of g.sections ?? []) {
    t.push(...(s.paragraphs ?? []), ...(s.steps ?? []).map((x: any) => x.detail), ...(s.bullets ?? []).map((b: any) => (typeof b === "string" ? b : b.text)));
    if (s.table) t.push(...s.table.rows.flat(), s.table.caption ?? "");
    if (s.callout) t.push(s.callout.text);
  }
  return t;
}

async function main() {
  const d = await loadOldData(repo);
  const root = site;
  for (const c of ["guides", "reviews"]) { rmSync(join(root, "src/content", c), { recursive: true, force: true }); mkdirSync(join(root, "src/content", c), { recursive: true }); }
  mkdirSync(join(root, "src/data"), { recursive: true });
  const ledger: string[][] = [];
  const stats = { guides: 0, reviews: 0, approxDates: 0 };
  const guideFile = "src/data/guides.ts";

  // ---- guides (includes inspirationGuides + projectStories: same /guides/<id>/ URL space)
  for (const g of d.guides) {
    const uses = { callout: false };
    const body: string[] = [];
    if (g.intro?.length) body.push(g.intro.map(P).join("\n\n"));
    for (const s of g.sections ?? []) body.push(renderSection(s, uses));
    if (g.keyTakeaways?.length) body.push(`## Key takeaways\n\n` + g.keyTakeaways.map((k: string) => `- ${P(k)}`).join("\n"));
    if (g.faqs?.length) body.push(faqSection(g.faqs));
    const md = (uses.callout ? `import Callout from "@portfolio/core/components/Callout.astro";\n\n` : "") + body.join("\n\n") + "\n";
    const fileHint = /^(genaipi|build-cpq)/.test(g.id) ? "src/data/projectStories.ts" : guideFile;
    const seen = firstSeen(`id: "${g.id}"`, fileHint);
    const legacy = g.lastUpdated as string | undefined;
    const checked = monthToIso(legacy) ?? seen.date;
    const sources = extractSources(textPieces(g), checked, true);
    const hasPrices = PRICE_RE.test(textPieces(g).join("\n"));
    const tq = targetQuery(`guides/${g.id}`, g.seoTitle);
    const fm: Record<string, unknown> = {
      title: g.seoTitle, description: g.metaDescription, slug: g.id, targetQuery: tq.q,
      published: seen.date, ...(seen.approx ? { publishedApprox: true } : {}),
      ...(hasPrices ? { reviewEvery: "90d" } : {}), author: EDITORIAL, evidence: "research",
      sources, category: g.category, relatedTools: g.relatedTools ?? [],
      ...(hasPrices && sources.length === 0 ? { needsSources: true } : {}), h1: g.title,
    };
    writeFileSync(join(root, "src/content/guides", `${g.id}.mdx`), `---\n${frontmatterText(fm)}---\n\n${md}`);
    stats.guides++; if (seen.approx) stats.approxDates++;
    const dec = decideGuide(g.id, wordsOf(md));
    ledger.push([`/guides/${g.id}/`, dec.decision, tq.q, dec.reason, dec.target ?? "", "2026-09-29", "approved", String(wordsOf(md)), String(!!fm.needsSources), "guide", legacy ?? "", seen.date, tq.source]);
  }

  // ---- reviews (full article, or tools.json fallback layout for the 13 reviewable tools)
  const affiliateRows: any[] = [];
  for (const t of d.tools) {
    const isLive = LIVE.includes(t.id);
    affiliateRows.push({ id: t.id, programme: t.name, network: t.id === "base44" ? "Impact/Partnerize" : t.id === "lovable" ? "Impact" : t.id === "v0" ? "Dub" : "direct", url: t.referralUrl, status: isLive ? "live" : ["lovable", "v0", "hostinger"].includes(t.id) ? "pending" : "none" });
    if (t.category === "bridge") continue;
    const a = d.reviewArticles.find((r: any) => r.toolId === t.id);
    const uses = { callout: false };
    const body: string[] = [];
    let seoTitle: string, metaDescription: string, legacy: string | undefined, pieces: string[];
    if (a) {
      seoTitle = a.seoTitle; metaDescription = a.metaDescription; legacy = a.lastUpdated;
      body.push(P(a.heroSummary));
      body.push(`**Best for:** ${P(a.bestFor)}\n\n**Not ideal for:** ${P(a.notFor)}`);
      body.push(a.intro.map(P).join("\n\n"));
      for (const s of a.sections) body.push(renderSection(s, uses));
      body.push(`## Pricing\n\n${P(a.pricing.intro)}\n\n| Plan | Price | What it includes |\n| --- | --- | --- |\n` +
        a.pricing.tiers.map((x: any) => `| ${cell(x.name)} | ${cell(x.price + (x.period ? " " + x.period : ""))} | ${cell([x.blurb, ...x.features].filter(Boolean).join("; "))} |`).join("\n") + (a.pricing.note ? `\n\n${P(a.pricing.note)}` : ""));
      body.push(`## Pros and cons\n\n**Pros**\n\n${a.pros.map((x: string) => `- ${P(x)}`).join("\n")}\n\n**Cons**\n\n${a.cons.map((x: string) => `- ${P(x)}`).join("\n")}`);
      body.push(faqSection(a.faqs));
      body.push(`## Verdict\n\n${a.verdict.map(P).join("\n\n")}`);
      pieces = [a.heroSummary, a.bestFor, a.notFor, ...a.intro, ...a.verdict, a.pricing.intro, a.pricing.note ?? "", ...a.pros, ...a.cons, ...a.faqs.map((f: any) => f.answer), ...a.pricing.tiers.flatMap((x: any) => [x.price, x.blurb ?? "", ...x.features]),
        ...a.sections.flatMap((s: any) => [...(s.paragraphs ?? []), ...(s.bullets ?? []).map((b: any) => b.text)])];
    } else {
      seoTitle = `${t.name} Review: ${t.tagline}`.slice(0, 200); metaDescription = t.description; legacy = undefined;
      body.push(P(t.description));
      if (t.idealFor) body.push(`**Best for:** ${P(t.idealFor)}`);
      body.push(`## Strengths\n\n${t.strengths.map((x: string) => `- ${P(x)}`).join("\n")}`);
      body.push(`## Weaknesses\n\n${t.weaknesses.map((x: string) => `- ${P(x)}`).join("\n")}`);
      body.push(`## Pricing\n\n${P(t.pricing)}`);
      if (t.verdict) body.push(`## Verdict\n\n${P(t.verdict)}`);
      pieces = [t.description, t.idealFor ?? "", ...t.strengths, ...t.weaknesses, t.pricing, t.verdict ?? ""];
    }
    const md = (uses.callout ? `import Callout from "@portfolio/core/components/Callout.astro";\n\n` : "") + body.join("\n\n") + "\n";
    const seen = firstSeen(a ? `toolId: "${t.id}"` : `"id": "${t.id}"`, a ? "src/data/reviewArticles.ts" : "src/data/tools.json");
    const checked = monthToIso(legacy) ?? seen.date;
    const sources = extractSources(pieces, checked, true);
    const tq = targetQuery(`reviews/${t.id}`, seoTitle);
    const needs = sources.length === 0;
    const fm: Record<string, unknown> = {
      title: seoTitle, description: metaDescription, slug: t.id, targetQuery: tq.q,
      published: seen.date, ...(seen.approx ? { publishedApprox: true } : {}), reviewEvery: "90d", author: EDITORIAL, evidence: "research",
      sources, affiliates: isLive ? [t.id] : [], category: t.category, relatedTools: [t.id], ...(needs ? { needsSources: true } : {}), h1: `${t.name} Review`,
    };
    writeFileSync(join(root, "src/content/reviews", `${t.id}.mdx`), `---\n${frontmatterText(fm)}---\n\n${md}`);
    stats.reviews++; if (seen.approx) stats.approxDates++;
    const dec = decideReview(t.id, !!a);
    ledger.push([`/reviews/${t.id}/`, dec.decision, tq.q, dec.reason, dec.target ?? "", "2026-09-29", "approved", String(wordsOf(md)), String(needs), a ? "review" : "review-thin", legacy ?? "", seen.date, tq.source]);
  }

  // ---- static pages (hand-built in CP3; listed so the parity gate sees them)
  for (const sp of STATIC_PAGES) ledger.push([sp.url, "keep", "", sp.reason, "", "2026-09-29", "approved", "", "", "static", "", "", ""]);

  // ---- data files
  const tools = d.tools.map(({ rating, referralUrl, ...rest }: any) => ({ ...rest, vendorUrl: LIVE.includes(rest.id) ? undefined : referralUrl }));
  writeFileSync(join(root, "src/data/tools.json"), JSON.stringify(tools, null, 2) + "\n");
  writeFileSync(join(root, "src/data/prompts.json"), JSON.stringify(d.prompts, null, 2) + "\n");
  writeFileSync(join(root, "src/data/affiliates.json"), JSON.stringify(affiliateRows, null, 2) + "\n");

  const head = ["url", "decision", "target_query", "reason", "redirect_target", "date", "status", "word_count", "needs_sources", "kind", "legacy_last_updated", "published", "target_query_source"];
  writeFileSync(join(root, "content-ledger.csv"), [head, ...ledger].map((r) => r.map(csvCell).join(",")).join("\n") + "\n");
  const redirectLines = ledger.filter((r) => r[1] !== "keep" && r[4]).map((r) => `${r[0]} ${r[4]} 301`).sort();
  writeFileSync(join(root, "public/_redirects"), `# generated from content-ledger.csv by packages/tooling/src/migrate/vibe.ts; do not edit\n${redirectLines.join("\n")}\n`);
  const by = (k: string) => ledger.filter((r) => r[1] === k).length;
  console.log(JSON.stringify({ ...stats, ledger: ledger.length, keep: by("keep"), merge: by("merge"), cut: by("cut") }));
}
main();
