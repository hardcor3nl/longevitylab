import type { APIRoute } from "astro";
import { buildSitemaps } from "@portfolio/core";
import { sitemapGroups } from "../lib/seo";
import site from "../../site.config.json";

export const GET: APIRoute = async () =>
  new Response(buildSitemaps(site.origin, await sitemapGroups()).get("sitemap-index.xml"), { headers: { "content-type": "application/xml" } });
