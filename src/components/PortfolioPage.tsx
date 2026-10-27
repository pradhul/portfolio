'use client'

import { motion } from 'framer-motion'
import PortfolioSection from '@/components/PortfolioSection'
import SectionHeading from '@/components/SectionHeading'
import SitePage from '@/components/SitePage'
import { FestivalTextDecoration, useFestivalTheme } from '@/components/FestivalTheme'
import { useLanguage } from '@/components/LanguageProvider'

function PortfolioInner() {
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
          index="02"
          activeFestival={activeFestival}
          title={
            activeFestival ? (
              <FestivalTextDecoration festival={activeFestival}>
                {tString('portfolio.title')}
              </FestivalTextDecoration>
            ) : (
              tString('portfolio.title')
            )
          }
        />
        <p className="mt-6 max-w-prose text-lg text-cream-muted">
          {tString('portfolio.pageSubtitle')}
        </p>
      </motion.div>

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
