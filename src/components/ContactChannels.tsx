'use client'

import { track } from '@vercel/analytics'
import { FaLinkedin, FaGithubSquare } from 'react-icons/fa'
import { FaSquareUpwork } from 'react-icons/fa6'
import { IoMail } from 'react-icons/io5'
import { SiStackoverflow } from 'react-icons/si'
import { useLanguage } from '@/components/LanguageProvider'
import { content } from '@/lib/content'
import { CONTACT_EMAIL, CONTACT_MAILTO } from '@/lib/contactConstants'

const SOCIALS = [
  {
    href: 'https://www.linkedin.com/in/pradhul-dev-30708814b/',
    labelKey: 'contact.channels.linkedin',
    icon: FaLinkedin,
  },
  {
    href: 'https://github.com/pradhul',
    labelKey: 'contact.channels.github',
    icon: FaGithubSquare,
  },
  {
    href: 'https://stackoverflow.com/users/3309470/p-rad',
    labelKey: 'contact.channels.stackOverflow',
    icon: SiStackoverflow,
  },
  {
    href: 'https://www.upwork.com/freelancers/~01a32f29fafd184f21',
    labelKey: 'contact.channels.upwork',
    icon: FaSquareUpwork,
    event: 'upwork_click' as const,
  },
]

export default function ContactChannels({
  heading = content.contact.connectLabel,
}: {
  heading?: string
}) {
  const { tString } = useLanguage()

  const channels = [
    {
      href: CONTACT_MAILTO,
      label: tString('contact.channels.email'),
      detail: CONTACT_EMAIL,
      event: 'hire_me_click' as const,
    },
    {
      href: 'https://www.upwork.com/freelancers/~01a32f29fafd184f21',
      label: tString('contact.channels.upwork'),
      detail: `${tString('hero.hireMe')} ↗`,
      event: 'upwork_click' as const,
      external: true,
    },
    {
      href: '/PRADHUL_DEV_RESUME.pdf',
      label: tString('contact.channels.resume'),
      detail: 'PDF ↗',
    },
  ]

  return (
    <aside className="frame p-[26px]">
      <div className="mb-4 font-mono text-[13px] tracking-[0.04em] text-cream-muted">{heading}</div>
      <div className="mb-2 flex flex-wrap gap-4">
        {SOCIALS.map(({ href, labelKey, icon: Icon, event }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={event ? () => track(event) : undefined}
            className="inline-flex items-center gap-2 text-cream-muted no-underline hover:text-lime"
          >
            <Icon className="text-xl" />
            <span className="text-sm font-medium">{tString(labelKey)}</span>
          </a>
        ))}
      </div>
      {channels.map((channel) => (
        <a
          key={`${channel.label}-${channel.href}`}
          href={channel.href}
          {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          onClick={channel.event ? () => track(channel.event) : undefined}
          className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-line py-3.5 no-underline last:border-b-0"
        >
          <span className="inline-flex items-center gap-2 text-cream">
            {channel.href.startsWith('mailto:') ? <IoMail className="text-lg" /> : null}
            {channel.label}
          </span>
          <span className="text-cream-muted">{channel.detail}</span>
        </a>
      ))}
    </aside>
  )
}
