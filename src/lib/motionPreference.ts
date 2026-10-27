export type MotionPreference = {
  viewportWidth: number
  pointerCoarse: boolean
  reducedMotion: boolean
}

const MOBILE_MAX_WIDTH = 768

export function shouldLoadThreeBackground({
  viewportWidth,
  pointerCoarse,
  reducedMotion,
}: MotionPreference): boolean {
  if (reducedMotion) return false
  if (pointerCoarse) return false
  if (viewportWidth < MOBILE_MAX_WIDTH) return false
  return true
}

export function readMotionPreference(): MotionPreference {
  if (typeof window === 'undefined') {
    return { viewportWidth: 1280, pointerCoarse: false, reducedMotion: false }
  }

  return {
    viewportWidth: window.innerWidth,
    pointerCoarse: window.matchMedia('(pointer: coarse)').matches,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  }
}
