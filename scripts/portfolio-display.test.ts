/**
 * Homepage curation helpers — featured vs archive and category filters.
 * Run: npx tsx scripts/portfolio-display.test.ts
 */

import assert from 'node:assert/strict'

import { projects } from '../src/data/projects'
import { content } from '../src/lib/content'
import {
  FEATURED_PROJECT_IDS,
  filterGroupFromCategory,
  getProjectCategory,
  matchesFilter,
  partitionProjects,
} from '../src/data/portfolioDisplay'

let failures = 0

function check(name: string, fn: () => void) {
  try {
    fn()
    console.log(`  ok  ${name}`)
  } catch (error) {
    failures += 1
    console.error(`  FAIL ${name}`)
    console.error(`       ${error instanceof Error ? error.message : error}`)
  }
}

console.log('portfolio display')

check('features the six curated projects in declared order', () => {
  const { featured } = partitionProjects(projects)
  assert.deepEqual(
    featured.map((project) => project.id),
    [...FEATURED_PROJECT_IDS]
  )
})

check('archive holds every other project — nothing is dropped', () => {
  const { featured, archive } = partitionProjects(projects)
  const featuredIds = new Set(featured.map((project) => project.id))
  const archiveIds = archive.map((project) => project.id)
  const allIds = projects.map((project) => project.id)

  assert.equal(featured.length + archive.length, projects.length)
  assert.equal(new Set([...featuredIds, ...archiveIds]).size, projects.length)
  for (const id of allIds) {
    assert.ok(featuredIds.has(id) || archiveIds.includes(id), `missing ${id}`)
  }
})

check('weak / thin entries stay in the archive', () => {
  const { archive } = partitionProjects(projects)
  const archiveIds = archive.map((project) => project.id)
  for (const id of ['splitit', 'geminiTutorial', 'pradhul', 'smspend']) {
    assert.ok(archiveIds.includes(id), `${id} should be archived`)
  }
})

check('maps English categories onto the four filter groups', () => {
  assert.equal(filterGroupFromCategory('CHROME EXTENSION'), 'extensions')
  assert.equal(filterGroupFromCategory('VS CODE EXTENSION'), 'extensions')
  assert.equal(filterGroupFromCategory('WEB APP'), 'web')
  assert.equal(filterGroupFromCategory('PWA'), 'web')
  assert.equal(filterGroupFromCategory('MOBILE APP'), 'mobile')
  assert.equal(filterGroupFromCategory('ANDROID TV'), 'mobile')
  assert.equal(filterGroupFromCategory('TELEGRAM BOT'), 'tools')
  assert.equal(filterGroupFromCategory('CLI TOOL'), 'tools')
  assert.equal(filterGroupFromCategory('LIBRARY'), 'tools')
})

check('every live card has a category and a known filter group', () => {
  for (const project of projects) {
    const category = getProjectCategory(project.id)
    assert.ok(category, `${project.id} is missing portfolio.<id>.category`)
    const group = filterGroupFromCategory(category)
    assert.ok(['extensions', 'web', 'mobile', 'tools'].includes(group))
  }
})

check('filters return the expected featured ids', () => {
  const { featured, archive } = partitionProjects(projects)
  assert.deepEqual(
    featured.filter((project) => matchesFilter(project, 'extensions')).map((p) => p.id),
    ['ionicMeasure', 'squashPush', 'vsColorCode']
  )
  assert.deepEqual(
    featured.filter((project) => matchesFilter(project, 'androidTv')).map((p) => p.id),
    ['glanceTv']
  )
  assert.deepEqual(
    featured.filter((project) => matchesFilter(project, 'inProgress')).map((p) => p.id),
    ['squashPush', 'vsColorCode']
  )
  assert.deepEqual(
    featured.filter((project) => matchesFilter(project, 'archive')).map((p) => p.id),
    []
  )
  assert.ok(archive.every((project) => matchesFilter(project, 'archive', 'archive')))
  assert.ok(archive.some((project) => project.id === 'chartStudio'))
  assert.ok(featured.some((project) => project.id === 'uploadSpec'))
})

check('a project missing from the featured list is archived (sync-safe)', () => {
  const extra = {
    ...projects[0],
    id: 'brandNewSyncedCard',
    githubRepo: 'pradhul/brand-new',
  }
  const { featured, archive } = partitionProjects([...projects, extra])
  assert.ok(!featured.some((project) => project.id === 'brandNewSyncedCard'))
  assert.ok(archive.some((project) => project.id === 'brandNewSyncedCard'))
  assert.equal(featured.length + archive.length, projects.length + 1)
})

check('English content still has an entry for every project id', () => {
  const portfolio = content.portfolio as unknown as Record<string, unknown>
  for (const project of projects) {
    assert.equal(typeof portfolio[project.id], 'object', `content.portfolio.${project.id}`)
  }
})

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`)
process.exit(failures === 0 ? 0 : 1)
