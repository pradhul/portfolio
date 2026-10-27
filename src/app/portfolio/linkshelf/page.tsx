import type { Metadata } from 'next'
import Image from 'next/image'
import ProjectPageShell, { ProjectHero } from '@/components/ProjectPageShell'
import { createPageMetadata, pages } from '@/lib/seo'
import { content } from '@/lib/content'

export const metadata: Metadata = createPageMetadata(pages.linkShelf)

const LINK_SHELF_URL = 'https://link-shelf-puce.vercel.app/'
const LINK_SHELF_GITHUB = 'https://github.com/pradhul/link-shelf'

const FEATURES = [
  'Telegram bot for instant saves with interactive tag and subtag prompts',
  'Bulk multi-link drops with progress feedback and Gemini-assisted categorization',
  'Metadata extraction—titles, hashtags, genres, and where-to-watch hints when available',
  'Dated digests that aggregate related saves into readable summaries',
  'Web UI to browse, search, favorite, and manage your shelf',
  'Built with Next.js, Neon Postgres, and an installable progressive web app',
]

export default function LinkShelfPortfolio() {
  return (
    <ProjectPageShell>
      <ProjectHero
        figure="Fig. 06"
        category={content.portfolio.linkShelf.category}
        title={content.portfolio.linkShelf.title}
        description={content.portfolio.linkShelf.description}
        actions={
          <>
            <a href={LINK_SHELF_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Live demo
            </a>
            <a href={LINK_SHELF_GITHUB} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              View on GitHub
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

      <section className="mt-12">
        <h2 className="mb-2 font-display text-2xl font-semibold text-cream">Telegram bot in action</h2>
        <p className="mb-8 max-w-2xl text-cream-muted">
          Save and organize links from chat—tag hierarchies, bulk analysis, and dated digests without leaving Telegram.
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
              Hierarchical tags, skip/type-new prompts, and bulk link analysis with metadata enrichment
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
              Save confirmations with tags, plus dated digests that group related links
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold text-cream">Features</h2>
        <ul className="ml-[18px] list-disc text-cream-muted">
          {FEATURES.map((item) => (
            <li key={item} className="my-2">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </ProjectPageShell>
  )
}
