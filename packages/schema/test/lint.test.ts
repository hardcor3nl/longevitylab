import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { lintCorpus, lintDocument, splitFrontmatter, type Doc, type LintContext } from "../src/index.ts";

const dir = resolve(import.meta.dirname, "fixtures");
const ctx: LintContext = {
  editorialName: "Vibe Coding Intel editorial",
  trailingSlash: "always",
  routes: new Set(["/guides/claude-code/"]),
  fileExists: (p) => p.endsWith("pass-plain-guide.md"),
  now: new Date("2026-09-28"),
};
const load = (name: string): Doc => {
  const { data, body } = splitFrontmatter(readFileSync(join(dir, name), "utf8"));
  return { file: name, frontmatter: data, body };
};
const fails = (name: string) => lintDocument(load(name), ctx).filter((i) => i.severity === "fail");
const rules = (name: string) => new Set(fails(name).map((i) => i.rule));

describe("passing fixtures", () => {
  for (const f of readdirSync(dir).filter((f) => f.startsWith("pass-")))
    it(f, () => expect(fails(f)).toEqual([]));
});

describe("failing fixtures", () => {
  it("prices without sources", () => expect(rules("fail-prices-no-sources.md")).toEqual(new Set(["sources"])));
  it("banned phrase + testing claim", () =>
    expect(rules("fail-banned-and-claim.md")).toEqual(new Set(["banned-phrase", "testing-claim", "ai-tell-strong"])));
  it("schema (title length) ", () => expect(rules("fail-schema-author.md")).toContain("schema"));
});

describe("other rules", () => {
  it("non-canonical and unresolved links", () => {
    const d = load("pass-plain-guide.md");
    d.body = "See [x](/guides/claude-code) and [y](/nope/).";
    const r = lintDocument(d, ctx).map((i) => i.rule);
    expect(r).toContain("link-canonical");
    expect(r).toContain("link-resolve");
  });
  it("owner-tested without files", () => {
    const d = load("pass-owner-tested.md");
    (d.frontmatter as any).ownerEvidence = ["missing.png"];
    expect(lintDocument(d, ctx).map((i) => i.rule)).toContain("owner-evidence");
  });
  it("wrong author", () => {
    const d = load("pass-plain-guide.md");
    (d.frontmatter as any).author = "Someone";
    expect(lintDocument(d, ctx).map((i) => i.rule)).toContain("author");
  });
  it("duplicate title/query across corpus", () => {
    const a = load("pass-plain-guide.md");
    const b = { ...a, file: "copy.md" };
    expect(lintCorpus([a, b], ctx).map((i) => i.rule)).toEqual(
      expect.arrayContaining(["duplicate-title", "duplicate-target-query"]),
    );
  });
  it("overdue review warns", () => {
    const d = load("pass-plain-guide.md");
    (d.frontmatter as any).updated = "2026-01-01";
    expect(lintDocument(d, ctx).some((i) => i.rule === "review-overdue" && i.severity === "warn")).toBe(true);
  });
});

describe("keepLiveMeta / allowPhrases", () => {
  const base = { slug: "a-b", targetQuery: "q", published: "2026-01-01", author: "Vibe Coding Intel editorial", evidence: "research" };
  const run = (extra: object, body = "Plain text.") =>
    lintDocument({ file: "x.md", frontmatter: { ...base, title: "T".repeat(70), description: "d", ...extra }, body }, ctx).filter((i) => i.severity === "fail").map((i) => i.rule);
  it("long title fails by default", () => expect(run({})).toContain("schema"));
  it("long title passes with keepLiveMeta", () => expect(run({ keepLiveMeta: true })).not.toContain("schema"));
  it("allowPhrases waives a listed banned phrase", () => {
    expect(run({ keepLiveMeta: true }, "Check the unlock time.")).toContain("banned-phrase");
    expect(run({ keepLiveMeta: true, allowPhrases: ["unlock"] }, "Check the unlock time.")).not.toContain("banned-phrase");
  });
});
