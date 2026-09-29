#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { loadDocs, lintCorpus, type LintContext } from "./index.ts";

// usage: check-content --site ./site.config.json [--content ./src/content]
const args = process.argv.slice(2);
const opt = (n: string, d?: string) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const sitePath = resolve(opt("--site", "./site.config.json")!);
const site = JSON.parse(readFileSync(sitePath, "utf8"));
const root = dirname(sitePath);
const contentDir = resolve(root, opt("--content", "src/content")!);

const docs = loadDocs(contentDir);
const routes = new Set<string>(site.staticRoutes ?? []);
for (const d of docs) {
  const fmx = d.frontmatter as { slug?: string; route?: string } | undefined;
  const slug = fmx?.slug;
  if (!slug) continue;
  if (fmx?.route) { routes.add(fmx.route); continue; }
  const collection = d.file.slice(contentDir.length + 1).split(/[\\/]/)[0];
  const base = site.collectionRoutes?.[collection];
  if (base) routes.add(`${base}${slug}${site.trailingSlash === "always" ? "/" : ""}`);
}
const ctx: LintContext = {
  editorialName: site.editorialName,
  trailingSlash: site.trailingSlash,
  routes: site.checkLinks === false ? undefined : routes,
  fileExists: (p) => existsSync(join(root, p)),
};
const issues = lintCorpus(docs, ctx);
const fails = issues.filter((i) => i.severity === "fail");
const warns = issues.filter((i) => i.severity === "warn");
for (const i of [...fails, ...warns].slice(0, Number(opt("--max", "80"))))
  console.log(`${i.severity.toUpperCase()} ${i.rule} ${i.file.replace(root + "/", "")}: ${i.message}`);
console.log(`\n${docs.length} files, ${fails.length} failures, ${warns.length} warnings`);
process.exit(fails.length && !args.includes("--warn-only") ? 1 : 0);
