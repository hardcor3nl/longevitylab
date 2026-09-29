import { expect, it } from "vitest";
import { article, review, canonicalUrl } from "../src/index.ts";
const org = { name: "Vibe Coding Intel editorial", url: "https://vibecodingintel.com/" };
const base = { title: "t", description: "d", url: "https://vibecodingintel.com/x/", published: "2026-01-01" };
it("article author is an Organization, never a Person", () => {
  expect((article({ ...base, evidence: "research" }, org).author as any)["@type"]).toBe("Organization");
});
it("review only for owner-tested with rubric", () => {
  const s = { name: "Lovable" }, r = { value: 4 };
  expect(review({ ...base, evidence: "research", rubric: true }, s, org, r)).toBeNull();
  expect(review({ ...base, evidence: "owner-tested" }, s, org, r)).toBeNull();
  expect(review({ ...base, evidence: "owner-tested", rubric: true }, s, org, r)).not.toBeNull();
});
it("canonical url follows trailingSlash", () => {
  expect(canonicalUrl("https://a.com", "/x", "always")).toBe("https://a.com/x/");
  expect(canonicalUrl("https://a.com", "/x/", "never")).toBe("https://a.com/x");
});
