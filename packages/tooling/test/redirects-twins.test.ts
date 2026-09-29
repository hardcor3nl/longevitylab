import { expect, it } from "vitest";
import { twinOf, withTwins } from "../src/redirect-twins.ts";
import { checkRedirectTwins } from "../src/seo/redirects-check.ts";
import { routesJson } from "../../core/src/seo/gone.ts";

it("twinOf gives the other slash form and skips files, splats and the root", () => {
  expect(twinOf("/a/b/")).toBe("/a/b");
  expect(twinOf("/a/b")).toBe("/a/b/");
  expect(twinOf("/sitemap.xml")).toBeNull();
  expect(twinOf("/database/*")).toBeNull();
  expect(twinOf("/")).toBeNull();
});

it("withTwins adds missing twins once, keeps comments and CRLF", () => {
  const out = withTwins("# c\r\n/a/ /b/ 301\r\n/c /d/ 301\r\n/c/ /d/ 301\r\n/x.xml /y.xml 301\r\n");
  expect(out).toBe("# c\r\n/a/ /b/ 301\r\n/a /b/ 301\r\n/c /d/ 301\r\n/c/ /d/ 301\r\n/x.xml /y.xml 301\r\n");
  expect(withTwins(out)).toBe(out);
});

it("routesJson routes both slash forms of a gone path", () => {
  expect(routesJson(["/old/"]).include).toEqual(["/go/*", "/old", "/old/"]);
});

const base = { gone: [], routesInclude: [], built: new Set(["/new/"]), dist: "", lists: [] as { name: string; paths: string[] }[] };
it("flags a redirect source that only matches one slash form", () => {
  const rules = new Map([["/old/", { to: "/new/", status: 301 }]]);
  const r = checkRedirectTwins({ ...base, rules });
  expect(r.asymmetric).toHaveLength(1);
  const ok = checkRedirectTwins({ ...base, rules: new Map([...rules, ["/old", { to: "/new/", status: 301 }]]) });
  expect(ok.asymmetric).toHaveLength(0);
});

it("flags a gone path not routed to the Function in both forms, and listed URLs that 404", () => {
  const r = checkRedirectTwins({ ...base, rules: new Map(), gone: ["/g/"], routesInclude: ["/g/"], lists: [{ name: "gsc", paths: ["/g", "/nope/", "/new"] }] });
  expect(r.asymmetric).toHaveLength(1);
  expect(r.listedButBroken).toEqual(["gsc: /nope/"]);
});
