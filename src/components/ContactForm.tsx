'use client'

import { FormEvent, useId, useState } from 'react'
import { track } from '@vercel/analytics'
import { content } from '@/lib/content'
import {
  BUDGET_RANGES,
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  HONEYPOT_FIELD,
  MAX_EMAIL_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_NAME_LENGTH,
  PROJECT_TYPES,
} from '@/lib/contactConstants'

type ContactFormCopy = typeof content.contact.form

export default function ContactForm({
  copy = content.contact.form,
  locationNote = content.contact.locationNote,
}: {
  copy?: ContactFormCopy
  locationNote?: string
}) {
  const id = useId()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [projectType, setProjectType] = useState<string>(PROJECT_TYPES[0])
  const [budget, setBudget] = useState<string>(BUDGET_RANGES[0])
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
          projectType,
          budget,
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
      setProjectType(PROJECT_TYPES[0])
      setBudget(BUDGET_RANGES[0])
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

  const projectTypes = copy.projectTypes?.length ? copy.projectTypes : [...PROJECT_TYPES]
  const budgets = copy.budgets?.length ? copy.budgets : [...BUDGET_RANGES]

  return (
    <form onSubmit={handleSubmit} className="frame grid grid-cols-1 gap-[18px] p-[30px] sm:grid-cols-2" noValidate>
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
        <label htmlFor={`${id}-name`} className="schematic-label">
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
          className="schematic-field"
        />
      </div>

      <div>
        <label htmlFor={`${id}-email`} className="schematic-label">
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
          className="schematic-field"
        />
      </div>

      <div>
        <label htmlFor={`${id}-type`} className="schematic-label">
          {copy.projectTypeLabel}
        </label>
        <select
          id={`${id}-type`}
          name="projectType"
          value={projectType}
          onChange={(event) => setProjectType(event.target.value)}
          className="schematic-select"
        >
          {projectTypes.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${id}-budget`} className="schematic-label">
          {copy.budgetLabel}
        </label>
        <select
          id={`${id}-budget`}
          name="budget"
          value={budget}
          onChange={(event) => setBudget(event.target.value)}
          className="schematic-select"
        >
          {budgets.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${id}-message`} className="schematic-label">
          {copy.messageLabel}
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          required
          rows={5}
          maxLength={MAX_MESSAGE_LENGTH}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={copy.messagePlaceholder}
          className="schematic-field"
        />
      </div>

      {error ? (
        <p role="alert" className="sm:col-span-2 border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}{' '}
          {mailto ? (
            <a href={mailto} className="font-medium text-lime underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>
          ) : null}
        </p>
      ) : null}

      {success ? (
        <p role="status" className="sm:col-span-2 border border-signal/40 bg-signal/10 px-4 py-3 text-sm text-signal">
          {success}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={submitting} className="btn btn-primary">
          {submitting ? copy.sending : copy.submit}
        </button>
        <span className="font-mono text-[13px] tracking-[0.04em] text-cream-muted">{locationNote}</span>
      </div>
    </form>
  )
}
