'use client'

import Image from 'next/image'
import ProjectPageShell, { FeatureHighlights, ProjectHero } from '@/components/ProjectPageShell'
import { useProjectCopy } from '@/components/useProjectCopy'
import { projects } from '@/data/projects'
import { SUNDRY_RELEASES_URL, type SundryRelease } from '@/lib/sundry-release'

const SUNDRY_GITHUB = 'https://github.com/pradhul/sundry'
const sundry = projects.find((project) => project.id === 'sundry')

export default function SundryContent({ release }: { release: SundryRelease }) {
  return (
    <ProjectPageShell>
      <SundryInner release={release} />
    </ProjectPageShell>
  )
}

function SundryInner({ release }: { release: SundryRelease }) {
  const copy = useProjectCopy('sundry')

  const downloadButton = (
    <a href={release.dmgUrl} className="btn btn-primary">
      {copy.downloadDmg}
    </a>
  )

  return (
    <>
      <ProjectHero
        figure={sundry?.figure ?? 'Fig. 21'}
        category={copy.category}
        title={copy.title}
        description={copy.description}
        icon={sundry?.icon}
        badge={<span className="tag border-lime text-lime">{release.tag}</span>}
        actions={
          <>
            {downloadButton}
            <a href={SUNDRY_GITHUB} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              {copy.viewGitHub}
            </a>
          </>
        }
        media={
          <div className="flex justify-center">
            <div className="frame w-full max-w-[280px] overflow-hidden">
              <Image
                src="/sundry/icon.png"
                alt="Sundry app icon"
                width={512}
                height={512}
                className="h-auto w-full"
                priority
              />
            </div>
          </div>
        }
      />

      <FeatureHighlights items={copy.highlights} />

      <section className="mt-12" id="install">
        <h2 className="mb-4 font-display text-2xl font-semibold text-cream">{copy.installHeading}</h2>
        <div className="flex flex-wrap items-center gap-3">
          {downloadButton}
          <span className="tag border-lime text-lime">{release.tag}</span>
          <a
            href={SUNDRY_RELEASES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[13px] text-cream-muted underline underline-offset-2 hover:text-lime"
          >
            {copy.allReleases}
          </a>
        </div>
        <ul className="mt-6 max-w-3xl space-y-4 text-cream-muted">
          <li>{copy.requirementsNote}</li>
          <li>{copy.gatekeeperNote}</li>
          <li>
            {copy.quarantineNote}{' '}
            <code className="mt-2 block break-all border border-line bg-ink-raised px-3 py-2 font-mono text-[13px] text-cream">
              {copy.quarantineCommand}
            </code>
          </li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold text-cream">{copy.aboutLabel} {copy.title}</h2>
        {copy.about.map((para) => (
          <p key={para} className="mb-4 max-w-3xl text-lg leading-relaxed text-cream-muted last:mb-0">
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
