export const SMSPEND_REPO = 'pradhul/SMSpend'
export const SMSPEND_RELEASES_URL = 'https://github.com/pradhul/SMSpend/releases'
export const SMSPEND_UNKNOWN_SOURCES_HELP = 'https://support.google.com/android/answer/9457058'
export const SMSPEND_RESTRICTED_SETTINGS_HELP = 'https://support.google.com/android/answer/12623953'

export const SMSPEND_FALLBACK_RELEASE = {
  tag: 'v1.3.1',
  apkUrl: 'https://github.com/pradhul/SMSpend/releases/download/v1.3.1/SMSpend-1.3.1.apk',
  releaseUrl: 'https://github.com/pradhul/SMSpend/releases/tag/v1.3.1',
} as const

export type SmspendRelease = {
  tag: string
  apkUrl: string
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

/** Returns a release when the GitHub payload is a published, non-prerelease tag with an APK. */
export function parseLatestSmspendRelease(payload: unknown): Omit<SmspendRelease, 'fromFallback'> | null {
  if (!isRecord(payload)) return null
  const data = payload as GitHubRelease
  if (data.draft || data.prerelease) return null
  if (typeof data.tag_name !== 'string' || data.tag_name.length === 0) return null

  const apk = (data.assets ?? []).find(
    (asset) =>
      typeof asset.name === 'string' &&
      asset.name.toLowerCase().endsWith('.apk') &&
      typeof asset.browser_download_url === 'string' &&
      asset.browser_download_url.length > 0
  )
  if (!apk?.browser_download_url) return null

  return {
    tag: data.tag_name,
    apkUrl: apk.browser_download_url,
    releaseUrl:
      typeof data.html_url === 'string' && data.html_url.length > 0
        ? data.html_url
        : `${SMSPEND_RELEASES_URL}/tag/${data.tag_name}`,
  }
}

export async function getLatestSmspendRelease(): Promise<SmspendRelease> {
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'pradhul-portfolio',
    }
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
    if (token) headers.Authorization = `Bearer ${token}`

    const response = await fetch(`https://api.github.com/repos/${SMSPEND_REPO}/releases/latest`, {
      headers,
      next: { revalidate: 3600 },
    })
    if (!response.ok) return { ...SMSPEND_FALLBACK_RELEASE, fromFallback: true }

    const parsed = parseLatestSmspendRelease(await response.json())
    if (!parsed) return { ...SMSPEND_FALLBACK_RELEASE, fromFallback: true }
    return { ...parsed, fromFallback: false }
  } catch {
    return { ...SMSPEND_FALLBACK_RELEASE, fromFallback: true }
  }
}
