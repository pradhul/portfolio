import { getFirestoreInstance } from './firebase'
import { FESTIVAL_CONFIGS, FestivalConfig } from './festivalConfig'

export interface FestivalDate {
  id: string
  name: string
  startDate: string // ISO date string
  endDate: string // ISO date string
  lastUpdated?: string
}

export interface FestivalDatesData {
  year: number
  festivals: FestivalDate[]
  lastUpdated?: string
}

// In-memory cache
let cachedDates: Map<number, FestivalDatesData> = new Map()
let cacheTimestamp: number = 0
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

// Track which years are currently being synced to avoid duplicate requests
const syncingYears = new Set<number>()

/**
 * Get festival dates from Firebase for a specific year
 */
export async function getFestivalDatesFromFirebase(year: number): Promise<FestivalDatesData | null> {
  try {
    const db = getFirestoreInstance()
    const docRef = db.collection('festivalDates').doc(year.toString())
    const doc = await docRef.get()

    if (!doc.exists) {
      return null
    }

    const data = doc.data() as FestivalDatesData
    return data
  } catch (error) {
    console.error('Error fetching festival dates from Firebase:', error)
    return null
  }
}

/**
 * Trigger automatic sync for a year (non-blocking)
 * This runs the sync logic directly without blocking the request
 */
async function triggerAutoSync(year: number): Promise<void> {
  // Don't sync if already syncing this year
  if (syncingYears.has(year)) {
    return
  }

  // Only auto-sync for current year, next year, or previous year (relevant years)
  const currentYear = new Date().getFullYear()
  if (year < currentYear - 1 || year > currentYear + 1) {
    return
  }

  syncingYears.add(year)

  // Run sync in background (non-blocking)
  // Import and call sync logic directly
  import('./syncFestivalDates').then(({ syncFestivalDatesForYear }) => {
    syncFestivalDatesForYear(year)
      .then(() => {
        console.log(`✅ Auto-synced festival dates for year ${year}`)
        // Clear cache so next request gets fresh data
        cachedDates.delete(year)
      })
      .catch((error) => {
        console.error(`Error auto-syncing year ${year}:`, error)
      })
      .finally(() => {
        // Remove from syncing set after a delay
        setTimeout(() => {
          syncingYears.delete(year)
        }, 60000) // 1 minute
      })
  }).catch((error) => {
    console.error(`Error importing sync module for year ${year}:`, error)
    syncingYears.delete(year)
  })
}

/**
 * Get festival dates with fallback to approximate dates
 * Automatically triggers sync if data is missing for relevant years
 */
export async function getFestivalDates(year: number = new Date().getFullYear()): Promise<FestivalDatesData> {
  // Check cache first
  const now = Date.now()
  if (cachedDates.has(year) && now - cacheTimestamp < CACHE_DURATION) {
    return cachedDates.get(year)!
  }

  // Try Firebase first
  const firebaseData = await getFestivalDatesFromFirebase(year)
  if (firebaseData) {
    cachedDates.set(year, firebaseData)
    cacheTimestamp = now
    return firebaseData
  }

  // If data doesn't exist in Firebase, trigger auto-sync for relevant years
  // (non-blocking - user gets immediate response with approximate dates)
  triggerAutoSync(year).catch((error) => {
    console.error(`Error triggering auto-sync for year ${year}:`, error)
  })

  // Fallback to approximate dates (return immediately, sync happens in background)
  const approximateDates: FestivalDatesData = {
    year,
    festivals: FESTIVAL_CONFIGS.map((config) => {
      const startDate = new Date(year, config.approximateStartMonth, config.approximateStartDay)
      const endDate = new Date(year, config.approximateEndMonth, config.approximateEndDay)
      
      // Handle year rollover (e.g., New Year spans Dec 31 to Jan 1)
      if (endDate < startDate) {
        endDate.setFullYear(year + 1)
      }

      return {
        id: config.id,
        name: config.name,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      }
    }),
  }

  cachedDates.set(year, approximateDates)
  cacheTimestamp = now
  return approximateDates
}

/**
 * Check if a date falls within a festival's date range
 */
export function isDateInFestivalRange(date: Date, festival: FestivalDate): boolean {
  const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const startDate = new Date(festival.startDate)
  const endDate = new Date(festival.endDate)

  return checkDate >= startDate && checkDate <= endDate
}

/**
 * Get the active festival for a given date
 */
export async function getActiveFestival(date: Date = new Date()): Promise<FestivalConfig | null> {
  const year = date.getFullYear()
  const dates = await getFestivalDates(year)

  // Check current year festivals
  for (const festivalDate of dates.festivals) {
    if (isDateInFestivalRange(date, festivalDate)) {
      const config = FESTIVAL_CONFIGS.find((f) => f.id === festivalDate.id)
      if (config) return config
    }
  }

  // Check previous year (for festivals that span year boundaries like New Year)
  if (date.getMonth() === 0 && date.getDate() <= 2) {
    const prevYearDates = await getFestivalDates(year - 1)
    for (const festivalDate of prevYearDates.festivals) {
      if (isDateInFestivalRange(date, festivalDate)) {
        const config = FESTIVAL_CONFIGS.find((f) => f.id === festivalDate.id)
        if (config) return config
      }
    }
  }

  return null
}

/**
 * Clear the cache (useful for testing or manual refresh)
 */
export function clearFestivalDatesCache(): void {
  cachedDates.clear()
  cacheTimestamp = 0
}
