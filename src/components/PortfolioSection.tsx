'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import ProjectCard from '@/components/ProjectCard'
import { projects } from '@/data/projects'
import {
  PROJECT_FILTERS,
  matchesFilter,
  partitionProjects,
  type ProjectFilter,
} from '@/data/portfolioDisplay'
import { useLanguage } from '@/components/LanguageProvider'
import { useFestivalTheme } from '@/components/FestivalTheme'
import type { Project } from '@/data/projects'

function FilterButton({
  id,
  label,
  active,
  onSelect,
  festivalColor,
}: {
  id: ProjectFilter
  label: string
  active: boolean
  onSelect: (id: ProjectFilter) => void
  festivalColor?: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => onSelect(id)}
      className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
        active
          ? 'border-brass/40 bg-brass/10 text-brass'
          : 'border-line text-cream-muted hover:border-cream hover:text-cream'
      }`}
      style={
        active && festivalColor
          ? { borderColor: `${festivalColor}66`, color: festivalColor, backgroundColor: `${festivalColor}1a` }
          : undefined
      }
    >
      {label}
    </button>
  )
}

function ProjectList({ items }: { items: Project[] }) {
  return (
    <div className="space-y-24">
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
  const { activeFestival } = useFestivalTheme()
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
        className="mt-12 flex flex-wrap gap-2"
      >
        {PROJECT_FILTERS.map((id) => (
          <FilterButton
            key={id}
            id={id}
            label={tString(`portfolio.filters.${id}`)}
            active={filter === id}
            onSelect={setFilter}
            festivalColor={activeFestival?.colors.primary}
          />
        ))}
      </div>

      <div className="mt-16">
        {visibleFeatured.length > 0 ? (
          <ProjectList items={visibleFeatured} />
        ) : (
          <p className="text-cream-muted">{tString('portfolio.emptyFilter')}</p>
        )}
      </div>

      {visibleArchive.length > 0 && (
        <div className="mt-20 border-t border-line pt-10">
          <button
            type="button"
            aria-expanded={archiveExpanded}
            onClick={() => setArchiveOpen((open) => !open)}
            className="group flex w-full items-center justify-between gap-4 text-left"
          >
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.25em] text-cream-muted">
                {tString('portfolio.archiveEyebrow')}
              </div>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-cream md:text-3xl">
                {tString('portfolio.archiveTitle')}
                <span className="ml-3 font-mono text-sm font-normal text-cream-muted">
                  {visibleArchive.length}
                </span>
              </h3>
            </div>
            <ChevronDown
              size={22}
              className={`shrink-0 text-cream-muted transition-transform ${archiveExpanded ? 'rotate-180' : ''}`}
            />
          </button>

          {archiveExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-12"
            >
              <ProjectList items={visibleArchive} />
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}
