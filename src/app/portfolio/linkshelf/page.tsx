import type { Metadata } from 'next'
import { createPageMetadata, pages } from '@/lib/seo'
import LinkShelfContent from './LinkShelfContent'

export const metadata: Metadata = createPageMetadata(pages.linkShelf)

export default function LinkShelfPortfolio() {
  return <LinkShelfContent />
}
