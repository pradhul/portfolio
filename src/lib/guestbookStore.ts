import type { Firestore } from 'firebase-admin/firestore'
import { getOptionalFirestore } from '@/lib/firebase'
import type { StoredSignatureStroke } from '@/lib/guestbookSignature'

export type GuestbookEntryRecord = {
  id: string
  name: string
  message: string
  signatureStrokes: StoredSignatureStroke[]
  createdAt: Date
  ipHash: string
}

export type GuestbookEntryResponse = {
  id: string
  name: string
  message: string
  signatureStrokes: StoredSignatureStroke[]
  createdAt: string
}

const GUESTBOOK_COLLECTION = 'guestbookEntries'
const RATE_LIMIT_COLLECTION = 'guestbookRateLimits'
const RATE_LIMIT_WINDOW_MS = 60 * 1000

const memoryEntries: GuestbookEntryRecord[] = []
const memoryRateLimits = new Map<string, number>()

function serializeEntry(entry: GuestbookEntryRecord): GuestbookEntryResponse {
  return {
    id: entry.id,
    name: entry.name,
    message: entry.message,
    signatureStrokes: entry.signatureStrokes,
    createdAt: entry.createdAt.toISOString(),
  }
}

function shouldUseMemoryStore(): boolean {
  return getOptionalFirestore() === null && process.env.NODE_ENV === 'development'
}

export function isGuestbookStorageAvailable(): boolean {
  return getOptionalFirestore() !== null || shouldUseMemoryStore()
}

export function getGuestbookStorageMode(): 'firestore' | 'memory' | 'unavailable' {
  if (getOptionalFirestore()) return 'firestore'
  if (shouldUseMemoryStore()) return 'memory'
  return 'unavailable'
}

async function isRateLimitedFirestore(db: Firestore, ipHash: string): Promise<boolean> {
  const now = Date.now()
  const lastInMemory = memoryRateLimits.get(ipHash)
  if (lastInMemory && now - lastInMemory < RATE_LIMIT_WINDOW_MS) {
    return true
  }

  const rateDoc = await db.collection(RATE_LIMIT_COLLECTION).doc(ipHash).get()
  const lastSubmittedAt = rateDoc.data()?.lastSubmittedAt?.toDate?.() as Date | undefined

  if (lastSubmittedAt && now - lastSubmittedAt.getTime() < RATE_LIMIT_WINDOW_MS) {
    return true
  }

  return false
}

function isRateLimitedMemory(ipHash: string): boolean {
  const now = Date.now()
  const lastSubmittedAt = memoryRateLimits.get(ipHash)
  return Boolean(lastSubmittedAt && now - lastSubmittedAt < RATE_LIMIT_WINDOW_MS)
}

async function updateRateLimitFirestore(db: Firestore, ipHash: string): Promise<void> {
  memoryRateLimits.set(ipHash, Date.now())
  await db.collection(RATE_LIMIT_COLLECTION).doc(ipHash).set({
    lastSubmittedAt: new Date(),
  })
}

function updateRateLimitMemory(ipHash: string): void {
  memoryRateLimits.set(ipHash, Date.now())
}

export async function listGuestbookEntries(limit = 20): Promise<GuestbookEntryResponse[]> {
  const db = getOptionalFirestore()

  if (db) {
    const snapshot = await db
      .collection(GUESTBOOK_COLLECTION)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get()

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return serializeEntry({
        id: doc.id,
        name: data.name || '',
        message: data.message || '',
        signatureStrokes: data.signatureStrokes || [],
        createdAt: data.createdAt?.toDate?.() || new Date(),
        ipHash: data.ipHash || '',
      })
    })
  }

  if (shouldUseMemoryStore()) {
    return memoryEntries
      .slice()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
      .map(serializeEntry)
  }

  throw new Error('Guestbook storage is not configured.')
}

export async function createGuestbookEntry(
  entry: Omit<GuestbookEntryRecord, 'id' | 'createdAt'> & { id?: string }
): Promise<GuestbookEntryResponse> {
  const db = getOptionalFirestore()
  const createdAt = new Date()

  if (db) {
    const limited = await isRateLimitedFirestore(db, entry.ipHash)
    if (limited) {
      throw new Error('RATE_LIMITED')
    }

    const docRef = entry.id ? db.collection(GUESTBOOK_COLLECTION).doc(entry.id) : db.collection(GUESTBOOK_COLLECTION).doc()
    const record: GuestbookEntryRecord = {
      id: docRef.id,
      name: entry.name,
      message: entry.message,
      signatureStrokes: entry.signatureStrokes,
      createdAt,
      ipHash: entry.ipHash,
    }

    await docRef.set(record)
    await updateRateLimitFirestore(db, entry.ipHash)
    return serializeEntry(record)
  }

  if (shouldUseMemoryStore()) {
    if (isRateLimitedMemory(entry.ipHash)) {
      throw new Error('RATE_LIMITED')
    }

    const record: GuestbookEntryRecord = {
      id: entry.id || `local-${Date.now()}`,
      name: entry.name,
      message: entry.message,
      signatureStrokes: entry.signatureStrokes,
      createdAt,
      ipHash: entry.ipHash,
    }

    memoryEntries.unshift(record)
    updateRateLimitMemory(entry.ipHash)
    return serializeEntry(record)
  }

  throw new Error('Guestbook storage is not configured.')
}
