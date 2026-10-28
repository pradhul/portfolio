'use client'

import Link from 'next/link'
import { track } from '@vercel/analytics'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useFestivalTheme } from '@/components/FestivalTheme'
import { content } from '@/lib/content'

export type SitePageCurrent = 'home' | 'about' | 'portfolio' | 'contact' | 'guestbook'

export type HeaderLink = {
  href: string
  label: string
  id?: SitePageCurrent
}

export default function SiteHeader({
  links,
  current,
  ctaHref,
  ctaLabel = content.hero.hireMe,
  onCtaClick,
}: {
  links: HeaderLink[]
  current?: SitePageCurrent
  ctaHref: string
  ctaLabel?: string
  onCtaClick?: () => void
}) {
  const { activeFestival } = useFestivalTheme()

  const handleCta = () => {
    track('hire_me_click')
    onCtaClick?.()
  }

  const festivalStyle = activeFestival
    ? {
        backgroundImage: `linear-gradient(to right, ${activeFestival.colors.primary}, ${activeFestival.colors.secondary}, ${activeFestival.colors.accent})`,
        WebkitBackgroundClip: 'text' as const,
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text' as const,
      }
    : undefined

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[rgba(5,11,20,0.92)] backdrop-blur-md">
      <div className="schematic-wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <b
            className="border border-lime px-1.5 py-1 font-mono text-[13px] font-semibold text-lime"
            style={
              activeFestival
                ? { borderColor: activeFestival.colors.primary, color: activeFestival.colors.primary }
                : undefined
            }
          >
            PD
          </b>
          <span className="hidden font-semibold text-cream sm:inline" style={festivalStyle}>
            Pradhul Dev
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {links.map((link) => {
            const isActive = current && link.id === current
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`text-[15px] no-underline ${
                  isActive ? 'text-cream' : 'text-cream-muted hover:text-cream'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <details className="relative md:hidden">
            <summary className="list-none cursor-pointer border border-line px-3 py-2 font-mono text-[13px] text-cream-muted [&::-webkit-details-marker]:hidden">
              Menu
            </summary>
            <div className="absolute right-0 top-full z-50 mt-2 min-w-[200px] border border-line bg-ink-soft p-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-cream-muted no-underline hover:text-cream"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 border-t border-line pt-2 sm:hidden">
                <LanguageSwitcher />
              </div>
            </div>
          </details>
          <Link
            href={ctaHref}
            className="btn btn-primary"
            onClick={handleCta}
            style={
              activeFestival
                ? {
                    background: `linear-gradient(to right, ${activeFestival.colors.primary}, ${activeFestival.colors.secondary})`,
                    borderColor: activeFestival.colors.primary,
                  }
                : undefined
            }
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </header>
  )
}
