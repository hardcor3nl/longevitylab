import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import { distFileFor, parseRedirectsFile, pathOf, readLedger } from "./util.ts";
import { ledgerRedirects } from "./parity.ts";

export interface RedirectReport { badTarget: string[]; chains: string[]; loops: string[] }

/** Every 301 target resolves to a built page, an external URL, or a further planned redirect (chains are flagged). */
export function checkRedirects(redirects: Map<string, { to: string; status: number }>, dist: string): RedirectReport {
  const rep: RedirectReport = { badTarget: [], chains: [], loops: [] };
  for (const [from, { to, status }] of redirects) {
    if (status === 410) continue;
    if (/^https?:\/\//.test(to)) continue;
    const target = pathOf(to);
    if (target === from) { rep.loops.push(from); continue; }
    if (distFileFor(dist, target)) continue;
    if (redirects.has(target)) rep.chains.push(`${from} -> ${target}`);
    else rep.badTarget.push(`${from} -> ${to}`);
  }
  return rep;
}

function main() {
  const a = process.argv.slice(2);
  const opt = (n: string) => (a.includes(n) ? a[a.indexOf(n) + 1] : undefined);
  const dist = opt("--dist"), ledger = opt("--ledger"), file = opt("--redirects");
  if (!dist) { console.error("usage: redirects --dist <dir> [--ledger csv] [--redirects _redirects]"); process.exit(2); }
  const map = new Map([...(ledger && existsSync(ledger) ? ledgerRedirects(ledger) : []), ...(file ? parseRedirectsFile(file) : [])]);
  const rep = checkRedirects(map, dist);
  console.log(`${map.size} redirects: ${rep.badTarget.length} bad targets, ${rep.chains.length} chains, ${rep.loops.length} loops`);
  [...rep.badTarget, ...rep.chains, ...rep.loops].slice(0, 50).forEach((x) => console.log("  " + x));
  process.exit(rep.badTarget.length + rep.chains.length + rep.loops.length ? 1 : 0);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
