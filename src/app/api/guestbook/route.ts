import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getFirestoreInstance } from '@/lib/firebase'
import {
  fromStoredStrokes,
  type SignaturePoint,
  type SignatureStroke,
  type StoredSignatureStroke,
  toStoredStrokes,
} from '@/lib/guestbookSignature'

type GuestbookEntry = {
  id: string
  name: string
  message: string
  signatureStrokes: StoredSignatureStroke[]
  createdAt: Date
  ipHash: string
}

const GUESTBOOK_COLLECTION = 'guestbookEntries'
const MAX_MESSAGE_LENGTH = 500
const MAX_NAME_LENGTH = 80
const MAX_STROKES = 40
const MAX_POINTS_PER_STROKE = 300
const MAX_TOTAL_POINTS = 3000
const RATE_LIMIT_WINDOW_MS = 60 * 1000

const inMemoryRateLimit = new Map<string, number>()
const VALIDATION_ERROR_PREFIXES = [
  'Invalid request payload.',
  'Message is required.',
  'Message is too long',
  'Name is too long',
  'Signature is required.',
  'Signature has too many strokes.',
  'Invalid signature stroke.',
  'A signature stroke has too many points.',
  'Invalid signature point.',
  'Signature point coordinates are invalid.',
  'Signature point coordinates are out of range.',
  'Signature has too many points.',
]

function sanitizeWhitespace(input: string): string {
  return input.replace(/\s+/g, ' ').trim()
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown'
  }

  const realIp = request.headers.get('x-real-ip')
  return realIp?.trim() || 'unknown'
}

function createIpHash(ip: string): string {
  const salt = process.env.GUESTBOOK_IP_HASH_SALT || 'guestbook-default-salt'
  return crypto.createHash('sha256').update(`${salt}:${ip}`).digest('hex')
}

function parseIncomingStrokes(strokes: unknown): SignatureStroke[] {
  if (!Array.isArray(strokes) || strokes.length === 0) {
    return []
  }

  const parsed = strokes
    .map((stroke): SignatureStroke | null => {
      if (Array.isArray(stroke) && stroke.length > 0) {
        return stroke as SignatureStroke
      }

      if (
        typeof stroke === 'object' &&
        stroke !== null &&
        Array.isArray((stroke as StoredSignatureStroke).points) &&
        (stroke as StoredSignatureStroke).points.length > 0
      ) {
        return (stroke as StoredSignatureStroke).points
      }

      return null
    })
    .filter((stroke): stroke is SignatureStroke => stroke !== null)

  return parsed
}

function validateSignatureStrokes(strokes: unknown): StoredSignatureStroke[] {
  const compactStrokes = parseIncomingStrokes(strokes)

  if (compactStrokes.length === 0) {
    throw new Error('Signature is required.')
  }

  if (compactStrokes.length > MAX_STROKES) {
    throw new Error('Signature has too many strokes.')
  }

  let totalPoints = 0

  const normalizedStrokes = compactStrokes.map((stroke) => {
    if (!Array.isArray(stroke)) {
      throw new Error('Invalid signature stroke.')
    }

    if (stroke.length > MAX_POINTS_PER_STROKE) {
      throw new Error('A signature stroke has too many points.')
    }

    const points = stroke.map((point) => {
      if (typeof point !== 'object' || point === null) {
        throw new Error('Invalid signature point.')
      }

      const maybePoint = point as Partial<SignaturePoint>
      if (
        typeof maybePoint.x !== 'number' ||
        typeof maybePoint.y !== 'number' ||
        !Number.isFinite(maybePoint.x) ||
        !Number.isFinite(maybePoint.y)
      ) {
        throw new Error('Signature point coordinates are invalid.')
      }

      if (Math.abs(maybePoint.x) > 10000 || Math.abs(maybePoint.y) > 10000) {
        throw new Error('Signature point coordinates are out of range.')
      }

      const normalizedPoint: SignaturePoint = {
        x: Number(maybePoint.x.toFixed(2)),
        y: Number(maybePoint.y.toFixed(2)),
      }

      if (typeof maybePoint.t === 'number' && Number.isFinite(maybePoint.t)) {
        normalizedPoint.t = Math.round(maybePoint.t)
      }

      return normalizedPoint
    })

    totalPoints += points.length
    return points
  })

  if (totalPoints > MAX_TOTAL_POINTS) {
    throw new Error('Signature has too many points.')
  }

  return toStoredStrokes(normalizedStrokes)
}

function validatePayload(body: unknown): Pick<GuestbookEntry, 'name' | 'message' | 'signatureStrokes'> {
  if (typeof body !== 'object' || body === null) {
    throw new Error('Invalid request payload.')
  }

  const payload = body as {
    name?: unknown
    message?: unknown
    signatureStrokes?: unknown
  }

  const name = typeof payload.name === 'string' ? sanitizeWhitespace(payload.name) : ''
  const message = typeof payload.message === 'string' ? sanitizeWhitespace(payload.message) : ''

  if (!message) {
    throw new Error('Message is required.')
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Message is too long (max ${MAX_MESSAGE_LENGTH} characters).`)
  }

  if (name.length > MAX_NAME_LENGTH) {
    throw new Error(`Name is too long (max ${MAX_NAME_LENGTH} characters).`)
  }

  const signatureStrokes = validateSignatureStrokes(payload.signatureStrokes)

  return {
    name,
    message,
    signatureStrokes,
  }
}

async function isRateLimited(ipHash: string): Promise<boolean> {
  const now = Date.now()
  const lastInMemory = inMemoryRateLimit.get(ipHash)
  if (lastInMemory && now - lastInMemory < RATE_LIMIT_WINDOW_MS) {
    return true
  }

  const db = getFirestoreInstance()
  const rateDoc = await db.collection('guestbookRateLimits').doc(ipHash).get()
  const lastSubmittedAt = rateDoc.data()?.lastSubmittedAt?.toDate?.() as Date | undefined

  if (lastSubmittedAt && now - lastSubmittedAt.getTime() < RATE_LIMIT_WINDOW_MS) {
    return true
  }

  return false
}

async function updateRateLimit(ipHash: string): Promise<void> {
  const db = getFirestoreInstance()
  inMemoryRateLimit.set(ipHash, Date.now())

  await db.collection('guestbookRateLimits').doc(ipHash).set({
    lastSubmittedAt: new Date(),
  })
}

export async function GET() {
  try {
    const db = getFirestoreInstance()
    const snapshot = await db
      .collection(GUESTBOOK_COLLECTION)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get()

    const entries = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name || '',
        message: data.message || '',
        signatureStrokes: fromStoredStrokes(data.signatureStrokes),
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
      }
    })

    return NextResponse.json({ entries })
  } catch (error) {
    console.error('Error fetching guestbook entries:', error)
    return NextResponse.json({ error: 'Failed to load guestbook entries.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const payload = validatePayload(body)
    const ip = getClientIp(request)
    const ipHash = createIpHash(ip)

    const limited = await isRateLimited(ipHash)
    if (limited) {
      return NextResponse.json(
        { error: 'You are posting too quickly. Please wait a minute before trying again.' },
        { status: 429 }
      )
    }

    const db = getFirestoreInstance()
    const docRef = db.collection(GUESTBOOK_COLLECTION).doc()
    const entry: GuestbookEntry = {
      id: docRef.id,
      name: payload.name,
      message: payload.message,
      signatureStrokes: payload.signatureStrokes,
      createdAt: new Date(),
      ipHash,
    }

    await docRef.set(entry)
    await updateRateLimit(ipHash)

    return NextResponse.json({
      entry: {
        id: entry.id,
        name: entry.name,
        message: entry.message,
        signatureStrokes: fromStoredStrokes(entry.signatureStrokes),
        createdAt: entry.createdAt.toISOString(),
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not submit guestbook entry.'

    if (message.startsWith('Failed to parse')) {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
    }

    if (VALIDATION_ERROR_PREFIXES.some((prefix) => message.startsWith(prefix))) {
      return NextResponse.json({ error: message }, { status: 422 })
    }

    console.error('Error submitting guestbook entry:', error)
    return NextResponse.json({ error: 'Could not submit guestbook entry.' }, { status: 500 })
  }
}
