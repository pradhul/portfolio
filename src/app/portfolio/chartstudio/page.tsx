"use client";

import Image from "next/image";
import { ExternalLink, BarChart3, FileSpreadsheet, Palette, Download } from "lucide-react";
import ChartStudioSummary from "../squashpush/ChartStudioSummary";

const CHART_STUDIO_URL = "https://soft-dieffenbachia-ba97b4.netlify.app/";

export default function ChartStudioPortfolio() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-gradient-to-r from-teal-600 to-cyan-600 py-12 px-6 md:px-12 lg:px-24">
        <ChartStudioSummary />
      </header>

      <div className="bg-white py-4 shadow-md">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-4">
          <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <BarChart3 size={16} className="mr-1" />
            Bar & Pie Charts
          </div>
          <div className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <FileSpreadsheet size={16} className="mr-1" />
            Excel & CSV
          </div>
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Palette size={16} className="mr-1" />
            Customizable
          </div>
          <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Download size={16} className="mr-1" />
            PNG / PDF Export
          </div>
        </div>
      </div>

      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">About Chart Studio</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Chart Studio is a web app that lets you create bar and pie charts from your data in minutes. Upload Excel (.xlsx, .xls) or CSV files, or paste values directly from a spreadsheet. Edit cells in the data preview and see your chart update in real time. Customize the chart title, axis labels, colors, legend, and grid, then export as PNG or PDF.
            </p>
            <a
              href={CHART_STUDIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <ExternalLink size={18} />
              Open Live Demo
            </a>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Screenshots</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                <Image
                  src="/chartStudio/Screenshot1.png"
                  alt="Chart Studio - Data and chart"
                  width={800}
                  height={500}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                <Image
                  src="/chartStudio/Screenshot2.png"
                  alt="Chart Studio - Customization"
                  width={800}
                  height={500}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Features</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                <span>Upload Excel (.xlsx, .xls) or CSV files, or paste from Excel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                <span>Data preview with editable cells—chart updates as you edit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                <span>Bar and pie chart types with customizable colors per category</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                <span>Chart title, category column (x-axis), and data series selection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                <span>Display options: grid (bar), legend, export as PNG or PDF</span>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
