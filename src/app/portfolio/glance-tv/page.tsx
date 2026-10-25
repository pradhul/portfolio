import type { Metadata } from 'next'
import Image from 'next/image'
import { Clock, Github, ImageIcon, LayoutGrid, Package } from 'lucide-react'
import GlanceTvSummary from '../squashpush/GlanceTvSummary'
import { createPageMetadata, pages } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata(pages.glanceTv)

const GLANCE_TV_GITHUB = 'https://github.com/pradhul/glance-tv'
const GLANCE_TV_RELEASE = 'https://github.com/pradhul/glance-tv/releases/tag/v43'

export default function GlanceTvPortfolio() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-gradient-to-r from-slate-800 to-sky-700 py-12 px-6 md:px-12 lg:px-24">
        <GlanceTvSummary />
      </header>

      <div className="bg-white py-4 shadow-md">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-4">
          <div className="bg-slate-50 text-slate-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <LayoutGrid size={16} className="mr-1" />
            Android TV launcher
          </div>
          <div className="bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <ImageIcon size={16} className="mr-1" />
            Daily Bing wallpaper
          </div>
          <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Clock size={16} className="mr-1" />
            Clock, weather, orders
          </div>
          <div className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Package size={16} className="mr-1" />
            Plain Java, no runtime deps
          </div>
        </div>
      </div>

      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">About Glance TV</h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Glance TV is a lean Android TV home screen: daily Bing wallpaper, clock and weather,
              your apps, and a single status line for what&apos;s coming up. Download the APK from
              GitHub Releases, install it over ADB, and set Glance TV as the default Home app.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              The launcher is written in plain Java against the Android SDK (minSdk 26, JDK 17)
              with no runtime dependencies, so it stays small and starts quickly on slow TVs. Latest
              release is v43.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={GLANCE_TV_GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <Github size={18} />
                View on GitHub
              </a>
              <a
                href={GLANCE_TV_RELEASE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-sky-700 hover:bg-sky-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                v43 release
              </a>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Home screen</h2>
            <p className="text-gray-600 mb-8 max-w-2xl">
              Screenshots from the Glance TV repository: the home screen, glass-tile layout, and
              the orders status line.
            </p>
            <div className="space-y-8">
              <figure className="rounded-xl overflow-hidden border border-gray-200 shadow-lg bg-black">
                <Image
                  src="/glanceTv/demo.png"
                  alt="Glance TV home screen with Bing wallpaper, clock, and app tiles"
                  width={1920}
                  height={1080}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </figure>
              <figure className="rounded-xl overflow-hidden border border-gray-200 shadow-lg bg-black">
                <Image
                  src="/glanceTv/styles.png"
                  alt="Glance TV glass tiles layout"
                  width={1920}
                  height={1080}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </figure>
              <figure className="rounded-xl overflow-hidden border border-gray-200 shadow-lg bg-slate-900">
                <Image
                  src="/glanceTv/orders.png"
                  alt="Glance TV orders status line with the next holiday and upcoming deliveries"
                  width={1300}
                  height={90}
                  className="w-full h-auto"
                  loading="lazy"
                />
                <figcaption className="px-4 py-3 text-sm text-center text-gray-600 bg-white">
                  Status line with the next holiday and upcoming orders
                </figcaption>
              </figure>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Features</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-sky-600 mt-1">•</span>
                <span>
                  Three launcher styles: Floating icons (halo + reflection), Glass tiles, and Tall
                  posters (tilt + glare), with an optional daily auto-switch
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-600 mt-1">•</span>
                <span>
                  Daily Bing wallpaper (brighter by day, darker at night), plus clock, date, live
                  weather effects, forecast, and AQI
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-600 mt-1">•</span>
                <span>
                  Next-holiday countdown and an optional orders status line / All apps orders
                  column from a JSON URL you choose
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-600 mt-1">•</span>
                <span>
                  Wi-Fi signal, HDMI input tiles with HDMI-CEC names, Bluetooth device battery
                  icons, hidden apps, and a last-used pill
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-600 mt-1">•</span>
                <span>
                  Arcticons line icons for popular streaming apps, with brand colours on focus
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-600 mt-1">•</span>
                <span>
                  Plain Java, Android SDK 26+, JDK 17, no runtime libraries — forked from
                  kleviss/minimal-tv-launcher
                </span>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}
