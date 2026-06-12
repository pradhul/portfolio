'use client'

import { useMemo, useState, useEffect } from 'react'
import { GitHubCalendar } from 'react-github-calendar'
import { useFestivalTheme } from './FestivalTheme'

interface GitHubActivityProps {
  username?: string
}

export default function GitHubActivity({ username = 'pradhul' }: GitHubActivityProps) {
  const [mounted, setMounted] = useState(false)
  const { activeFestival } = useFestivalTheme()

  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window !== 'undefined') {
      setMounted(true)
    }
  }, [])

  // Create theme based on festival or default colors
  // Theme format: { dark: string[] } where array has 5 colors for levels 0-4
  const theme = useMemo(() => {
    if (activeFestival) {
      // Use festival colors with different intensity levels
      const primary = activeFestival.colors.primary
      const secondary = activeFestival.colors.secondary

      // Helper function to convert hex to rgba with opacity
      const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)
        return `rgba(${r}, ${g}, ${b}, ${alpha})`
      }

      return {
        dark: [
          'rgba(255, 255, 255, 0.1)', // level 0 - no contributions
          hexToRgba(primary, 0.3), // level 1 - low intensity
          hexToRgba(primary, 0.6), // level 2 - medium-low intensity
          secondary, // level 3 - medium-high intensity
          primary, // level 4 - highest intensity
        ],
      }
    }

    // Default theme matching portfolio colors (warm brass scale)
    return {
      dark: [
        'rgba(236, 229, 216, 0.08)', // level 0 - no contributions
        'rgba(217, 164, 65, 0.25)', // level 1 - low
        'rgba(217, 164, 65, 0.5)', // level 2 - medium
        'rgba(217, 164, 65, 0.75)', // level 3 - high
        '#ecb955', // level 4 - highest
      ],
    }
  }, [activeFestival])

  // Ensure component only renders after mount to prevent hydration errors
  if (!mounted) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="text-gray-400 text-center py-8">Loading activity...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        <GitHubCalendar
          username={username}
          theme={theme}
          throwOnError={false}
          errorMessage="Unable to load GitHub activity. Please try again later."
        />
      </div>
    </div>
  )
}
