import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { formatScorecard, runSeoChecks } from "./run.ts";

/** pnpm seo:check <site> [--dist dir] [--only a,b] [--verbose] : exits 1 when any check fails. */
const args = process.argv.slice(2);
const flag = (n: string) => (args.includes(n) ? args[args.indexOf(n) + 1] : undefined);
const site = args.find((a, i) => !a.startsWith("--") && !(i > 0 && ["--dist", "--only"].includes(args[i - 1])));
if (!site) { console.error("usage: pnpm seo:check <site> [--dist dir] [--only ids] [--verbose]"); process.exit(2); }
const siteDir = existsSync(resolve(site, "site.config.json")) ? resolve(site) : resolve(process.cwd(), "sites", site);
if (!existsSync(resolve(siteDir, "site.config.json"))) { console.error(`no site.config.json in ${siteDir}`); process.exit(2); }
const dist = flag("--dist") ? resolve(flag("--dist")!) : resolve(siteDir, "dist");
if (!existsSync(dist)) { console.error(`no dist at ${dist}: build the site first`); process.exit(2); }
const card = runSeoChecks({ siteDir, distDir: dist, only: flag("--only")?.split(",") });
console.log(formatScorecard(card, args.includes("--verbose")));
process.exit(card.failed ? 1 : 0);
