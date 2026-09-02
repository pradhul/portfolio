import { GoogleGenerativeAI } from '@google/generative-ai'
import { content } from './content'

export type GitHubReleaseInfo = {
  tag: string
  name: string | null
  body: string
  url: string
  publishedAt: string
}

export type GitHubRepoInfo = {
  fullName: string
  name: string
  description: string | null
  topics: string[]
  homepage: string | null
  language: string | null
  isPrivate: boolean
}

export type ExistingCard = {
  id: string
  category: string
  title: string
  description: string
  demoLabel: string
  features: string[]
  upcomingFeatures: string[]
}

export type GenerateCardInput = {
  repo: GitHubRepoInfo
  release: GitHubReleaseInfo | null
  readme: string
  /** Titles of open issues labeled `enhancement`, capped by the caller. */
  enhancementIssues: string[]
  /** Candidate image URLs found in the README and release assets. */
  imageCandidates: string[]
  existing: ExistingCard | null
}

export type GeneratedCard = {
  id: string
  category: string
  title: string
  description: string
  demoLabel: string
  features: string[]
  upcomingFeatures: string[]
  iconUrl: string | null
  demoUrl: string | null
}

const MODEL = 'gemini-2.5-flash'
const README_CHAR_LIMIT = 12000
const RELEASE_BODY_CHAR_LIMIT = 6000

const CATEGORIES = [
  'CHROME EXTENSION',
  'VS CODE EXTENSION',
  'WEB APP',
  'PWA',
  'TELEGRAM BOT',
  'CLI TOOL',
  'LIBRARY',
  'MOBILE APP',
]

/** Existing cards double as few-shot examples so generated copy matches the site voice. */
function styleExamples(): string {
  const portfolio = content.portfolio as Record<string, unknown>
  const examples = ['ionicMeasure', 'linkShelf', 'quickPlate']
    .map((key) => portfolio[key])
    .filter(Boolean)

  return JSON.stringify(examples, null, 2)
}

function truncate(text: string, limit: number): string {
  if (text.length <= limit) return text
  return `${text.slice(0, limit)}\n...[truncated]`
}

function buildPrompt(input: GenerateCardInput): string {
  const { repo, release, readme, enhancementIssues, imageCandidates, existing } = input

  const releaseBlock = release
    ? `Tag: ${release.tag}
Name: ${release.name ?? release.tag}
Published: ${release.publishedAt}
Notes:
${truncate(release.body || '(no release notes)', RELEASE_BODY_CHAR_LIMIT)}`
    : 'NO RELEASES. This project has never published a GitHub release, so it is still in progress.'

  return `You write project cards for Pradhul Dev's developer portfolio website.

Your job: turn GitHub data into ONE project card that reads exactly like the existing cards on the site.

## Existing cards (match this voice, length, and structure)

${styleExamples()}

## Repository

Name: ${repo.fullName}
Description: ${repo.description ?? '(none)'}
Topics: ${repo.topics.join(', ') || '(none)'}
Homepage: ${repo.homepage || '(none)'}
Primary language: ${repo.language ?? '(unknown)'}

## Latest release

${releaseBlock}

## README

${truncate(readme || '(no README)', README_CHAR_LIMIT)}

## Open issues labeled "enhancement"

${enhancementIssues.length ? enhancementIssues.map((title) => `- ${title}`).join('\n') : '(none)'}

## Candidate image URLs found in the README and release assets

${imageCandidates.length ? imageCandidates.map((url) => `- ${url}`).join('\n') : '(none)'}

## Existing card for this project (null means this is a brand new card)

${existing ? JSON.stringify(existing, null, 2) : 'null'}

## Rules

1. "description" is 2-3 sentences, present tense, concrete about what the tool does and what it is built with. Match the length and tone of the examples above. Use an em dash the way the examples do.
2. "features" lists what already works. Draw from the release notes first, then the README. Between 2 and 5 short items, each under 90 characters, no trailing period.
3. "upcomingFeatures" lists planned work drawn from the README roadmap, a "What's next" or "TODO" section, or the enhancement issues. Return an empty array if there is no clear evidence of planned work. Never pad it.
4. NEVER invent a feature, integration, or capability that is not stated in the README or release notes.
5. "category" must be one of: ${CATEGORIES.join(', ')}. Pick the closest fit.
6. "demoLabel" is a short caption for the screenshot frame, like "Link Shelf" or "QuickPlate in Telegram".
7. "id" is camelCase derived from the repo name, for example "link-shelf" becomes "linkShelf". If an existing card is provided, reuse its id exactly.
8. "iconUrl" and "demoUrl" must be chosen from the candidate image URLs above, or null if none fit. The icon is a small logo or app icon; the demo is a screenshot or recording. Never invent a URL.
9. If an existing card is provided, preserve its wording wherever the GitHub data does not contradict it. Only rewrite what genuinely changed.

Respond with ONLY this JSON object, no markdown fences and no commentary:

{
  "id": "string",
  "category": "string",
  "title": "string",
  "description": "string",
  "demoLabel": "string",
  "features": ["string"],
  "upcomingFeatures": ["string"],
  "iconUrl": "string or null",
  "demoUrl": "string or null"
}`
}

function stripCodeFences(text: string): string {
  let jsonText = text.trim()
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/```\n?/g, '')
  }
  return jsonText.trim()
}

function asStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value)) {
    throw new Error(`Gemini returned a non-array "${field}"`)
  }
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Gemini returned an empty "${field}"`)
  }
  return value.trim()
}

function optionalUrl(value: unknown, allowed: string[]): string | null {
  if (typeof value !== 'string' || value.trim().length === 0) return null
  const url = value.trim()
  // Guard against hallucinated URLs — only candidates we actually discovered.
  return allowed.includes(url) ? url : null
}

function validate(raw: unknown, input: GenerateCardInput): GeneratedCard {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Gemini did not return a JSON object')
  }
  const obj = raw as Record<string, unknown>

  const category = requireString(obj.category, 'category').toUpperCase()
  if (!CATEGORIES.includes(category)) {
    throw new Error(`Gemini returned an unknown category: ${category}`)
  }

  const features = asStringArray(obj.features, 'features')
  if (features.length === 0) {
    throw new Error('Gemini returned no features')
  }

  return {
    id: input.existing?.id ?? requireString(obj.id, 'id'),
    category,
    title: requireString(obj.title, 'title'),
    description: requireString(obj.description, 'description'),
    demoLabel: requireString(obj.demoLabel, 'demoLabel'),
    features,
    upcomingFeatures: asStringArray(obj.upcomingFeatures, 'upcomingFeatures'),
    iconUrl: optionalUrl(obj.iconUrl, input.imageCandidates),
    demoUrl: optionalUrl(obj.demoUrl, input.imageCandidates),
  }
}

/**
 * Ask Gemini to draft a portfolio card from GitHub data.
 * Retries once on malformed output, then throws so the workflow fails
 * loudly instead of committing garbage.
 */
export async function generateProjectCard(input: GenerateCardInput): Promise<GeneratedCard> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set')
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: MODEL })
  const prompt = buildPrompt(input)

  let lastError: unknown
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const result = await model.generateContent(prompt)
      const text = result.response.text()
      return validate(JSON.parse(stripCodeFences(text)), input)
    } catch (error) {
      lastError = error
      console.warn(
        `Gemini card generation attempt ${attempt} failed for ${input.repo.fullName}:`,
        error instanceof Error ? error.message : error
      )
    }
  }

  throw new Error(
    `Could not generate a valid card for ${input.repo.fullName}: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`
  )
}
