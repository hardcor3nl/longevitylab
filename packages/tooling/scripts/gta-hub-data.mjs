// One-off exporter: reads the old React hub pages (news, artwork, screenshots, wallpapers) and writes the data the
// hub islands need to sites/gtasixguide/src/data/hubs.json. Usage: node gta-hub-data.mjs <old-repo-src/pages> <out.json>
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const [dir, out] = process.argv.slice(2);
const read = (f) => readFileSync(join(dir, f), "utf8");
/** Text of the array literal following `const <name>...=` up to its closing `];`. */
const arrayText = (src, name) => {
  const i = src.indexOf(`const ${name}`);
  const start = src.indexOf("[", src.indexOf("=", i));
  const end = src.indexOf("\n]", start);
  return src.slice(start, end + 2);
};
const evalArr = (text, ctx = {}) => new Function(...Object.keys(ctx), `return ${text};`)(...Object.values(ctx));
const consts = (src) => Object.fromEntries([...src.matchAll(/^const (\w+) =\s*\n?\s*"([^"]+)";/gm)].map((m) => [m[1], m[2]]));

const news = read("News.tsx");
const slides = evalArr(arrayText(news, "featuredSlides"), consts(news));
const art = read("OfficialArtwork.tsx");
const artwork = evalArr(arrayText(art, "artworkData"), { BASE_PATH: "/assets/screenshots/artwork" });
const subjects = evalArr(arrayText(art, "subjects"));
const artFormats = evalArr(art.match(/const formats = (\[[^\]]*\]);/)[1]);
const shots = read("Screenshots.tsx");
const screenshots = evalArr(arrayText(shots, "screenshots"));
const categories = evalArr(arrayText(shots, "categories"));
const wp = read("Wallpapers.tsx");
const icons = Object.fromEntries(["Monitor", "Smartphone", "Tablet", "Maximize2", "Square"].map((k) => [k, k]));
const wallFormats = evalArr(arrayText(wp, "FORMATS"), icons).map(({ id, label, desc, suffix }) => ({ id, label, desc, suffix }));
const wallpapers = evalArr(arrayText(wp, "WALLPAPERS"));
writeFileSync(out, JSON.stringify({ news: { slides }, artwork: { items: artwork, subjects, formats: artFormats }, screenshots: { items: screenshots, categories }, wallpapers: { items: wallpapers, formats: wallFormats, categories: ["All", "Official Promo", "Characters", "Locations"] } }, null, 1));
console.log({ slides: slides.length, artwork: artwork.length, subjects: subjects.length, screenshots: screenshots.length, categories: categories.length, wallpapers: wallpapers.length, wallFormats: wallFormats.length });
