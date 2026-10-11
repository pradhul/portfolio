import type { MetadataRoute } from 'next'
import { pageUrl, publicPages } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPages.map((page) => ({
    url: pageUrl(page.path),
    lastModified: new Date(),
    changeFrequency: page.path === '/' ? 'weekly' : 'monthly',
    priority: page.path === '/' ? 1 : page.path.startsWith('/portfolio/') && page.path !== '/portfolio' ? 0.8 : 0.6,
  }))
}
