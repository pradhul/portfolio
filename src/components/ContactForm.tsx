'use client'

import { FormEvent, useId, useState } from 'react'
import { track } from '@vercel/analytics'
import { Loader2, Send } from 'lucide-react'
import { content } from '@/lib/content'
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  HONEYPOT_FIELD,
  MAX_EMAIL_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_NAME_LENGTH,
} from '@/lib/contactConstants'

type ContactFormCopy = typeof content.contact.form

const fieldClassName =
  'w-full rounded-lg border border-line bg-ink/60 px-4 py-3 text-cream placeholder:text-cream-faint focus:outline-none focus:ring-2 focus:ring-brass/40'
const labelClassName = 'mb-2 block text-sm font-medium text-cream'

export default function ContactForm({ copy = content.contact.form }: { copy?: ContactFormCopy }) {
  const id = useId()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [mailto, setMailto] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return

    setSubmitting(true)
    setError('')
    setMailto('')
    setSuccess('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
          [HONEYPOT_FIELD]: website,
        }),
      })

      const data = (await response.json()) as {
        ok?: boolean
        error?: string
        code?: string
        mailto?: string
      }

      if (data.code === 'EMAIL_UNAVAILABLE' || response.status === 503) {
        setError(data.error || copy.unavailable)
        setMailto(data.mailto || CONTACT_MAILTO)
        return
      }

      if (!response.ok || !data.ok) {
        setError(data.error || copy.error)
        setMailto(typeof data.mailto === 'string' ? data.mailto : '')
        return
      }

      setName('')
      setEmail('')
      setMessage('')
      setWebsite('')
      setSuccess(copy.success)
      track('contact_form_submit')
    } catch {
      setError(copy.error)
      setMailto(CONTACT_MAILTO)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-5" noValidate>
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${id}-website`}>{copy.honeypotLabel}</label>
        <input
          id={`${id}-website`}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor={`${id}-name`} className={labelClassName}>
          {copy.nameLabel}
        </label>
        <input
          id={`${id}-name`}
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={MAX_NAME_LENGTH}
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={fieldClassName}
        />
      </div>

      <div>
        <label htmlFor={`${id}-email`} className={labelClassName}>
          {copy.emailLabel}
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={MAX_EMAIL_LENGTH}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={fieldClassName}
        />
      </div>

      <div>
        <label htmlFor={`${id}-message`} className={labelClassName}>
          {copy.messageLabel}
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          required
          rows={6}
          maxLength={MAX_MESSAGE_LENGTH}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={fieldClassName}
        />
        <p className="mt-1 text-xs text-cream-faint">
          {message.length}/{MAX_MESSAGE_LENGTH}
        </p>
      </div>

      {error ? (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}{' '}
          {mailto ? (
            <a href={mailto} className="font-medium text-brass underline underline-offset-2 hover:text-brass-bright">
              {CONTACT_EMAIL}
            </a>
          ) : null}
        </p>
      ) : null}

      {success ? (
        <p
          role="status"
          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
        >
          {success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded-full bg-brass px-6 py-3 font-semibold text-ink transition-colors hover:bg-brass-bright disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        {submitting ? copy.sending : copy.submit}
      </button>
    </form>
  )
}
