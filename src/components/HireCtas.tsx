'use client'

import Link from 'next/link'
import { track } from '@vercel/analytics'
import { content } from '@/lib/content'

export default function HireCtas({
  hireLabel = content.hero.hireMe,
  href = '/contact',
}: {
  hireLabel?: string
  upworkLabel?: string
  href?: string
}) {
  return (
    <Link href={href} className="btn btn-primary" onClick={() => track('hire_me_click')}>
      {hireLabel}
    </Link>
  )
}
