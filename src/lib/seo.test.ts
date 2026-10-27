/**
 * SEO helpers used by root layout metadata.
 * Run: npx tsx src/lib/seo.test.ts
 */

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import {
  SITE_HOST,
  SITE_URL,
  createPageMetadata,
  googleSiteVerification,
  pageUrl,
  pages,
  personJsonLd,
} from './seo'

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

console.log('canonical origin')

check('SITE_URL is the apex origin without www', () => {
  assert.equal(SITE_URL, 'https://pradhul.dev')
  assert.equal(SITE_HOST, 'pradhul.dev')
})

check('pageUrl prefixes public paths with the apex origin', () => {
  assert.equal(pageUrl('/'), 'https://pradhul.dev')
  assert.equal(pageUrl('/about'), 'https://pradhul.dev/about')
  assert.equal(pageUrl('/sitemap.xml'), 'https://pradhul.dev/sitemap.xml')
})

check('personJsonLd.url uses the apex origin', () => {
  assert.equal(personJsonLd.url, 'https://pradhul.dev')
})

check('createPageMetadata keeps relative canonical and OG URLs for metadataBase', () => {
  const metadata = createPageMetadata(pages.about)
  assert.equal(metadata.alternates?.canonical, '/about')
  assert.equal(metadata.openGraph?.url, '/about')
})

check('robots.txt omits Host and uses SITE_URL for Sitemap', () => {
  const source = readFileSync(join(process.cwd(), 'src/app/robots.ts'), 'utf8')
  assert.match(source, /sitemap:\s*`\$\{SITE_URL\}\/sitemap\.xml`/)
  assert.doesNotMatch(source, /\bhost\s*:/)
})

check('OG image brand mark uses SITE_HOST instead of a hardcoded www host', () => {
  const source = readFileSync(join(process.cwd(), 'src/lib/og.tsx'), 'utf8')
  assert.doesNotMatch(source, /www\.pradhul\.dev/)
  assert.match(source, /\{SITE_HOST\}/)
})

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
