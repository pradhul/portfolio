'use client'

import { Suspense } from 'react'
import { track } from '@vercel/analytics'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { FaSquareUpwork } from 'react-icons/fa6'
import { IoMail } from 'react-icons/io5'
import AboutContent from '@/components/AboutContent'
import ContactChannels from '@/components/ContactChannels'
import ContactForm from '@/components/ContactForm'
import HireCtas from '@/components/HireCtas'
import LazyChatWidget from '@/components/LazyChatWidget'
import PortfolioSection from '@/components/PortfolioSection'
import SectionHeading from '@/components/SectionHeading'
import SiteBackground from '@/components/SiteBackground'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader, { type HeaderLink } from '@/components/SiteHeader'
import { FestivalThemeProvider, useFestivalTheme } from '@/components/FestivalTheme'
import { LanguageProvider, useLanguage } from '@/components/LanguageProvider'
import { LanguageLayout } from '@/components/LanguageLayout'
import { content } from '@/lib/content'
import { CONTACT_MAILTO } from '@/lib/contactConstants'

const UPWORK_URL = 'https://www.upwork.com/freelancers/~01a32f29fafd184f21'

function TitleBlock() {
  const { tString } = useLanguage()
  const { activeFestival } = useFestivalTheme()
  const rows = [
    [tString('hero.titleBlock.drawnBy'), tString('hero.titleBlock.name')],
    [tString('hero.titleBlock.role'), tString('hero.titleBlock.roleValue')],
    [tString('hero.titleBlock.based'), tString('hero.titleBlock.basedValue')],
    [tString('hero.titleBlock.experience'), tString('hero.titleBlock.experienceValue')],
    [tString('hero.titleBlock.status'), tString('hero.titleBlock.statusValue')],
    [tString('hero.titleBlock.stack'), tString('hero.titleBlock.stackValue')],
  ]

  return (
    <div className="frame p-[22px]">
      <div className="mb-1 flex justify-between border-b border-cream-muted pb-2.5 font-mono text-[13px] tracking-[0.04em]">
        <span className="text-cream-muted">{tString('hero.titleBlock.heading')}</span>
        <span
          className="text-lime"
          style={activeFestival ? { color: activeFestival.colors.primary } : undefined}
        >
          {tString('hero.titleBlock.drawing')}
        </span>
      </div>
      <table className="w-full border-collapse">
        <tbody>
          {rows.map(([label, value], index) => (
            <tr key={label}>
              <td className="w-[38%] border-b border-line py-2.5 align-top font-mono text-xs font-medium uppercase tracking-[0.06em] text-cream-muted">
                {label}
              </td>
              <td className={`border-b border-line py-2.5 align-top text-[15px] ${index === 4 ? 'text-signal' : 'text-cream'}`}>
                {index === 4 ? `● ${value}` : value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function HomeContent() {
  const { activeFestival } = useFestivalTheme()
  const { t, tString } = useLanguage()
  const asList = (key: string): string[] => {
    const value = t(key)
    return Array.isArray(value) ? value : []
  }

  const navItems: HeaderLink[] = [
    { href: '#work', label: tString('nav.work') },
    { href: '#about', label: tString('nav.about') },
    { href: '#experience', label: tString('nav.experience') },
    { href: '#contact', label: tString('nav.contact') },
    { href: '/guestbook', label: tString('nav.guestbook') },
  ]

  const experience = content.about.experience

  return (
    <FestivalThemeProvider activeFestival={activeFestival}>
      <div className="relative min-h-screen bg-ink text-cream">
        <SpeedInsights />
        <SiteBackground />

        <SiteHeader
          links={navItems}
          ctaHref="#contact"
          ctaLabel={tString('hero.startProject')}
        />

        <main className="schematic-wrap">
          <section id="hero" className="grid grid-cols-1 items-start gap-12 pb-8 pt-[72px] lg:grid-cols-[1.45fr_.85fr]">
            <div>
              <div
                className="font-mono text-[13px] tracking-[0.04em] text-lime"
                style={activeFestival ? { color: activeFestival.colors.primary } : undefined}
              >
                {tString('hero.subtitle')}
              </div>
              <h1 className="my-4 font-display text-[clamp(34px,4.6vw,52px)] font-semibold tracking-tight text-cream">
                {tString('hero.title')}
              </h1>
              <p className="max-w-[600px] text-lg text-cream-muted">{tString('hero.lead')}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={CONTACT_MAILTO}
                  className="btn btn-primary"
                  onClick={() => track('hire_me_click')}
                >
                  <IoMail size={18} />
                  {tString('hero.hireMe')}
                </a>
                <a
                  href={UPWORK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  onClick={() => track('upwork_click')}
                >
                  <FaSquareUpwork size={18} />
                  {tString('hero.upwork')}
                </a>
                <a href="#work" className="btn btn-outline">
                  {tString('hero.seeWork')}
                </a>
              </div>
            </div>
            <TitleBlock />
          </section>

          <section id="work" className="py-[60px] md:py-[88px]">
            <SectionHeading
              kicker={tString('portfolio.sectionLabel')}
              title={tString('portfolio.title')}
              activeFestival={activeFestival}
            />
            <PortfolioSection />
          </section>

          <section id="about" className="py-[60px] md:py-[88px]">
            <SectionHeading
              kicker={tString('about.sectionLabel')}
              title={tString('about.title')}
              activeFestival={activeFestival}
            />
            <AboutContent />
          </section>

          <section id="experience" className="py-[60px] md:py-[88px]">
            <SectionHeading
              kicker={tString('about.experienceSectionLabel')}
              title={tString('about.experienceTitle')}
              activeFestival={activeFestival}
            />
            <div className="grid gap-4">
              {experience.map((item) => (
                <article
                  key={`${item.company}-${item.dates}`}
                  className="frame grid gap-1.5 p-[22px] md:grid-cols-[180px_1fr] md:gap-6"
                >
                  <div className="font-mono text-[13px] tracking-[0.04em] text-brass">{item.dates}</div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-cream">
                      {item.role}
                      {item.company ? ` · ${item.company}` : ''}
                    </h3>
                    <p className="mt-1.5 text-cream-muted">{item.summary}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="contact" className="py-[60px] md:py-[88px]">
            <SectionHeading
              kicker={tString('contact.sectionLabel')}
              title={tString('contact.title')}
              activeFestival={activeFestival}
            />
            <p className="mb-9 text-cream-muted">{tString('contact.subtitle')}</p>
            <div className="mb-8">
              <HireCtas hireLabel={tString('hero.hireMe')} upworkLabel={tString('hero.upwork')} />
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_.8fr]">
              <ContactForm
                copy={{
                  nameLabel: tString('contact.form.nameLabel'),
                  emailLabel: tString('contact.form.emailLabel'),
                  projectTypeLabel: tString('contact.form.projectTypeLabel'),
                  budgetLabel: tString('contact.form.budgetLabel'),
                  messageLabel: tString('contact.form.messageLabel'),
                  messagePlaceholder: tString('contact.form.messagePlaceholder'),
                  submit: tString('contact.form.submit'),
                  sending: tString('contact.form.sending'),
                  success: tString('contact.form.success'),
                  error: tString('contact.form.error'),
                  unavailable: tString('contact.form.unavailable'),
                  honeypotLabel: tString('contact.form.honeypotLabel'),
                  projectTypes: asList('contact.form.projectTypes'),
                  budgets: asList('contact.form.budgets'),
                }}
                locationNote={tString('contact.locationNote')}
              />
              <ContactChannels heading={tString('contact.connectLabel')} />
            </div>
          </section>
        </main>

        <SiteFooter brand={tString('brand')} />

        <Suspense fallback={null}>
          <LazyChatWidget />
        </Suspense>
      </div>
    </FestivalThemeProvider>
  )
}

export default function Home() {
  return (
    <LanguageProvider>
      <LanguageLayout>
        <HomeContent />
      </LanguageLayout>
    </LanguageProvider>
  )
}
