import type { Metadata } from 'next'
import Image from 'next/image'
import ProjectPageShell, { FeatureHighlights, ProjectHero } from '@/components/ProjectPageShell'
import { createPageMetadata, pages } from '@/lib/seo'
import { content } from '@/lib/content'
import { projects } from '@/data/projects'

export const metadata: Metadata = createPageMetadata(pages.chartStudio)

const CHART_STUDIO_URL = 'https://soft-dieffenbachia-ba97b4.netlify.app/'
const chartStudio = projects.find((project) => project.id === 'chartStudio')

const FEATURES = [
  'Upload Excel (.xlsx, .xls) or CSV files, or paste from Excel',
  'Data preview with editable cells—chart updates as you edit',
  'Bar and pie chart types with customizable colors per category',
  'Chart title, category column (x-axis), and data series selection',
  'Display options: grid (bar), legend, export as PNG or PDF',
]

export default function ChartStudioPortfolio() {
  return (
    <ProjectPageShell>
      <ProjectHero
        figure="Fig. 04"
        category={content.portfolio.chartStudio.category}
        title={content.portfolio.chartStudio.title}
        description={content.portfolio.chartStudio.description}
        icon={chartStudio?.icon}
        actions={
          <a href={CHART_STUDIO_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Live Demo
          </a>
        }
        media={
          <Image
            src="/chartStudio/Screenshot1.png"
            alt="Chart Studio - Data and chart"
            width={800}
            height={500}
            className="h-auto w-full border border-line"
            loading="lazy"
          />
        }
      />

      <FeatureHighlights items={['Bar & Pie Charts', 'Excel & CSV', 'Customizable', 'PNG / PDF Export']} />

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold text-cream">About Chart Studio</h2>
        <p className="max-w-3xl text-lg leading-relaxed text-cream-muted">
          Chart Studio is a web app that lets you create bar and pie charts from your data in minutes.
          Upload Excel (.xlsx, .xls) or CSV files, or paste values directly from a spreadsheet. Edit
          cells in the data preview and see your chart update in real time. Customize the chart title,
          axis labels, colors, legend, and grid, then export as PNG or PDF.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="mb-6 font-display text-2xl font-semibold text-cream">Screenshots</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="frame overflow-hidden">
            <Image
              src="/chartStudio/Screenshot1.png"
              alt="Chart Studio - Data and chart"
              width={800}
              height={500}
              className="h-auto w-full"
              loading="lazy"
            />
          </div>
          <div className="frame overflow-hidden">
            <Image
              src="/chartStudio/Screenshot2.png"
              alt="Chart Studio - Customization"
              width={800}
              height={500}
              className="h-auto w-full"
              loading="lazy"
            />
          </div>
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
