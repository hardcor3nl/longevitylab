import affiliates from "../../sites/thelongevityintel/src/data/affiliates.json";
import { deviceClass, refPath, type Affiliate } from "./lib.ts";

interface Env { DB?: D1Database; SITE_ID?: string }

/**
 * /go/<id>: the shared affiliate hop. `live` entries (Amazon Associates michaelregeer-20, Awin, the named Oxford Healthspan
 * and Sunlighten referral links) are logged to D1 (no IP, no cookies) and answered with a 302. `plain` entries are ordinary
 * brand links kept only so old URLs keep working: redirected, never logged, never presented as sponsored.
 */
export const onRequestGet: PagesFunction<Env> = async ({ params, request, env, waitUntil }) => {
  const id = String(params.id ?? "").replace(/\/$/, "");
  const entry = (affiliates as Affiliate[]).find((a) => a.id === id);
  if (!entry) return new Response("Not found", { status: 404, headers: { "x-robots-tag": "noindex" } });
  const headers = { location: entry.url, "cache-control": "no-store", "x-robots-tag": "noindex" };
  if (entry.status !== "live") return new Response(null, { status: 302, headers });

  const url = new URL(request.url);
  const row = [
    new Date().toISOString(),
    env.SITE_ID ?? "thelongevityintel",
    entry.id,
    refPath(request.headers.get("referer"), url.origin),
    (request as Request & { cf?: { country?: string } }).cf?.country ?? null,
    deviceClass(request.headers.get("user-agent") ?? ""),
  ];
  if (env.DB) {
    const write = env.DB.prepare("INSERT INTO clicks (ts, site, affiliate_id, page, country, device) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(...row).run().catch(() => undefined);
    waitUntil(write);
  }
  return new Response(null, { status: 302, headers });
};
