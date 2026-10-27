'use client'

import type { ReactNode } from 'react'
import SitePage from '@/components/SitePage'

export default function ProjectPageShell({ children }: { children: ReactNode }) {
  return <SitePage current="portfolio">{children}</SitePage>
}

export function ProjectHero({
  figure,
  category,
  title,
  description,
  actions,
  media,
}: {
  figure: string
  category: string
  title: string
  description: string
  actions: ReactNode
  media: ReactNode
}) {
  return (
    <div className="frame grid grid-cols-1 gap-8 p-6 md:grid-cols-2 md:p-8">
      <div>
        <span className="font-mono text-[13px] tracking-[0.04em] text-lime">
          {figure} · {category}
        </span>
        <h1 className="mt-2 font-display text-[clamp(2rem,4vw,3rem)] font-semibold text-cream">{title}</h1>
        <p className="mt-4 text-lg text-cream-muted">{description}</p>
        <div className="mt-6 flex flex-wrap gap-3">{actions}</div>
      </div>
      <div>{media}</div>
    </div>
  )
}
