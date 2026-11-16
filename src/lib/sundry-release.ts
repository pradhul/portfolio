export const SUNDRY_REPO = 'pradhul/sundry'
export const SUNDRY_RELEASES_URL = 'https://github.com/pradhul/sundry/releases'

export const SUNDRY_FALLBACK_RELEASE = {
  tag: 'v0.2.1',
  dmgUrl: 'https://github.com/pradhul/sundry/releases/download/v0.2.1/Sundry-0.2.1.dmg',
  releaseUrl: 'https://github.com/pradhul/sundry/releases/tag/v0.2.1',
} as const

export type SundryRelease = {
  tag: string
  dmgUrl: string
  releaseUrl: string
  fromFallback: boolean
}

type GitHubReleaseAsset = {
  name?: string
  browser_download_url?: string
}

type GitHubRelease = {
  tag_name?: string
  html_url?: string
  draft?: boolean
  prerelease?: boolean
  assets?: GitHubReleaseAsset[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

/** Returns a release when the GitHub payload is a published, non-prerelease tag with a DMG. */
export function parseLatestSundryRelease(payload: unknown): Omit<SundryRelease, 'fromFallback'> | null {
  if (!isRecord(payload)) return null
  const data = payload as GitHubRelease
  if (data.draft || data.prerelease) return null
  if (typeof data.tag_name !== 'string' || data.tag_name.length === 0) return null

  const dmg = (data.assets ?? []).find(
    (asset) =>
      typeof asset.name === 'string' &&
      asset.name.toLowerCase().endsWith('.dmg') &&
      typeof asset.browser_download_url === 'string' &&
      asset.browser_download_url.length > 0
  )
  if (!dmg?.browser_download_url) return null

  return {
    tag: data.tag_name,
    dmgUrl: dmg.browser_download_url,
    releaseUrl:
      typeof data.html_url === 'string' && data.html_url.length > 0
        ? data.html_url
        : `${SUNDRY_RELEASES_URL}/tag/${data.tag_name}`,
  }
}

export async function getLatestSundryRelease(): Promise<SundryRelease> {
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'pradhul-portfolio',
    }
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
    if (token) headers.Authorization = `Bearer ${token}`

    const response = await fetch(`https://api.github.com/repos/${SUNDRY_REPO}/releases/latest`, {
      headers,
      next: { revalidate: 3600 },
    })
    if (!response.ok) return { ...SUNDRY_FALLBACK_RELEASE, fromFallback: true }

    const parsed = parseLatestSundryRelease(await response.json())
    if (!parsed) return { ...SUNDRY_FALLBACK_RELEASE, fromFallback: true }
    return { ...parsed, fromFallback: false }
  } catch {
    return { ...SUNDRY_FALLBACK_RELEASE, fromFallback: true }
  }
}
