export interface Author {
  name: string
  role: string
  initials: string
  bio: string
  expertise: string[]
  articles: number
  credentials: string
  slug: string
}

export const authors: Author[] = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Chief Medical Reviewer',
    initials: 'SC',
    bio: 'MD with 12 years in preventive medicine and longevity research. Former researcher at UCSF. Specialises in metabolic health, diagnostics, and evidence-based supplementation.',
    expertise: ['Diagnostics', 'Metabolic Health', 'Supplements', 'Preventive Medicine'],
    articles: 8,
    credentials: 'MD, Internal Medicine. Board-certified. Former UCSF researcher.',
    slug: 'sarah-chen',
  },
  {
    name: 'Marcus Webb',
    role: 'Senior Recovery & Tech Editor',
    initials: 'MW',
    bio: 'MSc Exercise Physiology. 10 years covering health technology, recovery science, and wearable devices. Tests every device personally with lab-grade instruments.',
    expertise: ['Wearables', 'Recovery Devices', 'Red Light Therapy', 'Exercise Science'],
    articles: 15,
    credentials: 'MSc Exercise Physiology. ACSM Certified.',
    slug: 'marcus-webb',
  },
  {
    name: 'Dr. James Okafor',
    role: 'Research Scientist',
    initials: 'JO',
    bio: 'PhD Molecular Biology. Specialises in NAD+ metabolism, mitochondrial health, and cellular longevity mechanisms. Reviews all supplement mechanistic claims.',
    expertise: ['NAD+ & Mitochondria', 'Molecular Biology', 'Supplement Science', 'Protocols'],
    articles: 6,
    credentials: 'PhD Molecular Biology. Published researcher in NAD+ metabolism.',
    slug: 'james-okafor',
  },
]

const editorialTeam: Author = {
  name: 'LongevityLab Editors',
  role: 'Editorial Team',
  initials: 'LL',
  bio: 'Collaborative pieces researched and written by the LongevityLab editorial team, then fact-checked against primary literature and reviewed by our medical reviewer before publication.',
  expertise: ['Longevity Research', 'Evidence Review', 'Product Testing'],
  articles: 0,
  credentials: 'Physician-reviewed editorial collective.',
  slug: 'editorial-team',
}

export function getAuthorByName(name: string): Author {
  return authors.find(a => a.name === name) ?? editorialTeam
}
