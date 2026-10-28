'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import { BarChart3, Bookmark, UtensilsCrossed } from 'lucide-react'
import SitePage from '@/components/SitePage'
import { ICON_BLUR_DATA_URL, type ProjectIcon } from '@/data/projects'

const LUCIDE_ICONS = {
  BarChart3,
  Bookmark,
  UtensilsCrossed,
} as const

export default function ProjectPageShell({ children }: { children: ReactNode }) {
  return <SitePage current="portfolio">{children}</SitePage>
}

export function ProjectAppIcon({ icon }: { icon: ProjectIcon }) {
  return (
    <div className="border border-line bg-cream p-3">
      {icon.type === 'lucide' ? (
        (() => {
          const LucideIcon = LUCIDE_ICONS[icon.name]
          return <LucideIcon className="h-12 w-12 text-ink" />
        })()
      ) : (
        <Image
          src={icon.src}
          alt={icon.alt}
          width={48}
          height={48}
          loading="lazy"
          {...(icon.src.endsWith('.svg')
            ? {}
            : { placeholder: 'blur' as const, blurDataURL: ICON_BLUR_DATA_URL })}
        />
      )}
    </div>
  )
}

export function FeatureHighlights({ items }: { items: string[] }) {
  if (items.length === 0) return null

  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((label) => (
        <div key={label} className="frame px-4 py-3 font-mono text-[13px] text-cream">
          {label}
        </div>
      ))}
    </div>
  )
}

export function ProjectHero({
  figure,
  category,
  title,
  description,
  actions,
  media,
  icon,
  badge,
}: {
  figure: string
  category: string
  title: string
  description: string
  actions: ReactNode
  media: ReactNode
  icon?: ProjectIcon
  badge?: ReactNode
}) {
  return (
    <div className="frame grid grid-cols-1 gap-8 p-6 md:grid-cols-2 md:p-8">
      <div>
        <div className="mb-4 flex items-start gap-4">
          {icon ? <ProjectAppIcon icon={icon} /> : null}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[13px] tracking-[0.04em] text-lime">
                {figure} · {category}
              </span>
              {badge}
            </div>
            <h1 className="mt-2 font-display text-[clamp(2rem,4vw,3rem)] font-semibold text-cream">{title}</h1>
          </div>
        </div>
        <p className="mt-4 text-lg text-cream-muted">{description}</p>
        <div className="mt-6 flex flex-wrap gap-3">{actions}</div>
      </div>
      <div>{media}</div>
    </div>
  )
}
