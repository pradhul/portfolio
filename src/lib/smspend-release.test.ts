/**
 * SMSpend latest-release parsing and fallbacks.
 * Run: npx tsx src/lib/smspend-release.test.ts
 */

import assert from 'node:assert/strict'
import {
  SMSPEND_FALLBACK_RELEASE,
  SMSPEND_RESTRICTED_SETTINGS_HELP,
  SMSPEND_UNKNOWN_SOURCES_HELP,
  parseLatestSmspendRelease,
} from './smspend-release'

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

console.log('smspend release')

check('parses a stable release with a versioned APK asset', () => {
  const parsed = parseLatestSmspendRelease({
    tag_name: 'v1.3.1',
    html_url: 'https://github.com/pradhul/SMSpend/releases/tag/v1.3.1',
    draft: false,
    prerelease: false,
    assets: [
      { name: 'checksums.txt', browser_download_url: 'https://example.com/checksums.txt' },
      {
        name: 'SMSpend-1.3.1.apk',
        browser_download_url: 'https://github.com/pradhul/SMSpend/releases/download/v1.3.1/SMSpend-1.3.1.apk',
      },
    ],
  })
  assert.deepEqual(parsed, {
    tag: 'v1.3.1',
    apkUrl: 'https://github.com/pradhul/SMSpend/releases/download/v1.3.1/SMSpend-1.3.1.apk',
    releaseUrl: 'https://github.com/pradhul/SMSpend/releases/tag/v1.3.1',
  })
})

check('rejects prereleases, drafts, and releases without an APK', () => {
  assert.equal(
    parseLatestSmspendRelease({
      tag_name: 'v1.4.0-rc.1',
      prerelease: true,
      assets: [{ name: 'SMSpend-1.4.0-rc.1.apk', browser_download_url: 'https://example.com/x.apk' }],
    }),
    null
  )
  assert.equal(
    parseLatestSmspendRelease({
      tag_name: 'v1.3.2',
      draft: true,
      assets: [{ name: 'SMSpend-1.3.2.apk', browser_download_url: 'https://example.com/x.apk' }],
    }),
    null
  )
  assert.equal(
    parseLatestSmspendRelease({
      tag_name: 'v1.3.1',
      assets: [{ name: 'notes.md', browser_download_url: 'https://example.com/notes.md' }],
    }),
    null
  )
  assert.equal(parseLatestSmspendRelease(null), null)
  assert.equal(parseLatestSmspendRelease({}), null)
})

check('hardcodes v1.3.1 as the API fallback and official Google help URLs', () => {
  assert.equal(SMSPEND_FALLBACK_RELEASE.tag, 'v1.3.1')
  assert.equal(
    SMSPEND_FALLBACK_RELEASE.apkUrl,
    'https://github.com/pradhul/SMSpend/releases/download/v1.3.1/SMSpend-1.3.1.apk'
  )
  assert.equal(SMSPEND_UNKNOWN_SOURCES_HELP, 'https://support.google.com/android/answer/9457058')
  assert.equal(SMSPEND_RESTRICTED_SETTINGS_HELP, 'https://support.google.com/android/answer/12623953')
})

if (failures > 0) {
  console.error(`\n${failures} test(s) failed`)
  process.exit(1)
}

console.log('\nall tests passed')
