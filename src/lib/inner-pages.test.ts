/**
 * /about and /portfolio must share homepage chrome, copy, and data.
 * Run: npx tsx src/lib/inner-pages.test.ts
 */

import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { content } from './content'
import { pages } from './seo'
import { projects } from '../data/projects'
import { FEATURED_PROJECT_IDS } from '../data/portfolioDisplay'

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

function read(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), 'utf8')
}

const PHONE = /\+91[\s-]*\d|9986981757|\btel:/i

console.log('about content')

check('keeps the rewritten résumé bio, skills, and no phone number', () => {
  const { paragraphs, skills } = content.about
  const bio = paragraphs.join(' ')
  assert.match(bio, /HashedIn/)
  assert.match(bio, /Brainistic/)
  assert.match(bio, /VS Code/)
  assert.match(bio, /MMA/)
  assert.ok(skills.includes('React'))
  assert.ok(skills.includes('Next.js'))
  assert.doesNotMatch(bio, PHONE)
  assert.doesNotMatch(JSON.stringify(content.about), PHONE)
})

check('expands About with structured experience and education from the résumé', () => {
  const { experience, education } = content.about
  assert.ok(Array.isArray(experience) && experience.length >= 2)
  assert.ok(experience.some((item) => /HashedIn/i.test(item.company) && /2015/.test(item.dates)))
  assert.ok(experience.some((item) => /Brainistic/i.test(item.company) && /2014/.test(item.dates)))
  assert.ok(Array.isArray(education) && education.length >= 2)
  assert.ok(education.some((item) => /Annamalai/i.test(item.school)))
  assert.ok(education.some((item) => /Kerala/i.test(item.school)))
  for (const item of [...experience, ...education]) {
    assert.doesNotMatch(JSON.stringify(item), PHONE)
  }
})

console.log('about page wiring')

check('about route keeps per-page metadata and renders the redesigned About page', () => {
  const source = read('src/app/about/page.tsx')
  assert.match(source, /createPageMetadata\(\s*pages\.about/)
  assert.match(source, /from ['"]@\/components\/AboutPage['"]/)
  assert.doesNotMatch(source, /Web and Mobile Developer with 8\+ years/)
  assert.doesNotMatch(source, PHONE)
})

check('AboutPage reuses homepage About copy, hire CTAs, and site chrome', () => {
  const source = read('src/components/AboutPage.tsx')
  assert.match(source, /from ['"]@\/components\/SitePage['"]/)
  assert.match(source, /from ['"]@\/components\/AboutContent['"]/)
  assert.match(source, /HireCtas/)
  assert.doesNotMatch(source, PHONE)
})

check('homepage About section reuses AboutContent instead of duplicating copy', () => {
  const source = read('src/components/HomePage.tsx')
  assert.match(source, /from ['"]@\/components\/AboutContent['"]/)
  assert.match(source, /<AboutContent/)
})

console.log('portfolio page wiring')

check('portfolio route keeps per-page metadata and does not use the old summaries', () => {
  const source = read('src/app/portfolio/page.tsx')
  assert.match(source, /createPageMetadata\(\s*pages\.portfolio/)
  assert.doesNotMatch(source, /SquashPushSummary|GlanceTvSummary|VSColorCodeSummary|ChartStudioSummary|UploadSpecSummary|LinkShelfSummary/)
  assert.doesNotMatch(source, /\.\/portfolio\//)
})

check('portfolio page reuses SitePage, PortfolioSection, and featured-project data', () => {
  const source = read('src/components/PortfolioPage.tsx')
  assert.match(source, /from ['"]@\/components\/SitePage['"]/)
  assert.match(source, /from ['"]@\/components\/PortfolioSection['"]/)
  assert.match(source, /<PortfolioSection/)
  assert.doesNotMatch(source, /FEATURED_PROJECT_IDS/)
  assert.ok(FEATURED_PROJECT_IDS.includes('glanceTv'))
})

check('SEO titles for the inner pages stay distinct from the homepage', () => {
  assert.equal(pages.about.path, '/about')
  assert.equal(pages.portfolio.path, '/portfolio')
  assert.notEqual(pages.about.title, pages.home.title)
  assert.notEqual(pages.portfolio.title, pages.home.title)
})

console.log('links')

check('every internal project card link has a matching App Router page', () => {
  const missing: string[] = []
  for (const project of projects) {
    for (const link of project.links) {
      if (!link.internal) continue
      const pageFile = join(process.cwd(), 'src/app', link.href.replace(/^\//, ''), 'page.tsx')
      if (!existsSync(pageFile)) missing.push(`${project.id} -> ${link.href}`)
    }
  }
  assert.deepEqual(missing, [])
})

check('resume download and inner-page nav targets exist', () => {
  assert.ok(existsSync(join(process.cwd(), 'public/PRADHUL_DEV_RESUME.pdf')))
  for (const href of ['/about', '/portfolio', '/contact', '/guestbook']) {
    const pageFile = join(process.cwd(), 'src/app', href.slice(1), 'page.tsx')
    assert.ok(existsSync(pageFile), `missing page for ${href}`)
  }
})

check('SitePage nav uses real routes (not in-page hashes) that exist', () => {
  const source = read('src/components/SitePage.tsx')
  const hrefs = [...source.matchAll(/href:\s*['"](\/[^'"]*)['"]/g)].map((match) => match[1])
  assert.ok(hrefs.includes('/'))
  assert.ok(hrefs.includes('/about'))
  assert.ok(hrefs.includes('/portfolio'))
  assert.ok(hrefs.includes('/contact'))
  assert.ok(hrefs.includes('/guestbook'))
  assert.doesNotMatch(source, /href:\s*['"]\/#/)
  for (const href of hrefs) {
    const filePath =
      href === '/'
        ? join(process.cwd(), 'src/app/page.tsx')
        : join(process.cwd(), 'src/app', href.replace(/^\//, ''), 'page.tsx')
    assert.ok(existsSync(filePath), `nav href 404: ${href}`)
  }
})

check('SitePage uses the CSS schematic grid instead of a 3D background', () => {
  const shell = read('src/components/SitePage.tsx')
  const background = read('src/components/SiteBackground.tsx')
  assert.match(shell, /SiteBackground/)
  assert.match(background, /schematic-grid/)
  assert.doesNotMatch(background, /ThreeBackground/)
})

check('keeps invented Stitch stats out of the shipped UI', () => {
  const sources = [
    'src/lib/content.ts',
    'src/components/HomePage.tsx',
    'src/components/AboutContent.tsx',
    'src/components/ContactForm.tsx',
  ].map(read).join('\n')
  assert.doesNotMatch(sources, /0 runtime crashes/i)
  assert.doesNotMatch(sources, /Heap utilization/i)
  assert.doesNotMatch(sources, /Sarah Connor/i)
  assert.doesNotMatch(sources, /10\+\s*years/)
  assert.doesNotMatch(sources, /Tolerance:\s*production stable/i)
})

if (failures > 0) {
  console.error(`\n${failures} test(s) failed`)
  process.exit(1)
}

console.log('\nall tests passed')
