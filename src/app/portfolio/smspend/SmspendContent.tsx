'use client'

import Image from 'next/image'
import ProjectPageShell, { FeatureHighlights, ProjectHero } from '@/components/ProjectPageShell'
import { useProjectCopy } from '@/components/useProjectCopy'
import { projects } from '@/data/projects'

const SMSPEND_GITHUB = 'https://github.com/pradhul/SMSpend'
const smspend = projects.find((project) => project.id === 'smspend')

const SCREENSHOTS = [
  { src: '/smspend/smspend-home.png', fallbackAlt: 'SMSpend home screen' },
  { src: '/smspend/smspend-trends.png', fallbackAlt: 'SMSpend trends screen' },
  { src: '/smspend/smspend-report.png', fallbackAlt: 'SMSpend report screen' },
] as const

export default function SmspendContent() {
  return (
    <ProjectPageShell>
      <SmspendInner />
    </ProjectPageShell>
  )
}

function SmspendInner() {
  const copy = useProjectCopy('smspend')

  return (
    <>
      <ProjectHero
        figure={smspend?.figure ?? 'Fig. 08'}
        category={copy.category}
        title={copy.title}
        description={copy.description}
        icon={smspend?.icon}
        actions={
          <a href={SMSPEND_GITHUB} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            {copy.viewGitHub}
          </a>
        }
        media={
          <div className="flex justify-center">
            <div className="frame w-full max-w-[280px] overflow-hidden">
              <Image
                src="/smspend/smspend-home.png"
                alt={copy.screenshotAlts[0] ?? SCREENSHOTS[0].fallbackAlt}
                width={456}
                height={1024}
                className="h-auto w-full"
                priority
              />
            </div>
          </div>
        }
      />

      <FeatureHighlights items={copy.highlights} />

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold text-cream">{copy.aboutLabel} {copy.title}</h2>
        {copy.about.map((para) => (
          <p key={para} className="mb-4 max-w-3xl text-lg leading-relaxed text-cream-muted last:mb-0">
            {para}
          </p>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="mb-2 font-display text-2xl font-semibold text-cream">{copy.screenshotsLabel}</h2>
        {copy.screenshotsIntro ? <p className="mb-8 max-w-2xl text-cream-muted">{copy.screenshotsIntro}</p> : null}
        <div className="grid justify-items-center gap-8 sm:grid-cols-3">
          {SCREENSHOTS.map((shot, index) => (
            <figure key={shot.src} className="w-full max-w-[280px]">
              <div className="frame overflow-hidden">
                <Image
                  src={shot.src}
                  alt={copy.screenshotAlts[index] ?? shot.fallbackAlt}
                  width={456}
                  height={1024}
                  className="h-auto w-full"
                  loading="lazy"
                />
              </div>
              {copy.screenshotCaptions[index] ? (
                <figcaption className="mt-3 text-center text-sm text-cream-muted">
                  {copy.screenshotCaptions[index]}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold text-cream">{copy.featuresLabel}</h2>
        <ul className="ml-[18px] list-disc text-cream-muted">
          {copy.features.map((item) => (
            <li key={item} className="my-2">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
