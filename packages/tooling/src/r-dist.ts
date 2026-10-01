// Job R: rendered-page analysis over a built dist (catches data-driven pages the content-file lint cannot see).
// usage: node --experimental-strip-types packages/tooling/src/r-dist.ts <site> [--json out.json]
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { htmlFiles } from "./seo/dist.ts";
import { jaccard, shingles, countTells, clusters, nearDuplicates } from "../../schema/src/index.ts";

const ROOT = resolve(import.meta.dirname, "../../..");

export function mainText(html: string): { text: string; noindex: boolean; title: string } {
  const noindex = /<meta[^>]+name=["']robots["'][^>]*noindex/i.test(html);
  const title = (/<title>([^<]*)<\/title>/i.exec(html)?.[1] ?? "").trim();
  let m = /<main\b[\s\S]*?<\/main>/i.exec(html)?.[0] ?? html;
  m = m.replace(/<(script|style|nav|header|footer|svg|aside|form|button)\b[\s\S]*?<\/\1>/gi, " ");
  m = m.replace(/<\/(p|li|h[1-6]|tr|div|section|article)>/gi, "\n").replace(/<[^>]+>/g, " ");
  m = m.replace(/&amp;/g, "&").replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ");
  return { text: m.split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean).join("\n\n"), noindex, title };
}

export function analyseDist(site: string) {
  const dist = join(ROOT, "sites", site, "dist");
  if (!existsSync(dist)) throw new Error("no dist for " + site);
  const pages = htmlFiles(dist).map((f) => {
    const rel = f.slice(dist.length).split(sep).join("/");
    const url = rel.replace(/index\.html$/, "").replace(/\.html$/, "/");
    const { text, noindex, title } = mainText(readFileSync(f, "utf8"));
    return { url, text, noindex, title, words: text.split(/\s+/).filter(Boolean).length };
  }).filter((p) => !p.noindex && p.url !== "/404/" && !/^\/(og|embed)\//.test(p.url));
  const dup = nearDuplicates(pages.filter((p) => p.words >= 100).map((p) => ({ id: p.url, body: p.text })), 0.6);
  return { pages, dup, clusters: clusters(dup) };
}

if (process.argv[1] && import.meta.url === new URL(`file:///${process.argv[1].split(sep).join("/")}`).href) {
  const site = process.argv[2];
  const r = analyseDist(site);
  const thin = r.pages.filter((p) => p.words < 300).sort((a, b) => a.words - b.words);
  console.log(`${site}: ${r.pages.length} indexable rendered pages, ${thin.length} under 300 rendered words, ${r.clusters.length} duplicate clusters`);
  for (const c of r.clusters) console.log(`  dup (${c.ids.length}, max ${(c.maxSim * 100).toFixed(0)}%): ${c.ids.slice(0, 8).join(" ")}`);
  for (const p of thin.slice(0, 60)) console.log(`  thin ${p.words}  ${p.url}`);
  const j = process.argv.indexOf("--json");
  if (j > 0) writeFileSync(process.argv[j + 1], JSON.stringify({ site, thin: thin.map((p) => ({ url: p.url, words: p.words })), clusters: r.clusters }, null, 1));
}
