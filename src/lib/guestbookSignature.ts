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
