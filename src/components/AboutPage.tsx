'use client'

import Link from 'next/link'
import { FileText, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import AboutContent from '@/components/AboutContent'
import HireCtas from '@/components/HireCtas'
import SectionHeading from '@/components/SectionHeading'
import SitePage from '@/components/SitePage'
import { FestivalTextDecoration, useFestivalTheme } from '@/components/FestivalTheme'
import { useLanguage } from '@/components/LanguageProvider'

const btnGhost =
  'inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 font-medium text-cream-muted transition-colors hover:border-cream-muted hover:text-cream'

function AboutInner() {
  const { activeFestival } = useFestivalTheme()
  const { tString } = useLanguage()

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7 }}
      >
        <SectionHeading
          as="h1"
          index="01"
          activeFestival={activeFestival}
          title={
            activeFestival ? (
              <FestivalTextDecoration festival={activeFestival}>
                {tString('about.title')}
              </FestivalTextDecoration>
            ) : (
              tString('about.title')
            )
          }
        />
        <p className="mt-6 max-w-prose text-lg text-cream-muted">{tString('about.pageSubtitle')}</p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <HireCtas hireLabel={tString('hero.hireMe')} upworkLabel={tString('hero.upwork')} />
          <a
            href="/PRADHUL_DEV_RESUME.pdf"
            download="PRADHUL_DEV_RESUME.pdf"
            rel="noopener noreferrer"
            className={btnGhost}
            style={
              activeFestival
                ? {
                    borderColor: `${activeFestival.colors.primary}50`,
                    color: activeFestival.colors.primary,
                  }
                : undefined
            }
          >
            <FileText size={18} />
            <span>{tString('hero.downloadResume')}</span>
          </a>
          <Link
            href="/portfolio"
            className={btnGhost}
            style={
              activeFestival
                ? {
                    borderColor: `${activeFestival.colors.primary}50`,
                    color: activeFestival.colors.primary,
                  }
                : undefined
            }
          >
            <span>{tString('hero.viewPortfolio')}</span>
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </motion.div>

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
