import { NextRequest, NextResponse } from 'next/server'
import { syncFestivalDatesForYear } from '@/lib/syncFestivalDates'

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

    // Use the shared sync function
    const festivalDatesData = await syncFestivalDatesForYear(year)

    return NextResponse.json({
      success: true,
      year,
      festivals: festivalDatesData.festivals,
      message: 'Festival dates synced successfully',
    })
  } catch (error) {
    console.error('Error in festival sync API:', error)

    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your configuration.' },
          { status: 500 }
        )
      }
      if (error.message.includes('QUOTA') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }
      if (error.message.includes('JSON')) {
        return NextResponse.json(
          { error: 'Failed to parse AI response. Using approximate dates as fallback.' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'An error occurred while syncing festival dates. Please try again.' },
      { status: 500 }
    )
  }
}
