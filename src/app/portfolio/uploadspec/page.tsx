import type { Metadata } from 'next'
import Image from 'next/image'
import ProjectPageShell, { ProjectHero } from '@/components/ProjectPageShell'
import { createPageMetadata, pages } from '@/lib/seo'
import { content } from '@/lib/content'

export const metadata: Metadata = createPageMetadata(pages.uploadSpec)

const UPLOAD_SPEC_URL = 'https://uploadspec.web.app/'

const FEATURES = [
  'Dedicated pages per exam or portal under /tools/ (UPSC, IBPS, RRB, Kerala PSC, passport, driving licence, and more)',
  'Spec tables and guidance visible in static HTML for SEO and no-JS users',
  'Crop, compress to KB range, and download with portal-ready filenames',
  'Kerala PSC name and date stamp overlay where required',
  'Per-tool feedback embed to capture portal rejection signals',
  'Deployed as a static site on Firebase Hosting (uploadspec.web.app)',
]

export default function UploadSpecPortfolio() {
  return (
    <ProjectPageShell>
      <ProjectHero
        figure="Fig. 05"
        category={content.portfolio.uploadSpec.category}
        title={content.portfolio.uploadSpec.title}
        description={content.portfolio.uploadSpec.description}
        actions={
          <a href={UPLOAD_SPEC_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Open live site
          </a>
        }
        media={
          <div className="flex min-h-[220px] items-center justify-center border border-line bg-ink-raised p-8">
            <Image src="/uploadSpec/logo.svg" alt="UploadSpec" width={120} height={120} />
          </div>
        }
      />

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
