/** Client-only capability checks used to keep heavy visuals off the mobile path. */

export const NARROW_VIEWPORT_MQ = '(max-width: 767px)'
export const COARSE_POINTER_MQ = '(pointer: coarse)'
export const REDUCED_MOTION_MQ = '(prefers-reduced-motion: reduce)'

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(REDUCED_MOTION_MQ).matches
}

export function isNarrowOrCoarsePointer(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia(NARROW_VIEWPORT_MQ).matches ||
    window.matchMedia(COARSE_POINTER_MQ).matches
  )
}

/** Three.js, particle canvases, and festival particle overlays. Off by default until we know the device. */
export function shouldEnableHeavyVisuals(): boolean {
  return !prefersReducedMotion() && !isNarrowOrCoarsePointer()
}

export function runWhenIdle(callback: () => void, timeout = 1500): () => void {
  if (typeof window === 'undefined') return () => undefined

  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(callback, { timeout })
    return () => window.cancelIdleCallback(id)
  }

  const timer = window.setTimeout(callback, Math.min(timeout, 400))
  return () => window.clearTimeout(timer)
}
