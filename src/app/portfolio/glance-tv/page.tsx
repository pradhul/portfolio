import type { Metadata } from 'next'
import Image from 'next/image'
import ProjectPageShell, { ProjectHero } from '@/components/ProjectPageShell'
import { createPageMetadata, pages } from '@/lib/seo'
import { content } from '@/lib/content'

export const metadata: Metadata = createPageMetadata(pages.glanceTv)

const GLANCE_TV_GITHUB = 'https://github.com/pradhul/glance-tv'
const GLANCE_TV_RELEASE = 'https://github.com/pradhul/glance-tv/releases/tag/v43'

const FEATURES = [
  'Three launcher styles: Floating icons (halo + reflection), Glass tiles, and Tall posters (tilt + glare), with an optional daily auto-switch',
  'Daily Bing wallpaper (brighter by day, darker at night), plus clock, date, live weather effects, forecast, and AQI',
  'Next-holiday countdown and an optional orders status line / All apps orders column from a JSON URL you choose',
  'Wi-Fi signal, HDMI input tiles with HDMI-CEC names, Bluetooth device battery icons, hidden apps, and a last-used pill',
  'Arcticons line icons for popular streaming apps, with brand colours on focus',
  'Plain Java, Android SDK 26+, JDK 17, no runtime libraries — forked from kleviss/minimal-tv-launcher',
]

export default function GlanceTvPortfolio() {
  return (
    <ProjectPageShell>
      <ProjectHero
        figure="Fig. 18"
        category={content.portfolio.glanceTv.category}
        title={content.portfolio.glanceTv.title}
        description={content.portfolio.glanceTv.description}
        actions={
          <>
            <a href={GLANCE_TV_RELEASE} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Download APK (v43)
            </a>
            <a href={GLANCE_TV_GITHUB} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              View on GitHub
            </a>
          </>
        }
        media={
          <Image
            src="/glanceTv/demo.png"
            alt="Glance TV home screen with Bing wallpaper, clock, and app tiles"
            width={1920}
            height={1080}
            className="h-auto w-full border border-line"
            loading="lazy"
          />
        }
      />

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold text-cream">Home screen</h2>
        <p className="mb-8 max-w-2xl text-cream-muted">
          Screenshots from the Glance TV repository: the home screen, glass-tile layout, and the orders status line.
        </p>
        <div className="space-y-8">
          <figure className="frame overflow-hidden">
            <Image
              src="/glanceTv/styles.png"
              alt="Glance TV glass tiles layout"
              width={1920}
              height={1080}
              className="h-auto w-full"
              loading="lazy"
            />
          </figure>
          <figure className="frame overflow-hidden">
            <Image
              src="/glanceTv/orders.png"
              alt="Glance TV orders status line with the next holiday and upcoming deliveries"
              width={1300}
              height={90}
              className="h-auto w-full"
              loading="lazy"
            />
            <figcaption className="px-4 py-3 text-center text-sm text-cream-muted">
              Status line with the next holiday and upcoming orders
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold text-cream">Features</h2>
        <ul className="ml-[18px] list-disc text-cream-muted">
          {FEATURES.map((item) => (
            <li key={item} className="my-2">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </ProjectPageShell>
  )
}
