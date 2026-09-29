-- D1 schema shared by all sites (FOUNDATION_SPEC "Affiliate tracking"). No IP, no cookies.
CREATE TABLE IF NOT EXISTS clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL,          -- ISO 8601 UTC
  site TEXT NOT NULL,
  affiliate_id TEXT NOT NULL,
  page TEXT,                 -- referring path only, query stripped
  country TEXT,              -- Cloudflare cf.country
  device TEXT NOT NULL       -- mobile | tablet | desktop | bot
);
CREATE INDEX IF NOT EXISTS clicks_site_ts ON clicks (site, ts);
CREATE INDEX IF NOT EXISTS clicks_affiliate ON clicks (site, affiliate_id);
