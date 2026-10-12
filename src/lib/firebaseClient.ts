import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics'

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

export function getFirebaseApp(): FirebaseApp {
  if (app) {
    return app
  }

  const existingApps = getApps()
  if (existingApps.length > 0) {
    app = existingApps[0]
    return app
  }

  app = initializeApp(getFirebaseConfig())
  return app
}

export async function getAnalyticsInstance(): Promise<Analytics | null> {
  if (analytics) {
    return analytics
  }

  if (typeof window === 'undefined') {
    return null
  }

  try {
    const supported = await isSupported()
    if (!supported) {
      return null
    }

    analytics = getAnalytics(getFirebaseApp())
    return analytics
  } catch (error) {
    console.error('Error initializing Firebase Analytics:', error)
    return null
  }
}
