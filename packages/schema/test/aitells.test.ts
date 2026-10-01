import { describe, expect, it } from "vitest";
import { countTells, nearDuplicates, templatedEnds, wordCount } from "../src/aitells.ts";

describe("ai tells", () => {
  it("flags strong tells", () => {
    const t = countTells("Let's delve into this. Whether you're a student or a pro, look no further.");
    expect(t.strong.map((s) => s.label)).toEqual(expect.arrayContaining(["delve", "look no further", "whether you're a ... or a ..."]));
  });
  it("does not fail quoted vendor wording or blockquotes", () => {
    expect(countTells('The vendor calls it a "game-changer" in its own words.').strongTotal).toBe(0);
    expect(countTells("> Rest assured, our servers are fast.\n\nPlain text follows.").strongTotal).toBe(0);
    expect(countTells("This is a game-changer.").strongTotal).toBe(1);
  });
  it("is quiet on plain text", () => {
    const t = countTells("The plan costs $20 a month. It allows 500 requests, and the limit resets on the first.");
    expect(t.score).toBe(0);
  });
  it("counts em-dash excess only past the allowance", () => {
    const body = Array.from({ length: 10 }, () => "a word — and another one here for length padding to fill").join(" ");
    expect(countTells(body).emDashExcess).toBeGreaterThan(0);
  });
  it("finds near duplicates and template ends", () => {
    const base = "alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi omicron pi rho sigma tau upsilon";
    expect(nearDuplicates([{ id: "a", body: base }, { id: "b", body: base + " extra" }, { id: "c", body: "completely different words about other things entirely here today" }]).length).toBe(1);
    const mk = (n: string) => ({ id: n, title: n, slug: n, body: `Intro for ${n} here.\n\nMiddle.\n\nResearched from the pricing page and read in a browser in September.` });
    expect(templatedEnds([mk("a"), mk("b"), mk("c")], 3).length).toBeGreaterThan(0);
    expect(wordCount("one two three")).toBe(3);
  });
});
