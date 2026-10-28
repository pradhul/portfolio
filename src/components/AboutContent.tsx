'use client'

import dynamic from 'next/dynamic'
import { content } from '@/lib/content'
import { useFestivalTheme } from '@/components/FestivalTheme'
import { useLanguage } from '@/components/LanguageProvider'

const GitHubActivity = dynamic(() => import('@/components/GitHubActivity'), {
  ssr: false,
  loading: () => (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="py-8 text-center text-cream-muted">Loading activity...</div>
      </div>
    </div>
  ),
})

type AboutSource = typeof content.about
type AboutInterest = AboutSource['interests'][number]

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
    interests:
      (translatedContent?.about as AboutSource | undefined)?.interests ?? content.about.interests,
  }

  const paragraphs = asStringList(t('about.paragraphs'))
  const skills = asStringList(t('about.skills'))
  const interests = about.interests as AboutInterest[]

  return (
    <>
      <div className="frame grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div className="border-b border-line bg-ink-raised p-[26px] md:col-span-2 lg:col-span-1 lg:border-b-0 lg:border-r">
          <span
            className="font-mono text-[13px] tracking-[0.04em] text-lime"
            style={activeFestival ? { color: activeFestival.colors.primary } : undefined}
          >
            {tString('about.fighterLabel')}
          </span>
          <h3 className="mt-1.5 font-display text-xl font-semibold text-cream">
            {tString('about.fighterName')}
          </h3>
          <p className="mt-1.5 text-cream-muted">{tString('about.fighterIntro')}</p>
        </div>
        {interests.map((interest, index) => (
          <div
            key={interest.title}
            className={`border-line p-[26px] ${
              index < interests.length - 1 ? 'border-b md:border-b lg:border-b-0 lg:border-r' : ''
            } ${index === 0 ? 'md:border-r' : ''} ${index === 1 ? 'md:border-t-0 md:border-b-0' : ''}`}
          >
            <span className="font-mono text-[13px] tracking-[0.04em] text-brass">{interest.label}</span>
            <h3 className="mt-1.5 font-display text-xl font-semibold text-cream">{interest.title}</h3>
            <p className="mt-1.5 text-cream-muted">{interest.body}</p>
          </div>
        ))}
      </div>

      {variant === 'full' && (
        <div className="mt-16 max-w-prose">
          {paragraphs.map((para) => (
            <p key={para} className="mb-5 text-base leading-relaxed text-cream-muted last:mb-0 md:text-lg">
              {para}
            </p>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="mt-12">
          <div
            className="mb-4 font-mono text-[13px] tracking-[0.04em] text-lime"
            style={activeFestival ? { color: activeFestival.colors.primary } : undefined}
          >
            {tString('about.skillsLabel')}
          </div>
          <ul className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <li key={skill} className="tag">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      )}

      {variant === 'full' && (
        <>
          <div className="mt-16">
            <div
              className="mb-6 font-mono text-[13px] tracking-[0.04em] text-lime"
              style={activeFestival ? { color: activeFestival.colors.primary } : undefined}
            >
              {tString('about.experienceLabel')}
            </div>
            <ol className="grid gap-4">
              {about.experience.map((item) => (
                <li key={`${item.company}-${item.dates}`} className="frame grid gap-1.5 p-[22px] md:grid-cols-[180px_1fr] md:gap-6">
                  <div className="font-mono text-[13px] tracking-[0.04em] text-brass">{item.dates}</div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-cream">{item.role}</h3>
                    <div className="mt-1 text-cream-muted">{item.company}</div>
                    <p className="mt-1.5 text-cream-muted">{item.summary}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-16">
            <div
              className="mb-6 font-mono text-[13px] tracking-[0.04em] text-lime"
              style={activeFestival ? { color: activeFestival.colors.primary } : undefined}
            >
              {tString('about.educationLabel')}
            </div>
            <ul className="grid gap-4">
              {about.education.map((item) => (
                <li key={`${item.school}-${item.dates}`} className="frame grid gap-1.5 p-[22px] md:grid-cols-[180px_1fr] md:gap-6">
                  <div className="font-mono text-[13px] tracking-[0.04em] text-brass">{item.dates}</div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-cream">{item.credential}</h3>
                    <div className="mt-1 text-cream-muted">{item.school}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <div className="mt-16">
        <div
          className="mb-6 font-mono text-[13px] tracking-[0.04em] text-lime"
          style={activeFestival ? { color: activeFestival.colors.primary } : undefined}
        >
          {tString('about.githubActivity')}
        </div>
        <div className="frame overflow-hidden p-6 md:p-8">
          <GitHubActivity username="pradhul" />
        </div>
      </div>
    </>
  )
}
