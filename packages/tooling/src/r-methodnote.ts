// Job R: make boilerplate "Researched from ..." method notes page-specific by naming the sources the page actually cites.
// usage: node --experimental-strip-types packages/tooling/src/r-methodnote.ts <site> <regex-of-opening-to-replace> [--dry]
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { walk, splitFrontmatter } from "../../schema/src/index.ts";

const ROOT = resolve(import.meta.dirname, "../../..");
const [site, pattern] = process.argv.slice(2);
const dry = process.argv.includes("--dry");
const re = new RegExp(pattern, "i");
let n = 0;
for (const f of walk(join(ROOT, "sites", site, "src/content"))) {
  const src = readFileSync(f, "utf8");
  const { data } = splitFrontmatter(src);
  const fm = (data ?? {}) as { sources?: { title: string; checked?: string }[] };
  const srcs = fm.sources ?? [];
  if (!srcs.length) continue;
  const lines = src.split("\n");
  // last non-empty paragraph line matching the pattern
  let idx = -1;
  for (let i = lines.length - 1; i >= 0 && i > lines.length - 12; i--) if (re.test(lines[i])) { idx = i; break; }
  if (idx < 0) continue;
  const clean = (t: string) => t.replace(/\s+/g, " ").replace(/[.]+$/, "").trim();
  const uniq = [...new Set(srcs.map((s) => clean(s.title)))];
  const shown = uniq.slice(0, 3);
  const more = uniq.length > 3 ? `, and ${uniq.length - 3} more listed above` : "";
  const m = re.exec(lines[idx])!;
  const rest = lines[idx].slice(m.index + m[0].length).replace(/^[\s.;,]*/, "");
  const dates = srcs.map((x) => String(x.checked ?? "").slice(0, 10)).filter(Boolean).sort();
  const last = dates[dates.length - 1];
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const when = last ? ` Checked ${Number(last.slice(8, 10))} ${MON[Number(last.slice(5, 7)) - 1]} ${last.slice(0, 4)}.` : "";
  lines[idx] = `Read for this page: ${shown.join("; ")}${more}.${when} ${rest}`.trim();
  n++;
  if (!dry) writeFileSync(f, lines.join("\n"));
  else console.log(f.split(/[\\/]content[\\/]/)[1], "=>", lines[idx].slice(0, 200));
}
console.log(`${n} notes rewritten`);
