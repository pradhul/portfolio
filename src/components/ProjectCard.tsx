'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
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

function StatusBadge({ project, inProgressLabel }: { project: Project; inProgressLabel: string }) {
  if (project.status === 'in_progress' || !project.release) {
    return <span className="tag">{inProgressLabel}</span>
  }

  const { tag, url } = project.release

  if (!url) {
    return <span className="tag text-lime">{tag}</span>
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="tag text-lime no-underline hover:bg-[rgba(234,255,82,0.12)]"
    >
      {tag} ↗
    </a>
  )
}

function FeatureList({ heading, items }: { heading: string; items: string[] }) {
  if (items.length === 0) return null

  return (
    <div className="mb-6">
      <div className="mb-2 font-mono text-[13px] tracking-[0.04em] text-lime festival-accent">{heading}</div>
      <ul className="ml-[18px] list-disc text-cream-muted">
        {items.map((item) => (
          <li key={item} className="my-1">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function MediaFallback({ label }: { label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="flex min-h-[240px] items-center justify-center bg-ink-raised px-6 text-center"
    >
      <p className="font-mono text-[13px] uppercase tracking-[0.2em] text-cream-muted">
        Preview unavailable
      </p>
    </div>
  )
}

type ProbeStatus = 'checking' | 'ok' | 'failed'

function usePublicAsset(src: string): ProbeStatus {
  const [status, setStatus] = useState<ProbeStatus>('checking')

  useEffect(() => {
    if (!src) {
      setStatus('failed')
      return
    }
    let cancelled = false
    const probe = new window.Image()
    probe.onload = () => {
      if (!cancelled) setStatus('ok')
    }
    probe.onerror = () => {
      if (!cancelled) setStatus('failed')
    }
    probe.src = src
    return () => {
      cancelled = true
      probe.onload = null
      probe.onerror = null
    }
  }, [src])

  return status
}

function SafeImage({
  src,
  alt,
  width,
  height,
  className,
  unoptimized,
  fallbackLabel,
}: {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  unoptimized?: boolean
  fallbackLabel: string
}) {
  const status = usePublicAsset(src)

  if (status !== 'ok') {
    return status === 'failed' ? (
      <MediaFallback label={fallbackLabel} />
    ) : (
      <div className="min-h-[240px] bg-ink-raised" aria-hidden />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      unoptimized={unoptimized}
    />
  )
}

function ProjectIconBlock({ project }: { project: Project }) {
  const { icon } = project
  const status = usePublicAsset(icon.type === 'image' ? icon.src : '')

  return (
    <div className="border border-line bg-cream p-3">
      {icon.type === 'lucide' ? (
        (() => {
          const LucideIcon = LUCIDE_ICONS[icon.name]
          return <LucideIcon className="h-14 w-14 text-ink" />
        })()
      ) : status === 'ok' ? (
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
        <div className="flex h-14 w-14 items-center justify-center font-mono text-[10px] uppercase tracking-widest text-ink/50">
          {status === 'failed' ? 'N/A' : ''}
        </div>
      )}
    </div>
  )
}

function ProjectButton({ link, label }: { link: ProjectLink; label: string }) {
  const Icon = LINK_ICONS[link.type]
  const className = link.primary ? 'btn btn-primary' : 'btn btn-outline'
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
      <a href={link.href} className={className}>
        {inner}
      </a>
    )
  }

  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  )
}

export default function ProjectCard({ project }: { project: Project }) {
  const { activeFestival } = useFestivalTheme()
  const { t, tString } = useLanguage()
  const accent = activeFestival?.colors.primary

  const base = `portfolio.${project.id}`
  const asList = (key: string): string[] => {
    const value = t(key)
    return Array.isArray(value) ? value : []
  }

  const fallbackLabel = `${tString(`${base}.title`)} preview unavailable`
  const media = (
    <div className="overflow-hidden border border-line bg-ink-raised">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="font-mono text-[13px] tracking-[0.04em] text-lime" style={accent ? { color: accent } : undefined}>{project.figure}</span>
        <span className="font-mono text-[13px] text-cream-muted">{tString(`${base}.demoLabel`)}</span>
      </div>
      <div className="p-4">
        {project.media.contain ? (
          <div className="flex min-h-[240px] items-center justify-center bg-ink p-4">
            <SafeImage
              src={project.media.src}
              alt={project.media.alt}
              width={project.media.width}
              height={project.media.height}
              className={`h-auto w-full ${project.media.maxWidthClass ?? 'max-w-[120px] opacity-90'}`}
              unoptimized={project.media.unoptimized}
              fallbackLabel={fallbackLabel}
            />
          </div>
        ) : (
          <SafeImage
            src={project.media.src}
            alt={project.media.alt}
            width={project.media.width}
            height={project.media.height}
            className="h-auto w-full"
            unoptimized={project.media.unoptimized}
            fallbackLabel={fallbackLabel}
          />
        )}
      </div>
    </div>
  )

  return (
    <article className="frame grid items-center gap-8 p-6 lg:grid-cols-2 lg:gap-12 lg:p-8">
      <div className={project.reverseLayout ? 'lg:order-2' : undefined}>
        <div className="mb-6 flex items-center gap-5">
          <ProjectIconBlock project={project} />
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2.5">
              <span
                className="font-mono text-[13px] tracking-[0.04em] text-lime"
                style={accent ? { color: accent } : undefined}
              >
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
            />
          ))}
        </div>
      </div>

      <div className={project.reverseLayout ? 'lg:order-1' : undefined}>{media}</div>
    </article>
  )
}
