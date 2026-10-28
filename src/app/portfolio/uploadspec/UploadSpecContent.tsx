'use client'

import Image from 'next/image'
import ProjectPageShell, { FeatureHighlights, ProjectHero } from '@/components/ProjectPageShell'
import { useProjectCopy } from '@/components/useProjectCopy'
import { projects } from '@/data/projects'

const UPLOAD_SPEC_URL = 'https://uploadspec.web.app/'
const uploadSpec = projects.find((project) => project.id === 'uploadSpec')

export default function UploadSpecContent() {
  return (
    <ProjectPageShell>
      <UploadSpecInner />
    </ProjectPageShell>
  )
}

function UploadSpecInner() {
  const copy = useProjectCopy('uploadSpec')

  return (
    <>
      <ProjectHero
        figure="Fig. 05"
        category={copy.category}
        title={copy.title}
        description={copy.description}
        icon={uploadSpec?.icon}
        actions={
          <a href={UPLOAD_SPEC_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            {copy.liveDemo}
          </a>
        }
        media={
          <div className="flex min-h-[220px] items-center justify-center border border-line bg-ink-raised p-8">
            <Image src="/uploadSpec/logo.svg" alt="UploadSpec" width={120} height={120} />
          </div>
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
