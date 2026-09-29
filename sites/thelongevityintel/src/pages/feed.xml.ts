import type { APIRoute } from "astro";
import { rssFeed } from "@portfolio/core";
import { feedItems, feedMeta } from "../lib/seo";

export const GET: APIRoute = async () =>
  new Response(rssFeed(feedMeta, await feedItems()), { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
