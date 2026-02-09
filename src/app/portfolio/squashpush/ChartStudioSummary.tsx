'use client'
import { BarChart3, ExternalLink } from "lucide-react";
import Image from "next/image";

const CHART_STUDIO_URL = "https://soft-dieffenbachia-ba97b4.netlify.app/";

export default function ChartStudioSummary() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <div className="flex items-center mb-6">
            <div className="bg-white p-2 rounded-lg shadow-lg mr-4">
              <BarChart3 className="w-12 h-12 text-teal-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-teal-200">WEB APP</div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Chart Studio</h1>
            </div>
          </div>

          <p className="text-lg md:text-xl text-white/90 mb-8">
            Create bar and pie charts from Excel (.xlsx, .xls) or CSV files. Upload your data, paste from Excel, or edit cells in the preview—then customize your chart and export as PNG or PDF.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href={CHART_STUDIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-teal-600 hover:bg-teal-50 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <ExternalLink size={18} />
              <span>Live Demo</span>
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
              <div className="text-xs font-mono text-gray-400">Chart Studio</div>
            </div>
            <div className="p-4">
              <Image
                src="/chartStudio/Screenshot1.png"
                alt="Chart Studio"
                width={800}
                height={500}
                className="w-full h-auto rounded shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
