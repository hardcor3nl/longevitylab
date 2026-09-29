export interface Affiliate { id: string; url: string; status: string }
export function deviceClass(ua: string): "mobile" | "tablet" | "desktop" | "bot" {
  if (/bot|crawl|spider|slurp|preview|facebookexternalhit/i.test(ua)) return "bot";
  if (/ipad|tablet/i.test(ua)) return "tablet";
  if (/mobi|iphone|android/i.test(ua)) return "mobile";
  return "desktop";
}
/** Referring path only: no host, no query string. */
export function refPath(referer: string | null, origin: string): string | null {
  if (!referer) return null;
  try { const u = new URL(referer); return u.origin === origin ? u.pathname : null; } catch { return null; }
}
