'use client'

import { track } from '@vercel/analytics'
import { content } from '@/lib/content'
import { CONTACT_EMAIL, CONTACT_MAILTO } from '@/lib/contactConstants'

const CHANNELS = [
  {
    href: CONTACT_MAILTO,
    label: 'Email',
    detail: CONTACT_EMAIL,
    event: 'hire_me_click' as const,
  },
  {
    href: 'https://www.upwork.com/freelancers/~01a32f29fafd184f21',
    label: 'Upwork',
    detail: 'Hire ↗',
    event: 'upwork_click' as const,
    external: true,
  },
  {
    href: 'https://www.linkedin.com/in/pradhul-dev-30708814b/',
    label: 'LinkedIn',
    detail: '↗',
    external: true,
  },
  {
    href: 'https://github.com/pradhul',
    label: 'GitHub',
    detail: '@pradhul ↗',
    external: true,
  },
  {
    href: '/PRADHUL_DEV_RESUME.pdf',
    label: 'Resume',
    detail: 'PDF ↗',
  },
]

export default function ContactChannels({
  heading = content.contact.connectLabel,
}: {
  heading?: string
}) {
  return (
    <aside className="frame p-[26px]">
      <div className="mb-1.5 font-mono text-[13px] tracking-[0.04em] text-cream-muted">{heading}</div>
      {CHANNELS.map((channel) => (
        <a
          key={channel.href}
          href={channel.href}
          {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          onClick={channel.event ? () => track(channel.event) : undefined}
          className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-line py-3.5 no-underline last:border-b-0"
        >
          <span className="text-cream">{channel.label}</span>
          <span className="text-cream-muted">{channel.detail}</span>
        </a>
      ))}
    </aside>
  )
}
