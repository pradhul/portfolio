'use client'

import { lazy, useEffect, useState } from 'react'

const ChatWidget = lazy(() => import('@/components/ChatWidget'))

export default function LazyChatWidget() {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const loadOnInteraction = () => {
      setShouldLoad(true)
      document.removeEventListener('mousemove', loadOnInteraction)
      document.removeEventListener('touchstart', loadOnInteraction)
      document.removeEventListener('scroll', loadOnInteraction)
    }

    const timer = window.setTimeout(() => {
      setShouldLoad(true)
    }, 3000)

    document.addEventListener('mousemove', loadOnInteraction, { once: true, passive: true })
    document.addEventListener('touchstart', loadOnInteraction, { once: true, passive: true })
    document.addEventListener('scroll', loadOnInteraction, { once: true, passive: true })

    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('mousemove', loadOnInteraction)
      document.removeEventListener('touchstart', loadOnInteraction)
      document.removeEventListener('scroll', loadOnInteraction)
    }
  }, [])

  if (!shouldLoad) return null

  return <ChatWidget />
}
