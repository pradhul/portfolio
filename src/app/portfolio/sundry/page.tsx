import type { Metadata } from 'next'
import { createPageMetadata, pages } from '@/lib/seo'
import { getLatestSundryRelease } from '@/lib/sundry-release'
import SundryContent from './SundryContent'

export const revalidate = 3600

export const metadata: Metadata = createPageMetadata(pages.sundry)

export default async function SundryPortfolio() {
  const release = await getLatestSundryRelease()
  return <SundryContent release={release} />
}
