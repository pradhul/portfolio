/**
 * SEO helpers used by root layout metadata.
 * Run: npx tsx src/lib/seo.test.ts
 */

import assert from 'node:assert/strict'

import { googleSiteVerification } from './seo'

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

console.log('googleSiteVerification')

check('returns google verification when the env value is present', () => {
  assert.deepEqual(googleSiteVerification('abc123'), { google: 'abc123' })
})

check('omits verification when the env value is missing or blank', () => {
  assert.equal(googleSiteVerification(undefined), undefined)
  assert.equal(googleSiteVerification(''), undefined)
  assert.equal(googleSiteVerification('   '), undefined)
})

if (failures > 0) {
  console.error(`\n${failures} test(s) failed`)
  process.exit(1)
}

console.log('\nall tests passed')
