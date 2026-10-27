'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { content } from '@/lib/content'
import { useFestivalTheme } from '@/components/FestivalTheme'
import { useLanguage } from '@/components/LanguageProvider'

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

type AboutSource = typeof content.about

function asStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

export default function AboutContent({ variant = 'compact' }: { variant?: 'compact' | 'full' }) {
  const { activeFestival } = useFestivalTheme()
  const { t, tString, translatedContent } = useLanguage()
  const about = {
    ...content.about,
    ...((translatedContent?.about as AboutSource | undefined) ?? {}),
    experience:
      (translatedContent?.about as AboutSource | undefined)?.experience ?? content.about.experience,
    education:
      (translatedContent?.about as AboutSource | undefined)?.education ?? content.about.education,
  }

  const paragraphs = asStringList(t('about.paragraphs'))
  const skills = asStringList(t('about.skills'))

  return (
    <>
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
          {paragraphs.map((para, index) => {
            if (index === 0 && para.includes('Pradhul')) {
              const parts = para.split('Pradhul')
              return (
                <p
                  key={index}
                  className="mb-6 text-2xl font-medium leading-snug text-cream md:text-3xl last:mb-0"
                >
                  {parts[0]}
                  <span
                    className="text-brass"
                    style={activeFestival ? { color: activeFestival.colors.primary } : undefined}
                  >
                    Pradhul
                  </span>
                  {parts[1]}
                </p>
              )
            }
            return (
              <p
                key={index}
                className="mb-6 text-base leading-relaxed text-cream-muted md:text-lg last:mb-0"
              >
                {para}
              </p>
            )
          })}
          {skills.length > 0 && (
            <div className="mt-10">
              <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-cream-faint">
                {tString('about.skillsLabel')}
              </div>
              <ul className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-line px-3 py-1.5 text-sm text-cream-muted"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>

      {variant === 'full' && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-20 grid gap-10 md:grid-cols-[1fr_2fr]"
          >
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-cream-faint">
              {tString('about.experienceLabel')}
            </div>
            <ol className="space-y-10">
              {about.experience.map((item) => (
                <li key={`${item.company}-${item.dates}`}>
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-brass">
                    {item.dates}
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-cream">
                    {item.role}
                  </h3>
                  <div className="mt-1 text-cream-muted">{item.company}</div>
                  <p className="mt-3 max-w-prose leading-relaxed text-cream-muted">{item.summary}</p>
                </li>
              ))}
            </ol>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-20 grid gap-10 md:grid-cols-[1fr_2fr]"
          >
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-cream-faint">
              {tString('about.educationLabel')}
            </div>
            <ul className="space-y-8">
              {about.education.map((item) => (
                <li key={`${item.school}-${item.dates}`}>
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-brass">
                    {item.dates}
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-cream">
                    {item.credential}
                  </h3>
                  <div className="mt-1 text-cream-muted">{item.school}</div>
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}

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
    </>
  )
}
