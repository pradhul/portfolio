import type { Metadata } from 'next'
import { createPageMetadata, pages } from '@/lib/seo'
import { getLatestSmspendRelease } from '@/lib/smspend-release'
import SmspendContent from './SmspendContent'

export const revalidate = 3600

export const metadata: Metadata = createPageMetadata(pages.smspend)

export default async function SmspendPortfolio() {
  const release = await getLatestSmspendRelease()
  return <SmspendContent release={release} />
}
