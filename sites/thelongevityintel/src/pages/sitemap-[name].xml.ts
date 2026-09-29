import type { APIRoute, GetStaticPaths } from "astro";
import { buildSitemaps } from "@portfolio/core";
import { sitemapGroups } from "../lib/seo";
import site from "../../site.config.json";

export const getStaticPaths: GetStaticPaths = async () => {
  const maps = buildSitemaps(site.origin, await sitemapGroups());
  return [...maps.keys()].filter((k) => k !== "sitemap-index.xml")
    .map((k) => ({ params: { name: k.replace(/^sitemap-|\.xml$/g, "") }, props: { xml: maps.get(k)! } }));
};
export const GET: APIRoute = ({ props }) => new Response(props.xml, { headers: { "content-type": "application/xml" } });
