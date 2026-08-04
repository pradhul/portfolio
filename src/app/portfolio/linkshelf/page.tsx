'use client'

import Image from 'next/image'
import {
  Bookmark,
  Bot,
  ExternalLink,
  Github,
  Sparkles,
  Tags,
} from 'lucide-react'
import LinkShelfSummary from '../squashpush/LinkShelfSummary'

const LINK_SHELF_URL = 'https://link-shelf-puce.vercel.app/'
const LINK_SHELF_GITHUB = 'https://github.com/pradhul/link-shelf'

export default function LinkShelfPortfolio() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-gradient-to-r from-violet-700 to-fuchsia-600 py-12 px-6 md:px-12 lg:px-24">
        <LinkShelfSummary />
      </header>

      <div className="bg-white py-4 shadow-md">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-4">
          <div className="bg-violet-50 text-violet-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Bot size={16} className="mr-1" />
            Telegram bot
          </div>
          <div className="bg-fuchsia-50 text-fuchsia-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Tags size={16} className="mr-1" />
            Hierarchical tags
          </div>
          <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Sparkles size={16} className="mr-1" />
            Gemini auto-tag
          </div>
          <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Bookmark size={16} className="mr-1" />
            Installable PWA
          </div>
        </div>
      </div>

      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">About Link Shelf</h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Link Shelf is a household link library for the links you share and forget—Instagram reels, YouTube videos, recipes, tools, and more. Save from a Telegram bot in the moment, or manage everything later in the installable web app.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Drop one URL or a handful at once. The bot extracts titles and metadata, prompts for tags and subtags (or skips), and can auto-categorize multi-link drops with Gemini. Daily digests pull related saves into readable summaries—like “Today&apos;s eats” for cooking links.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={LINK_SHELF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-violet-700 hover:bg-violet-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <ExternalLink size={18} />
                Open Live Demo
              </a>
              <a
                href={LINK_SHELF_GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <Github size={18} />
                View on GitHub
              </a>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Telegram bot in action</h2>
            <p className="text-gray-600 mb-8 max-w-2xl">
              Save and organize links from chat—tag hierarchies, bulk analysis, and dated digests without leaving Telegram.
            </p>
            <div className="grid sm:grid-cols-2 gap-8 justify-items-center">
              <figure className="w-full max-w-[320px]">
                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-white">
                  <Image
                    src="/linkShelf/telegram-tagging.jpg"
                    alt="Link Shelf Telegram bot: tagging Books/Thriller and analyzing multiple Instagram links"
                    width={544}
                    height={1024}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
                <figcaption className="mt-3 text-sm text-center text-gray-600">
                  Hierarchical tags, skip/type-new prompts, and bulk link analysis with metadata enrichment
                </figcaption>
              </figure>
              <figure className="w-full max-w-[320px]">
                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-white">
                  <Image
                    src="/linkShelf/telegram-digest.jpg"
                    alt="Link Shelf Telegram bot: Movies/Best save and Today's eats daily digest"
                    width={547}
                    height={1024}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
                <figcaption className="mt-3 text-sm text-center text-gray-600">
                  Save confirmations with tags, plus dated digests that group related links
                </figcaption>
              </figure>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Web app</h2>
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-lg">
              <Image
                src="/linkShelf/demo.jpg"
                alt="Link Shelf web UI"
                width={1024}
                height={556}
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Features</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-violet-500 mt-1">•</span>
                <span>Telegram bot for instant saves with interactive tag and subtag prompts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500 mt-1">•</span>
                <span>Bulk multi-link drops with progress feedback and Gemini-assisted categorization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500 mt-1">•</span>
                <span>Metadata extraction—titles, hashtags, genres, and where-to-watch hints when available</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500 mt-1">•</span>
                <span>Dated digests that aggregate related saves into readable summaries</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500 mt-1">•</span>
                <span>Web UI to browse, search, favorite, and manage your shelf</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500 mt-1">•</span>
                <span>Built with Next.js, Neon Postgres, and an installable progressive web app</span>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}
