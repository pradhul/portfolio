import type { Metadata } from 'next'
import { createPageMetadata, pages } from '@/lib/seo'
import SquashPushContent from './SquashPushContent'

export const metadata: Metadata = createPageMetadata(pages.squashPush)

export default function SquashPushPortfolio() {
  return <SquashPushContent />
}
