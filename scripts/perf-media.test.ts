/**
 * Guards the mobile-performance media and contrast changes.
 * Run: npx tsx scripts/perf-media.test.ts
 */

import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'path'
import { fileURLToPath } from 'node:url'

import { projects } from '../src/data/projects'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

let failures = 0

function check(name: string, fn: () => void | Promise<void>) {
  return Promise.resolve()
    .then(fn)
    .then(() => {
      console.log(`  ok  ${name}`)
    })
    .catch((error) => {
      failures += 1
      console.error(`  FAIL ${name}`)
      console.error(`       ${error instanceof Error ? error.message : error}`)
    })
}

function relativeLuminance(hex: string): number {
  const normalized = hex.replace('#', '')
  const channels = [0, 2, 4].map((offset) => {
    const value = parseInt(normalized.slice(offset, offset + 2), 16) / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrastRatio(foreground: string, background: string): number {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background))
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background))
  return (lighter + 0.05) / (darker + 0.05)
}

async function run() {
  console.log('perf media')

  await check('squash-push uses compressed video instead of the raw GIF', () => {
    const squash = projects.find((project) => project.id === 'squashPush')
    assert.ok(squash)
    assert.ok(squash.media.video?.mp4.endsWith('.mp4'))
    assert.ok(squash.media.video?.webm?.endsWith('.webm'))
    assert.ok(squash.media.src.endsWith('.jpg'))
    assert.ok(!squash.media.src.endsWith('.gif'))
    assert.notEqual(squash.media.unoptimized, true)
  })

  await check('package.json no longer lists stray unused packages', async () => {
    const pkg = JSON.parse(await readFile(path.join(ROOT, 'package.json'), 'utf8')) as {
      dependencies: Record<string, string>
    }
    for (const name of ['npm', 'i', 'pdf-parse', '@fortawesome/fontawesome-free']) {
      assert.equal(pkg.dependencies[name], undefined, `${name} should not be a dependency`)
    }
  })

  await check('cream-faint meets 4.5:1 contrast on the ink background', async () => {
    const config = await readFile(path.join(ROOT, 'tailwind.config.ts'), 'utf8')
    const faint = config.match(/faint:\s*"([^"]+)"/)?.[1]
    assert.equal(faint, '#867e70')
    assert.ok(contrastRatio('#867e70', '#0f0d0b') >= 4.5)
  })

  await check('homepage summaries do not embed the raw GIF', async () => {
    const summary = await readFile(
      path.join(ROOT, 'src/app/portfolio/squashpush/SquashPushSummary.tsx'),
      'utf8'
    )
    assert.ok(!summary.includes('recording.gif'))
    assert.ok(summary.includes('DemoVideo'))
  })

  console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`)
  process.exit(failures === 0 ? 0 : 1)
}

void run()
