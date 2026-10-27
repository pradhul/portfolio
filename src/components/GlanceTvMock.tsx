'use client'

import { useEffect, useState } from 'react'

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  })
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    timeZone: 'Asia/Kolkata',
  })
}

export default function GlanceTvMock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const id = window.setInterval(tick, 30_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div
      className="flex aspect-auto flex-col justify-between gap-[18px] self-center border border-line bg-[linear-gradient(160deg,#16325c,#0b1628_60%)] p-[22px] sm:aspect-[16/10] sm:gap-0"
      aria-label="Glance TV preview"
    >
      <div className="flex justify-between font-mono text-[13px] tracking-[0.04em] text-cream-muted">
        <span>Glance TV</span>
        <span>Bangalore · IST</span>
      </div>
      <div>
        <div className="font-display text-[38px] font-semibold leading-none text-cream sm:text-[52px]">
          {now ? formatTime(now) : '--:--'}
        </div>
        <div className="mt-1 text-cream-muted">{now ? formatDate(now) : 'Asia/Kolkata'}</div>
        <div className="mt-2.5 inline-block border border-lime bg-[rgba(234,255,82,0.12)] px-2.5 py-1.5 font-mono text-[13px] font-medium text-lime">
          Status line: next holiday + orders
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {['YouTube', 'Netflix', 'Kodi', 'HDMI 1'].map((app, index) => (
          <span
            key={app}
            className={`border bg-[rgba(5,11,20,0.6)] px-1 py-3 text-center text-sm ${
              index === 3 ? 'border-lime text-lime' : 'border-line text-cream'
            }`}
          >
            {app}
          </span>
        ))}
      </div>
    </div>
  )
}
