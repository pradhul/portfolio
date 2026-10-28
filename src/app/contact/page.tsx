import type { Metadata } from 'next'
import ContactPage from '@/components/ContactPage'
import { createPageMetadata, pages } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata(pages.contact)

export default function Contact() {
  return <ContactPage />
}
