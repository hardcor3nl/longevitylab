export const NAV_GROUPS = [
  {
    label: "Topics",
    items: [
      { href: "/sleep", label: "Sleep Optimization", desc: "Circadian rhythm & sleep stack" },
      { href: "/cardio", label: "Zone 2 & VO₂ Max", desc: "Cardio training science" },
      { href: "/nutrition", label: "Nutrition", desc: "Longevity eating frameworks" },
      { href: "/stress-resilience", label: "Stress Resilience", desc: "Meditation, adaptogens, breathwork" },
      { href: "/exotic-methods", label: "Exotic Methods", desc: "Peptides, NAD+ IV, advanced protocols" },
    ],
  },
  {
    label: "Reviews",
    items: [
      { href: "/category/supplements", label: "Supplements", desc: "NMN, creatine, magnesium & more" },
      { href: "/category/wearables", label: "Wearables", desc: "WHOOP, Oura, Garmin, CGMs" },
      { href: "/category/recovery", label: "Recovery Devices", desc: "Sauna, cold plunge, red light" },
      { href: "/category/diagnostics", label: "Diagnostics", desc: "Blood tests, VO₂ max, biomarkers" },
      { href: "/best", label: "Best Of", desc: "Top-ranked picks by category" },
    ],
  },
  {
    label: "Learn",
    items: [
      { href: "/protocols", label: "Expert Protocols", desc: "Huberman, Sinclair, Bryan Johnson & more" },
      { href: "/compare", label: "Comparisons", desc: "Head-to-head product breakdowns" },
      { href: "/database", label: "Supplement Database", desc: "Evidence grades for 68+ compounds" },
      { href: "/cost-per-dose", label: "Cost per Study Dose", desc: "Monthly price at the dose studies used" },
      { href: "/glossary", label: "Glossary", desc: "Longevity terms explained" },
      { href: "/authors", label: "Editorial Team", desc: "How articles are attributed and reviewed" },
      { href: "/get-started", label: "Beginner Path", desc: "5-step plan for new optimisers" },
    ],
  },
];

export const FOOTER_LINKS: Record<string, [string, string][]> = {
  Topics: [
    ["Sleep Optimization", "/sleep"],
    ["Zone 2 & VO₂ Max", "/cardio"],
    ["Nutrition", "/nutrition"],
    ["Stress Resilience", "/stress-resilience"],
    ["Exotic Methods", "/exotic-methods"],
  ],
  Reviews: [
    ["Supplements", "/category/supplements"],
    ["Wearables", "/category/wearables"],
    ["Recovery", "/category/recovery"],
    ["Diagnostics", "/category/diagnostics"],
    ["Best Picks", "/best"],
  ],
  Tools: [
    ["Build My Plan", "/get-started"],
    ["Research Database", "/database"],
    ["Cost per Study Dose", "/cost-per-dose"],
    ["Expert Protocols", "/protocols"],
    ["Bio Age Quiz", "/quiz"],
    ["Comparisons", "/compare"],
    ["Glossary", "/glossary"],
  ],
  Company: [
    ["About", "/about"],
    ["Editorial Team", "/authors"],
    ["Contact", "/contact"],
    ["Affiliate Disclosure", "/about#affiliate"],
    ["Privacy Policy", "/privacy"],
    ["Terms of Service", "/terms"],
  ],
};
