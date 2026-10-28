'use client'

import Link from 'next/link'
import SectionHeading from '@/components/SectionHeading'
import { useLanguage } from '@/components/LanguageProvider'
import GuestbookClient, { type GuestbookEntry } from './GuestbookClient'

export default function GuestbookPage({
  initialEntries,
}: {
  initialEntries: GuestbookEntry[]
}) {
  const { tString } = useLanguage()

  return (
    <>
      <Link href="/" className="mb-8 inline-flex items-center gap-2 font-mono text-[13px] text-cream-muted no-underline hover:text-lime">
        ← {tString('contact.backToHome')}
      </Link>
      <GuestbookClient initialEntries={initialEntries}>
        <SectionHeading as="h1" kicker={tString('guestbook.sectionLabel')} title={tString('guestbook.title')} />
        <p className="text-cream-muted">{tString('guestbook.subtitle')}</p>
      </GuestbookClient>
    </>
  )
}
