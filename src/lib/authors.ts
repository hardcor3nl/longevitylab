export interface Author {
  name: string
  role: string
  initials: string
  bio: string
  expertise: string[]
  articles: number
  credentials: string
  slug: string
  verifiedReviewer?: boolean
}

const editorialTeam: Author = {
  name: 'Longevity Intel Editors',
  role: 'Editorial Team',
  initials: 'LL',
  bio: 'Collaborative articles researched and maintained by the Longevity Intel editorial team. Medical review is shown only when a named reviewer and review date are recorded for the article.',
  expertise: ['Research summaries', 'Product comparisons', 'Editorial maintenance'],
  articles: 0,
  credentials: 'Editorial attribution; no medical credential claimed.',
  slug: 'editorial-team',
}

// Add a contributor only after identity, credentials, permission, and the work
// attributed to them have been documented. Reviewers must also opt in here.
export const authors: Author[] = [editorialTeam]

export function getAuthorByName(name: string): Author {
  return authors.find(a => a.name === name) ?? editorialTeam
}

export function getVerifiedReviewerByName(name?: string): Author | undefined {
  if (!name) return undefined
  return authors.find(a => a.name === name && a.verifiedReviewer)
}

export function getAuthorBySlug(slug: string): Author | undefined {
  if (slug === editorialTeam.slug) return editorialTeam
  return authors.find(a => a.slug === slug)
}

export function getAllAuthors(): Author[] {
  return authors
}

export { editorialTeam }
