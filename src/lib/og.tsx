import { ImageResponse } from 'next/og'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

type OgImageProps = {
  eyebrow?: string
  title: string
  description: string
}

function truncateDescription(text: string, max = 180): string {
  if (text.length <= max) return text
  return `${text.slice(0, max).replace(/\s+\S*$/, '')}…`
}

export function generateOgImage({
  eyebrow = 'WEB & MOBILE DEVELOPER',
  title,
  description,
}: OgImageProps) {
  const titleSize = title.length > 22 ? 68 : 84
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
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 980 }}>
          <div
            style={{
              color: '#d9a441',
              fontSize: 22,
              letterSpacing: 6,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              color: '#ece5d8',
              fontSize: titleSize,
              fontWeight: 700,
              marginTop: 24,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            {title}
          </div>
          <div
            style={{
              width: 80,
              height: 3,
              backgroundColor: '#d9a441',
              marginTop: 28,
            }}
          />
          <div
            style={{
              color: '#a89f8e',
              fontSize: 28,
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
            fontSize: 22,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          }}
        >
          <span>PRADHUL DEV</span>
          <span>www.pradhul.dev</span>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  )
}
