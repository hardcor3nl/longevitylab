import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadSiteConfig } from "./dist.ts";
import { buildPayloads, diffSnapshots, ensureKeyFile, loadSnapshot, saveSnapshot, snapshotFromDist, snapshotFromLive, submit } from "./indexnow.ts";

/**
 * Post-deploy IndexNow step. DRY-RUN by default: prints what would be submitted and never touches the network
 * for submission. Pass --submit to POST (deploy pipelines only).
 *
 *   pnpm seo:indexnow <site> --init                       create the key file (public/<key>.txt) + config entry
 *   pnpm seo:indexnow <site> --previous snap.json         diff dist sitemaps against a saved snapshot
 *   pnpm seo:indexnow <site> --previous-live              diff dist sitemaps against the live site's sitemaps
 *   ... --write-snapshot snap.json   save the new snapshot   --include-removed   also submit deleted URLs   --submit  live POST
 */
const args = process.argv.slice(2);
const flag = (n: string) => (args.includes(n) ? args[args.indexOf(n) + 1] : undefined);
const valueFlags = ["--previous", "--write-snapshot", "--dist"];
const site = args.find((a, i) => !a.startsWith("--") && !(i > 0 && valueFlags.includes(args[i - 1])));
if (!site) { console.error("usage: pnpm seo:indexnow <site> [--init] [--previous file | --previous-live] [--write-snapshot file] [--submit]"); process.exit(2); }
const siteDir = resolve(process.cwd(), "sites", site);
if (args.includes("--init")) { console.log("key file written:", ensureKeyFile(siteDir, args.includes("--rotate"))); process.exit(0); }

const cfg = loadSiteConfig(siteDir);
if (!cfg.indexNowKey) { console.error("no indexNowKey: run with --init first"); process.exit(2); }
const dist = resolve(flag("--dist") ?? resolve(siteDir, "dist"));
if (!existsSync(dist)) { console.error(`no dist at ${dist}`); process.exit(2); }

const curr = snapshotFromDist(dist, cfg.origin);
const prev = args.includes("--previous-live") ? await snapshotFromLive(cfg.origin) : flag("--previous") ? loadSnapshot(resolve(flag("--previous")!)) : {};
const d = diffSnapshots(prev, curr, args.includes("--include-removed"));
console.log(`IndexNow (${cfg.origin}): ${d.added.length} new, ${d.changed.length} changed, ${d.removed.length} removed vs previous; ${d.submit.length} to submit`);
const payloads = buildPayloads(cfg.origin, cfg.indexNowKey, d.submit);
if (!args.includes("--submit")) {
  console.log("DRY RUN (no request sent). Payload preview:");
  for (const p of payloads) console.log(JSON.stringify({ ...p, urlList: p.urlList.slice(0, 5).concat(p.urlList.length > 5 ? [`... +${p.urlList.length - 5} more`] : []) }, null, 2));
} else {
  console.log("submitting:", JSON.stringify(await submit(payloads)));
}
if (flag("--write-snapshot")) saveSnapshot(resolve(flag("--write-snapshot")!), curr);
