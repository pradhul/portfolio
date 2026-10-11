import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { fromStoredStrokes } from '@/lib/guestbookSignature'
import { isGuestbookStorageAvailable, listGuestbookEntries } from '@/lib/guestbookStore'
import { createPageMetadata, pages } from '@/lib/seo'
import GuestbookClient, { type GuestbookEntry } from './GuestbookClient'

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

export default async function GuestbookPage() {
  const initialEntries = await loadInitialEntries()

  return (
    <main className="min-h-screen bg-ink text-cream">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-cream-muted hover:text-brass transition-colors"
          >
            <ArrowLeft size={18} />
            Back to home
          </Link>
        </div>

        <GuestbookClient initialEntries={initialEntries}>
          <h1 className="mb-2 font-display text-4xl md:text-5xl font-semibold tracking-tight text-cream">
            Guestbook
          </h1>
          <p className="text-cream-muted">
            Drop a note, add your signature, and leave a little good vibe behind.
          </p>
        </GuestbookClient>
      </div>
    </main>
  )
}
