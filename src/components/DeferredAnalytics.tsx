'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { runWhenIdle } from '@/lib/runtimeCapabilities'

const FirebaseAnalytics = dynamic(() => import('./FirebaseAnalytics'), { ssr: false })
const VercelInsights = dynamic(() => import('./VercelInsights'), { ssr: false })

export default function DeferredAnalytics() {
  const [ready, setReady] = useState(false)

  useEffect(() => runWhenIdle(() => setReady(true), 4000), [])

  if (!ready) return null

  return (
    <>
      <VercelInsights />
      <FirebaseAnalytics />
    </>
  )
}
