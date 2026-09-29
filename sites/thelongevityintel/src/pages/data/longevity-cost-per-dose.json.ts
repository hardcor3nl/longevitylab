import type { APIRoute } from "astro";
import { cpdRecords } from "../../lib/cpd";
export const GET: APIRoute = () => new Response(JSON.stringify(cpdRecords, null, 1) + "\n", { headers: { "content-type": "application/json; charset=utf-8" } });
