import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { type Check, type SiteConfig, check } from "./dist.ts";
import { parseIndex, parseUrlset, readSitemaps } from "./sitemap-check.ts";

/**
 * IndexNow (https://www.indexnow.org/documentation). Supported by Bing, Yandex, Naver, Seznam and Yep.
 * Google does NOT support IndexNow (Search Console + sitemaps are the only Google routes).
 * Protocol: POST https://api.indexnow.org/IndexNow  { host, key, keyLocation, urlList[<=10000] }
 * The key (8-128 chars, a-z A-Z 0-9 -) must be served as plain text at keyLocation, containing exactly the key.
 */
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";
export const MAX_URLS = 10000;

export type Snapshot = Record<string, string>; // loc -> lastmod ("" when the sitemap gives none)

export const generateKey = () => randomBytes(16).toString("hex");
export const validKey = (k: string) => /^[a-zA-Z0-9-]{8,128}$/.test(k);

/** Write public/<key>.txt and record the key in site.config.json. Reuses an existing key unless `rotate`. */
export function ensureKeyFile(siteDir: string, rotate = false): string {
  const cfgPath = join(siteDir, "site.config.json");
  const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
  let key: string = cfg.indexNowKey;
  if (!key || !validKey(key) || rotate) { key = generateKey(); cfg.indexNowKey = key; writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + "\n"); }
  mkdirSync(join(siteDir, "public"), { recursive: true });
  writeFileSync(join(siteDir, "public", `${key}.txt`), key);
  return key;
}

export function snapshotFromDist(dist: string, origin: string): Snapshot {
  const snap: Snapshot = {};
  for (const u of readSitemaps(dist, origin).urls) snap[u.loc] = u.lastmod ?? "";
  return snap;
}

/** Snapshot of the LIVE sitemaps (the "previous deploy"). Returns {} when the site has no sitemap yet (first deploy). */
export async function snapshotFromLive(origin: string, fetcher: typeof fetch = fetch): Promise<Snapshot> {
  const snap: Snapshot = {};
  const idx = await fetcher(new URL("/sitemap-index.xml", origin)).catch(() => null);
  if (!idx?.ok) return snap;
  for (const loc of parseIndex(await idx.text())) {
    const r = await fetcher(loc).catch(() => null);
    if (r?.ok) for (const u of parseUrlset(await r.text())) snap[u.loc] = u.lastmod ?? "";
  }
  return snap;
}

export interface Diff { added: string[]; changed: string[]; removed: string[]; submit: string[] }
/** New URLs, and URLs whose lastmod moved. Removed URLs are reported (IndexNow accepts them too) but submitted only when `includeRemoved`. */
export function diffSnapshots(prev: Snapshot, curr: Snapshot, includeRemoved = false): Diff {
  const added = Object.keys(curr).filter((u) => !(u in prev));
  const changed = Object.keys(curr).filter((u) => u in prev && curr[u] !== prev[u] && curr[u] !== "");
  const removed = Object.keys(prev).filter((u) => !(u in curr));
  return { added, changed, removed, submit: [...added, ...changed, ...(includeRemoved ? removed : [])].sort() };
}

export interface Payload { host: string; key: string; keyLocation: string; urlList: string[] }
export function buildPayloads(origin: string, key: string, urls: string[]): Payload[] {
  const host = new URL(origin).host;
  const own = urls.filter((u) => new URL(u).host === host);
  const out: Payload[] = [];
  for (let i = 0; i < own.length; i += MAX_URLS) out.push({ host, key, keyLocation: new URL(`/${key}.txt`, origin).toString(), urlList: own.slice(i, i + MAX_URLS) });
  return out;
}

/** Live submission. Only ever called when the caller passes an explicit `submit: true`; the CLI defaults to dry-run. */
export async function submit(payloads: Payload[], fetcher: typeof fetch = fetch): Promise<{ status: number }[]> {
  const res: { status: number }[] = [];
  for (const p of payloads) {
    const r = await fetcher(INDEXNOW_ENDPOINT, { method: "POST", headers: { "content-type": "application/json; charset=utf-8" }, body: JSON.stringify(p) });
    res.push({ status: r.status }); // 200/202 accepted; 400 bad request; 403 key not found; 422 url/host mismatch; 429 throttled
  }
  return res;
}

/** Scorecard check: key configured, key file shipped in dist with matching content, robots does not block it. */
export function checkIndexNow(dist: string, cfg: SiteConfig): Check {
  const issues: string[] = [];
  const key = cfg.indexNowKey;
  if (!key) issues.push("site.config.json has no indexNowKey (run: pnpm seo:indexnow <site> --init)");
  else {
    if (!validKey(key)) issues.push("indexNowKey is not 8-128 chars of a-z, A-Z, 0-9, -");
    const f = join(dist, `${key}.txt`);
    if (!existsSync(f)) issues.push(`key file /${key}.txt missing from dist`);
    else if (readFileSync(f, "utf8").trim() !== key) issues.push("key file content does not equal the key");
    const robots = existsSync(join(dist, "robots.txt")) ? readFileSync(join(dist, "robots.txt"), "utf8") : "";
    if (/^\s*Disallow:\s*\/\s*$/im.test(robots)) issues.push("robots.txt disallows everything");
  }
  return check("indexnow", "IndexNow", issues, key ? `key ${key.slice(0, 6)}... file shipped` : "not configured");
}

export function loadSnapshot(path: string): Snapshot {
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {};
}
export function saveSnapshot(path: string, snap: Snapshot) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(snap, null, 1));
}
