import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { SITE_HOST } from '@/lib/seo'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

type OgImageProps = {
  eyebrow?: string
  title: string
  description: string
}

const plexRegular = readFileSync(join(process.cwd(), 'src/lib/fonts/IBMPlexSans-Regular.ttf'))

function truncateDescription(text: string, max = 170): string {
  if (text.length <= max) return text
  return `${text.slice(0, max).replace(/\s+\S*$/, '')}…`
}

export function generateOgImage({
  eyebrow = 'WEB & MOBILE DEVELOPER',
  title,
  description,
}: OgImageProps) {
  const titleSize = title.length > 22 ? 64 : 80
  const summary = truncateDescription(description)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#050b14',
          backgroundImage:
            'linear-gradient(rgba(90, 130, 200, 0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(90, 130, 200, 0.10) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          padding: '72px 80px',
          fontFamily: 'IBM Plex Sans',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 980,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              color: '#eaff52',
              fontSize: 20,
              fontWeight: 400,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              color: '#e6edf7',
              fontSize: titleSize,
              fontWeight: 400,
              marginTop: 24,
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'flex',
              width: 80,
              height: 3,
              backgroundColor: '#eaff52',
              marginTop: 28,
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              color: '#b5ccf2',
              fontSize: 26,
              fontWeight: 400,
              marginTop: 32,
              lineHeight: 1.4,
            }}
          >
            {summary}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: '#8fb0e0',
            fontSize: 20,
            fontWeight: 400,
          }}
        >
          <div style={{ display: 'flex' }}>PRADHUL DEV · PD-2026</div>
          <div style={{ display: 'flex' }}>{SITE_HOST}</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        {
          name: 'IBM Plex Sans',
          data: plexRegular,
          weight: 400,
          style: 'normal',
        },
      ],
    }
  )
}
