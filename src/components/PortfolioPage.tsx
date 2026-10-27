'use client'

import PortfolioSection from '@/components/PortfolioSection'
import SectionHeading from '@/components/SectionHeading'
import SitePage from '@/components/SitePage'
import { useLanguage } from '@/components/LanguageProvider'

function PortfolioInner() {
  const { tString } = useLanguage()

  return (
    <>
      <SectionHeading
        as="h1"
        kicker={tString('portfolio.sectionLabel')}
        title={tString('portfolio.title')}
      />
      <p className="mb-4 max-w-prose text-lg text-cream-muted">{tString('portfolio.pageSubtitle')}</p>
      <PortfolioSection />
    </>
  )
}

export default function PortfolioPage() {
  return (
    <SitePage current="portfolio">
      <PortfolioInner />
    </SitePage>
  )
}
