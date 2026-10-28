/**
 * Locale detection — India defaults to English.
 * Run: npx tsx src/lib/countryToLanguage.test.ts
 */

import assert from 'node:assert/strict'
import { getLanguageFromBrowser, getLanguageFromCountry } from './countryToLanguage'

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

console.log('country to language')

check('maps India to English', () => {
  assert.equal(getLanguageFromCountry('IN'), 'en')
  assert.equal(getLanguageFromCountry('in'), 'en')
})

check('keeps automatic detection for other countries', () => {
  assert.equal(getLanguageFromCountry('FR'), 'fr')
  assert.equal(getLanguageFromCountry('DE'), 'de')
  assert.equal(getLanguageFromCountry('JP'), 'ja')
  assert.equal(getLanguageFromCountry('US'), 'en')
})

check('browser locales from India also default to English', () => {
  assert.equal(getLanguageFromBrowser('hi-IN'), 'en')
  assert.equal(getLanguageFromBrowser('en-IN'), 'en')
})

check('browser locales from other countries still follow the language tag', () => {
  assert.equal(getLanguageFromBrowser('fr-FR'), 'fr')
  assert.equal(getLanguageFromBrowser('de-DE'), 'de')
  assert.equal(getLanguageFromBrowser('hi'), 'hi')
})

if (failures > 0) {
  console.error(`\n${failures} test(s) failed`)
  process.exit(1)
}

console.log('\nall tests passed')
