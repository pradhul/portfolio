/**
 * Sundry latest-release parsing and fallbacks.
 * Run: npx tsx src/lib/sundry-release.test.ts
 */

import assert from 'node:assert/strict'
import { SUNDRY_FALLBACK_RELEASE, parseLatestSundryRelease } from './sundry-release'

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

console.log('sundry release')

check('parses a stable release with a versioned DMG asset', () => {
  const parsed = parseLatestSundryRelease({
    tag_name: 'v0.2.1',
    html_url: 'https://github.com/pradhul/sundry/releases/tag/v0.2.1',
    draft: false,
    prerelease: false,
    assets: [
      { name: 'notes.md', browser_download_url: 'https://example.com/notes.md' },
      {
        name: 'Sundry-0.2.1.dmg',
        browser_download_url: 'https://github.com/pradhul/sundry/releases/download/v0.2.1/Sundry-0.2.1.dmg',
      },
    ],
  })
  assert.deepEqual(parsed, {
    tag: 'v0.2.1',
    dmgUrl: 'https://github.com/pradhul/sundry/releases/download/v0.2.1/Sundry-0.2.1.dmg',
    releaseUrl: 'https://github.com/pradhul/sundry/releases/tag/v0.2.1',
  })
})

check('rejects prereleases, drafts, and releases without a DMG', () => {
  assert.equal(
    parseLatestSundryRelease({
      tag_name: 'v0.3.0-rc.1',
      prerelease: true,
      assets: [{ name: 'Sundry-0.3.0-rc.1.dmg', browser_download_url: 'https://example.com/x.dmg' }],
    }),
    null
  )
  assert.equal(
    parseLatestSundryRelease({
      tag_name: 'v0.2.2',
      draft: true,
      assets: [{ name: 'Sundry-0.2.2.dmg', browser_download_url: 'https://example.com/x.dmg' }],
    }),
    null
  )
  assert.equal(
    parseLatestSundryRelease({
      tag_name: 'v0.2.1',
      assets: [{ name: 'notes.md', browser_download_url: 'https://example.com/notes.md' }],
    }),
    null
  )
  assert.equal(parseLatestSundryRelease(null), null)
  assert.equal(parseLatestSundryRelease({}), null)
})

check('hardcodes v0.2.1 as the API fallback', () => {
  assert.equal(SUNDRY_FALLBACK_RELEASE.tag, 'v0.2.1')
  assert.equal(
    SUNDRY_FALLBACK_RELEASE.dmgUrl,
    'https://github.com/pradhul/sundry/releases/download/v0.2.1/Sundry-0.2.1.dmg'
  )
})

if (failures > 0) {
  console.error(`\n${failures} test(s) failed`)
  process.exit(1)
}

console.log('\nall tests passed')
