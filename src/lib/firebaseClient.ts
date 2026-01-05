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

  // Validate that all required config values are present
  const missingKeys = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing Firebase configuration: ${missingKeys.join(', ')}. ` +
      'Please set these environment variables in your .env.local file or Vercel deployment settings.'
    )
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
    return analytics
  }

  // Check if we're in the browser
  if (typeof window === 'undefined') {
    return null
  }

  // Check if Analytics is supported
  const supported = await isSupported()
  if (!supported) {
    console.warn('Firebase Analytics is not supported in this environment')
    return null
  }

  try {
    const firebaseApp = getFirebaseApp()
    analytics = getAnalytics(firebaseApp)
    return analytics
  } catch (error) {
    console.error('Error initializing Firebase Analytics:', error)
    return null
  }
}

