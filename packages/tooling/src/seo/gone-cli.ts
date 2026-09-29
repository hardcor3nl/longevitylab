import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseGone, routesJson } from "../../../core/src/seo/gone.ts";

/** pnpm seo:gone <site>: regenerate functions/gone-paths.json and public/_routes.json from sites/<site>/gone.txt. */
export function writeGoneFiles(siteDir: string): string[] {
  const src = join(siteDir, "gone.txt");
  const gone = existsSync(src) ? parseGone(readFileSync(src, "utf8")) : [];
  mkdirSync(join(siteDir, "functions"), { recursive: true });
  mkdirSync(join(siteDir, "public"), { recursive: true });
  writeFileSync(join(siteDir, "functions", "gone-paths.json"), JSON.stringify(gone, null, 2) + "\n");
  writeFileSync(join(siteDir, "public", "_routes.json"), JSON.stringify(routesJson(gone), null, 2) + "\n");
  return gone;
}
if (process.argv[1]?.endsWith("gone-cli.ts")) {
  const site = process.argv[2];
  if (!site) { console.error("usage: pnpm seo:gone <site>"); process.exit(2); }
  const gone = writeGoneFiles(resolve(process.cwd(), "sites", site));
  console.log(`${gone.length} gone paths written`);
}
