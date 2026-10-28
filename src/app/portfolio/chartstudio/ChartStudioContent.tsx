'use client'

import Image from 'next/image'
import ProjectPageShell, { FeatureHighlights, ProjectHero } from '@/components/ProjectPageShell'
import { useProjectCopy } from '@/components/useProjectCopy'
import { projects } from '@/data/projects'

const CHART_STUDIO_URL = 'https://soft-dieffenbachia-ba97b4.netlify.app/'
const chartStudio = projects.find((project) => project.id === 'chartStudio')

export default function ChartStudioContent() {
  return (
    <ProjectPageShell>
      <ChartStudioInner />
    </ProjectPageShell>
  )
}

function ChartStudioInner() {
  const copy = useProjectCopy('chartStudio')

  return (
    <>
      <ProjectHero
        figure="Fig. 04"
        category={copy.category}
        title={copy.title}
        description={copy.description}
        icon={chartStudio?.icon}
        actions={
          <a href={CHART_STUDIO_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            {copy.liveDemo}
          </a>
        }
        media={
          <Image
            src="/chartStudio/Screenshot1.png"
            alt={copy.screenshot1Alt}
            width={800}
            height={500}
            className="h-auto w-full border border-line"
            loading="lazy"
          />
        }
      />

      <FeatureHighlights items={copy.highlights} />

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold text-cream">{copy.aboutLabel} {copy.title}</h2>
        {copy.about.map((para) => (
          <p key={para} className="max-w-3xl text-lg leading-relaxed text-cream-muted">
            {para}
          </p>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="mb-6 font-display text-2xl font-semibold text-cream">{copy.screenshotsLabel}</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="frame overflow-hidden">
            <Image
              src="/chartStudio/Screenshot1.png"
              alt={copy.screenshot1Alt}
              width={800}
              height={500}
              className="h-auto w-full"
              loading="lazy"
            />
          </div>
          <div className="frame overflow-hidden">
            <Image
              src="/chartStudio/Screenshot2.png"
              alt={copy.screenshot2Alt}
              width={800}
              height={500}
              className="h-auto w-full"
              loading="lazy"
            />
          </div>
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
