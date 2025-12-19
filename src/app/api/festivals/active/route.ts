import { NextRequest, NextResponse } from 'next/server'
import { getActiveFestival } from '@/lib/festivalDates'

export async function GET(request: NextRequest) {
  try {
    const dateParam = request.nextUrl.searchParams.get('date')
    const date = dateParam ? new Date(dateParam) : new Date()

    const activeFestival = await getActiveFestival(date)

    if (!activeFestival) {
      return NextResponse.json({ activeFestival: null })
    }

    return NextResponse.json({ activeFestival })
  } catch (error) {
    console.error('Error getting active festival:', error)
    return NextResponse.json(
      { error: 'Failed to get active festival', activeFestival: null },
      { status: 500 }
    )
  }
}
