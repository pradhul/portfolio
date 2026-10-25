import { Github } from 'lucide-react'
import Image from 'next/image'

const GLANCE_TV_GITHUB = 'https://github.com/pradhul/glance-tv'
const GLANCE_TV_RELEASE = 'https://github.com/pradhul/glance-tv/releases/tag/v43'

export default function GlanceTvSummary() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <div className="flex items-center mb-6">
            <div className="bg-white p-2 rounded-lg shadow-lg mr-4">
              <Image src="/glanceTv/icon.svg" alt="Glance TV" width={48} height={48} />
            </div>
            <div>
              <div className="text-xs font-semibold text-sky-200">ANDROID TV</div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Glance TV</h1>
            </div>
          </div>

          <p className="text-lg md:text-xl text-white/90 mb-8">
            A lean Android TV home screen: daily Bing wallpaper, clock and weather, your apps,
            and a status line for the next holiday and upcoming orders.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href={GLANCE_TV_GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-slate-800 hover:bg-slate-100 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Github size={18} />
              <span>GitHub</span>
            </a>
            <a
              href={GLANCE_TV_RELEASE}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-slate-900/40 text-white hover:bg-slate-900/60 font-medium py-2 px-4 rounded-lg transition-colors border border-white/20"
            >
              <span>v43 release</span>
            </a>
          </div>
        </div>

        <div className="flex-1 mt-6 md:mt-0">
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
            <div className="bg-gray-900 p-2 flex items-center justify-between border-b border-gray-700">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-xs font-mono text-gray-400">Glance TV</div>
            </div>
            <div className="p-4">
              <Image
                src="/glanceTv/demo.png"
                alt="Glance TV home screen with Bing wallpaper, clock, and app tiles"
                width={1920}
                height={1080}
                className="w-full h-auto rounded shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
