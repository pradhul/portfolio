/**
 * Pull-based portfolio sync.
 *
 * By default lists every repo you own on GitHub (public + private when the
 * token can see them), skips forks/archived/this portfolio repo, and for each
 * one either creates a new card or updates an existing entry when the release
 * tag or README changed. Gemini drafts copy; results land in a PR.
 *
 * Usage:
 *   npx tsx scripts/sync-portfolio-from-github.ts
 *   npx tsx scripts/sync-portfolio-from-github.ts --repo pradhul/quickplate
 *   npx tsx scripts/sync-portfolio-from-github.ts --force
 *
 * Token: set GH_PAT (classic `repo` or fine-grained read on your repos) so
 * private projects like unfear/SMSpend are visible. Falls back to GITHUB_TOKEN.
 *
 * Opt out a repo: add GitHub topic `no-portfolio`.
 */

import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import {
  generateProjectCard,
  type ExistingCard,
  type GeneratedCard,
  type GitHubReleaseInfo,
  type GitHubRepoInfo,
} from '../src/lib/generateProjectCard'
import { projects, type Project, type ProjectStatus } from '../src/data/projects'
import { content } from '../src/lib/content'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PROJECTS_FILE = path.join(ROOT, 'src/data/projects.ts')
const CONTENT_FILE = path.join(ROOT, 'src/lib/content.ts')
const PUBLIC_DIR = path.join(ROOT, 'public')
const SUMMARY_FILE = path.join(ROOT, '.sync-summary.md')

const GITHUB_API = 'https://api.github.com'
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']
const MAX_ENHANCEMENT_ISSUES = 5
const PORTFOLIO_REPO = process.env.PORTFOLIO_REPO ?? 'pradhul/portfolio'

type Args = {
  repo: string | null
  force: boolean
}

function parseArgs(argv: string[]): Args {
  const args: Args = { repo: null, force: false }
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--repo' && argv[i + 1]) {
      args.repo = argv[i + 1]
      i += 1
    } else if (argv[i] === '--force') {
      args.force = true
    }
  }
  return args
}

function githubToken(): string | undefined {
  return process.env.GH_PAT || process.env.GITHUB_TOKEN
}

function githubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'portfolio-sync',
  }
  const token = githubToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

async function githubJson<T>(endpoint: string): Promise<T | null> {
  const response = await fetch(`${GITHUB_API}${endpoint}`, { headers: githubHeaders() })
  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error(`GitHub ${endpoint} failed: ${response.status} ${response.statusText}`)
  }
  return (await response.json()) as T
}

type RawRepo = {
  full_name: string
  name: string
  description: string | null
  topics?: string[]
  homepage: string | null
  language: string | null
  private: boolean
  default_branch: string
  fork: boolean
  archived: boolean
  pushed_at?: string
}

/** Repos you own that should appear on the portfolio (unless --repo overrides). */
export async function fetchAllOwnerRepos(): Promise<RawRepo[]> {
  const token = githubToken()
  if (!token) {
    throw new Error('No GitHub token. Set GH_PAT or GITHUB_TOKEN.')
  }

  const all: RawRepo[] = []
  let page = 1

  while (true) {
    const batch = await githubJson<RawRepo[]>(
      `/user/repos?affiliation=owner&sort=pushed&per_page=100&page=${page}`
    )
    if (!batch || batch.length === 0) break
    all.push(...batch)
    if (batch.length < 100) break
    page += 1
  }

  return all
}

export function shouldSyncRepo(repo: RawRepo, portfolioRepo = PORTFOLIO_REPO): boolean {
  if (repo.fork) return false
  if (repo.archived) return false
  if (repo.full_name.toLowerCase() === portfolioRepo.toLowerCase()) return false
  if (repo.topics?.includes('no-portfolio')) return false
  return true
}

function countProjectsInSource(source: string): number {
  return (source.match(/\n    id: '/g) ?? []).length
}

type RawRelease = {
  tag_name: string
  name: string | null
  body: string | null
  html_url: string
  published_at: string
  assets?: Array<{ name: string; browser_download_url: string }>
}

type RawIssue = { title: string; pull_request?: unknown }

async function fetchReadme(fullName: string): Promise<string> {
  const response = await fetch(`${GITHUB_API}/repos/${fullName}/readme`, {
    headers: { ...githubHeaders(), Accept: 'application/vnd.github.raw' },
  })
  if (!response.ok) return ''
  return response.text()
}

/**
 * Collect image URLs the card could use, in the priority order from the plan:
 * README images, then release assets, then the repo's Open Graph preview.
 */
function collectImageCandidates(
  fullName: string,
  defaultBranch: string,
  readme: string,
  release: RawRelease | null
): string[] {
  const candidates: string[] = []

  const markdownImage = /!\[[^\]]*\]\(([^)\s]+)/g
  const htmlImage = /<img[^>]+src=["']([^"']+)["']/gi

  const pushReadmeUrl = (raw: string) => {
    let url = raw.trim()
    if (url.startsWith('<') && url.endsWith('>')) url = url.slice(1, -1)
    if (!url) return
    if (url.startsWith('//')) url = `https:${url}`
    if (!url.startsWith('http')) {
      // Relative README paths resolve against raw.githubusercontent.
      const clean = url.replace(/^\.\//, '').replace(/^\//, '')
      url = `https://raw.githubusercontent.com/${fullName}/${defaultBranch}/${clean}`
    }
    if (!candidates.includes(url)) candidates.push(url)
  }

  for (const match of readme.matchAll(markdownImage)) pushReadmeUrl(match[1])
  for (const match of readme.matchAll(htmlImage)) pushReadmeUrl(match[1])

  for (const asset of release?.assets ?? []) {
    if (IMAGE_EXTENSIONS.some((ext) => asset.name.toLowerCase().endsWith(ext))) {
      if (!candidates.includes(asset.browser_download_url)) {
        candidates.push(asset.browser_download_url)
      }
    }
  }

  candidates.push(`https://opengraph.githubassets.com/1/${fullName}`)

  return candidates
}

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 16)
}

function toCamelCaseId(repoName: string): string {
  return repoName
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, (_, chr: string) => chr.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '')
}

function getExistingCard(project: Project): ExistingCard | null {
  const portfolio = content.portfolio as unknown as Record<string, Record<string, unknown>>
  const entry = portfolio[project.id]
  if (!entry) return null
  return {
    id: project.id,
    category: String(entry.category ?? ''),
    title: String(entry.title ?? ''),
    description: String(entry.description ?? ''),
    demoLabel: String(entry.demoLabel ?? ''),
    features: Array.isArray(entry.features) ? (entry.features as string[]) : [],
    upcomingFeatures: Array.isArray(entry.upcomingFeatures)
      ? (entry.upcomingFeatures as string[])
      : [],
  }
}

async function downloadImage(url: string, destination: string): Promise<boolean> {
  try {
    const response = await fetch(url, { headers: githubHeaders() })
    if (!response.ok) return false
    const buffer = Buffer.from(await response.arrayBuffer())
    if (buffer.byteLength === 0) return false
    await mkdir(path.dirname(destination), { recursive: true })
    await writeFile(destination, buffer)
    return true
  } catch (error) {
    console.warn(`Could not download ${url}:`, error instanceof Error ? error.message : error)
    return false
  }
}

function extensionFor(url: string): string {
  const clean = url.split('?')[0].toLowerCase()
  const match = IMAGE_EXTENSIONS.find((ext) => clean.endsWith(ext))
  return match ?? '.png'
}

// --- Source file patching -------------------------------------------------
//
// The card copy and the project records are plain TypeScript literals, so the
// sync rewrites them textually. This keeps the committed files hand-editable
// and produces small, readable diffs in the PR.

export function tsString(value: string): string {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}

export function tsStringArray(values: string[], indent: string): string {
  if (values.length === 0) return '[]'
  const inner = values.map((value) => `${indent}  ${tsString(value)},`).join('\n')
  return `[\n${inner}\n${indent}]`
}

/** Replace a single `key: value` inside the `portfolio.<id>` object literal. */
export function replaceContentField(
  source: string,
  projectId: string,
  field: string,
  replacement: string
): string {
  const blockStart = source.indexOf(`\n    ${projectId}: {`)
  if (blockStart === -1) {
    throw new Error(`Could not find content block for "${projectId}"`)
  }
  const blockEnd = source.indexOf('\n    },', blockStart)
  if (blockEnd === -1) {
    throw new Error(`Could not find end of content block for "${projectId}"`)
  }

  const block = source.slice(blockStart, blockEnd)
  // Matches `field: <value>,` where the value may span lines (arrays, or a
  // string wrapped onto the next line). The value is rewritten onto one line
  // so the output formatting stays consistent regardless of the input shape.
  const pattern = new RegExp(`\\n {6}${field}:[\\s\\S]*?,(?=\\n {6}[a-zA-Z]|$)`)
  if (!pattern.test(block)) {
    throw new Error(`Could not find field "${field}" for "${projectId}"`)
  }
  const patched = block.replace(pattern, `\n      ${field}: ${replacement},`)
  return source.slice(0, blockStart) + patched + source.slice(blockEnd)
}

function buildContentBlock(card: GeneratedCard, labelKeys: string[]): string {
  const lines = [
    `    ${card.id}: {`,
    `      category: ${tsString(card.category)},`,
    `      title: ${tsString(card.title)},`,
    `      description: ${tsString(card.description)},`,
    `      features: ${tsStringArray(card.features, '      ')},`,
    `      upcomingFeatures: ${tsStringArray(card.upcomingFeatures, '      ')},`,
  ]
  for (const key of labelKeys) {
    const label =
      key === 'viewGitHub'
        ? 'View on GitHub'
        : key === 'liveDemo'
          ? 'Live Demo'
          : key === 'viewProject'
            ? 'View Project'
            : key === 'marketplace'
              ? 'VS Code Marketplace'
              : 'View on Chrome Web Store'
    lines.push(`      ${key}: ${tsString(label)},`)
  }
  lines.push(`      demoLabel: ${tsString(card.demoLabel)},`)
  lines.push('    },')
  return lines.join('\n')
}

function bumpContentVersion(source: string): string {
  return source.replace(/export const CONTENT_VERSION = '(\d+)'/, (_, version: string) => {
    return `export const CONTENT_VERSION = '${Number(version) + 1}'`
  })
}

/** Rewrite `status`, `release`, `lastSyncedAt` and `readmeHash` for one project. */
export function patchProjectRecord(
  source: string,
  projectId: string,
  update: {
    status: ProjectStatus
    release: { tag: string; url: string | null; publishedAt: string } | null
    readmeHash: string
    syncedAt: string
  }
): string {
  const blockStart = source.indexOf(`    id: '${projectId}',`)
  if (blockStart === -1) {
    throw new Error(`Could not find project record for "${projectId}"`)
  }
  const blockEnd = source.indexOf('\n  },', blockStart)
  if (blockEnd === -1) {
    throw new Error(`Could not find end of project record for "${projectId}"`)
  }

  let block = source.slice(blockStart, blockEnd)

  block = block.replace(/status: '(?:released|in_progress)',/, `status: '${update.status}',`)

  const releaseLiteral = update.release
    ? [
        'release: {',
        `      tag: ${tsString(update.release.tag)},`,
        `      url: ${update.release.url ? tsString(update.release.url) : 'null'},`,
        `      publishedAt: ${tsString(update.release.publishedAt)},`,
        '    },',
      ].join('\n    ')
    : 'release: null,'

  block = block.replace(/release: (?:null,|\{[\s\S]*?\n {4}\},)/, releaseLiteral)
  block = block.replace(/lastSyncedAt: .*?,/, `lastSyncedAt: ${tsString(update.syncedAt)},`)
  block = block.replace(/readmeHash: .*?,/, `readmeHash: ${tsString(update.readmeHash)},`)

  return source.slice(0, blockStart) + block + source.slice(blockEnd)
}

function buildProjectRecord(
  card: GeneratedCard,
  repo: GitHubRepoInfo,
  release: GitHubReleaseInfo | null,
  figure: string,
  media: { icon: string | null; demo: string | null },
  readmeHash: string,
  syncedAt: string
): string {
  const status: ProjectStatus = release ? 'released' : 'in_progress'
  const releaseLiteral = release
    ? `{
      tag: ${tsString(release.tag)},
      url: ${repo.isPrivate ? 'null' : tsString(release.url)},
      publishedAt: ${tsString(release.publishedAt.slice(0, 10))},
    }`
    : 'null'

  const iconLiteral = media.icon
    ? `{ type: 'image', src: ${tsString(media.icon)}, alt: ${tsString(`${card.title} Icon`)} }`
    : `{ type: 'lucide', name: 'Bookmark' }`

  const mediaLiteral = media.demo
    ? `{
      src: ${tsString(media.demo)},
      alt: ${tsString(card.title)},
      width: 800,
      height: 600,
    }`
    : `{
      src: ${tsString(`/${card.id}/demo.png`)},
      alt: ${tsString(card.title)},
      width: 800,
      height: 600,
    }`

  return `  {
    id: ${tsString(card.id)},
    githubRepo: ${tsString(repo.fullName)},
    status: '${status}',
    release: ${releaseLiteral},
    lastSyncedAt: ${tsString(syncedAt)},
    readmeHash: ${tsString(readmeHash)},
    figure: ${tsString(figure)},
    icon: ${iconLiteral},
    media: ${mediaLiteral},
    links: [
      {
        type: 'github',
        href: ${tsString(`https://github.com/${repo.fullName}`)},
        labelKey: 'viewGitHub',
        primary: true,
      },
    ],
  },
`
}

// --- Main -----------------------------------------------------------------

type SyncResult = {
  id: string
  repo: string
  action: 'created' | 'updated'
  status: ProjectStatus
  releaseTag: string | null
  features: number
  upcoming: number
}

async function syncRepo(
  fullName: string,
  existingProject: Project | undefined,
  force: boolean,
  files: { projects: string; content: string },
  projectCountRef: { value: number }
): Promise<{ result: SyncResult; files: { projects: string; content: string } } | null> {
  const rawRepo = await githubJson<RawRepo>(`/repos/${fullName}`)
  if (!rawRepo) {
    console.warn(`Skipping ${fullName}: repository not found or not accessible`)
    return null
  }

  const rawRelease = await githubJson<RawRelease>(`/repos/${fullName}/releases/latest`)
  const readme = await fetchReadme(fullName)
  const readmeHash = hash(readme)

  const releaseTag = rawRelease?.tag_name ?? null
  const storedTag = existingProject?.release?.tag ?? null
  const tagUnchanged = releaseTag === storedTag
  const readmeUnchanged = existingProject?.readmeHash === readmeHash

  if (existingProject && tagUnchanged && readmeUnchanged && !force) {
    console.log(`  ${fullName}: unchanged (${releaseTag ?? 'no release'})`)
    return null
  }

  // A repo can have a stored hash of null on first run; treat that as changed
  // but still avoid a Gemini call when nothing about the release moved.
  if (existingProject && tagUnchanged && existingProject.readmeHash === null && !force) {
    console.log(`  ${fullName}: recording baseline, no copy changes`)
    const patched = patchProjectRecord(files.projects, existingProject.id, {
      status: existingProject.status,
      release: existingProject.release,
      readmeHash,
      syncedAt: new Date().toISOString(),
    })
    return {
      result: {
        id: existingProject.id,
        repo: fullName,
        action: 'updated',
        status: existingProject.status,
        releaseTag,
        features: 0,
        upcoming: 0,
      },
      files: { ...files, projects: patched },
    }
  }

  console.log(`  ${fullName}: changed (${storedTag ?? 'none'} -> ${releaseTag ?? 'none'})`)

  const issues =
    (await githubJson<RawIssue[]>(
      `/repos/${fullName}/issues?state=open&labels=enhancement&per_page=${MAX_ENHANCEMENT_ISSUES}`
    )) ?? []

  const repoInfo: GitHubRepoInfo = {
    fullName: rawRepo.full_name,
    name: rawRepo.name,
    description: rawRepo.description,
    topics: rawRepo.topics ?? [],
    homepage: rawRepo.homepage,
    language: rawRepo.language,
    isPrivate: rawRepo.private,
  }

  const releaseInfo: GitHubReleaseInfo | null = rawRelease
    ? {
        tag: rawRelease.tag_name,
        name: rawRelease.name,
        body: rawRelease.body ?? '',
        url: rawRelease.html_url,
        publishedAt: rawRelease.published_at,
      }
    : null

  const imageCandidates = collectImageCandidates(
    fullName,
    rawRepo.default_branch,
    readme,
    rawRelease
  )

  const card = await generateProjectCard({
    repo: repoInfo,
    release: releaseInfo,
    readme,
    enhancementIssues: issues.filter((issue) => !issue.pull_request).map((issue) => issue.title),
    imageCandidates,
    existing: existingProject ? getExistingCard(existingProject) : null,
  })

  if (!existingProject) {
    card.id = toCamelCaseId(rawRepo.name)
  }

  const syncedAt = new Date().toISOString()
  let nextProjects = files.projects
  let nextContent = files.content

  if (existingProject) {
    nextContent = replaceContentField(
      nextContent,
      card.id,
      'description',
      tsString(card.description)
    )
    nextContent = replaceContentField(
      nextContent,
      card.id,
      'features',
      tsStringArray(card.features, '      ')
    )
    nextContent = replaceContentField(
      nextContent,
      card.id,
      'upcomingFeatures',
      tsStringArray(card.upcomingFeatures, '      ')
    )

    nextProjects = patchProjectRecord(nextProjects, card.id, {
      status: releaseInfo ? 'released' : 'in_progress',
      release: releaseInfo
        ? {
            tag: releaseInfo.tag,
            url: repoInfo.isPrivate ? null : releaseInfo.url,
            publishedAt: releaseInfo.publishedAt.slice(0, 10),
          }
        : null,
      readmeHash,
      syncedAt,
    })
  } else {
    // New project: download media, then append both records.
    const media: { icon: string | null; demo: string | null } = { icon: null, demo: null }
    if (card.iconUrl) {
      const dest = `/${card.id}/icon${extensionFor(card.iconUrl)}`
      if (await downloadImage(card.iconUrl, path.join(PUBLIC_DIR, dest))) media.icon = dest
    }
    if (card.demoUrl) {
      const dest = `/${card.id}/demo${extensionFor(card.demoUrl)}`
      if (await downloadImage(card.demoUrl, path.join(PUBLIC_DIR, dest))) media.demo = dest
    }

    projectCountRef.value += 1
    const figure = `Fig. ${String(projectCountRef.value).padStart(2, '0')}`
    const record = buildProjectRecord(
      card,
      repoInfo,
      releaseInfo,
      figure,
      media,
      readmeHash,
      syncedAt
    )

    const anchor = '\n]\n\nexport function findProjectByRepo'
    if (!nextProjects.includes(anchor)) {
      throw new Error('Could not find the end of the projects array')
    }
    nextProjects = nextProjects.replace(anchor, `${record}]\n\nexport function findProjectByRepo`)

    const contentAnchor = '\n  },\n  contact: {'
    if (!nextContent.includes(contentAnchor)) {
      throw new Error('Could not find the end of the portfolio content block')
    }
    nextContent = nextContent.replace(
      contentAnchor,
      `\n${buildContentBlock(card, ['viewGitHub'])}\n  },\n  contact: {`
    )
  }

  return {
    result: {
      id: card.id,
      repo: fullName,
      action: existingProject ? 'updated' : 'created',
      status: releaseInfo ? 'released' : 'in_progress',
      releaseTag,
      features: card.features.length,
      upcoming: card.upcomingFeatures.length,
    },
    files: { projects: nextProjects, content: nextContent },
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  let targets: string[]
  if (args.repo) {
    targets = [args.repo]
  } else {
    const allRepos = await fetchAllOwnerRepos()
    const eligible = allRepos.filter((repo) => shouldSyncRepo(repo))
    const skipped = allRepos.length - eligible.length
    targets = eligible.map((repo) => repo.full_name)

    const privateCount = eligible.filter((repo) => repo.private).length
    console.log(
      `Discovered ${allRepos.length} owned repo(s): syncing ${targets.length}` +
        (skipped ? `, skipped ${skipped} (fork/archived/portfolio/no-portfolio)` : '') +
        (privateCount ? `, including ${privateCount} private` : '')
    )

    if (allRepos.some((repo) => repo.private) && !process.env.GH_PAT) {
      console.warn(
        'Tip: private repos need GH_PAT (classic repo scope or fine-grained read) — GITHUB_TOKEN in Actions only sees this repo.'
      )
    }
  }

  console.log(`Checking ${targets.length} repo(s)${args.force ? ' (force)' : ''}...`)

  const originalContent = await readFile(CONTENT_FILE, 'utf8')
  let files = {
    projects: await readFile(PROJECTS_FILE, 'utf8'),
    content: originalContent,
  }

  const projectCountRef = { value: countProjectsInSource(files.projects) }
  const knownProjects = new Map(
    projects.map((project) => [project.githubRepo.toLowerCase(), project] as const)
  )

  const results: SyncResult[] = []

  for (const target of targets) {
    const existing = knownProjects.get(target.toLowerCase())
    try {
      const outcome = await syncRepo(target, existing, args.force, files, projectCountRef)
      if (outcome) {
        files = outcome.files
        results.push(outcome.result)
        if (outcome.result.action === 'created') {
          knownProjects.set(target.toLowerCase(), {
            id: outcome.result.id,
            githubRepo: target,
            status: outcome.result.status,
            release: null,
            lastSyncedAt: new Date().toISOString(),
            readmeHash: null,
            figure: '',
            icon: { type: 'lucide', name: 'Bookmark' },
            media: { src: '', alt: '', width: 800, height: 600 },
            links: [],
          })
        }
      }
    } catch (error) {
      console.error(`Failed to sync ${target}:`, error instanceof Error ? error.message : error)
      process.exitCode = 1
      return
    }
  }

  if (results.length === 0) {
    console.log('Nothing changed. No files written.')
    await writeFile(SUMMARY_FILE, '')
    return
  }

  // Only invalidate cached translations when the copy itself moved.
  if (files.content !== originalContent) {
    files.content = bumpContentVersion(files.content)
  }

  await writeFile(PROJECTS_FILE, files.projects)
  await writeFile(CONTENT_FILE, files.content)

  const summary = [
    '## Portfolio sync',
    '',
    ...results.map((result) => {
      const badge = result.status === 'released' ? result.releaseTag : 'In Progress'
      return `- **${result.id}** (${result.repo}) — ${result.action}, badge \`${badge}\`, ${result.features} feature(s), ${result.upcoming} upcoming`
    }),
    '',
    'Copy was drafted by Gemini from the README and release notes. Review the wording and screenshots before merging.',
  ].join('\n')

  await writeFile(SUMMARY_FILE, summary)
  console.log(`\n${summary}`)
}

// Guarded so the patch helpers above can be imported by tests without running a sync.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
