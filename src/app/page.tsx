'use client'
import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  FileText,
  Github,
  Package,
  ChevronDown,
  ExternalLink,
  BarChart3,
  ArrowUpRight
} from 'lucide-react'
import { useFestivalTheme, FestivalThemeProvider, FestivalTextDecoration } from '@/components/FestivalTheme'
import { LanguageProvider, useLanguage } from '@/components/LanguageProvider'
import { LanguageLayout } from '@/components/LanguageLayout'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { FaLinkedin, FaGithubSquare, FaPhone } from 'react-icons/fa'
import { FaSquareUpwork } from 'react-icons/fa6'
import { IoMail } from 'react-icons/io5'
import { SiStackoverflow } from 'react-icons/si'

// Lazy load heavy components
const ThreeBackground = lazy(() => import('@/components/ThreeBackground'))
const InteractiveDots = lazy(() => import('@/components/InteractiveDots'))
const ChatWidget = lazy(() => import('@/components/ChatWidget'))
// Disable SSR for GitHubActivity to prevent hydration errors (fetches external API data)
const GitHubActivity = dynamic(() => import('@/components/GitHubActivity'), {
  ssr: false,
  loading: () => (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="text-cream-faint text-center py-8">Loading activity...</div>
      </div>
    </div>
  ),
})

// Shared button styles
const btnPrimary =
  'inline-flex items-center gap-2 rounded-full bg-brass px-7 py-3.5 font-semibold text-ink transition-colors hover:bg-brass-bright'
const btnGhost =
  'inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 font-medium text-cream-muted transition-colors hover:border-cream-muted hover:text-cream'
const btnPrimarySm =
  'inline-flex items-center gap-2 rounded-full bg-brass px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-brass-bright'
const btnGhostSm =
  'inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-cream-muted transition-colors hover:border-cream-muted hover:text-cream'

function SectionHeading({
  index,
  title,
  activeFestival,
}: {
  index: string
  title: React.ReactNode
  activeFestival: ReturnType<typeof useFestivalTheme>['activeFestival']
}) {
  return (
    <div className="flex items-baseline gap-5 border-t border-line pt-8">
      <span className="font-mono text-sm text-brass">{index}</span>
      <h2
        className="font-display text-4xl md:text-6xl font-semibold tracking-tight text-cream"
        style={activeFestival ? {
          backgroundImage: `linear-gradient(to right, ${activeFestival.colors.primary}, ${activeFestival.colors.secondary})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        } : undefined}
      >
        {title}
      </h2>
    </div>
  )
}

function ProjectFrame({
  caption,
  figure,
  children,
}: {
  caption: string
  figure: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-ink-soft">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="font-mono text-xs uppercase tracking-widest text-cream-faint">{figure}</span>
        <span className="font-mono text-xs text-cream-faint">{caption}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function HomeContent() {
  const [activeSection, setActiveSection] = useState('hero')
  const containerRef = useRef<HTMLDivElement>(null)
  const { activeFestival } = useFestivalTheme()
  const { t, tString } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'portfolio', 'contact']
      const scrollPosition = window.scrollY + window.innerHeight / 2

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const navItems = [
    { id: 'hero', label: tString('nav.home') },
    { id: 'about', label: tString('nav.about') },
    { id: 'portfolio', label: tString('nav.portfolio') },
    { id: 'contact', label: tString('nav.contact') },
    { id: 'guestbook', label: tString('nav.guestbook'), href: '/guestbook' },
  ]

  return (
    <FestivalThemeProvider activeFestival={activeFestival}>
      <div ref={containerRef} className="relative min-h-screen overflow-y-auto bg-ink text-cream scroll-smooth">
        <Analytics />
        <SpeedInsights />
        {/* Lazy load heavy background components after initial render */}
        <Suspense fallback={null}>
          <LazyBackgroundComponents />
        </Suspense>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-line bg-ink/80 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div
            className="cursor-pointer font-display text-xl font-semibold tracking-tight text-cream transition-colors hover:text-brass"
            onClick={() => scrollToSection('hero')}
            style={activeFestival ? {
              backgroundImage: `linear-gradient(to right, ${activeFestival.colors.primary}, ${activeFestival.colors.secondary}, ${activeFestival.colors.accent})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            } : undefined}
          >
            {tString('brand')}
          </div>
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = activeSection === item.id
              const itemClasses = `relative px-4 py-2 text-sm transition-colors ${
                isActive ? 'text-cream' : 'text-cream-muted hover:text-cream'
              }`

              if (item.href) {
                return (
                  <Link key={item.id} href={item.href} className={itemClasses}>
                    {item.label}
                  </Link>
                )
              }

              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={itemClasses}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute inset-x-4 -bottom-px h-px bg-brass"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      style={activeFestival ? { backgroundColor: activeFestival.colors.primary } : undefined}
                    />
                  )}
                </button>
              )
            })}
            <div className="ml-3">
              <LanguageSwitcher />
            </div>
          </div>
          <div className="md:hidden">
            <LanguageSwitcher />
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" className="relative flex min-h-screen items-center px-6">
        <div className="mx-auto w-full max-w-6xl z-10 pt-28 pb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-brass"
            style={activeFestival ? { color: activeFestival.colors.primary } : undefined}
          >
            {tString('hero.subtitle')}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="font-display text-[clamp(3.25rem,11vw,8.5rem)] font-bold leading-[0.92] tracking-[-0.03em] text-cream"
            style={activeFestival ? {
              backgroundImage: `linear-gradient(to right, ${activeFestival.colors.primary}, ${activeFestival.colors.secondary}, ${activeFestival.colors.accent})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            } : undefined}
          >
            {activeFestival ? (
              <FestivalTextDecoration festival={activeFestival}>
                {tString('hero.title')}
              </FestivalTextDecoration>
            ) : (
              tString('hero.title')
            )}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-10 h-px w-full bg-line"
          />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="/PRADHUL_DEV_RESUME.pdf"
              download="PRADHUL_DEV_RESUME.pdf"
              rel="noopener noreferrer"
              className={btnPrimary}
              style={activeFestival ? {
                background: `linear-gradient(to right, ${activeFestival.colors.primary}, ${activeFestival.colors.secondary})`,
              } : undefined}
            >
              <FileText size={18} />
              <span>{tString('hero.downloadResume')}</span>
            </a>

            <button
              onClick={() => scrollToSection('portfolio')}
              className={btnGhost}
              style={activeFestival ? {
                borderColor: `${activeFestival.colors.primary}50`,
                color: activeFestival.colors.primary,
              } : undefined}
            >
              <span>{tString('hero.viewPortfolio')}</span>
              <ArrowUpRight size={18} />
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.button
            onClick={() => scrollToSection('about')}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-cream-faint transition-colors hover:text-brass"
            style={activeFestival ? { color: activeFestival.colors.primary } : undefined}
            aria-label="Scroll to about section"
          >
            <ChevronDown size={28} />
          </motion.button>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
          >
            <SectionHeading
              index="01"
              activeFestival={activeFestival}
              title={activeFestival ? (
                <FestivalTextDecoration festival={activeFestival}>
                  {tString('about.title')}
                </FestivalTextDecoration>
              ) : (
                tString('about.title')
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-14 grid gap-10 md:grid-cols-[1fr_2fr]"
          >
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-cream-faint">
              {tString('nav.about')}
            </div>
            <div className="max-w-prose">
              {(() => {
                const paragraphs = t('about.paragraphs')
                if (Array.isArray(paragraphs)) {
                  return paragraphs.map((para: string, index: number) => {
                    // For the first paragraph, highlight "Pradhul" with styled span
                    if (index === 0 && para.includes('Pradhul')) {
                      const parts = para.split('Pradhul')
                      return (
                        <p key={index} className="mb-6 text-2xl font-medium leading-snug text-cream md:text-3xl last:mb-0">
                          {parts[0]}
                          <span className="text-brass" style={activeFestival ? { color: activeFestival.colors.primary } : undefined}>Pradhul</span>
                          {parts[1]}
                        </p>
                      )
                    }
                    return (
                      <p key={index} className="mb-6 text-base leading-relaxed text-cream-muted md:text-lg last:mb-0">
                        {para}
                      </p>
                    )
                  })
                }
                return null
              })()}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-20 grid gap-10 md:grid-cols-[1fr_2fr]"
          >
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-cream-faint">
              {tString('about.githubActivity')}
            </div>
            <div className="overflow-hidden rounded-2xl border border-line bg-ink-soft p-6 md:p-8">
              <GitHubActivity username="pradhul" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl z-10 relative w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
          >
            <SectionHeading
              index="02"
              activeFestival={activeFestival}
              title={activeFestival ? (
                <FestivalTextDecoration festival={activeFestival}>
                  {tString('portfolio.title')}
                </FestivalTextDecoration>
              ) : (
                tString('portfolio.title')
              )}
            />
          </motion.div>

          <div className="mt-16 space-y-24">
            {/* Ionic Measure */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7 }}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <div>
                <div className="mb-6 flex items-center gap-5">
                  <div className="rounded-xl border border-line bg-cream p-3">
                    <Image
                      src="/ionicMeasure/icon.png"
                      alt="Ionic Measure Icon"
                      width={56}
                      height={56}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  </div>
                  <div>
                    <div className="mb-1 font-mono text-xs uppercase tracking-[0.25em] text-brass">{tString('portfolio.ionicMeasure.category')}</div>
                    <h3 className="font-display text-3xl font-semibold tracking-tight text-cream md:text-4xl">{tString('portfolio.ionicMeasure.title')}</h3>
                  </div>
                </div>

                <p className="mb-8 max-w-prose leading-relaxed text-cream-muted">
                  {tString('portfolio.ionicMeasure.description')}
                </p>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://chromewebstore.google.com/detail/cemannkhghihhipcokcbnnaklafbfnpj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btnPrimarySm}
                    style={activeFestival ? {
                      background: `linear-gradient(to right, ${activeFestival.colors.primary}, ${activeFestival.colors.secondary})`,
                    } : undefined}
                  >
                    <ExternalLink size={16} />
                    <span>{tString('portfolio.ionicMeasure.viewWebStore')}</span>
                  </a>
                  <a
                    href="https://github.com/pradhul/ionic-measure-extension"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btnGhostSm}
                  >
                    <Github size={16} />
                    <span>{tString('portfolio.ionicMeasure.viewGitHub')}</span>
                  </a>
                </div>
              </div>

              <ProjectFrame figure="Fig. 01" caption={tString('portfolio.ionicMeasure.demoLabel')}>
                <Image
                  src="/ionicMeasure/demo.png"
                  alt="Ionic Measure Demo"
                  width={800}
                  height={600}
                  className="h-auto w-full rounded-lg"
                  loading="lazy"
                />
              </ProjectFrame>
            </motion.div>

            {/* Squash-Push Project */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7 }}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <div className="lg:order-2">
                <div className="mb-6 flex items-center gap-5">
                  <div className="rounded-xl border border-line bg-cream p-3">
                    <Image
                      src="/squashPush/icon.png"
                      alt="Squash-Push Icon"
                      width={56}
                      height={56}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  </div>
                  <div>
                    <div className="mb-1 font-mono text-xs uppercase tracking-[0.25em] text-brass">{tString('portfolio.squashPush.category')}</div>
                    <h3 className="font-display text-3xl font-semibold tracking-tight text-cream md:text-4xl">{tString('portfolio.squashPush.title')}</h3>
                  </div>
                </div>

                <p className="mb-8 max-w-prose leading-relaxed text-cream-muted">
                  {tString('portfolio.squashPush.description')}
                </p>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://marketplace.visualstudio.com/items?itemName=PradhulDev.squash-push"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btnPrimarySm}
                    style={activeFestival ? {
                      background: `linear-gradient(to right, ${activeFestival.colors.primary}, ${activeFestival.colors.secondary})`,
                    } : undefined}
                  >
                    <Package size={16} />
                    <span>{tString('portfolio.squashPush.marketplace')}</span>
                  </a>
                  <a
                    href="https://github.com/pradhul/squash-push"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btnGhostSm}
                  >
                    <Github size={16} />
                    <span>{tString('portfolio.squashPush.viewGitHub')}</span>
                  </a>
                </div>
              </div>

              <div className="lg:order-1">
                <ProjectFrame figure="Fig. 02" caption={tString('portfolio.squashPush.demoLabel')}>
                  <Image
                    src="/squashPush/recording.gif"
                    alt="Squash-Push Demo"
                    width={800}
                    height={600}
                    className="h-auto w-full rounded-lg"
                    loading="lazy"
                    unoptimized
                  />
                </ProjectFrame>
              </div>
            </motion.div>

            {/* VS ColorCode Project */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7 }}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <div>
                <div className="mb-6 flex items-center gap-5">
                  <div className="rounded-xl border border-line bg-cream p-3">
                    <Image
                      src="/vsColorCode/icon.png"
                      alt="vsColorCode Icon"
                      width={56}
                      height={56}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  </div>
                  <div>
                    <div className="mb-1 font-mono text-xs uppercase tracking-[0.25em] text-brass">{tString('portfolio.vsColorCode.category')}</div>
                    <h3 className="font-display text-3xl font-semibold tracking-tight text-cream md:text-4xl">{tString('portfolio.vsColorCode.title')}</h3>
                  </div>
                </div>

                <p className="mb-8 max-w-prose leading-relaxed text-cream-muted">
                  {tString('portfolio.vsColorCode.description')}
                </p>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://marketplace.visualstudio.com/items?itemName=PradhulDev.vscolorcode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btnPrimarySm}
                    style={activeFestival ? {
                      background: `linear-gradient(to right, ${activeFestival.colors.primary}, ${activeFestival.colors.secondary})`,
                    } : undefined}
                  >
                    <Package size={16} />
                    <span>{tString('portfolio.vsColorCode.marketplace')}</span>
                  </a>
                  <a
                    href="https://github.com/pradhul/vscolorcode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btnGhostSm}
                  >
                    <Github size={16} />
                    <span>{tString('portfolio.vsColorCode.viewGitHub')}</span>
                  </a>
                </div>
              </div>

              <ProjectFrame figure="Fig. 03" caption={tString('portfolio.vsColorCode.demoLabel')}>
                <Image
                  src="/vsColorCode/demo.png"
                  alt="vsColorCode Demo"
                  width={800}
                  height={600}
                  className="h-auto w-full rounded-lg"
                  loading="lazy"
                />
              </ProjectFrame>
            </motion.div>

            {/* Chart Studio Project */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7 }}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <div className="lg:order-2">
                <div className="mb-6 flex items-center gap-5">
                  <div className="rounded-xl border border-line bg-cream p-3">
                    <BarChart3 className="h-14 w-14 text-ink" />
                  </div>
                  <div>
                    <div className="mb-1 font-mono text-xs uppercase tracking-[0.25em] text-brass">{tString('portfolio.chartStudio.category')}</div>
                    <h3 className="font-display text-3xl font-semibold tracking-tight text-cream md:text-4xl">{tString('portfolio.chartStudio.title')}</h3>
                  </div>
                </div>

                <p className="mb-8 max-w-prose leading-relaxed text-cream-muted">
                  {tString('portfolio.chartStudio.description')}
                </p>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://soft-dieffenbachia-ba97b4.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btnPrimarySm}
                    style={activeFestival ? {
                      background: `linear-gradient(to right, ${activeFestival.colors.primary}, ${activeFestival.colors.secondary})`,
                    } : undefined}
                  >
                    <ExternalLink size={16} />
                    <span>{tString('portfolio.chartStudio.liveDemo')}</span>
                  </a>
                  <a href="/portfolio/chartstudio" className={btnGhostSm}>
                    <span>{tString('portfolio.chartStudio.viewProject')}</span>
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>

              <div className="lg:order-1">
                <ProjectFrame figure="Fig. 04" caption={tString('portfolio.chartStudio.demoLabel')}>
                  <Image
                    src="/chartStudio/Screenshot1.png"
                    alt="Chart Studio"
                    width={800}
                    height={500}
                    className="h-auto w-full rounded-lg"
                    loading="lazy"
                  />
                </ProjectFrame>
              </div>
            </motion.div>

            {/* UploadSpec Project */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7 }}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <div>
                <div className="mb-6 flex items-center gap-5">
                  <div className="rounded-xl border border-line bg-cream p-3">
                    <Image
                      src="/uploadSpec/logo.svg"
                      alt="UploadSpec"
                      width={56}
                      height={56}
                    />
                  </div>
                  <div>
                    <div className="mb-1 font-mono text-xs uppercase tracking-[0.25em] text-brass">{tString('portfolio.uploadSpec.category')}</div>
                    <h3 className="font-display text-3xl font-semibold tracking-tight text-cream md:text-4xl">{tString('portfolio.uploadSpec.title')}</h3>
                  </div>
                </div>

                <p className="mb-8 max-w-prose leading-relaxed text-cream-muted">
                  {tString('portfolio.uploadSpec.description')}
                </p>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://uploadspec.web.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btnPrimarySm}
                    style={activeFestival ? {
                      background: `linear-gradient(to right, ${activeFestival.colors.primary}, ${activeFestival.colors.secondary})`,
                    } : undefined}
                  >
                    <ExternalLink size={16} />
                    <span>{tString('portfolio.uploadSpec.liveDemo')}</span>
                  </a>
                  <a href="/portfolio/uploadspec" className={btnGhostSm}>
                    <span>{tString('portfolio.uploadSpec.viewProject')}</span>
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>

              <ProjectFrame figure="Fig. 05" caption={tString('portfolio.uploadSpec.demoLabel')}>
                <div className="flex min-h-[240px] items-center justify-center rounded-lg bg-ink-raised">
                  <Image
                    src="/uploadSpec/logo.svg"
                    alt="UploadSpec"
                    width={120}
                    height={120}
                    className="opacity-90"
                  />
                </div>
              </ProjectFrame>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl z-10 relative w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
          >
            <SectionHeading
              index="03"
              activeFestival={activeFestival}
              title={activeFestival ? (
                <FestivalTextDecoration festival={activeFestival}>
                  {tString('contact.title')}
                </FestivalTextDecoration>
              ) : (
                tString('contact.title')
              )}
            />
            <p className="mt-6 max-w-prose text-lg text-cream-muted">
              {tString('contact.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-14"
          >
            <a
              href="mailto:pradhuldev.1990@gmail.com"
              className="group flex items-baseline gap-4 border-t border-line py-7 transition-colors"
            >
              <IoMail className="self-center text-xl text-cream-faint transition-colors group-hover:text-brass" />
              <span className="font-display text-2xl font-semibold tracking-tight text-cream transition-colors group-hover:text-brass md:text-4xl">
                pradhuldev.1990@gmail.com
              </span>
              <ArrowUpRight className="ml-auto self-center text-cream-faint transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-brass" size={22} />
            </a>

            <a
              href="tel:+919986981757"
              className="group flex items-baseline gap-4 border-t border-line py-7 transition-colors"
            >
              <FaPhone className="self-center text-lg text-cream-faint transition-colors group-hover:text-brass" />
              <span className="font-display text-2xl font-semibold tracking-tight text-cream transition-colors group-hover:text-brass md:text-4xl">
                +91&#8209;9986981757
              </span>
              <ArrowUpRight className="ml-auto self-center text-cream-faint transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-brass" size={22} />
            </a>

            <div className="border-t border-line pt-10">
              <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-cream-faint">{tString('contact.connectLabel')}</p>
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/pradhul-dev-30708814b/', label: 'LinkedIn' },
                  { icon: FaGithubSquare, href: 'https://github.com/pradhul', label: 'GitHub' },
                  { icon: SiStackoverflow, href: 'https://stackoverflow.com/users/3309470/p-rad', label: 'Stack Overflow' },
                  { icon: FaSquareUpwork, href: 'https://www.upwork.com/freelancers/~01a32f29fafd184f21', label: 'Upwork' },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-cream-muted transition-colors hover:text-brass"
                  >
                    <Icon className="text-2xl" />
                    <span className="text-sm font-medium">{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-line px-6 py-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-6xl font-mono text-xs text-cream-faint"
        >
          © {new Date().getFullYear()} {tString('footer.copyright')}
        </motion.p>
      </footer>

      {/* Chat Widget - Lazy loaded */}
      <Suspense fallback={null}>
        <LazyChatWidget />
      </Suspense>
      </div>
    </FestivalThemeProvider>
  )
}

// Component to lazy load background after initial render
function LazyBackgroundComponents() {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Defer loading until after initial paint
    const timer = setTimeout(() => {
      setShouldLoad(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  if (!shouldLoad) return null

  return (
    <>
      <ThreeBackground />
      <InteractiveDots />
    </>
  )
}

// Component to lazy load chat widget on interaction
function LazyChatWidget() {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Load chat widget after user interaction or 3 seconds
    const loadOnInteraction = () => {
      setShouldLoad(true)
      document.removeEventListener('mousemove', loadOnInteraction)
      document.removeEventListener('touchstart', loadOnInteraction)
      document.removeEventListener('scroll', loadOnInteraction)
    }

    const timer = setTimeout(() => {
      setShouldLoad(true)
    }, 3000)

    document.addEventListener('mousemove', loadOnInteraction, { once: true, passive: true })
    document.addEventListener('touchstart', loadOnInteraction, { once: true, passive: true })
    document.addEventListener('scroll', loadOnInteraction, { once: true, passive: true })

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousemove', loadOnInteraction)
      document.removeEventListener('touchstart', loadOnInteraction)
      document.removeEventListener('scroll', loadOnInteraction)
    }
  }, [])

  if (!shouldLoad) return null

  return <ChatWidget />
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
