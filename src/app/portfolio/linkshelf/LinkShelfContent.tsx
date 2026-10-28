'use client'

import Image from 'next/image'
import ProjectPageShell, { FeatureHighlights, ProjectHero } from '@/components/ProjectPageShell'
import { useProjectCopy } from '@/components/useProjectCopy'
import { projects } from '@/data/projects'

const LINK_SHELF_URL = 'https://link-shelf-puce.vercel.app/'
const LINK_SHELF_GITHUB = 'https://github.com/pradhul/link-shelf'
const linkShelf = projects.find((project) => project.id === 'linkShelf')

export default function LinkShelfContent() {
  return (
    <ProjectPageShell>
      <LinkShelfInner />
    </ProjectPageShell>
  )
}

function LinkShelfInner() {
  const copy = useProjectCopy('linkShelf')

  return (
    <>
      <ProjectHero
        figure="Fig. 06"
        category={copy.category}
        title={copy.title}
        description={copy.description}
        icon={linkShelf?.icon}
        actions={
          <>
            <a href={LINK_SHELF_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              {copy.liveDemo}
            </a>
            <a href={LINK_SHELF_GITHUB} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              {copy.viewGitHub}
            </a>
          </>
        }
        media={
          <Image
            src="/linkShelf/demo.jpg"
            alt="Link Shelf web UI"
            width={1024}
            height={556}
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
        <h2 className="mb-2 font-display text-2xl font-semibold text-cream">{copy.telegramTitle}</h2>
        <p className="mb-8 max-w-2xl text-cream-muted">
          {copy.telegramIntro}
        </p>
        <div className="grid justify-items-center gap-8 sm:grid-cols-2">
          <figure className="w-full max-w-[320px]">
            <div className="frame overflow-hidden">
              <Image
                src="/linkShelf/telegram-tagging.jpg"
                alt="Link Shelf Telegram bot: tagging Books/Thriller and analyzing multiple Instagram links"
                width={544}
                height={1024}
                className="h-auto w-full"
                loading="lazy"
              />
            </div>
            <figcaption className="mt-3 text-center text-sm text-cream-muted">
              {copy.telegramTagCaption}
            </figcaption>
          </figure>
          <figure className="w-full max-w-[320px]">
            <div className="frame overflow-hidden">
              <Image
                src="/linkShelf/telegram-digest.jpg"
                alt="Link Shelf Telegram bot: Movies/Best save and Today's eats daily digest"
                width={547}
                height={1024}
                className="h-auto w-full"
                loading="lazy"
              />
            </div>
            <figcaption className="mt-3 text-center text-sm text-cream-muted">
              {copy.telegramDigestCaption}
            </figcaption>
          </figure>
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
