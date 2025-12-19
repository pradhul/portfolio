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
const cachedDates: Map<number, FestivalDatesData> = new Map()
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
 * Returns the most relevant festival if multiple are active
 */
export async function getActiveFestival(date: Date = new Date()): Promise<FestivalConfig | null> {
  const year = date.getFullYear()
  const dates = await getFestivalDates(year)

  // Festival priority order (higher priority first)
  // When multiple festivals overlap, the one with higher priority is shown
  const priorityOrder = [
    'christmas',        // Highest - most prominent winter holiday
    'new-year',         // Second - major celebration
    'diwali',           // Major festival of lights
    'chinese-new-year', // Major cultural celebration
    'easter',           // Major Christian holiday
    'hanukkah',         // Jewish festival
    'ramadan-eid',      // Major Islamic festival
    'holi',             // Festival of colors
    'valentines',       // Single day, but popular
    'mardi-gras',       // Pre-Lent celebration
    'cherry-blossom',   // Spring festival
    'halloween',        // Popular but single day focus
    'day-of-the-dead',  // Cultural celebration
    'oktoberfest',      // Beer festival
  ]

  // Collect all active festivals
  const activeFestivals: Array<{ id: string; config: FestivalConfig }> = []

  // Check current year festivals
  for (const festivalDate of dates.festivals) {
    if (isDateInFestivalRange(date, festivalDate)) {
      const config = FESTIVAL_CONFIGS.find((f) => f.id === festivalDate.id)
      if (config) {
        activeFestivals.push({ id: festivalDate.id, config })
      }
    }
  }

  // Check previous year (for festivals that span year boundaries like New Year)
  if (date.getMonth() === 0 && date.getDate() <= 2) {
    const prevYearDates = await getFestivalDates(year - 1)
    for (const festivalDate of prevYearDates.festivals) {
      if (isDateInFestivalRange(date, festivalDate)) {
        const config = FESTIVAL_CONFIGS.find((f) => f.id === festivalDate.id)
        if (config && !activeFestivals.find((af) => af.id === festivalDate.id)) {
          activeFestivals.push({ id: festivalDate.id, config })
        }
      }
    }
  }

  // If multiple festivals are active, return the one with highest priority
  if (activeFestivals.length > 0) {
    // Sort by priority
    activeFestivals.sort((a, b) => {
      const aPriority = priorityOrder.indexOf(a.id)
      const bPriority = priorityOrder.indexOf(b.id)
      // If not in priority list, put at end
      if (aPriority === -1 && bPriority === -1) return 0
      if (aPriority === -1) return 1
      if (bPriority === -1) return -1
      return aPriority - bPriority
    })
    return activeFestivals[0].config
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
