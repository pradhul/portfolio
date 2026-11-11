import type { Metadata } from 'next'
import { createPageMetadata, pages } from '@/lib/seo'
import SmspendContent from './SmspendContent'

export const metadata: Metadata = createPageMetadata(pages.smspend)

export default function SmspendPortfolio() {
  return <SmspendContent />
}
