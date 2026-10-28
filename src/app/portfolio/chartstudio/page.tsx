import type { Metadata } from 'next'
import { createPageMetadata, pages } from '@/lib/seo'
import ChartStudioContent from './ChartStudioContent'

export const metadata: Metadata = createPageMetadata(pages.chartStudio)

export default function ChartStudioPortfolio() {
  return <ChartStudioContent />
}
