import { generateOgImage, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og'
import { pages } from '@/lib/seo'

export const alt = `${pages.guestbook.title} | Pradhul Dev`
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return generateOgImage({
    eyebrow: pages.guestbook.eyebrow,
    title: pages.guestbook.title,
    description: pages.guestbook.description,
  })
}
