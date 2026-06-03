'use client'
import { ExternalLink } from "lucide-react";
import Image from "next/image";

const UPLOAD_SPEC_URL = "https://uploadspec.web.app/";

export default function UploadSpecSummary() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <div className="flex items-center mb-6">
            <div className="bg-white p-2 rounded-lg shadow-lg mr-4">
              <Image
                src="/uploadSpec/logo.svg"
                alt="UploadSpec"
                width={48}
                height={48}
              />
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-200">WEB APP</div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">UploadSpec</h1>
            </div>
          </div>

          <p className="text-lg md:text-xl text-white/90 mb-8">
            Portal-ready photo and signature tools for Indian application portals. Resize to exact pixels and KB ranges for UPSC, SSC, bank exams, state PSC, passport, and more—processed entirely in your browser with no server upload.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href={UPLOAD_SPEC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <ExternalLink size={18} />
              <span>Visit site</span>
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
              <div className="text-xs font-mono text-gray-400">UploadSpec</div>
            </div>
            <div className="p-8 flex items-center justify-center bg-gradient-to-br from-emerald-900/40 to-teal-900/40 min-h-[200px]">
              <Image
                src="/uploadSpec/logo.svg"
                alt="UploadSpec"
                width={120}
                height={120}
                className="opacity-90"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
