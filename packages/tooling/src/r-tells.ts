// Job R helper: list the offending snippets per page for a site, worst first.
// usage: node --experimental-strip-types packages/tooling/src/r-tells.ts <site> [--min 3]
import { join, resolve } from "node:path";
import { loadDocs, countTells } from "../../schema/src/index.ts";

const ROOT = resolve(import.meta.dirname, "../../..");
const site = process.argv[2];
const min = Number(process.argv[process.argv.indexOf("--min") + 1] || 1);
const docs = loadDocs(join(ROOT, "sites", site, "src/content"));
const rows = docs.map((d) => ({ f: d.file.split(/[\\/]content[\\/]/)[1], t: countTells(d.body) })).filter((r) => r.t.score >= min).sort((a, b) => b.t.score - a.t.score);
for (const r of rows) {
  console.log(`\n## ${r.f}  score ${r.t.score.toFixed(1)} words ${r.t.words} strong[${r.t.strong.map((s) => s.label).join(",")}] weak ${r.t.weakTotal} dash+${r.t.emDashExcess}`);
  for (const e of r.t.examples) console.log("   " + e);
}
