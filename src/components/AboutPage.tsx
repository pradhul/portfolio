'use client'

import Link from 'next/link'
import { track } from '@vercel/analytics'
import { IoMail } from 'react-icons/io5'
import AboutContent from '@/components/AboutContent'
import HireCtas from '@/components/HireCtas'
import SectionHeading from '@/components/SectionHeading'
import SitePage from '@/components/SitePage'
import { useFestivalTheme } from '@/components/FestivalTheme'
import { useLanguage } from '@/components/LanguageProvider'
import { CONTACT_EMAIL, CONTACT_MAILTO } from '@/lib/contactConstants'

function AboutInner() {
  const { activeFestival } = useFestivalTheme()
  const { tString } = useLanguage()

  return (
    <>
      <SectionHeading
        as="h1"
        kicker={tString('about.sectionLabel')}
        title={tString('about.title')}
        activeFestival={activeFestival}
      />
      <p className="mb-8 max-w-prose text-lg text-cream-muted">{tString('about.pageSubtitle')}</p>
      <div className="mb-12 flex flex-wrap items-center gap-3">
        <HireCtas hireLabel={tString('hero.hireMe')} upworkLabel={tString('hero.upwork')} />
        <a
          href={CONTACT_MAILTO}
          className="btn btn-outline"
          onClick={() => track('hire_me_click')}
        >
          <IoMail size={18} />
          {CONTACT_EMAIL}
        </a>
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
