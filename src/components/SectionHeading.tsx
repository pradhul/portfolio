'use client'

import type { ReactNode } from 'react'
import { FestivalTextDecoration, useFestivalTheme } from '@/components/FestivalTheme'

export default function SectionHeading({
  index,
  title,
  activeFestival: activeFestivalProp,
  as: Tag = 'h2',
  kicker,
}: {
  index?: string
  title: ReactNode
  activeFestival?: ReturnType<typeof useFestivalTheme>['activeFestival']
  as?: 'h1' | 'h2'
  kicker?: string
}) {
  const { activeFestival: fetchedFestival } = useFestivalTheme()
  const activeFestival = activeFestivalProp ?? fetchedFestival

  return (
    <div className="sh mb-9">
      <div
        className="font-mono text-[13px] tracking-[0.04em] text-lime"
        style={activeFestival ? { color: activeFestival.colors.primary } : undefined}
      >
        {kicker ?? (index ? `Section ${index}` : null)}
      </div>
      <Tag
        className="mt-2 font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-tight text-cream"
        style={
          activeFestival
            ? {
                backgroundImage: `linear-gradient(to right, ${activeFestival.colors.primary}, ${activeFestival.colors.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }
            : undefined
        }
      >
        {activeFestival ? (
          <FestivalTextDecoration festival={activeFestival}>{title}</FestivalTextDecoration>
        ) : (
          title
        )}
      </Tag>
    </div>
  )
}
