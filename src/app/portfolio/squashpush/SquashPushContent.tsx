'use client'

import Image from 'next/image'
import ProjectPageShell, { FeatureHighlights, ProjectHero } from '@/components/ProjectPageShell'
import { useProjectCopy } from '@/components/useProjectCopy'
import { projects } from '@/data/projects'

const MARKETPLACE = 'https://marketplace.visualstudio.com/items?itemName=PradhulDev.squash-push'
const GITHUB = 'https://github.com/pradhul/squash-push'
const squashPush = projects.find((project) => project.id === 'squashPush')

export default function SquashPushContent() {
  return (
    <ProjectPageShell>
      <SquashPushInner />
    </ProjectPageShell>
  )
}

function SquashPushInner() {
  const copy = useProjectCopy('squashPush')

  return (
    <>
      <ProjectHero
        figure="Fig. 02"
        category={copy.category}
        title={copy.title}
        description={copy.description}
        icon={squashPush?.icon}
        actions={
          <>
            <a href={MARKETPLACE} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              {copy.marketplace}
            </a>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              {copy.viewGitHub}
            </a>
          </>
        }
        media={
          <Image
            src="/squashPush/recording.gif"
            alt="Squash-Push Demo"
            width={800}
            height={600}
            className="h-auto w-full border border-line"
            unoptimized
          />
        }
      />

      <FeatureHighlights items={copy.highlights} />

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold text-cream">{copy.overview}</h2>
        {copy.about.map((para) => (
          <p key={para} className="mb-4 max-w-3xl text-lg leading-relaxed text-cream-muted">
            {para}
          </p>
        ))}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {copy.capabilityTitles.map((title, index) => (
            <div key={title} className="frame p-5">
              <h3 className="font-display text-lg font-semibold text-cream">{title}</h3>
              <p className="mt-2 text-cream-muted">{copy.capabilityBodies[index]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold text-cream">{copy.usageGuide}</h2>
        <ol className="ml-5 list-decimal space-y-2 text-cream-muted">
          {copy.usageSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className="frame mt-6 p-5">
          <div className="font-mono text-[13px] text-cream-muted">{copy.commandLabel}</div>
          <code className="mt-2 block bg-ink px-3 py-3 font-mono text-sm text-signal">
            {copy.commandName}
          </code>
        </div>
        <div className="frame mt-6 p-5">
          <h3 className="font-display text-lg font-semibold text-cream">{copy.requirementsHeading}</h3>
          <ul className="mt-2 ml-5 list-disc text-cream-muted">
            <li>{copy.gitRequirement}</li>
            <li>{copy.vscodeRequirement}</li>
          </ul>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold text-cream">{copy.knownLimitations}</h2>
        <p className="text-cream-muted">{copy.limitationMerge}</p>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold text-cream">{copy.futurePlans}</h2>
        <p className="mb-6 max-w-3xl text-cream-muted">
          {copy.futureIntro}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="frame p-5">
            <h3 className="font-display text-lg font-semibold text-cream">{copy.futureUxHeading}</h3>
            <ul className="mt-3 ml-5 list-disc text-cream-muted">
              {copy.futureUx.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="frame p-5">
            <h3 className="font-display text-lg font-semibold text-cream">{copy.futureTechHeading}</h3>
            <ul className="mt-3 ml-5 list-disc text-cream-muted">
              {copy.futureTech.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold text-cream">{copy.installationHeading}</h2>
        <ol className="ml-5 list-decimal space-y-2 text-cream-muted">
          {copy.installationSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold text-cream">{copy.technicalHeading}</h2>
        <p className="mb-4 text-cream-muted">
          {copy.technicalIntro}
        </p>
        <div className="frame overflow-hidden">
          <div className="border-b border-line px-4 py-2 font-mono text-[13px] text-cream-muted">
            {copy.coreFunctionsHeading}
          </div>
          <ul className="divide-y divide-line">
            {copy.coreFunctionNames.map((name, index) => (
              <li key={name} className="px-4 py-3">
                <div className="font-mono text-sm text-lime">{name}</div>
                <div className="text-sm text-cream-muted">{copy.coreFunctionDetails[index]}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
