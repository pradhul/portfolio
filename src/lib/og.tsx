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
          backgroundColor: '#0f0d0b',
          backgroundImage:
            'radial-gradient(circle at 12% 20%, rgba(217, 164, 65, 0.16), transparent 42%), radial-gradient(circle at 88% 80%, rgba(236, 229, 216, 0.08), transparent 36%)',
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
              color: '#d9a441',
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
              color: '#ece5d8',
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
              backgroundColor: '#d9a441',
              marginTop: 28,
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              color: '#a89f8e',
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
            color: '#6e675b',
            fontSize: 20,
            fontWeight: 400,
          }}
        >
          <div style={{ display: 'flex' }}>PRADHUL DEV</div>
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
