"use client";

import { ExternalLink, ImageIcon, Shield, FileImage, Layers } from "lucide-react";
import UploadSpecSummary from "../squashpush/UploadSpecSummary";

const UPLOAD_SPEC_URL = "https://uploadspec.web.app/";

export default function UploadSpecPortfolio() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-gradient-to-r from-emerald-800 to-teal-600 py-12 px-6 md:px-12 lg:px-24">
        <UploadSpecSummary />
      </header>

      <div className="bg-white py-4 shadow-md">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-4">
          <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <FileImage size={16} className="mr-1" />
            Exam photo specs
          </div>
          <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Layers size={16} className="mr-1" />
            KB compression
          </div>
          <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Shield size={16} className="mr-1" />
            Browser-only privacy
          </div>
          <div className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <ImageIcon size={16} className="mr-1" aria-hidden />
            UPSC / SSC / Bank tools
          </div>
        </div>
      </div>

      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">About UploadSpec</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              UploadSpec is a static Astro site with a React tool island that helps users prepare photos and signatures for Indian government and exam portals. Each tool page targets a specific upload specification—exact pixel dimensions, JPEG size ranges, and filenames—verified against official portal rules. All image processing runs in the browser using Canvas; nothing is uploaded to a server.
            </p>
            <a
              href={UPLOAD_SPEC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <ExternalLink size={18} />
              Open live site
            </a>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Features</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Dedicated pages per exam or portal under /tools/ (UPSC, IBPS, RRB, Kerala PSC, passport, driving licence, and more)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Spec tables and guidance visible in static HTML for SEO and no-JS users</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Crop, compress to KB range, and download with portal-ready filenames</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Kerala PSC name and date stamp overlay where required</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Per-tool feedback embed to capture portal rejection signals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Deployed as a static site on Firebase Hosting (uploadspec.web.app)</span>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
