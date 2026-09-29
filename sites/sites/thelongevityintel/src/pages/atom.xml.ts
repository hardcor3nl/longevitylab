import type { APIRoute } from "astro";
import { atomFeed } from "@portfolio/core";
import { feedItems, feedMeta } from "../lib/seo";

export const GET: APIRoute = async () =>
  new Response(atomFeed({ ...feedMeta, feedUrl: new URL("/atom.xml", feedMeta.link).toString() }, await feedItems()), { headers: { "content-type": "application/atom+xml; charset=utf-8" } });
