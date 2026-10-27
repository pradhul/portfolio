import type { Metadata } from 'next'
import ContactChannels from '@/components/ContactChannels'
import ContactForm from '@/components/ContactForm'
import SectionHeading from '@/components/SectionHeading'
import SitePage from '@/components/SitePage'
import { createPageMetadata, pages } from '@/lib/seo'
import { content } from '@/lib/content'

export const metadata: Metadata = createPageMetadata(pages.contact)

export default function Contact() {
  return (
    <SitePage current="contact">
      <SectionHeading as="h1" kicker={content.contact.sectionLabel} title={content.contact.title} />
      <p className="mb-9 max-w-prose text-lg text-cream-muted">{content.contact.subtitle}</p>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_.8fr]">
        <ContactForm />
        <ContactChannels />
      </div>
    </SitePage>
  )
}
