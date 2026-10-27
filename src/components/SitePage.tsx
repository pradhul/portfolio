'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { motion } from 'framer-motion'
import { FestivalThemeProvider, useFestivalTheme } from '@/components/FestivalTheme'
import { LanguageProvider, useLanguage } from '@/components/LanguageProvider'
import { LanguageLayout } from '@/components/LanguageLayout'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import LazyChatWidget from '@/components/LazyChatWidget'
import SiteBackground from '@/components/SiteBackground'

export type SitePageCurrent = 'home' | 'about' | 'portfolio' | 'contact' | 'guestbook'

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

  return (
    <FestivalThemeProvider activeFestival={activeFestival}>
      <div className="relative min-h-screen overflow-y-auto bg-ink text-cream scroll-smooth">
        <SpeedInsights />
        <SiteBackground />

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brass focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
        >
          Skip to content
        </a>

        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          aria-label="Primary"
          className="fixed top-0 left-0 right-0 z-50 border-b border-line bg-ink/80 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
            <Link
              href="/"
              className="shrink-0 font-display text-xl font-semibold tracking-tight text-cream transition-colors hover:text-brass"
              style={
                activeFestival
                  ? {
                      backgroundImage: `linear-gradient(to right, ${activeFestival.colors.primary}, ${activeFestival.colors.secondary}, ${activeFestival.colors.accent})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }
                  : undefined
              }
            >
              {tString('brand')}
            </Link>
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-0.5 gap-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = current === item.id
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative whitespace-nowrap px-2 py-2 text-sm transition-colors md:px-4 ${
                      isActive ? 'text-cream' : 'text-cream-muted hover:text-cream'
                    }`}
                  >
                    {tString(item.labelKey)}
                    {isActive && (
                      <span
                        className="absolute inset-x-2 -bottom-px h-px bg-brass md:inset-x-4"
                        style={
                          activeFestival ? { backgroundColor: activeFestival.colors.primary } : undefined
                        }
                      />
                    )}
                  </Link>
                )
              })}
              <div className="ml-2 shrink-0 md:ml-3">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </motion.nav>

        <main id="main-content" className="relative z-10 px-6 pb-28 pt-36 md:pt-28">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>

        <footer className="relative z-10 border-t border-line px-6 py-10">
          <p className="mx-auto max-w-6xl font-mono text-xs text-cream-faint">
            © {new Date().getFullYear()} {tString('footer.copyright')}
          </p>
        </footer>

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
