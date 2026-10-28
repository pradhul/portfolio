import type { Metadata } from 'next'
import { createPageMetadata, pages } from '@/lib/seo'
import UploadSpecContent from './UploadSpecContent'

export const metadata: Metadata = createPageMetadata(pages.uploadSpec)

export default function UploadSpecPortfolio() {
  return <UploadSpecContent />
}
