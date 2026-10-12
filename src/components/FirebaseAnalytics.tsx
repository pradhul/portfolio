'use client'

import { useEffect } from 'react'
import { getAnalyticsInstance } from '@/lib/firebaseClient'
import { logEvent } from 'firebase/analytics'
import { trackEvent } from '@/lib/analytics'

export default function FirebaseAnalytics() {
  useEffect(() => {
    const initAnalytics = async () => {
      try {
        const analytics = await getAnalyticsInstance()
        if (analytics) {
          logEvent(analytics, 'page_view', {
            page_path: window.location.pathname,
            page_title: document.title,
          })
        }
      } catch (error) {
        console.error('Failed to initialize Firebase Analytics:', error)
      }
    }

    initAnalytics()
  }, [])

  useEffect(() => {
    const handleRouteChange = () => {
      trackEvent('page_view', {
        page_path: window.location.pathname,
        page_title: document.title,
      })
    }

    handleRouteChange()
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  return null
}
