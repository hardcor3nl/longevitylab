// Job R inventory: AI tells, near-duplicates, thin pages, per site.
// usage: node --experimental-strip-types packages/tooling/src/r-inventory.ts [--out program/logs/R-inventory.md] [--json file] [site...]
import { existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  loadDocs, countTells, nearDuplicates, clusters, templatedEnds, wordCount, pageShape, shingles, jaccard, frontmatterSchema,
} from "../../schema/src/index.ts";

const ROOT = resolve(import.meta.dirname, "../../..");
const args = process.argv.slice(2);
const opt = (n: string) => (args.includes(n) ? args[args.indexOf(n) + 1] : undefined);
const out = opt("--out");
const jsonOut = opt("--json");
const only = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--")));
const SITES = process.env.R_SITES_ROOT ?? join(ROOT, "sites");
const sites = readdirSync(SITES).filter((s) => existsSync(join(SITES, s, "site.config.json")) && (!only.length || only.includes(s)));

/** Protected pages from the GSC baseline: clicks > 0 or position <= 20. */
function protectedPaths(site: string): Map<string, string> {
  const m = new Map<string, string>();
  const csv = join(ROOT, "program/gsc", site.replace(/intel$/, "intel") + ".com", "pages.csv");
  const alt = readdirSync(join(ROOT, "program/gsc")).map((d) => join(ROOT, "program/gsc", d, "pages.csv")).find((p) => p.includes(site) && existsSync(p));
  const f = existsSync(csv) ? csv : alt;
  if (f) {
    for (const line of readFileSync(f, "utf8").split(/\r?\n/).slice(1)) {
      const [path, imp, clk, pos] = line.split(",");
      if (!path) continue;
      if (Number(clk) > 0 || (Number(pos) > 0 && Number(pos) <= 20)) m.set(norm(path), `GSC ${imp} impr / ${clk} clicks / pos ${pos}`);
    }
  }
  // baseline markdown "Pages:" lines
  const base = readFileSync(join(ROOT, "program/GSC_BASELINE_2026-09-28.md"), "utf8").split(/\r?\n/);
  let cur = "";
  for (const l of base) {
    const h = /^\*\*(\w+)\*\* (?:queries|Pages)/.exec(l);
    if (h) cur = h[1];
    if (cur !== site) continue;
    for (const mm of l.matchAll(/(\/[a-z0-9/_.-]*)\s+(\d+)\|(\d+)\|([\d.]+)/g)) {
      const [, p, imp, clk, pos] = mm;
      if (Number(clk) > 0 || Number(pos) <= 20) m.set(norm(p), `baseline ${imp} impr / ${clk} clicks / pos ${pos}`);
    }
  }
  return m;
}
const norm = (p: string) => (p.endsWith("/") || /\.[a-z0-9]+$/i.test(p) ? p : p + "/");

export interface PageRow {
  id: string; url: string; file: string; words: number; score: number; strong: number; weak: number; emDash: number;
  rhetorical: number; superl: number; filler: number; noindex: boolean; table: boolean; component: boolean; sources: number;
  title: string; slug: string; body: string; guard?: string;
}

export function analyseSite(site: string) {
  const root = join(SITES, site);
  const cfg = JSON.parse(readFileSync(join(root, "site.config.json"), "utf8"));
  const contentDir = join(root, "src/content");
  const docs = loadDocs(contentDir);
  const guard = protectedPaths(site);
  const rows: PageRow[] = [];
  for (const d of docs) {
    const p = frontmatterSchema.safeParse(d.frontmatter);
    const fm = (d.frontmatter ?? {}) as Record<string, any>;
    const rel = d.file.replace(/\\/g, "/").slice(contentDir.replace(/\\/g, "/").length + 1);
    const coll = rel.split("/")[0];
    const slug = fm.slug ?? rel.replace(/\.mdx?$/, "").split("/").pop();
    const base = cfg.collectionRoutes?.[coll];
    const url = fm.route ?? (base ? `${base}${slug}/` : `/${rel.replace(/\.mdx?$/, "")}/`);
    const t = countTells(d.body);
    const shape = pageShape(d.body, Array.isArray(fm.sources) ? fm.sources.length : 0);
    rows.push({
      id: rel, url, file: rel, words: t.words, score: t.score, strong: t.strongTotal, weak: t.weakTotal, emDash: t.emDashExcess,
      rhetorical: t.rhetoricalOpeners, superl: t.superlatives, filler: t.fillerParas, noindex: !!fm.noindex,
      table: shape.hasTable, component: shape.hasComponent, sources: shape.sources, title: String(fm.title ?? ""), slug: String(slug),
      body: d.body, guard: guard.get(norm(url)),
    });
  }
  const indexable = rows.filter((r) => !r.noindex);
  const dupPairs = nearDuplicates(indexable.map((r) => ({ id: r.id, body: r.body })));
  const cl = clusters(dupPairs);
  const tmpl = templatedEnds(indexable);
  // most similar peer for merge targets
  const sets = new Map(indexable.map((r) => [r.id, shingles(r.body)]));
  const peer = (r: PageRow) => {
    let best: { id: string; sim: number } | undefined;
    for (const o of indexable) {
      if (o.id === r.id || o.words < r.words) continue;
      const sim = jaccard(sets.get(r.id)!, sets.get(o.id)!);
      const sameColl = o.file.split("/")[0] === r.file.split("/")[0];
      const sc = sim + (sameColl ? 0.02 : 0);
      if (!best || sc > best.sim) best = { id: o.id, sim: sc };
    }
    return best;
  };
  const thin = indexable.filter((r) => r.words < 300).map((r) => {
    const distinct = r.table || r.component;
    let decision: string;
    let why: string;
    if (r.guard) { decision = "expand"; why = `protected (${r.guard})`; }
    else if (r.words < 150 && !distinct) { decision = "merge"; why = "stub, no distinctive element"; }
    else if (distinct) { decision = "expand"; why = "has a table/component/sources; add specifics"; }
    else { decision = "merge"; why = "150-300 words, nothing distinctive"; }
    const target = decision === "merge" ? peer(r) : undefined;
    return { r, decision, why, target: target?.id };
  });
  return { site, rows, indexable, cl, tmpl, thin, dupPairs, cfg };
}

function main() {
  const res = sites.map(analyseSite);
  let md = `# Job R inventory (generated ${new Date().toISOString().slice(0, 10)})\n\nGenerated by \`packages/tooling/src/r-inventory.ts\`. Scope: content collections (MDX/MD) in each site's \`src/content\`; pages generated from \`src/data\` are covered by the template-duplicate check only where they share content files. Near-duplicate = >60% 4-word-shingle Jaccard similarity. Thin = indexable, under 300 words of prose. Protected = GSC clicks or position 20 or better (never merged or noindexed).\n\n## Summary\n\n| Site | Pages | Indexable | Strong tells (pages / hits) | Pages with any tell | Tell score total | Dup clusters (pages) | Templated intro/outro groups | Thin |\n|---|---:|---:|---|---:|---:|---|---:|---:|\n`;
  for (const r of res) {
    const sp = r.rows.filter((x) => x.strong > 0);
    md += `| ${r.site} | ${r.rows.length} | ${r.indexable.length} | ${sp.length} / ${sp.reduce((a, b) => a + b.strong, 0)} | ${r.rows.filter((x) => x.score > 0).length} | ${Math.round(r.rows.reduce((a, b) => a + b.score, 0))} | ${r.cl.length} (${r.cl.reduce((a, b) => a + b.ids.length, 0)}) | ${r.tmpl.length} | ${r.thin.length} |\n`;
  }
  for (const r of res) {
    md += `\n## ${r.site}\n\n### Worst pages by AI-tell score (strong x5, weak x1.5, em-dash excess x0.5, rhetorical opener x2, unsourced superlative x1, filler para x2)\n\n| Page | Words | Score | Strong | Weak | Em-dash excess | Rhetorical | Superl. | Filler |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|\n`;
    for (const x of [...r.rows].sort((a, b) => b.score - a.score).slice(0, 12).filter((x) => x.score > 0))
      md += `| ${x.url} | ${x.words} | ${x.score.toFixed(1)} | ${x.strong} | ${x.weak} | ${x.emDash} | ${x.rhetorical} | ${x.superl} | ${x.filler} |\n`;
    md += `\n### Near-duplicate clusters (>60% similar)\n\n`;
    if (!r.cl.length) md += `None.\n`;
    for (const c of r.cl) md += `- (${c.ids.length} pages, max ${(c.maxSim * 100).toFixed(0)}%) ${c.ids.map((i) => r.rows.find((x) => x.id === i)!.url).join(", ")}\n`;
    md += `\n### Templated intros/outros (same skeleton on 3+ pages)\n\n`;
    if (!r.tmpl.length) md += `None.\n`;
    for (const t of r.tmpl.slice(0, 15)) md += `- ${t.kind} x${t.ids.length}: "${t.skeleton}..." e.g. ${t.ids.slice(0, 3).map((i) => r.rows.find((x) => x.id === i)!.url).join(", ")}\n`;
    md += `\n### Thin pages (<300 words) and proposed decision\n\n`;
    if (!r.thin.length) md += `None.\n`;
    else {
      md += `| Page | Words | Decision | Reason | Merge target |\n|---|---:|---|---|---|\n`;
      for (const t of r.thin.sort((a, b) => a.r.words - b.r.words))
        md += `| ${t.r.url} | ${t.r.words} | ${t.decision} | ${t.why} | ${t.target ? r.rows.find((x) => x.id === t.target)!.url : ""} |\n`;
    }
  }
  // rendered (built-page) findings, from r-dist.ts --json files in R_DIST_JSON
  const dj = process.env.R_DIST_JSON;
  if (dj) {
    md += `\n## Rendered-page findings (built HTML, main content only)\n\nThese come from \`packages/tooling/src/r-dist.ts\` on each site's built \`dist\`. They include text added by templates and data, so they catch near-duplicates between data-driven pages that the content-file scan cannot see.\n`;
    for (const r of res) {
      const f = join(dj, `d0-${r.site}.json`);
      if (!existsSync(f)) continue;
      const d = JSON.parse(readFileSync(f, "utf8"));
      md += `\n### ${r.site}\n\n- Rendered pages under 300 words: ${d.thin.length}${d.thin.length ? " (" + d.thin.slice(0, 14).map((t: any) => `${t.url} ${t.words}`).join(", ") + (d.thin.length > 14 ? ", ..." : "") + ")" : ""}\n- Rendered near-duplicate clusters (>60%): ${d.clusters.length}${d.clusters.length ? " (" + d.clusters.map((c: any) => `${c.ids.join(" + ")} at ${(c.maxSim * 100).toFixed(0)}%`).join("; ") + ")" : ""}\n`;
    }
  }
  if (out) writeFileSync(resolve(ROOT, out), md);
  else console.log(md);
  if (jsonOut)
    writeFileSync(resolve(jsonOut), JSON.stringify(res.map((r) => ({ site: r.site, rows: r.rows.map(({ body, ...x }) => x), cl: r.cl, tmpl: r.tmpl, thin: r.thin.map((t) => ({ url: t.r.url, id: t.r.id, words: t.r.words, decision: t.decision, why: t.why, target: t.target })) })), null, 1));
}
if (process.argv[1] && import.meta.url === new URL(`file:///${process.argv[1].replace(/\\/g, "/")}`).href) main();
