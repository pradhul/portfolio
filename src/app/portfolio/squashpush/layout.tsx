import type { Metadata } from 'next'
import { createPageMetadata, pages } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata(pages.squashPush)

export default function SquashPushLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
