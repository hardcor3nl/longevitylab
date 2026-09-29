// Resizes the self-hosted hero photos (src/assets/heroes) to a small webp ladder in public/img/heroes and writes
// src/data/hero-manifest.json. Idempotent: existing outputs are skipped.
import { readdirSync, mkdirSync, existsSync, writeFileSync } from "node:fs";
import sharp from "sharp";
import { fileURLToPath } from "node:url";
const P = (u) => fileURLToPath(u);
const src = new URL("../src/assets/heroes/", import.meta.url);
const out = new URL("../public/img/heroes/", import.meta.url);
mkdirSync(fileURLToPath(out), { recursive: true });
const SIZES = [480, 800, 1200];
const manifest = {};
for (const f of readdirSync(fileURLToPath(src)).filter((n) => n.endsWith(".jpg")).sort()) {
  const id = f.replace(/\.jpg$/, "");
  const img = sharp(P(new URL(f, src)));
  const { width, height } = await img.metadata();
  const sizes = SIZES.filter((w) => w <= width);
  if (!sizes.includes(width) && width < SIZES.at(-1)) sizes.push(width);
  for (const w of sizes) {
    const o = new URL(`${id}-${w}.webp`, out);
    if (!existsSync(P(o))) await sharp(P(new URL(f, src))).resize({ width: w }).webp({ quality: 72, effort: 5 }).toFile(P(o));
  }
  manifest[id] = { w: width, h: height, sizes };
}
writeFileSync(new URL("../src/data/hero-manifest.json", import.meta.url), JSON.stringify(manifest) + "\n");
console.log(`heroes: ${Object.keys(manifest).length} photos`);
