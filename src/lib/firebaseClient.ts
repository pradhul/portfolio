import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics'

// Get Firebase config from environment variables
const getFirebaseConfig = () => {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  }

  // Debug: Log which variables are present (without exposing values)
  if (typeof window !== 'undefined') {
    const envStatus = Object.entries(config).map(([key, value]) => ({
      key,
      present: !!value,
      length: value ? value.length : 0,
      // Show first/last few chars for verification (not full value for security)
      preview: value ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}` : 'missing'
    }))
    console.log('[Firebase Config Debug] Environment variables status:', envStatus)
    console.log('[Firebase Config Debug] Measurement ID:', config.measurementId ? `${config.measurementId.substring(0, 4)}...${config.measurementId.substring(config.measurementId.length - 4)}` : 'MISSING')
    
    // Also check raw process.env to see if variables exist with different names
    const allEnvKeys = Object.keys(process.env).filter(key => key.includes('FIREBASE'))
    console.log('[Firebase Config Debug] All FIREBASE env vars found:', allEnvKeys)
  }

  // Validate that all required config values are present
  const missingKeys = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missingKeys.length > 0) {
    const errorMsg = `Missing Firebase configuration: ${missingKeys.join(', ')}. ` +
      'Please set these environment variables in your .env.local file or Vercel deployment settings.'
    console.error('[Firebase Config Debug]', errorMsg)
    throw new Error(errorMsg)
  }

  return config
}

let app: FirebaseApp | undefined
let analytics: Analytics | null = null

// Initialize Firebase
export function getFirebaseApp(): FirebaseApp {
  if (app) {
    return app
  }

  // Check if already initialized
  const existingApps = getApps()
  if (existingApps.length > 0) {
    app = existingApps[0]
    return app
  }

  // Initialize Firebase with config from environment variables
  const firebaseConfig = getFirebaseConfig()
  app = initializeApp(firebaseConfig)
  return app
}

// Initialize Analytics (client-side only)
export async function getAnalyticsInstance(): Promise<Analytics | null> {
  // Return cached instance if available
  if (analytics) {
    console.log('[Firebase Analytics Debug] Using cached Analytics instance')
    return analytics
  }

  // Check if we're in the browser
  if (typeof window === 'undefined') {
    console.log('[Firebase Analytics Debug] Not in browser environment (SSR)')
    return null
  }

  try {
    console.log('[Firebase Analytics Debug] Starting Analytics initialization...')
    
    // Check if Analytics is supported
    const supported = await isSupported()
    console.log('[Firebase Analytics Debug] Analytics supported:', supported)
    if (!supported) {
      console.warn('[Firebase Analytics Debug] Analytics is not supported in this environment')
      return null
    }

    // Get Firebase app (this will validate config)
    console.log('[Firebase Analytics Debug] Getting Firebase app...')
    const firebaseApp = getFirebaseApp()
    console.log('[Firebase Analytics Debug] Firebase app obtained:', !!firebaseApp)
    
    // Initialize Analytics
    console.log('[Firebase Analytics Debug] Initializing Analytics...')
    analytics = getAnalytics(firebaseApp)
    console.log('[Firebase Analytics Debug] Analytics initialized successfully:', !!analytics)
    return analytics
  } catch (error) {
    console.error('[Firebase Analytics Debug] Error initializing Firebase Analytics:', error)
    if (error instanceof Error) {
      console.error('[Firebase Analytics Debug] Error message:', error.message)
      console.error('[Firebase Analytics Debug] Error stack:', error.stack)
    }
    return null
  }
}

