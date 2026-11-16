import type { Metadata } from 'next'
import { createPageMetadata, pages } from '@/lib/seo'
import FightcardHqContent from './FightcardHqContent'

export const metadata: Metadata = createPageMetadata(pages.fightcardHq)

export default function FightcardHqPortfolio() {
  return <FightcardHqContent />
}
