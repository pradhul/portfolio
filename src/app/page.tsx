'use client'
import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { motion } from 'framer-motion'
import { FileText, ChevronDown, ArrowUpRight } from 'lucide-react'
import ProjectCard from '@/components/ProjectCard'
import { projects } from '@/data/projects'
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
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
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
