import { describe, it, expect } from "vitest";
import { inferFields, csvColumns, fetchSnippet, median } from "../src/index.ts";

describe("l3 helpers", () => {
  it("infers fields from real records without inventing values", () => {
    const f = inferFields([{ id: "a", price: 10, note: null }, { id: "b", price: null, note: "x" }]);
    expect(f.find((x) => x.name === "price")).toMatchObject({ type: "number (nullable)", filled: "1 of 2", example: "10" });
    expect(f.find((x) => x.name === "id")).toMatchObject({ type: "string", filled: "2 of 2" });
  });
  it("reads CSV header names incl. quoted", () => {
    expect(csvColumns('id,"a,b",c\r\n1,2,3')).toEqual(["id", "a,b", "c"]);
  });
  it("builds a fetch snippet for the absolute URL", () => {
    expect(fetchSnippet("https://x.com/", "/data/a.json", "json")).toContain('fetch("https://x.com/data/a.json")');
  });
  it("median", () => { expect(median([3, 1, 2])).toBe(2); expect(median([1, 2, 3, 4])).toBe(2.5); expect(median([])).toBeNull(); });
});
