'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  BarChart3,
  Bookmark,
  ExternalLink,
  Github,
  Package,
  UtensilsCrossed,
} from 'lucide-react'
import { useFestivalTheme } from '@/components/FestivalTheme'
import { useLanguage } from '@/components/LanguageProvider'
import {
  ICON_BLUR_DATA_URL,
  type Project,
  type ProjectLink,
  type ProjectLinkType,
} from '@/data/projects'

const btnPrimarySm =
  'inline-flex items-center gap-2 rounded-full bg-brass px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-brass-bright'
const btnGhostSm =
  'inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-cream-muted transition-colors hover:border-cream-muted hover:text-cream'

const LUCIDE_ICONS = {
  BarChart3,
  Bookmark,
  UtensilsCrossed,
} as const

const LINK_ICONS: Record<ProjectLinkType, typeof Github> = {
  github: Github,
  marketplace: Package,
  liveDemo: ExternalLink,
  viewWebStore: ExternalLink,
  viewProject: ArrowUpRight,
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

function StatusBadge({ project, inProgressLabel }: { project: Project; inProgressLabel: string }) {
  if (project.status === 'in_progress' || !project.release) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-cream-faint">
        <span className="h-1.5 w-1.5 rounded-full bg-brass" aria-hidden />
        {inProgressLabel}
      </span>
    )
  }

  const { tag, url } = project.release
  const className =
    'inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-brass/10 px-2.5 py-1 font-mono text-[11px] tracking-widest text-brass'

  if (!url) {
    return <span className={className}>{tag}</span>
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} transition-colors hover:border-brass hover:bg-brass/20`}
    >
      {tag}
      <ArrowUpRight size={12} />
    </a>
  )
}

function FeatureList({ heading, items }: { heading: string; items: string[] }) {
  if (items.length === 0) return null

  return (
    <div className="mb-6">
      <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-cream-faint">
        {heading}
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-cream-muted">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brass" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProjectIconBlock({ project }: { project: Project }) {
  const { icon } = project

  return (
    <div className="rounded-xl border border-line bg-cream p-3">
      {icon.type === 'image' ? (
        <Image
          src={icon.src}
          alt={icon.alt}
          width={56}
          height={56}
          loading="lazy"
          {...(icon.src.endsWith('.svg')
            ? {}
            : { placeholder: 'blur' as const, blurDataURL: ICON_BLUR_DATA_URL })}
        />
      ) : (
        (() => {
          const LucideIcon = LUCIDE_ICONS[icon.name]
          return <LucideIcon className="h-14 w-14 text-ink" />
        })()
      )}
    </div>
  )
}

function ProjectButton({
  link,
  label,
  festivalStyle,
}: {
  link: ProjectLink
  label: string
  festivalStyle?: React.CSSProperties
}) {
  const Icon = LINK_ICONS[link.type]
  const className = link.primary ? btnPrimarySm : btnGhostSm
  const trailingIcon = link.type === 'viewProject'

  const inner = (
    <>
      {!trailingIcon && <Icon size={16} />}
      <span>{label}</span>
      {trailingIcon && !link.hideIcon && <Icon size={16} />}
    </>
  )

  if (link.internal) {
    return (
      <a href={link.href} className={className} style={link.primary ? festivalStyle : undefined}>
        {inner}
      </a>
    )
  }

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={link.primary ? festivalStyle : undefined}
    >
      {inner}
    </a>
  )
}

export default function ProjectCard({ project }: { project: Project }) {
  const { activeFestival } = useFestivalTheme()
  const { t, tString } = useLanguage()

  const base = `portfolio.${project.id}`
  const asList = (key: string): string[] => {
    const value = t(key)
    return Array.isArray(value) ? value : []
  }

  const festivalStyle = activeFestival
    ? {
        background: `linear-gradient(to right, ${activeFestival.colors.primary}, ${activeFestival.colors.secondary})`,
      }
    : undefined

  const media = (
    <ProjectFrame figure={project.figure} caption={tString(`${base}.demoLabel`)}>
      {project.media.contain ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-lg bg-ink-raised p-4">
          <Image
            src={project.media.src}
            alt={project.media.alt}
            width={project.media.width}
            height={project.media.height}
            className={`h-auto w-full rounded-lg ${project.media.maxWidthClass ?? 'max-w-[120px] opacity-90'}`}
            loading="lazy"
            unoptimized={project.media.unoptimized}
          />
        </div>
      ) : (
        <Image
          src={project.media.src}
          alt={project.media.alt}
          width={project.media.width}
          height={project.media.height}
          className="h-auto w-full rounded-lg"
          loading="lazy"
          unoptimized={project.media.unoptimized}
        />
      )}
    </ProjectFrame>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7 }}
      className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
    >
      <div className={project.reverseLayout ? 'lg:order-2' : undefined}>
        <div className="mb-6 flex items-center gap-5">
          <ProjectIconBlock project={project} />
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-brass">
                {tString(`${base}.category`)}
              </span>
              <StatusBadge
                project={project}
                inProgressLabel={tString('portfolio.labels.inProgress')}
              />
            </div>
            <h3 className="font-display text-3xl font-semibold tracking-tight text-cream md:text-4xl">
              {tString(`${base}.title`)}
            </h3>
          </div>
        </div>

        <p className="mb-8 max-w-prose leading-relaxed text-cream-muted">
          {tString(`${base}.description`)}
        </p>

        <FeatureList
          heading={tString('portfolio.labels.features')}
          items={asList(`${base}.features`)}
        />
        <FeatureList
          heading={tString('portfolio.labels.upcoming')}
          items={asList(`${base}.upcomingFeatures`)}
        />

        <div className="flex flex-wrap gap-3">
          {project.links.map((link) => (
            <ProjectButton
              key={link.href}
              link={link}
              label={tString(`${base}.${link.labelKey}`)}
              festivalStyle={festivalStyle}
            />
          ))}
        </div>
      </div>

      <div className={project.reverseLayout ? 'lg:order-1' : undefined}>{media}</div>
    </motion.div>
  )
}
