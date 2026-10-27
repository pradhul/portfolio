import {
  BUDGET_RANGES,
  CONTACT_MAILTO,
  HONEYPOT_FIELD,
  MAX_BUDGET_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_NAME_LENGTH,
  MAX_PROJECT_TYPE_LENGTH,
  PROJECT_TYPES,
} from './contactConstants'

export {
  BUDGET_RANGES,
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  HONEYPOT_FIELD,
  MAX_BUDGET_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_NAME_LENGTH,
  MAX_PROJECT_TYPE_LENGTH,
  PROJECT_TYPES,
} from './contactConstants'

export const RESEND_EMAILS_URL = 'https://api.resend.com/emails'
export const DEFAULT_RESEND_FROM = 'Pradhul Dev Portfolio <onboarding@resend.dev>'
export const DEFAULT_CONTACT_TO_EMAIL = 'pradhul.dev1990@gmail.com'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type ValidatedContact = {
  name: string
  email: string
  message: string
  projectType: string
  budget: string
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
  const projectType =
    typeof payload.projectType === 'string'
      ? sanitizeWhitespace(stripHeaderBreaks(payload.projectType))
      : ''
  const budget =
    typeof payload.budget === 'string' ? sanitizeWhitespace(stripHeaderBreaks(payload.budget)) : ''
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

  if (projectType && !PROJECT_TYPES.includes(projectType as (typeof PROJECT_TYPES)[number])) {
    return { ok: false, error: 'Please choose a valid project type.' }
  }

  if (projectType.length > MAX_PROJECT_TYPE_LENGTH) {
    return { ok: false, error: `Project type is too long (max ${MAX_PROJECT_TYPE_LENGTH} characters).` }
  }

  if (budget && !BUDGET_RANGES.includes(budget as (typeof BUDGET_RANGES)[number])) {
    return { ok: false, error: 'Please choose a valid budget range.' }
  }

  if (budget.length > MAX_BUDGET_LENGTH) {
    return { ok: false, error: `Budget is too long (max ${MAX_BUDGET_LENGTH} characters).` }
  }

  return {
    ok: true,
    data: {
      name,
      email,
      message,
      projectType,
      budget,
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

export function resolveResendFrom(from?: string): string {
  const configured = from?.trim() || process.env.RESEND_FROM?.trim()
  return configured || DEFAULT_RESEND_FROM
}

export function resolveContactToEmail(to?: string): string {
  const configured = to?.trim() || process.env.CONTACT_TO_EMAIL?.trim()
  return configured || DEFAULT_CONTACT_TO_EMAIL
}

function buildEmail(data: ValidatedContact, from?: string, to?: string) {
  const extraLines = [
    data.projectType ? `Project type: ${data.projectType}` : '',
    data.budget ? `Budget: ${data.budget}` : '',
  ].filter(Boolean)
  const text = [`Name: ${data.name}`, `Email: ${data.email}`, ...extraLines, '', data.message].join(
    '\n'
  )
  const html = [
    `<p><strong>Name:</strong> ${escapeHtml(data.name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(data.email)}</p>`,
    data.projectType
      ? `<p><strong>Project type:</strong> ${escapeHtml(data.projectType)}</p>`
      : '',
    data.budget ? `<p><strong>Budget:</strong> ${escapeHtml(data.budget)}</p>` : '',
    `<p>${escapeHtml(data.message).replace(/\n/g, '<br />')}</p>`,
  ].join('')

  return {
    from: resolveResendFrom(from),
    to: [resolveContactToEmail(to)],
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
    from?: string
    to?: string
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
      body: JSON.stringify(buildEmail(validated.data, deps.from, deps.to)),
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
