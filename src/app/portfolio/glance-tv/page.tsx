import type { Metadata } from 'next'
import { createPageMetadata, pages } from '@/lib/seo'
import GlanceTvContent from './GlanceTvContent'

export const metadata: Metadata = createPageMetadata(pages.glanceTv)

export default function GlanceTvPortfolio() {
  return <GlanceTvContent />
}
