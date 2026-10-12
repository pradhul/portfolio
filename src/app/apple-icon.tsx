import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f0d0b',
          color: '#d9a441',
          fontSize: 118,
          fontWeight: 700,
          letterSpacing: '-0.04em',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        P
      </div>
    ),
    { ...size }
  )
}
