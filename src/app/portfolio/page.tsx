import type { Metadata } from 'next'
import PortfolioPage from '@/components/PortfolioPage'
import { createPageMetadata, pages } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata(pages.portfolio)

export default function Portfolio() {
  return <PortfolioPage />
}
