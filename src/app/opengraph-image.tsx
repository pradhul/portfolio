import { generateOgImage, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og'
import { pages } from '@/lib/seo'

export const alt = pages.home.ogTitle
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return generateOgImage({
    eyebrow: pages.home.eyebrow,
    title: pages.home.ogTitle ?? pages.home.title,
    description: pages.home.description,
  })
}
