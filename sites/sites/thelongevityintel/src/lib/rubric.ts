/** The visible rubric behind every evidence grade on the site (database, product cards, hero card). One definition, printed wherever a grade appears. */
export const GRADES = [
  { id: "strong", label: "Strong", bars: 4, text: "Several randomised controlled trials or meta-analyses in people agree on direction, the effect is large enough to matter for the stated outcome, and safety is established over long use." },
  { id: "moderate", label: "Moderate", bars: 3, text: "Some human trials, but small, short, or mixed. Plausible benefit, with limited long-term safety data." },
  { id: "emerging", label: "Emerging", bars: 2, text: "Mostly animal or mechanism studies, or very small human studies. Interesting, not yet enough to act on." },
  { id: "weak", label: "Weak", bars: 1, text: "Little or contradictory evidence, no benefit shown, or a safety concern outweighs the evidence." },
] as const;

export const CRITERIA = [
  ["Human evidence", "How many people, how well controlled, how consistent."],
  ["Effect size", "Whether the measured change is big enough to matter in daily life."],
  ["Safety data", "Length of use studied, known interactions, who should avoid it."],
  ["Product transparency", "Whether the brand publishes third-party testing and a label that matches. Reported per product, only when published."],
] as const;

export const gradeClass = (level: string) => `grade grade-${level.toLowerCase()}`;
export const gradeBars = (level: string) => GRADES.find((g) => g.label === level)?.bars ?? 1;
