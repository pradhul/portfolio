'use client'

import Link from 'next/link'
import AboutContent from '@/components/AboutContent'
import HireCtas from '@/components/HireCtas'
import SectionHeading from '@/components/SectionHeading'
import SitePage from '@/components/SitePage'
import { useLanguage } from '@/components/LanguageProvider'

function AboutInner() {
  const { tString } = useLanguage()

  return (
    <>
      <SectionHeading
        as="h1"
        kicker={tString('about.sectionLabel')}
        title={tString('about.title')}
      />
      <p className="mb-8 max-w-prose text-lg text-cream-muted">{tString('about.pageSubtitle')}</p>
      <div className="mb-12 flex flex-wrap items-center gap-3">
        <HireCtas hireLabel={tString('hero.hireMe')} upworkLabel={tString('hero.upwork')} />
        <a href="/PRADHUL_DEV_RESUME.pdf" download="PRADHUL_DEV_RESUME.pdf" className="btn btn-outline">
          {tString('hero.downloadResume')}
        </a>
        <Link href="/portfolio" className="btn btn-outline">
          {tString('hero.viewPortfolio')}
        </Link>
      </div>
      <AboutContent variant="full" />
    </>
  )
}

export default function AboutPage() {
  return (
    <SitePage current="about">
      <AboutInner />
    </SitePage>
  )
}
