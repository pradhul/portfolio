'use client'

import { useFestivalTheme } from '@/components/FestivalTheme'

export default function SectionHeading({
  index,
  title,
  activeFestival,
  as: Tag = 'h2',
}: {
  index: string
  title: React.ReactNode
  activeFestival: ReturnType<typeof useFestivalTheme>['activeFestival']
  as?: 'h1' | 'h2'
}) {
  return (
    <div className="flex items-baseline gap-5 border-t border-line pt-8">
      <span className="font-mono text-sm text-brass">{index}</span>
      <Tag
        className="font-display text-4xl md:text-6xl font-semibold tracking-tight text-cream"
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
        {title}
      </Tag>
    </div>
  )
}
