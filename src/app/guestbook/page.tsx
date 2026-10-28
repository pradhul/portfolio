import type { Metadata } from 'next'
import { fromStoredStrokes } from '@/lib/guestbookSignature'
import { isGuestbookStorageAvailable, listGuestbookEntries } from '@/lib/guestbookStore'
import { createPageMetadata, pages } from '@/lib/seo'
import SitePage from '@/components/SitePage'
import GuestbookPage from './GuestbookPage'
import type { GuestbookEntry } from './GuestbookClient'

export const metadata: Metadata = createPageMetadata(pages.guestbook)
export const revalidate = 60

async function loadInitialEntries(): Promise<GuestbookEntry[]> {
  try {
    if (!isGuestbookStorageAvailable()) return []

    const entries = await listGuestbookEntries()
    return entries.map((entry) => ({
      id: entry.id,
      name: entry.name,
      message: entry.message,
      createdAt: entry.createdAt,
      signatureStrokes: fromStoredStrokes(entry.signatureStrokes),
    }))
  } catch {
    return []
  }
}

export default async function GuestbookRoute() {
  const initialEntries = await loadInitialEntries()

  return (
    <SitePage current="guestbook">
      <GuestbookPage initialEntries={initialEntries} />
    </SitePage>
  )
}
