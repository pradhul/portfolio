'use client'

import Image from 'next/image'
import ProjectPageShell, { FeatureHighlights, ProjectHero } from '@/components/ProjectPageShell'
import { useProjectCopy } from '@/components/useProjectCopy'
import { projects } from '@/data/projects'

const GLANCE_TV_GITHUB = 'https://github.com/pradhul/glance-tv'
const GLANCE_TV_RELEASE = 'https://github.com/pradhul/glance-tv/releases/tag/v43'
const glance = projects.find((project) => project.id === 'glanceTv')

export default function GlanceTvContent() {
  return (
    <ProjectPageShell>
      <GlanceTvInner />
    </ProjectPageShell>
  )
}

function GlanceTvInner() {
  const copy = useProjectCopy('glanceTv')

  return (
    <>
      <ProjectHero
        figure="Fig. 18"
        category={copy.category}
        title={copy.title}
        description={copy.description}
        icon={glance?.icon}
        badge={<span className="tag border-lime text-lime">{copy.releaseLabel}</span>}
        actions={
          <>
            <a href={GLANCE_TV_RELEASE} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              {copy.releaseLabel}
            </a>
            <a href={GLANCE_TV_GITHUB} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              {copy.viewGitHub}
            </a>
          </>
        }
        media={
          <Image
            src="/glanceTv/demo.png"
            alt="Glance TV home screen with Bing wallpaper, clock, and app tiles"
            width={1920}
            height={1080}
            className="h-auto w-full border border-line"
            loading="lazy"
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
        <h2 className="mb-4 font-display text-2xl font-semibold text-cream">{copy.homeScreenTitle}</h2>
        <p className="mb-8 max-w-2xl text-cream-muted">
          {copy.homeScreenIntro}
        </p>
        <div className="space-y-8">
          <figure className="frame overflow-hidden">
            <Image
              src="/glanceTv/styles.png"
              alt="Glance TV glass tiles layout"
              width={1920}
              height={1080}
              className="h-auto w-full"
              loading="lazy"
            />
          </figure>
          <figure className="frame overflow-hidden">
            <Image
              src="/glanceTv/orders.png"
              alt="Glance TV orders status line with the next holiday and upcoming deliveries"
              width={1300}
              height={90}
              className="h-auto w-full"
              loading="lazy"
            />
            <figcaption className="px-4 py-3 text-center text-sm text-cream-muted">
              {copy.ordersCaption}
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold text-cream">{copy.features.length ? copy.featuresLabel : ''}</h2>
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
