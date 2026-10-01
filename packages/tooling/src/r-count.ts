// Job R: headline counts for a content dir (before/after comparison).
// usage: node --experimental-strip-types packages/tooling/src/r-count.ts <contentDir> [label]
import { loadDocs, countTells, wordCount, templatedEnds, frontmatterSchema } from "../../schema/src/index.ts";

const dir = process.argv[2];
const docs = loadDocs(dir);
let pages = 0, strong = 0, tellPages = 0, score = 0, dashes = 0, weak = 0, q = 0, sup = 0, fill = 0, thin = 0;
const named: { id: string; title: string; slug: string; body: string }[] = [];
for (const d of docs) {
  const fm = (d.frontmatter ?? {}) as Record<string, unknown>;
  if (fm.noindex) continue;
  pages++;
  const t = countTells(d.body);
  strong += t.strongTotal; weak += t.weakTotal; dashes += t.emDashes; q += t.rhetoricalOpeners; sup += t.superlatives; fill += t.fillerParas;
  if (t.score > 0) tellPages++;
  score += t.score;
  if (wordCount(d.body) < 300) thin++;
  const p = frontmatterSchema.safeParse(d.frontmatter);
  if (p.success) named.push({ id: d.file, title: p.data.title, slug: p.data.slug, body: d.body });
}
const tmpl = templatedEnds(named, 5).reduce((a, b) => a + b.ids.length, 0);
console.log(JSON.stringify({ label: process.argv[3] ?? dir, pages, tellPages, score: Math.round(score), strong, weak, emDashes: dashes, questionOpeners: q, superlatives: sup, filler: fill, templatedEndPages: tmpl, thinBody: thin }));
