'use client'

import { track } from '@vercel/analytics'
import { FaSquareUpwork } from 'react-icons/fa6'
import { IoMail } from 'react-icons/io5'
import { content } from '@/lib/content'
import { CONTACT_MAILTO } from '@/lib/contactConstants'

const UPWORK_URL = 'https://www.upwork.com/freelancers/~01a32f29fafd184f21'

export default function HireCtas({
  hireLabel = content.hero.hireMe,
  upworkLabel = content.hero.upwork,
}: {
  hireLabel?: string
  upworkLabel?: string
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a href={CONTACT_MAILTO} className="btn btn-primary" onClick={() => track('hire_me_click')}>
        <IoMail size={18} />
        <span>{hireLabel}</span>
      </a>
      <a
        href={UPWORK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-outline"
        onClick={() => track('upwork_click')}
      >
        <FaSquareUpwork size={18} />
        <span>{upworkLabel}</span>
      </a>
    </div>
  )
}
