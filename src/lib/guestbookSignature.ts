export type SignaturePoint = {
  x: number
  y: number
  t?: number
}

export type SignatureStroke = SignaturePoint[]

/** Firestore-safe stroke shape (arrays cannot contain nested arrays). */
export type StoredSignatureStroke = {
  points: SignaturePoint[]
}

export const SIGNATURE_PAD_WIDTH = 680
export const SIGNATURE_PAD_HEIGHT = 220

export function normalizeStrokes(strokes: SignatureStroke[]): SignatureStroke[] {
  return strokes.filter((stroke) => stroke.length > 0)
}

export function toStoredStrokes(strokes: SignatureStroke[]): StoredSignatureStroke[] {
  return normalizeStrokes(strokes).map((points) => ({ points }))
}

export function fromStoredStrokes(value: unknown): SignatureStroke[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((stroke): SignatureStroke | null => {
      if (Array.isArray(stroke)) {
        return stroke as SignatureStroke
      }

      if (typeof stroke === 'object' && stroke !== null && Array.isArray((stroke as StoredSignatureStroke).points)) {
        return (stroke as StoredSignatureStroke).points
      }

      return null
    })
    .filter((stroke): stroke is SignatureStroke => stroke !== null && stroke.length > 0)
}

/** Scale signature coordinates from the drawing pad into a smaller preview canvas. */
export function scaleStrokesToFit(
  strokes: SignatureStroke[],
  targetWidth: number,
  targetHeight: number,
  padding = 8
): { strokes: SignatureStroke[]; lineWidth: number } {
  const normalized = normalizeStrokes(strokes)
  if (normalized.length === 0) {
    return { strokes: [], lineWidth: 2 }
  }
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const stroke of normalized) {
    for (const point of stroke) {
      minX = Math.min(minX, point.x)
      minY = Math.min(minY, point.y)
      maxX = Math.max(maxX, point.x)
      maxY = Math.max(maxY, point.y)
    }
  }

  const boundsWidth = Math.max(maxX - minX, 1)
  const boundsHeight = Math.max(maxY - minY, 1)
  const innerWidth = Math.max(targetWidth - padding * 2, 1)
  const innerHeight = Math.max(targetHeight - padding * 2, 1)
  const scale = Math.min(innerWidth / boundsWidth, innerHeight / boundsHeight)
  const scaledWidth = boundsWidth * scale
  const scaledHeight = boundsHeight * scale
  const offsetX = padding + (innerWidth - scaledWidth) / 2
  const offsetY = padding + (innerHeight - scaledHeight) / 2

  const scaledStrokes = normalized.map((stroke) =>
    stroke.map((point) => ({
      x: (point.x - minX) * scale + offsetX,
      y: (point.y - minY) * scale + offsetY,
      t: point.t,
    }))
  )

  return {
    strokes: scaledStrokes,
    lineWidth: Math.max(1.2, 2.4 * scale),
  }
}
