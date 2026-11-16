'use client'

import Image from 'next/image'
import ProjectPageShell, { FeatureHighlights, ProjectHero } from '@/components/ProjectPageShell'
import { useProjectCopy } from '@/components/useProjectCopy'
import { projects } from '@/data/projects'

const FORGE_GITHUB = 'https://github.com/pradhul/forge-launcher/tree/cursor/forge-launcher-mvp-8cde'
const forgeLauncher = projects.find((project) => project.id === 'forgeLauncher')

export default function ForgeLauncherContent() {
  return (
    <ProjectPageShell>
      <ForgeLauncherInner />
    </ProjectPageShell>
  )
}

function ForgeLauncherInner() {
  const copy = useProjectCopy('forgeLauncher')

  return (
    <>
      <ProjectHero
        figure={forgeLauncher?.figure ?? 'Fig. 22'}
        category={copy.category}
        title={copy.title}
        description={copy.description}
        icon={forgeLauncher?.icon}
        actions={
          <a href={FORGE_GITHUB} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            {copy.viewGitHub}
          </a>
        }
        media={
          <div className="flex justify-center">
            <div className="frame w-full max-w-[200px] overflow-hidden">
              <Image
                src="/forgeLauncher/icon.png"
                alt="Forge launcher icon"
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
