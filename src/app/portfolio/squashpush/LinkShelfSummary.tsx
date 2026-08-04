'use client'

import { Bookmark, ExternalLink, Github } from 'lucide-react'
import Image from 'next/image'

const LINK_SHELF_URL = 'https://link-shelf-puce.vercel.app/'
const LINK_SHELF_GITHUB = 'https://github.com/pradhul/link-shelf'

export default function LinkShelfSummary() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <div className="flex items-center mb-6">
            <div className="bg-white p-2 rounded-lg shadow-lg mr-4">
              <Bookmark className="w-12 h-12 text-violet-700" />
            </div>
            <div>
              <div className="text-xs font-semibold text-violet-200">PWA</div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Link Shelf</h1>
            </div>
          </div>

          <p className="text-lg md:text-xl text-white/90 mb-8">
            Save Instagram, YouTube, and other links from Telegram or the web UI. Tag, favorite, and search your shelf—or drop several URLs at once and let Gemini categorize them.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href={LINK_SHELF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-violet-700 hover:bg-violet-50 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <ExternalLink size={18} />
              <span>Live Demo</span>
            </a>
            <a
              href={LINK_SHELF_GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-violet-900/40 text-white hover:bg-violet-900/60 font-medium py-2 px-4 rounded-lg transition-colors border border-white/20"
            >
              <Github size={18} />
              <span>GitHub</span>
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
              <div className="text-xs font-mono text-gray-400">Link Shelf</div>
            </div>
            <div className="p-4">
              <Image
                src="/linkShelf/demo.jpg"
                alt="Link Shelf web UI"
                width={1024}
                height={556}
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
