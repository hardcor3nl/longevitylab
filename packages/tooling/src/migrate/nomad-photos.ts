/** Downloads the Unsplash photos the old site hotlinked (Unsplash licence: free commercial use) and copies owner-supplied blog covers. Idempotent. */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
const args = process.argv.slice(2);
const opt = (n: string, d: string) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const site = opt("--site", "sites/nomadterminal"), repo = opt("--repo", "/home/user/globaldigitalnomadhub"), drafts = opt("--drafts", "");
const needed: string[] = JSON.parse(readFileSync(join(site, "src/data/photos-needed.json"), "utf8"));
mkdirSync(join(site, "src/assets/photos"), { recursive: true }); mkdirSync(join(site, "src/assets/blog"), { recursive: true });
let got = 0, had = 0, failed: string[] = [];
const queue = needed.filter((f) => f.startsWith("photos/"));
async function worker() {
  for (let f = queue.shift(); f; f = queue.shift()) {
    const dest = join(site, "src/assets", f);
    if (existsSync(dest)) { had++; continue; }
    const id = f.replace(/^photos\//, "").replace(/\.jpg$/, "");
    let ok = false;
    for (let attempt = 0; attempt < 3 && !ok; attempt++) {
      try {
        const r = await fetch(`https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=74&fm=jpg`);
        if (!r.ok) throw new Error(String(r.status));
        writeFileSync(dest, Buffer.from(await r.arrayBuffer())); ok = true; got++;
      } catch { await new Promise((r) => setTimeout(r, 800 * (attempt + 1))); }
    }
    if (!ok) failed.push(f);
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
for (const f of needed.filter((x) => x.startsWith("blog/"))) {
  const dest = join(site, "src/assets", f.replace(/\.png$/, ".webp"));
  const png = f.replace(/\.webp$/, ".png");
  const from = [join(repo, "public", f), join(repo, "public", png), drafts && join(drafts, "public", f)].find((p) => p && existsSync(p));
  if (!from) { failed.push(f); continue; }
  if (from.endsWith(".png")) {
    // 2 MB PNG covers: re-encode once as WebP (same pixels, max 1600 px wide); Astro then serves AVIF/WebP at several widths
    const sharp = createRequire(resolve(site, "package.json"))("sharp");
    await sharp(from).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(dest);
  } else copyFileSync(from, dest);
}
console.log(JSON.stringify({ downloaded: got, alreadyPresent: had, failed }));
