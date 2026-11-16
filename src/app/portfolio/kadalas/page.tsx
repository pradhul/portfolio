import type { Metadata } from 'next'
import { createPageMetadata, pages } from '@/lib/seo'
import KadalasContent from './KadalasContent'

export const metadata: Metadata = createPageMetadata(pages.kadalas)

export default function KadalasPortfolio() {
  return <KadalasContent />
}
