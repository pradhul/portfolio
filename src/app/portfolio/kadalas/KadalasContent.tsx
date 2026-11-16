'use client'

import Image from 'next/image'
import ProjectPageShell, { FeatureHighlights, ProjectHero } from '@/components/ProjectPageShell'
import { useProjectCopy } from '@/components/useProjectCopy'
import { projects } from '@/data/projects'

const KADALAS_LIVE = 'https://kadalas.netlify.app'
const KADALAS_GITHUB = 'https://github.com/pradhul/kadalas'
const kadalas = projects.find((project) => project.id === 'kadalas')

const SCREENSHOTS = [
  { src: '/kadalas/screenshot-vault.png', width: 1280, height: 900, fallbackAlt: 'Kadalas vault home' },
  { src: '/kadalas/screenshot-scan-review.png', width: 1280, height: 900, fallbackAlt: 'Kadalas scan review' },
  { src: '/kadalas/screenshot-vehicle-cover.png', width: 1280, height: 900, fallbackAlt: 'Kadalas vehicle cover' },
] as const

export default function KadalasContent() {
  return (
    <ProjectPageShell>
      <KadalasInner />
    </ProjectPageShell>
  )
}

function KadalasInner() {
  const copy = useProjectCopy('kadalas')

  return (
    <>
      <ProjectHero
        figure={kadalas?.figure ?? 'Fig. 19'}
        category={copy.category}
        title={copy.title}
        description={copy.description}
        icon={kadalas?.icon}
        actions={
          <>
            <a href={KADALAS_LIVE} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              {copy.liveDemo}
            </a>
            <a href={KADALAS_GITHUB} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              {copy.viewGitHub}
            </a>
          </>
        }
        media={
          <Image
            src="/kadalas/screenshot-vault.png"
            alt={copy.screenshotAlts[0] ?? SCREENSHOTS[0].fallbackAlt}
            width={1280}
            height={900}
            className="h-auto w-full border border-line"
            priority
          />
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
        <div className="grid gap-8">
          {SCREENSHOTS.map((shot, index) => (
            <figure key={shot.src}>
              <div className="frame overflow-hidden">
                <Image
                  src={shot.src}
                  alt={copy.screenshotAlts[index] ?? shot.fallbackAlt}
                  width={shot.width}
                  height={shot.height}
                  className="h-auto w-full"
                  loading="lazy"
                />
              </div>
              {copy.screenshotCaptions[index] ? (
                <figcaption className="mt-3 text-sm text-cream-muted">
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
