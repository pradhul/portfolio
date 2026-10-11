import type { Metadata } from 'next'
import HomePage from '@/components/HomePage'
import { createPageMetadata, pages, personJsonLd } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata(pages.home)

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <HomePage />
    </>
  )
}
