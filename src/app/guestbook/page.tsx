'use client'

import Link from 'next/link'
import { FormEvent, PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, PenTool } from 'lucide-react'
import {
  normalizeStrokes,
  type SignatureStroke,
  toStoredStrokes,
} from '@/lib/guestbookSignature'

type GuestbookEntry = {
  id: string
  name: string
  message: string
  signatureStrokes: SignatureStroke[]
  createdAt: string
}

const CANVAS_WIDTH = 680
const CANVAS_HEIGHT = 220

function drawStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: SignatureStroke[],
  width: number,
  height: number
): void {
  ctx.clearRect(0, 0, width, height)
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#22d3ee'
  ctx.lineWidth = 2.4

  for (const stroke of strokes) {
    if (stroke.length === 0) continue

    ctx.beginPath()
    ctx.moveTo(stroke[0].x, stroke[0].y)
    for (let i = 1; i < stroke.length; i += 1) {
      ctx.lineTo(stroke[i].x, stroke[i].y)
    }
    ctx.stroke()
  }
}

function SignaturePreview({ strokes }: { strokes: SignatureStroke[] }) {
  const previewRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = previewRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    drawStrokes(ctx, strokes, canvas.width, canvas.height)
  }, [strokes])

  return (
    <canvas
      ref={previewRef}
      width={220}
      height={80}
      className="w-full rounded-lg border border-cyan-500/20 bg-black/30"
      aria-label="Submitted signature preview"
    />
  )
}

export default function GuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [loadingEntries, setLoadingEntries] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [strokes, setStrokes] = useState<SignatureStroke[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeStrokeRef = useRef<SignatureStroke>([])

  useEffect(() => {
    const loadEntries = async () => {
      setLoadingEntries(true)
      try {
        const response = await fetch('/api/guestbook')
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load entries.')
        }
        setEntries(data.entries || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load entries.')
      } finally {
        setLoadingEntries(false)
      }
    }

    loadEntries()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    drawStrokes(ctx, strokes, canvas.width, canvas.height)
  }, [strokes])

  const normalizedStrokes = useMemo(() => normalizeStrokes(strokes), [strokes])
  const hasSignature = normalizedStrokes.length > 0

  const mapClientPoint = (event: PointerEvent | ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const x = (event.clientX - rect.left) * scaleX
    const y = (event.clientY - rect.top) * scaleY

    return {
      x: Math.max(0, Math.min(canvas.width, x)),
      y: Math.max(0, Math.min(canvas.height, y)),
      t: Date.now(),
    }
  }

  const beginStroke = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const point = mapClientPoint(event)
    if (!point) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsDrawing(true)
    activeStrokeRef.current = [point]
    setStrokes((previous) => [...previous, [point]])
  }

  const continueStroke = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const point = mapClientPoint(event)
    if (!point) return
    activeStrokeRef.current = [...activeStrokeRef.current, point]
    setStrokes((previous) => {
      if (previous.length === 0) return previous
      const updated = [...previous]
      updated[updated.length - 1] = activeStrokeRef.current
      return updated
    })
  }

  const finishStroke = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setIsDrawing(false)
    activeStrokeRef.current = []
    setStrokes((previous) => normalizeStrokes(previous))
  }

  const clearSignature = () => {
    setStrokes([])
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return

    const trimmedMessage = message.trim()
    const trimmedName = name.trim()

    if (!trimmedMessage) {
      setError('Please write a message before submitting.')
      return
    }

    if (!hasSignature) {
      setError('Please add your signature before submitting.')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          message: trimmedMessage,
          signatureStrokes: toStoredStrokes(normalizedStrokes),
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Could not submit your entry.')
      }

      setEntries((previous) => [data.entry, ...previous].slice(0, 20))
      setName('')
      setMessage('')
      setStrokes([])
      setSuccess('Thanks! Your message was posted.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit your entry.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to home
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-cyan-500/20 bg-black/40 p-6 md:p-8 backdrop-blur-sm">
            <div className="mb-6">
              <h1 className="mb-2 text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Guestbook
              </h1>
              <p className="text-gray-300">
                Drop a note, add your signature, and leave a little good vibe behind.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="guest-name" className="mb-2 block text-sm font-medium text-gray-200">
                  Name (optional)
                </label>
                <input
                  id="guest-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={80}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-cyan-500/30 bg-black/40 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              <div>
                <label htmlFor="guest-message" className="mb-2 block text-sm font-medium text-gray-200">
                  Message
                </label>
                <textarea
                  id="guest-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  maxLength={500}
                  required
                  rows={5}
                  placeholder="Write a short message..."
                  className="w-full rounded-lg border border-cyan-500/30 bg-black/40 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
                <p className="mt-1 text-xs text-gray-500">{message.length}/500</p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-200">Signature</label>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Clear signature
                  </button>
                </div>
                <div className="rounded-xl border border-cyan-500/30 bg-black/40 p-2">
                  <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    onPointerDown={beginStroke}
                    onPointerMove={continueStroke}
                    onPointerUp={finishStroke}
                    onPointerLeave={finishStroke}
                    className="h-[220px] w-full touch-none rounded-lg bg-black/30"
                    aria-label="Signature pad"
                  />
                </div>
              </div>

              {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
              {success && <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{success}</p>}

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.01 }}
                whileTap={{ scale: submitting ? 1 : 0.99 }}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <PenTool size={18} />}
                {submitting ? 'Posting...' : 'Post to guestbook'}
              </motion.button>
            </form>
          </section>

          <section className="rounded-2xl border border-cyan-500/20 bg-black/40 p-6 md:p-8 backdrop-blur-sm">
            <h2 className="mb-6 text-2xl font-semibold text-cyan-300">Recent messages</h2>

            {loadingEntries ? (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 size={18} className="animate-spin" />
                Loading entries...
              </div>
            ) : entries.length === 0 ? (
              <p className="text-gray-400">No entries yet. Be the first to leave a message.</p>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <article
                    key={entry.id}
                    className="rounded-xl border border-cyan-500/20 bg-black/30 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="font-semibold text-white">{entry.name || 'Anonymous'}</p>
                      <time className="text-xs text-gray-500">
                        {new Date(entry.createdAt).toLocaleString()}
                      </time>
                    </div>
                    <p className="mb-3 text-gray-300">{entry.message}</p>
                    <SignaturePreview strokes={entry.signatureStrokes} />
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
