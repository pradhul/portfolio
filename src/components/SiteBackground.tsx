'use client'

import { lazy, Suspense, useEffect, useState } from 'react'
import { readMotionPreference, shouldLoadThreeBackground } from '@/lib/motionPreference'

const ThreeBackground = lazy(() => import('@/components/ThreeBackground'))
const InteractiveDots = lazy(() => import('@/components/InteractiveDots'))

export default function SiteBackground() {
  const [shouldLoad, setShouldLoad] = useState(false)
  const [loadThree, setLoadThree] = useState(false)
  const [loadDots, setLoadDots] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const preference = readMotionPreference()
      setLoadThree(shouldLoadThreeBackground(preference))
      setLoadDots(!preference.reducedMotion)
      setShouldLoad(true)
    }, 100)
    return () => window.clearTimeout(timer)
  }, [])

  if (!shouldLoad) return null

  return (
    <Suspense fallback={null}>
      {loadThree ? (
        <ThreeBackground />
      ) : (
        <div className="fixed inset-0 -z-10 bg-ink" aria-hidden />
      )}
      {loadDots ? <InteractiveDots /> : null}
    </Suspense>
  )
}
