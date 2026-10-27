/**
 * When to skip heavy Three.js backgrounds (mobile / reduced motion).
 * Run: npx tsx src/lib/motionPreference.test.ts
 */

import assert from 'node:assert/strict'

import { shouldLoadThreeBackground } from './motionPreference'

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

console.log('shouldLoadThreeBackground')

check('loads on a desktop viewport with a fine pointer', () => {
  assert.equal(
    shouldLoadThreeBackground({
      viewportWidth: 1280,
      pointerCoarse: false,
      reducedMotion: false,
    }),
    true
  )
})

check('skips on a phone-sized viewport', () => {
  assert.equal(
    shouldLoadThreeBackground({
      viewportWidth: 390,
      pointerCoarse: false,
      reducedMotion: false,
    }),
    false
  )
})

check('skips when the primary pointer is coarse (touch)', () => {
  assert.equal(
    shouldLoadThreeBackground({
      viewportWidth: 1280,
      pointerCoarse: true,
      reducedMotion: false,
    }),
    false
  )
})

check('skips when the user prefers reduced motion', () => {
  assert.equal(
    shouldLoadThreeBackground({
      viewportWidth: 1280,
      pointerCoarse: false,
      reducedMotion: true,
    }),
    false
  )
})

if (failures > 0) {
  console.error(`\n${failures} test(s) failed`)
  process.exit(1)
}

console.log('\nall tests passed')
