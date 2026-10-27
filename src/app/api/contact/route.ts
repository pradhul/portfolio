import { NextRequest, NextResponse } from 'next/server'
import { getClientIp, submitContactMessage } from '@/lib/contact'

export async function POST(request: NextRequest) {
  let body: unknown

  try {
    body = await request.json()
  } catch (error) {
    console.error('Invalid contact form JSON', error)
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 })
  }

  const result = await submitContactMessage(body, getClientIp(request.headers))

  if (!result.body.ok && result.status >= 500) {
    console.error('Contact form submission failed', {
      status: result.status,
      code: result.body.code,
    })
  }

  return NextResponse.json(result.body, { status: result.status })
}
