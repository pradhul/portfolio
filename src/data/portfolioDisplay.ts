// Homepage curation — kept out of the sync-written `projects` array so
// `sync:portfolio` can create/update/remove cards without dropping this list.
// New synced projects land in the archive until an id is added here.

import { content } from '../lib/content'
import type { Project } from './projects'

export const FEATURED_PROJECT_IDS = [
  'glanceTv',
  'ionicMeasure',
  'squashPush',
  'vsColorCode',
  'linkShelf',
  'uploadSpec',
] as const

export type CategoryGroup = 'extensions' | 'web' | 'mobile' | 'tools'
export type ProjectFilter = 'all' | 'androidTv' | 'extensions' | 'inProgress' | 'archive'

export const PROJECT_FILTERS: ProjectFilter[] = [
  'all',
  'androidTv',
  'extensions',
  'inProgress',
  'archive',
]

type PortfolioEntry = { category?: string }

function portfolioEntry(projectId: string): PortfolioEntry | undefined {
  const portfolio = content.portfolio as unknown as Record<string, PortfolioEntry>
  return portfolio[projectId]
}

/** Always reads English source copy so translated category labels cannot break filters. */
export function getProjectCategory(projectId: string): string {
  return portfolioEntry(projectId)?.category ?? ''
}

export function filterGroupFromCategory(category: string): CategoryGroup {
  const normalized = category.toUpperCase()
  if (normalized.includes('EXTENSION')) return 'extensions'
  if (normalized.includes('MOBILE') || normalized.includes('ANDROID TV') || normalized.endsWith(' TV')) {
    return 'mobile'
  }
  if (normalized.includes('WEB') || normalized === 'PWA') return 'web'
  return 'tools'
}

export function matchesFilter(
  project: Project,
  filter: ProjectFilter,
  scope: 'featured' | 'archive' = 'featured'
): boolean {
  if (filter === 'all') return true
  if (filter === 'archive') return scope === 'archive'
  if (filter === 'inProgress') return project.status === 'in_progress'
  if (filter === 'androidTv') {
    const category = getProjectCategory(project.id).toUpperCase()
    return category.includes('ANDROID TV') || category.endsWith(' TV')
  }
  if (filter === 'extensions') {
    return filterGroupFromCategory(getProjectCategory(project.id)) === 'extensions'
  }
  return false
}

export function partitionProjects(all: Project[]): { featured: Project[]; archive: Project[] } {
  const byId = new Map(all.map((project) => [project.id, project]))
  const featured = FEATURED_PROJECT_IDS.map((id) => byId.get(id)).filter(
    (project): project is Project => Boolean(project)
  )
  const featuredIds = new Set(featured.map((project) => project.id))
  const archive = all.filter((project) => !featuredIds.has(project.id))
  return { featured, archive }
}
