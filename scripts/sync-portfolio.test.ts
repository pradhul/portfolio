/**
 * Exercises the source-file patching used by the sync against the real
 * projects.ts and content.ts, without calling GitHub or Gemini.
 *
 * Run: npx tsx scripts/sync-portfolio.test.ts
 */

import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  patchProjectRecord,
  replaceContentField,
  shouldSyncRepo,
  tsString,
  tsStringArray,
} from './sync-portfolio-from-github'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

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

async function run() {
const projectsSource = await readFile(path.join(ROOT, 'src/data/projects.ts'), 'utf8')
const contentSource = await readFile(path.join(ROOT, 'src/lib/content.ts'), 'utf8')

console.log('content.ts patching')

check('rewrites a single-line description', () => {
  const next = replaceContentField(
    contentSource,
    'quickPlate',
    'description',
    tsString('A brand new description.')
  )
  assert.match(next, /description: 'A brand new description\.',/)
  assert.ok(!next.includes('Private Telegram bot for a small household'))
})

check('rewrites a multi-line wrapped description', () => {
  const next = replaceContentField(
    contentSource,
    'linkShelf',
    'description',
    tsString('Short now.')
  )
  assert.match(next, /linkShelf: \{[\s\S]*?description: 'Short now\.',/)
  // The following field must survive intact.
  assert.match(next, /linkShelf: \{[\s\S]*?liveDemo: 'Live Demo',/)
})

check('rewrites a features array', () => {
  const next = replaceContentField(
    contentSource,
    'chartStudio',
    'features',
    tsStringArray(['One thing', 'Two thing'], '      ')
  )
  assert.match(next, /features: \[\n {8}'One thing',\n {8}'Two thing',\n {6}\],/)
  assert.ok(!next.includes('Export finished charts as PNG or PDF'))
})

check('fills an empty upcomingFeatures array', () => {
  const next = replaceContentField(
    contentSource,
    'quickPlate',
    'upcomingFeatures',
    tsStringArray(['Weekly meal-plan digest'], '      ')
  )
  assert.match(next, /upcomingFeatures: \[\n {8}'Weekly meal-plan digest',\n {6}\],/)
})

check('escapes apostrophes safely', () => {
  const next = replaceContentField(
    contentSource,
    'quickPlate',
    'description',
    tsString("It's a bot — handles \"quotes\" too.")
  )
  assert.ok(next.includes("description: 'It\\'s a bot — handles \"quotes\" too.',"))
})

check('rejects an unknown project id', () => {
  assert.throws(() => replaceContentField(contentSource, 'nopeProject', 'description', "'x'"))
})

console.log('\nprojects.ts patching')

check('promotes an in-progress project to released', () => {
  const next = patchProjectRecord(projectsSource, 'squashPush', {
    status: 'released',
    release: { tag: 'v2.0.0', url: 'https://example.com/r/v2.0.0', publishedAt: '2026-08-20' },
    readmeHash: 'abc123',
    syncedAt: '2026-08-28T00:00:00.000Z',
  })
  assert.match(next, /id: 'squashPush',[\s\S]*?status: 'released',/)
  assert.match(next, /id: 'squashPush',[\s\S]*?tag: 'v2\.0\.0',/)
  assert.match(next, /id: 'squashPush',[\s\S]*?url: 'https:\/\/example\.com\/r\/v2\.0\.0',/)
  assert.match(next, /id: 'squashPush',[\s\S]*?readmeHash: 'abc123',/)
  // Untouched neighbours.
  assert.match(next, /id: 'squashPush',[\s\S]*?figure: 'Fig\. 02',/)
})

check('demotes a released project back to in progress', () => {
  const next = patchProjectRecord(projectsSource, 'quickPlate', {
    status: 'in_progress',
    release: null,
    readmeHash: 'def456',
    syncedAt: '2026-08-28T00:00:00.000Z',
  })
  assert.match(next, /id: 'quickPlate',[\s\S]*?status: 'in_progress',/)
  assert.match(next, /id: 'quickPlate',[\s\S]*?release: null,/)
  assert.ok(!/id: 'quickPlate',[\s\S]*?tag: 'v1\.0\.0'/.test(next))
})

check('bumps an existing release tag', () => {
  const next = patchProjectRecord(projectsSource, 'linkShelf', {
    status: 'released',
    release: { tag: 'v1.2.0', url: 'https://example.com/r/v1.2.0', publishedAt: '2026-08-27' },
    readmeHash: 'ghi789',
    syncedAt: '2026-08-28T00:00:00.000Z',
  })
  assert.match(next, /id: 'linkShelf',[\s\S]*?tag: 'v1\.2\.0',/)
  assert.ok(!next.includes("tag: 'v1.1.0'"))
  // The next project record must be untouched.
  assert.match(next, /id: 'quickPlate',[\s\S]*?tag: 'v1\.0\.0',/)
})

check('keeps a private repo release unlinked', () => {
  const next = patchProjectRecord(projectsSource, 'uploadSpec', {
    status: 'released',
    release: { tag: 'v1.1.0', url: null, publishedAt: '2026-08-27' },
    readmeHash: 'jkl012',
    syncedAt: '2026-08-28T00:00:00.000Z',
  })
  assert.match(next, /id: 'uploadSpec',[\s\S]*?tag: 'v1\.1\.0',\n\s*url: null,/)
})

check('rejects an unknown project id', () => {
  assert.throws(() =>
    patchProjectRecord(projectsSource, 'nopeProject', {
      status: 'released',
      release: null,
      readmeHash: 'x',
      syncedAt: 'y',
    })
  )
})

console.log('\nrepo discovery filters')

const repo = (overrides: Partial<Parameters<typeof shouldSyncRepo>[0]>) => ({
  full_name: 'pradhul/example',
  name: 'example',
  description: null,
  homepage: null,
  language: null,
  private: false,
  default_branch: 'main',
  fork: false,
  archived: false,
  ...overrides,
})

check('includes a normal public repo', () => {
  assert.equal(shouldSyncRepo(repo({})), true)
})

check('skips forks', () => {
  assert.equal(shouldSyncRepo(repo({ fork: true })), false)
})

check('skips archived repos', () => {
  assert.equal(shouldSyncRepo(repo({ archived: true })), false)
})

check('skips the portfolio repo itself', () => {
  assert.equal(shouldSyncRepo(repo({ full_name: 'pradhul/portfolio' })), false)
})

check('skips repos tagged no-portfolio', () => {
  assert.equal(shouldSyncRepo(repo({ topics: ['no-portfolio'] })), false)
})

check('includes private repos when listed', () => {
  assert.equal(shouldSyncRepo(repo({ private: true, full_name: 'pradhul/unfear' })), true)
})

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`)
process.exit(failures === 0 ? 0 : 1)
}

run()
