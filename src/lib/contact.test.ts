/**
 * Contact form validation, rate limiting, and Resend send flow.
 * Run: npx tsx src/lib/contact.test.ts
 */

import assert from 'node:assert/strict'

import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  HONEYPOT_FIELD,
  MemoryRateLimiter,
  getClientIp,
  submitContactMessage,
  validateContactInput,
} from './contact'

let failures = 0

function check(name: string, fn: () => void | Promise<void>) {
  return Promise.resolve()
    .then(() => fn())
    .then(() => {
      console.log(`  ok  ${name}`)
    })
    .catch((error) => {
      failures += 1
      console.error(`  FAIL ${name}`)
      console.error(`       ${error instanceof Error ? error.message : error}`)
    })
}

const validInput = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'I would like to hire you for a Next.js project.',
  [HONEYPOT_FIELD]: '',
}

async function run() {
  console.log('validateContactInput')

  await check('accepts a trimmed valid payload', () => {
    const result = validateContactInput({
      name: '  Ada  Lovelace  ',
      email: '  ada@example.com  ',
      message: '  Hello there.  ',
      [HONEYPOT_FIELD]: '   ',
    })
    assert.equal(result.ok, true)
    if (result.ok) {
      assert.equal(result.data.name, 'Ada Lovelace')
      assert.equal(result.data.email, 'ada@example.com')
      assert.equal(result.data.message, 'Hello there.')
      assert.equal(result.data.honeypotFilled, false)
    }
  })

  await check('rejects a missing name', () => {
    const result = validateContactInput({ ...validInput, name: '   ' })
    assert.equal(result.ok, false)
    if (!result.ok) assert.match(result.error, /name/i)
  })

  await check('rejects an invalid email', () => {
    const result = validateContactInput({ ...validInput, email: 'not-an-email' })
    assert.equal(result.ok, false)
    if (!result.ok) assert.match(result.error, /email/i)
  })

  await check('rejects a missing message', () => {
    const result = validateContactInput({ ...validInput, message: '' })
    assert.equal(result.ok, false)
    if (!result.ok) assert.match(result.error, /message/i)
  })

  await check('rejects a message that is too long', () => {
    const result = validateContactInput({ ...validInput, message: 'x'.repeat(2001) })
    assert.equal(result.ok, false)
    if (!result.ok) assert.match(result.error, /too long/i)
  })

  await check('marks a filled honeypot without treating it as a validation error', () => {
    const result = validateContactInput({ ...validInput, [HONEYPOT_FIELD]: 'https://spam.test' })
    assert.equal(result.ok, true)
    if (result.ok) assert.equal(result.data.honeypotFilled, true)
  })

  await check('rejects a non-object payload', () => {
    const result = validateContactInput(null)
    assert.equal(result.ok, false)
  })

  console.log('MemoryRateLimiter')

  await check('allows requests under the limit and blocks after it', () => {
    const limiter = new MemoryRateLimiter({ windowMs: 60_000, max: 2, now: () => 1_000 })
    assert.equal(limiter.isLimited('1.1.1.1'), false)
    limiter.record('1.1.1.1')
    limiter.record('1.1.1.1')
    assert.equal(limiter.isLimited('1.1.1.1'), true)
    assert.equal(limiter.isLimited('2.2.2.2'), false)
  })

  await check('expires hits after the window', () => {
    let now = 0
    const limiter = new MemoryRateLimiter({ windowMs: 100, max: 1, now: () => now })
    limiter.record('9.9.9.9')
    assert.equal(limiter.isLimited('9.9.9.9'), true)
    now = 101
    assert.equal(limiter.isLimited('9.9.9.9'), false)
  })

  console.log('submitContactMessage')

  await check('returns a mailto fallback when RESEND_API_KEY is missing', async () => {
    const fetchCalls: unknown[] = []
    const result = await submitContactMessage(validInput, '1.1.1.1', {
      apiKey: '',
      fetchImpl: async (...args) => {
        fetchCalls.push(args)
        return new Response('{}', { status: 200 })
      },
    })

    assert.equal(result.status, 503)
    assert.equal(result.body.ok, false)
    assert.equal(result.body.code, 'EMAIL_UNAVAILABLE')
    assert.equal(result.body.mailto, CONTACT_MAILTO)
    assert.match(String(result.body.error), /email me/i)
    assert.equal(fetchCalls.length, 0)
  })

  await check('silently succeeds for honeypot spam without sending email', async () => {
    const fetchCalls: unknown[] = []
    const result = await submitContactMessage(
      { ...validInput, [HONEYPOT_FIELD]: 'http://bots.example' },
      '8.8.8.8',
      {
        apiKey: 're_test',
        fetchImpl: async (...args) => {
          fetchCalls.push(args)
          return new Response('{}', { status: 200 })
        },
      }
    )

    assert.equal(result.status, 200)
    assert.equal(result.body.ok, true)
    assert.equal(fetchCalls.length, 0)
  })

  await check('sends via the Resend API and sets reply-to to the visitor', async () => {
    const previous = process.env.RESEND_FROM
    delete process.env.RESEND_FROM
    const fetchCalls: Array<{ url: string; init: RequestInit }> = []
    try {
    const result = await submitContactMessage(validInput, '4.4.4.4', {
      apiKey: 're_test_key',
      fetchImpl: async (input, init) => {
        fetchCalls.push({ url: String(input), init: init ?? {} })
        return new Response(JSON.stringify({ id: 'email_123' }), { status: 200 })
      },
    })

    assert.equal(result.status, 200)
    assert.equal(result.body.ok, true)
    assert.equal(fetchCalls.length, 1)
    assert.equal(fetchCalls[0].url, 'https://api.resend.com/emails')

    const headers = new Headers(fetchCalls[0].init.headers)
    assert.equal(headers.get('Authorization'), 'Bearer re_test_key')

    const payload = JSON.parse(String(fetchCalls[0].init.body))
    assert.deepEqual(payload.to, [CONTACT_EMAIL])
    assert.equal(payload.from, 'Pradhul Dev Portfolio <onboarding@resend.dev>')
    assert.doesNotMatch(payload.from, /hello@pradhul\.dev/)
    assert.equal(payload.reply_to, validInput.email)
    assert.match(payload.subject, /Ada Lovelace/)
    assert.match(payload.text, /ada@example.com/)
    assert.match(payload.text, /Next\.js project/)
    assert.match(payload.html, /Ada Lovelace/)
    } finally {
      if (previous === undefined) delete process.env.RESEND_FROM
      else process.env.RESEND_FROM = previous
    }
  })

  await check('uses RESEND_FROM when set and still replies to the visitor', async () => {
    const previous = process.env.RESEND_FROM
    process.env.RESEND_FROM = 'Pradhul Dev <contact@pradhul.dev>'
    try {
      const fetchCalls: Array<{ init: RequestInit }> = []
      const result = await submitContactMessage(validInput, '6.6.6.6', {
        apiKey: 're_test_key',
        fetchImpl: async (_input, init) => {
          fetchCalls.push({ init: init ?? {} })
          return new Response(JSON.stringify({ id: 'email_456' }), { status: 200 })
        },
      })

      assert.equal(result.status, 200)
      const payload = JSON.parse(String(fetchCalls[0].init.body))
      assert.equal(payload.from, 'Pradhul Dev <contact@pradhul.dev>')
      assert.equal(payload.reply_to, validInput.email)
    } finally {
      if (previous === undefined) delete process.env.RESEND_FROM
      else process.env.RESEND_FROM = previous
    }
  })

  await check('treats a blank RESEND_FROM as the Resend onboarding default', async () => {
    const previous = process.env.RESEND_FROM
    process.env.RESEND_FROM = '   '
    try {
      const fetchCalls: Array<{ init: RequestInit }> = []
      await submitContactMessage(validInput, '3.3.3.3', {
        apiKey: 're_test_key',
        fetchImpl: async (_input, init) => {
          fetchCalls.push({ init: init ?? {} })
          return new Response(JSON.stringify({ id: 'email_789' }), { status: 200 })
        },
      })
      const payload = JSON.parse(String(fetchCalls[0].init.body))
      assert.equal(payload.from, 'Pradhul Dev Portfolio <onboarding@resend.dev>')
    } finally {
      if (previous === undefined) delete process.env.RESEND_FROM
      else process.env.RESEND_FROM = previous
    }
  })

  await check('rate limits repeated submissions from the same IP', async () => {
    const limiter = new MemoryRateLimiter({ windowMs: 60_000, max: 1, now: () => 50 })
    const deps = {
      apiKey: 're_test_key',
      limiter,
      fetchImpl: async () => new Response(JSON.stringify({ id: 'ok' }), { status: 200 }),
    }

    const first = await submitContactMessage(validInput, '5.5.5.5', deps)
    const second = await submitContactMessage(validInput, '5.5.5.5', deps)

    assert.equal(first.status, 200)
    assert.equal(second.status, 429)
    assert.equal(second.body.ok, false)
  })

  await check('returns 422 for invalid input without calling Resend', async () => {
    const fetchCalls: unknown[] = []
    const result = await submitContactMessage({ ...validInput, email: 'nope' }, '1.2.3.4', {
      apiKey: 're_test_key',
      fetchImpl: async (...args) => {
        fetchCalls.push(args)
        return new Response('{}', { status: 200 })
      },
    })

    assert.equal(result.status, 422)
    assert.equal(result.body.ok, false)
    assert.equal(fetchCalls.length, 0)
  })

  await check('surfaces a Resend API failure without leaking the key', async () => {
    const result = await submitContactMessage(validInput, '7.7.7.7', {
      apiKey: 're_secret_should_not_leak',
      fetchImpl: async () =>
        new Response(JSON.stringify({ message: 'Invalid API key' }), { status: 401 }),
    })

    assert.equal(result.status, 502)
    assert.equal(result.body.ok, false)
    assert.equal(JSON.stringify(result.body).includes('re_secret_should_not_leak'), false)
  })

  console.log('getClientIp')

  await check('prefers the Vercel forwarded IP over spoofable x-forwarded-for', () => {
    const ip = getClientIp(
      new Headers({
        'x-forwarded-for': '1.1.1.1, 8.8.8.8',
        'x-vercel-forwarded-for': '9.9.9.9',
      })
    )
    assert.equal(ip, '9.9.9.9')
  })

  await check('uses x-real-ip when the Vercel header is absent', () => {
    const ip = getClientIp(
      new Headers({
        'x-real-ip': '7.7.7.7',
        'x-forwarded-for': '1.1.1.1',
      })
    )
    assert.equal(ip, '7.7.7.7')
  })

  await check('uses the last x-forwarded-for hop as a fallback', () => {
    const ip = getClientIp(new Headers({ 'x-forwarded-for': '1.1.1.1, 2.2.2.2' }))
    assert.equal(ip, '2.2.2.2')
  })

  if (failures > 0) {
    console.error(`\n${failures} test(s) failed`)
    process.exit(1)
  }

  console.log('\nall tests passed')
}

run()
