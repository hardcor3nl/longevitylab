import { expect, it } from "vitest";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildPayloads, checkIndexNow, diffSnapshots, ensureKeyFile, submit, validKey } from "../src/seo/indexnow.ts";

it("diff finds new and lastmod-changed urls, ignores unchanged and undated", () => {
  const d = diffSnapshots(
    { "https://a.com/1/": "2026-01-01", "https://a.com/2/": "2026-01-01", "https://a.com/gone/": "2026-01-01", "https://a.com/u/": "" },
    { "https://a.com/1/": "2026-01-01", "https://a.com/2/": "2026-02-01", "https://a.com/new/": "2026-02-02", "https://a.com/u/": "" },
  );
  expect(d.added).toEqual(["https://a.com/new/"]);
  expect(d.changed).toEqual(["https://a.com/2/"]);
  expect(d.removed).toEqual(["https://a.com/gone/"]);
  expect(d.submit).toEqual(["https://a.com/2/", "https://a.com/new/"]);
  expect(diffSnapshots({}, { "https://a.com/x/": "" }).submit).toEqual(["https://a.com/x/"]);
});
it("payload uses the site host, key location and drops foreign hosts; chunks at 10000", () => {
  const p = buildPayloads("https://a.com", "abcdef1234", ["https://a.com/x/", "https://evil.com/y/"]);
  expect(p).toHaveLength(1);
  expect(p[0]).toMatchObject({ host: "a.com", key: "abcdef1234", keyLocation: "https://a.com/abcdef1234.txt", urlList: ["https://a.com/x/"] });
  const many = Array.from({ length: 10001 }, (_, i) => `https://a.com/${i}/`);
  expect(buildPayloads("https://a.com", "abcdef1234", many)).toHaveLength(2);
});
it("key file is generated once, valid, and reused", () => {
  const dir = mkdtempSync(join(tmpdir(), "in-"));
  writeFileSync(join(dir, "site.config.json"), JSON.stringify({ name: "T", origin: "https://a.com" }));
  const k1 = ensureKeyFile(dir), k2 = ensureKeyFile(dir);
  expect(validKey(k1)).toBe(true);
  expect(k2).toBe(k1);
  expect(readFileSync(join(dir, "public", `${k1}.txt`), "utf8")).toBe(k1);
  expect(ensureKeyFile(dir, true)).not.toBe(k1);
});
it("submit posts JSON to the IndexNow endpoint (mock fetch only, never the network)", async () => {
  const calls: any[] = [];
  const fake = (async (url: string, init: any) => { calls.push([url, JSON.parse(init.body)]); return { status: 202 }; }) as any;
  const r = await submit(buildPayloads("https://a.com", "abcdef1234", ["https://a.com/x/"]), fake);
  expect(r).toEqual([{ status: 202 }]);
  expect(calls[0][0]).toBe("https://api.indexnow.org/IndexNow");
});
it("scorecard check requires the shipped key file", () => {
  const dist = mkdtempSync(join(tmpdir(), "dist-"));
  const cfg: any = { name: "T", origin: "https://a.com", trailingSlash: "always", indexNowKey: "abcdef1234" };
  expect(checkIndexNow(dist, cfg).status).toBe("fail");
  writeFileSync(join(dist, "abcdef1234.txt"), "abcdef1234");
  expect(checkIndexNow(dist, cfg).status).toBe("pass");
  expect(existsSync(dist)).toBe(true); void mkdirSync;
});
