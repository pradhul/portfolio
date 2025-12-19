import { GoogleGenerativeAI } from '@google/generative-ai'
import { getFirestoreInstance } from './firebase'
import { FESTIVAL_CONFIGS } from './festivalConfig'
import { FestivalDatesData } from './festivalDates'

/**
 * Sync festival dates for a specific year using Gemini AI
 * This is the core sync logic extracted from the API route
 */
export async function syncFestivalDatesForYear(year: number): Promise<FestivalDatesData> {
  // Get API key from environment variable
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set')
  }

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  // Create prompt for Gemini to get accurate festival dates
  const festivalList = FESTIVAL_CONFIGS.map((f) => f.name).join(', ')
  const prompt = `You are a helpful assistant that provides accurate dates for cultural festivals worldwide.

For the year ${year}, please provide the exact start and end dates (in YYYY-MM-DD format) for the following festivals:
${festivalList}

Important considerations:
- Use the actual calendar dates for ${year}, accounting for lunar calendars where applicable
- For festivals with variable dates (like Chinese New Year, Diwali, Ramadan/Eid, Hanukkah), use the correct dates for ${year}
- For single-day festivals, use the same date for both start and end
- For festivals that span year boundaries (like New Year), include the correct dates

Please respond with a JSON array in this exact format:
[
  {
    "name": "Festival Name",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD"
  },
  ...
]

Only return the JSON array, no additional text or explanation.`

  // Generate response from Gemini
  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  // Parse JSON from response (may have markdown code blocks)
  let jsonText = text.trim()
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/```\n?/g, '')
  }

  const geminiFestivals = JSON.parse(jsonText) as Array<{
    name: string
    startDate: string
    endDate: string
  }>

  // Map Gemini response to our festival IDs
  const festivals = geminiFestivals
    .map((geminiFestival) => {
      const config = FESTIVAL_CONFIGS.find((f) => {
        const nameLower = f.name.toLowerCase()
        const geminiNameLower = geminiFestival.name.toLowerCase()
        return (
          nameLower === geminiNameLower ||
          nameLower.includes(geminiNameLower) ||
          geminiNameLower.includes(nameLower)
        )
      })

      if (!config) {
        console.warn(`Could not match festival: ${geminiFestival.name}`)
        return null
      }

      return {
        id: config.id,
        name: config.name,
        startDate: geminiFestival.startDate,
        endDate: geminiFestival.endDate,
      }
    })
    .filter((f) => f !== null) as Array<{
    id: string
    name: string
    startDate: string
    endDate: string
  }>

  // If some festivals are missing, add approximate dates for them
  const existingIds = new Set(festivals.map((f) => f.id))
  FESTIVAL_CONFIGS.forEach((config) => {
    if (!existingIds.has(config.id)) {
      const startDate = new Date(
        year,
        config.approximateStartMonth,
        config.approximateStartDay
      )
      const endDate = new Date(year, config.approximateEndMonth, config.approximateEndDay)
      if (endDate < startDate) {
        endDate.setFullYear(year + 1)
      }

      festivals.push({
        id: config.id,
        name: config.name,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      })
    }
  })

  // Store in Firebase
  const festivalDatesData: FestivalDatesData = {
    year,
    festivals,
    lastUpdated: new Date().toISOString(),
  }

  try {
    const db = getFirestoreInstance()
    await db.collection('festivalDates').doc(year.toString()).set(festivalDatesData)
  } catch (firebaseError) {
    console.error('Error storing in Firebase:', firebaseError)
    // Still return the data even if Firebase storage fails
  }

  return festivalDatesData
}
