import { NextRequest, NextResponse } from 'next/server'
import { getLanguageFromCountry } from '@/lib/countryToLanguage'

export async function GET(request: NextRequest) {
  try {
    // Check Vercel headers first
    const vercelCountry = request.headers.get('x-vercel-ip-country')
    
    if (vercelCountry) {
      const language = getLanguageFromCountry(vercelCountry)
      return NextResponse.json({
        country: vercelCountry,
        language,
        source: 'vercel-header',
      })
    }

    // Fallback to IP geolocation (free service)
    try {
      const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
      
      // Use ipapi.co free service (1000 requests/day)
      const response = await fetch(`https://ipapi.co/${clientIp}/json/`, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.country_code) {
          const language = getLanguageFromCountry(data.country_code)
          return NextResponse.json({
            country: data.country_code,
            language,
            source: 'ipapi',
          })
        }
      }
    } catch (error) {
      console.error('Error fetching IP geolocation:', error)
    }

    // Default fallback
    return NextResponse.json({
      country: 'US',
      language: 'en',
      source: 'default',
    })
  } catch (error) {
    console.error('Error in detect-country API:', error)
    return NextResponse.json(
      { error: 'Detection failed', country: 'US', language: 'en' },
      { status: 500 }
    )
  }
}
