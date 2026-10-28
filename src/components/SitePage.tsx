'use client'

import { Suspense } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { FestivalThemeProvider, useFestivalTheme } from '@/components/FestivalTheme'
import { LanguageProvider, useLanguage } from '@/components/LanguageProvider'
import { LanguageLayout } from '@/components/LanguageLayout'
import LazyChatWidget from '@/components/LazyChatWidget'
import SiteBackground from '@/components/SiteBackground'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader, { type HeaderLink, type SitePageCurrent } from '@/components/SiteHeader'

export type { SitePageCurrent }

const NAV_ITEMS: { id: SitePageCurrent; href: string; labelKey: string }[] = [
  { id: 'home', href: '/', labelKey: 'nav.home' },
  { id: 'about', href: '/about', labelKey: 'nav.about' },
  { id: 'portfolio', href: '/portfolio', labelKey: 'nav.portfolio' },
  { id: 'contact', href: '/contact', labelKey: 'nav.contact' },
  { id: 'guestbook', href: '/guestbook', labelKey: 'nav.guestbook' },
]

function SitePageInner({
  current,
  children,
}: {
  current: SitePageCurrent
  children: React.ReactNode
}) {
  const { activeFestival } = useFestivalTheme()
  const { tString } = useLanguage()

  const links: HeaderLink[] = NAV_ITEMS.map((item) => ({
    id: item.id,
    href: item.href,
    label: tString(item.labelKey),
  }))

  return (
    <FestivalThemeProvider activeFestival={activeFestival}>
      <div className="relative min-h-screen bg-ink text-cream">
        <SpeedInsights />
        <SiteBackground />

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-lime focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#0a0f00]"
        >
          Skip to content
        </a>

        <SiteHeader
          links={links}
          current={current}
          ctaHref="/contact"
          ctaLabel={tString('hero.startProject')}
        />

        <main id="main-content" className="relative z-10 py-16 md:py-20">
          <div className="schematic-wrap">{children}</div>
        </main>

        <SiteFooter brand={tString('brand')} />

        <Suspense fallback={null}>
          <LazyChatWidget />
        </Suspense>
      </div>
    </FestivalThemeProvider>
  )
}

export default function SitePage({
  current,
  children,
}: {
  current: SitePageCurrent
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <LanguageLayout>
        <SitePageInner current={current}>{children}</SitePageInner>
      </LanguageLayout>
    </LanguageProvider>
  )
}
