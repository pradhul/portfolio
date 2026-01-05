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
      console.log('[Firebase Analytics Debug] FirebaseAnalytics component mounted, initializing...')
      try {
        const analytics = await getAnalyticsInstance()
        console.log('[Firebase Analytics Debug] getAnalyticsInstance returned:', !!analytics)
        if (analytics) {
          // Log a page_view event to verify Analytics is working
          console.log('[Firebase Analytics Debug] Logging page_view event...')
          logEvent(analytics, 'page_view', {
            page_path: window.location.pathname,
            page_title: document.title,
          })
          console.log('[Firebase Analytics Debug] page_view event logged successfully')
        } else {
          console.warn('[Firebase Analytics Debug] Analytics instance is null, cannot log events')
        }
      } catch (error) {
        console.error('[Firebase Analytics Debug] Failed to initialize Firebase Analytics:', error)
        if (error instanceof Error) {
          console.error('[Firebase Analytics Debug] Error details:', {
            message: error.message,
            stack: error.stack
          })
        }
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

