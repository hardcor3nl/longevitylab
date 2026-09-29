import manifest from "../../data/hero-manifest.json";
type Entry = { w: number; h: number; sizes: number[] };
const m = manifest as Record<string, Entry>;
const idOf = (src: string) => ((src ?? "").match(/photo-[0-9a-f]+-[0-9a-f]+/)?.[0]) ?? "";
export function heroSrcSet(src: string): string | null {
  const id = idOf(src);
  const e = id && m[id];
  return e ? e.sizes.map((w) => `/img/heroes/${id}-${w}.webp ${w}w`).join(", ") : null;
}
export function heroFallback(src: string): string {
  const id = idOf(src); const e = m[id];
  return e ? `/img/heroes/${id}-${e.sizes.at(-1)}.webp` : src;
}
export function heroDims(src: string) { const e = m[idOf(src)]; return e ? { width: e.w, height: e.h } : { width: 1200, height: 800 }; }
