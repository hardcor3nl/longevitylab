import { goneResponse, isGone } from "@portfolio/core/seo/gone.ts";
import gonePaths from "./gone-paths.json";

/** Catch-all that only runs for the routes listed in public/_routes.json (generated from gone.txt). Everything else falls through to static assets. */
export const onRequest: PagesFunction = async ({ request, next }) => {
  const { pathname } = new URL(request.url);
  return isGone(pathname, gonePaths as string[]) ? goneResponse() : next();
};
