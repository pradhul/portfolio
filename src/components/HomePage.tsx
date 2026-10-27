'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { track } from '@vercel/analytics'
import { SpeedInsights } from '@vercel/speed-insights/next'
import AboutContent from '@/components/AboutContent'
import ContactChannels from '@/components/ContactChannels'
import ContactForm from '@/components/ContactForm'
import GlanceTvMock from '@/components/GlanceTvMock'
import LazyChatWidget from '@/components/LazyChatWidget'
import SectionHeading from '@/components/SectionHeading'
import SiteBackground from '@/components/SiteBackground'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader, { type HeaderLink } from '@/components/SiteHeader'
import { FestivalThemeProvider, useFestivalTheme } from '@/components/FestivalTheme'
import { LanguageProvider, useLanguage } from '@/components/LanguageProvider'
import { LanguageLayout } from '@/components/LanguageLayout'
import { content } from '@/lib/content'
import { projects } from '@/data/projects'

const HOME_CARD_IDS = ['ionicMeasure', 'linkShelf', 'squashPush', 'vsColorCode'] as const

function TitleBlock() {
  const { tString } = useLanguage()
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
        <span className="text-lime">{tString('hero.titleBlock.drawing')}</span>
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

function HomeWork() {
  const { tString, t } = useLanguage()
  const glance = projects.find((project) => project.id === 'glanceTv')
  const cards = HOME_CARD_IDS.map((id) => projects.find((project) => project.id === id)).filter(
    (project): project is NonNullable<typeof project> => Boolean(project)
  )

  const asList = (key: string): string[] => {
    const value = t(key)
    return Array.isArray(value) ? value : []
  }

  const glanceFeatures = asList('portfolio.glanceTv.features').slice(0, 2)
  const glanceTags = ['Plain Java', 'No runtime dependencies', 'minSdk 26', glance?.release?.tag ?? 'v43']
  const glanceRelease = glance?.release?.url ?? 'https://github.com/pradhul/glance-tv/releases/tag/v43'
  const glanceGithub = glance?.links.find((link) => link.type === 'github')?.href ?? 'https://github.com/pradhul/glance-tv'

  return (
    <section id="work" className="py-[60px] md:py-[88px]">
      <SectionHeading
        kicker={tString('portfolio.sectionLabel')}
        title={tString('portfolio.title')}
      />

      <div className="frame grid grid-cols-1 gap-9 p-8 md:grid-cols-2 md:p-8">
        <div>
          <span className="font-mono text-[13px] tracking-[0.04em] text-lime">
            {glance?.figure ?? 'Fig. 18'} · {tString('portfolio.glanceTv.category')}
          </span>
          <h3 className="mt-2.5 font-display text-[30px] font-semibold text-cream">
            {tString('portfolio.glanceTv.title')}
          </h3>
          <p className="mt-3 text-cream-muted">{tString('portfolio.glanceTv.description')}</p>
          <div className="mt-4 font-mono">
            {glanceTags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <ul className="my-4 ml-[18px] list-disc text-cream-muted">
            {glanceFeatures.map((item) => (
              <li key={item} className="my-1">
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <a href={glanceRelease} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Download APK ({glance?.release?.tag ?? 'v43'})
            </a>
            <a href={glanceGithub} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              GitHub
            </a>
          </div>
        </div>
        <GlanceTvMock />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {cards.map((project) => (
          <article key={project.id} className="frame p-[26px]">
            <span className="font-mono text-[13px] tracking-[0.04em] text-lime">
              {project.figure} · {tString(`portfolio.${project.id}.category`)}
            </span>
            <h3 className="mt-2 font-display text-[22px] font-semibold text-cream">
              {tString(`portfolio.${project.id}.title`)}
            </h3>
            <p className="mt-2 text-cream-muted">{tString(`portfolio.${project.id}.description`)}</p>
            <div className="mt-4 flex flex-wrap gap-3 font-mono text-sm">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  {...(link.internal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                  className="text-lime no-underline hover:underline"
                >
                  {tString(`portfolio.${project.id}.${link.labelKey}`)} ↗
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/portfolio" className="btn btn-outline">
          {tString('hero.viewPortfolio')}
        </Link>
      </div>
    </section>
  )
}

function HomeContent() {
  const { activeFestival } = useFestivalTheme()
  const { tString } = useLanguage()

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
          ctaLabel={tString('hero.hireMe')}
        />

        <main className="schematic-wrap">
          <section id="hero" className="grid grid-cols-1 items-start gap-12 pb-8 pt-[72px] lg:grid-cols-[1.45fr_.85fr]">
            <div>
              <div className="font-mono text-[13px] tracking-[0.04em] text-lime">{tString('hero.subtitle')}</div>
              <h1 className="my-4 font-display text-[clamp(34px,4.6vw,52px)] font-semibold tracking-tight text-cream">
                {tString('hero.title')}
              </h1>
              <p className="max-w-[600px] text-lg text-cream-muted">{tString('hero.lead')}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="btn btn-primary"
                  onClick={() => track('hire_me_click')}
                >
                  {tString('hero.hireMe')} →
                </a>
                <a href="#work" className="btn btn-outline">
                  {tString('hero.viewPortfolio')}
                </a>
              </div>
            </div>
            <TitleBlock />
          </section>

          <HomeWork />

          <section id="about" className="py-[60px] md:py-[88px]">
            <SectionHeading
              kicker={tString('about.sectionLabel')}
              title={tString('about.title')}
            />
            <AboutContent />
          </section>

          <section id="experience" className="py-[60px] md:py-[88px]">
            <SectionHeading
              kicker={tString('about.experienceSectionLabel')}
              title={tString('about.experienceTitle')}
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
            />
            <p className="mb-9 text-cream-muted">{tString('contact.subtitle')}</p>
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
                  projectTypes: content.contact.form.projectTypes,
                  budgets: content.contact.form.budgets,
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
