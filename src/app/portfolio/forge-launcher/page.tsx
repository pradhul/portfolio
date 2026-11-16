import type { Metadata } from 'next'
import { createPageMetadata, pages } from '@/lib/seo'
import ForgeLauncherContent from './ForgeLauncherContent'

export const metadata: Metadata = createPageMetadata(pages.forgeLauncher)

export default function ForgeLauncherPortfolio() {
  return <ForgeLauncherContent />
}
