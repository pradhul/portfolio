'use client'

import { useEffect } from 'react'
import { getAnalyticsInstance } from '@/lib/firebaseClient'

/**
 * Component to initialize Firebase Analytics
 * This should be included in the root layout
 */
export default function FirebaseAnalytics() {
  useEffect(() => {
    // Initialize Firebase Analytics on client-side only
    getAnalyticsInstance().catch((error) => {
      console.error('Failed to initialize Firebase Analytics:', error)
    })
  }, [])

  return null
}

