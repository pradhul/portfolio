'use client'

import Image from 'next/image'
import ProjectPageShell, { FeatureHighlights, ProjectHero } from '@/components/ProjectPageShell'
import { useProjectCopy } from '@/components/useProjectCopy'
import { projects } from '@/data/projects'
import {
  SMSPEND_RELEASES_URL,
  SMSPEND_RESTRICTED_SETTINGS_HELP,
  SMSPEND_UNKNOWN_SOURCES_HELP,
  type SmspendRelease,
} from '@/lib/smspend-release'

const SMSPEND_GITHUB = 'https://github.com/pradhul/SMSpend'
const smspend = projects.find((project) => project.id === 'smspend')

const SCREENSHOTS = [
  { src: '/smspend/smspend-home.png', fallbackAlt: 'SMSpend home screen' },
  { src: '/smspend/smspend-trends.png', fallbackAlt: 'SMSpend trends screen' },
  { src: '/smspend/smspend-report.png', fallbackAlt: 'SMSpend report screen' },
] as const

const helpLinkClass = 'font-medium text-lime underline underline-offset-2'

export default function SmspendContent({ release }: { release: SmspendRelease }) {
  return (
    <ProjectPageShell>
      <SmspendInner release={release} />
    </ProjectPageShell>
  )
}

function SmspendInner({ release }: { release: SmspendRelease }) {
  const copy = useProjectCopy('smspend')

  const downloadButton = (
    <a href={release.apkUrl} className="btn btn-primary">
      {copy.downloadApk}
    </a>
  )

  return (
    <>
      <ProjectHero
        figure={smspend?.figure ?? 'Fig. 08'}
        category={copy.category}
        title={copy.title}
        description={copy.description}
        icon={smspend?.icon}
        badge={<span className="tag border-lime text-lime">{release.tag}</span>}
        actions={
          <>
            {downloadButton}
            <a href={SMSPEND_GITHUB} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              {copy.viewGitHub}
            </a>
          </>
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

      <section className="mt-12" id="install">
        <h2 className="mb-4 font-display text-2xl font-semibold text-cream">{copy.installHeading}</h2>
        <div className="flex flex-wrap items-center gap-3">
          {downloadButton}
          <span className="tag border-lime text-lime">{release.tag}</span>
          <a
            href={SMSPEND_RELEASES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[13px] text-cream-muted underline underline-offset-2 hover:text-lime"
          >
            {copy.allReleases}
          </a>
        </div>
        <ul className="mt-6 max-w-3xl space-y-4 text-cream-muted">
          <li>
            {copy.unknownSourcesNote}{' '}
            <a
              href={SMSPEND_UNKNOWN_SOURCES_HELP}
              target="_blank"
              rel="noopener noreferrer"
              className={helpLinkClass}
            >
              {copy.unknownSourcesLink}
            </a>
          </li>
          <li>
            {copy.restrictedSettingsNote}{' '}
            <a
              href={SMSPEND_RESTRICTED_SETTINGS_HELP}
              target="_blank"
              rel="noopener noreferrer"
              className={helpLinkClass}
            >
              {copy.restrictedSettingsLink}
            </a>
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
