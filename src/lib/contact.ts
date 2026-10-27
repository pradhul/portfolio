import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  HONEYPOT_FIELD,
  MAX_EMAIL_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_NAME_LENGTH,
} from './contactConstants'

export {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  HONEYPOT_FIELD,
  MAX_EMAIL_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_NAME_LENGTH,
} from './contactConstants'

export const RESEND_EMAILS_URL = 'https://api.resend.com/emails'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type ValidatedContact = {
  name: string
  email: string
  message: string
  honeypotFilled: boolean
}

export type ValidationResult =
  | { ok: true; data: ValidatedContact }
  | { ok: false; error: string }

export type ContactSubmitResult = {
  status: number
  body: Record<string, unknown>
}

function sanitizeWhitespace(input: string): string {
  return input.replace(/\s+/g, ' ').trim()
}

function stripHeaderBreaks(input: string): string {
  return input.replace(/[\r\n]+/g, ' ')
}

export function validateContactInput(input: unknown): ValidationResult {
  if (typeof input !== 'object' || input === null) {
    return { ok: false, error: 'Invalid request payload.' }
  }

  const payload = input as Record<string, unknown>
  const name =
    typeof payload.name === 'string' ? sanitizeWhitespace(stripHeaderBreaks(payload.name)) : ''
  const email =
    typeof payload.email === 'string'
      ? sanitizeWhitespace(stripHeaderBreaks(payload.email)).toLowerCase()
      : ''
  const message = typeof payload.message === 'string' ? payload.message.replace(/\r\n/g, '\n').trim() : ''
  const honeypot = typeof payload[HONEYPOT_FIELD] === 'string' ? payload[HONEYPOT_FIELD].trim() : ''

  if (!name) {
    return { ok: false, error: 'Name is required.' }
  }

  if (name.length > MAX_NAME_LENGTH) {
    return { ok: false, error: `Name is too long (max ${MAX_NAME_LENGTH} characters).` }
  }

  if (!email) {
    return { ok: false, error: 'Email is required.' }
  }

  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }

  if (!message) {
    return { ok: false, error: 'Message is required.' }
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, error: `Message is too long (max ${MAX_MESSAGE_LENGTH} characters).` }
  }

  return {
    ok: true,
    data: {
      name,
      email,
      message,
      honeypotFilled: honeypot.length > 0,
    },
  }
}

export class MemoryRateLimiter {
  private hits = new Map<string, number[]>()

  constructor(
    private readonly options: {
      windowMs: number
      max: number
      now?: () => number
    }
  ) {}

  private now() {
    return this.options.now?.() ?? Date.now()
  }

  private prune(ip: string): number[] {
    const cutoff = this.now() - this.options.windowMs
    const next = (this.hits.get(ip) ?? []).filter((timestamp) => timestamp > cutoff)
    this.hits.set(ip, next)
    return next
  }

  isLimited(ip: string): boolean {
    return this.prune(ip).length >= this.options.max
  }

  record(ip: string): void {
    const hits = this.prune(ip)
    hits.push(this.now())
    this.hits.set(ip, hits)
  }
}

export const contactRateLimiter = new MemoryRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
})

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildEmail(data: ValidatedContact) {
  const text = [`Name: ${data.name}`, `Email: ${data.email}`, '', data.message].join('\n')
  const html = [
    `<p><strong>Name:</strong> ${escapeHtml(data.name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(data.email)}</p>`,
    `<p>${escapeHtml(data.message).replace(/\n/g, '<br />')}</p>`,
  ].join('')

  return {
    from: 'Pradhul Dev Portfolio <beth.t@example.com>',
    to: [CONTACT_EMAIL],
    reply_to: data.email,
    subject: `Portfolio contact from ${data.name}`,
    text,
    html,
  }
}

function firstHeaderValue(value: string | null): string | undefined {
  const part = value?.split(',')[0]?.trim()
  return part || undefined
}

function lastHeaderValue(value: string | null): string | undefined {
  const parts = value?.split(',').map((part) => part.trim()).filter(Boolean) ?? []
  return parts.at(-1)
}

export function getClientIp(headers: Headers): string {
  return (
    firstHeaderValue(headers.get('x-vercel-forwarded-for')) ||
    firstHeaderValue(headers.get('x-real-ip')) ||
    lastHeaderValue(headers.get('x-forwarded-for')) ||
    'unknown'
  )
}

export async function submitContactMessage(
  input: unknown,
  ip: string,
  deps: {
    apiKey?: string
    fetchImpl?: typeof fetch
    limiter?: MemoryRateLimiter
  } = {}
): Promise<ContactSubmitResult> {
  const limiter = deps.limiter ?? contactRateLimiter
  const fetchImpl = deps.fetchImpl ?? fetch
  const apiKey = deps.apiKey ?? process.env.RESEND_API_KEY

  if (limiter.isLimited(ip)) {
    return {
      status: 429,
      body: {
        ok: false,
        error: 'You are sending messages too quickly. Please wait a few minutes and try again.',
      },
    }
  }

  const validated = validateContactInput(input)
  if (!validated.ok) {
    return {
      status: 422,
      body: { ok: false, error: validated.error },
    }
  }

  if (validated.data.honeypotFilled) {
    limiter.record(ip)
    return { status: 200, body: { ok: true } }
  }

  if (!apiKey) {
    return {
      status: 503,
      body: {
        ok: false,
        code: 'EMAIL_UNAVAILABLE',
        error: 'The contact form is not configured yet. Please email me instead.',
        mailto: CONTACT_MAILTO,
      },
    }
  }

  limiter.record(ip)

  try {
    const response = await fetchImpl(RESEND_EMAILS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildEmail(validated.data)),
    })

    if (!response.ok) {
      console.error('Resend API error', response.status)
      return {
        status: 502,
        body: {
          ok: false,
          error: 'Could not send your message. Please try again or email me directly.',
          mailto: CONTACT_MAILTO,
        },
      }
    }

    return { status: 200, body: { ok: true } }
  } catch (error) {
    console.error('Resend request failed', error)
    return {
      status: 502,
      body: {
        ok: false,
        error: 'Could not send your message. Please try again or email me directly.',
        mailto: CONTACT_MAILTO,
      },
    }
  }
}
