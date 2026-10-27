import type { Metadata } from 'next'
import AboutPage from '@/components/AboutPage'
import { createPageMetadata, pages, personJsonLd } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata(pages.about)

export default function About() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <AboutPage />
    </>
  )
}
