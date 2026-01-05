'use client'

import { useEffect } from 'react'
import { getAnalyticsInstance } from '@/lib/firebaseClient'
import { logEvent } from 'firebase/analytics'
import { trackEvent } from '@/lib/analytics'

/**
 * Component to initialize Firebase Analytics
 * This should be included in the root layout
 */
export default function FirebaseAnalytics() {
  useEffect(() => {
    // Initialize Firebase Analytics on client-side only
    const initAnalytics = async () => {
      try {
        const analytics = await getAnalyticsInstance()
        if (analytics) {
          // Log a page_view event to verify Analytics is working
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

  // Track page views on route changes
  useEffect(() => {
    const handleRouteChange = () => {
      trackEvent('page_view', {
        page_path: window.location.pathname,
        page_title: document.title,
      })
    }

    // Track initial page view
    handleRouteChange()

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  return null
}

