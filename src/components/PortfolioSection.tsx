'use client'

import { useMemo, useState } from 'react'
import ProjectCard from '@/components/ProjectCard'
import { projects } from '@/data/projects'
import {
  PROJECT_FILTERS,
  matchesFilter,
  partitionProjects,
  type ProjectFilter,
} from '@/data/portfolioDisplay'
import { useLanguage } from '@/components/LanguageProvider'
import type { Project } from '@/data/projects'

function FilterButton({
  id,
  label,
  active,
  onSelect,
}: {
  id: ProjectFilter
  label: string
  active: boolean
  onSelect: (id: ProjectFilter) => void
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => onSelect(id)}
      className={`border px-4 py-2 font-mono text-[13px] uppercase tracking-[0.08em] ${
        active ? 'border-lime bg-[rgba(234,255,82,0.12)] text-lime' : 'border-line text-cream-muted hover:text-cream'
      }`}
    >
      {label}
    </button>
  )
}

function ProjectList({ items }: { items: Project[] }) {
  return (
    <div className="grid gap-6">
      {items.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={{ ...project, reverseLayout: index % 2 === 1 }}
        />
      ))}
    </div>
  )
}

export default function PortfolioSection() {
  const { tString } = useLanguage()
  const [filter, setFilter] = useState<ProjectFilter>('all')
  const [archiveOpen, setArchiveOpen] = useState(false)

  const { featured, archive } = useMemo(() => partitionProjects(projects), [])
  const visibleFeatured = featured.filter((project) => matchesFilter(project, filter))
  const visibleArchive = archive.filter((project) => matchesFilter(project, filter))
  const archiveExpanded = archiveOpen || visibleFeatured.length === 0

  return (
    <div>
      <div
        role="tablist"
        aria-label={tString('portfolio.filtersLabel')}
        className="mt-8 flex flex-wrap gap-2"
      >
        {PROJECT_FILTERS.map((id) => (
          <FilterButton
            key={id}
            id={id}
            label={tString(`portfolio.filters.${id}`)}
            active={filter === id}
            onSelect={setFilter}
          />
        ))}
      </div>

      <div className="mt-10">
        {visibleFeatured.length > 0 ? (
          <ProjectList items={visibleFeatured} />
        ) : (
          <p className="text-cream-muted">{tString('portfolio.emptyFilter')}</p>
        )}
      </div>

      {visibleArchive.length > 0 && (
        <div className="mt-16 border-t border-line pt-10">
          <button
            type="button"
            aria-expanded={archiveExpanded}
            onClick={() => setArchiveOpen((open) => !open)}
            className="group flex w-full items-center justify-between gap-4 text-left"
          >
            <div>
              <div className="font-mono text-[13px] tracking-[0.04em] text-lime">
                {tString('portfolio.archiveEyebrow')}
              </div>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-cream md:text-3xl">
                {tString('portfolio.archiveTitle')}
                <span className="ml-3 font-mono text-sm font-normal text-cream-muted">
                  {visibleArchive.length}
                </span>
              </h3>
            </div>
            <span className="font-mono text-lime">{archiveExpanded ? '−' : '+'}</span>
          </button>

          {archiveExpanded ? (
            <div className="mt-10">
              <ProjectList items={visibleArchive} />
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
