import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreInstance } from '@/lib/firebase'
import { FestivalDatesData } from '@/lib/festivalDates'

/**
 * API endpoint to view what's stored in Firebase
 * Usage: GET /api/festivals/view?year=2025
 */
export async function GET(request: NextRequest) {
  try {
    const yearParam = request.nextUrl.searchParams.get('year')
    const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear()

    if (isNaN(year) || year < 2020 || year > 2100) {
      return NextResponse.json(
        { error: 'Invalid year. Please provide a year between 2020 and 2100.' },
        { status: 400 }
      )
    }

    // Get Firebase project info from environment or initialized app
    let projectId: string = process.env.FIREBASE_PROJECT_ID || 'Not configured'
    try {
      const { getFirebaseAdmin } = await import('@/lib/firebase')
      const { app } = getFirebaseAdmin()
      projectId = app.options.projectId || projectId
    } catch (error) {
      // Firebase not initialized yet, use env var
    }

    // Try to get data from Firebase
    let firebaseData: FestivalDatesData | null = null
    let firebaseError: string | null = null

    try {
      const db = getFirestoreInstance()
      const docRef = db.collection('festivalDates').doc(year.toString())
      const doc = await docRef.get()

      if (doc.exists) {
        firebaseData = doc.data() as FestivalDatesData
      } else {
        firebaseError = `No data found for year ${year} in Firebase`
      }
    } catch (error) {
      firebaseError = error instanceof Error ? error.message : 'Unknown error'
    }

    // Get environment variable status (without exposing sensitive data)
    const envStatus = {
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Not set',
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? '✅ Set' : '❌ Not set',
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? '✅ Set' : '❌ Not set',
    }

    return NextResponse.json({
      firebaseProject: projectId || 'Not configured',
      environmentStatus: envStatus,
      requestedYear: year,
      firebaseData: firebaseData || null,
      firebaseError: firebaseError || null,
      collectionPath: `festivalDates/${year}`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in view API:', error)
    return NextResponse.json(
      {
        error: 'Failed to view festival data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
