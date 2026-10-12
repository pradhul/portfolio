'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { FestivalConfig } from '@/lib/festivalConfig'
import { runWhenIdle, shouldEnableHeavyVisuals } from '@/lib/runtimeCapabilities'

const FestivalVisuals = dynamic(() => import('./FestivalVisuals'), { ssr: false })

export function TextSnowPile({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`relative inline-block ${className}`} style={style}>
      {children}
      <span className="absolute -top-2 left-0 right-0 h-2 overflow-hidden pointer-events-none z-10">
        <span className="absolute left-0 top-0 w-3 h-3 bg-white rounded-full opacity-80" style={{ left: '10%' }} />
        <span className="absolute left-0 top-0 w-2 h-2 bg-white rounded-full opacity-70" style={{ left: '30%' }} />
        <span className="absolute left-0 top-0 w-2.5 h-2.5 bg-white rounded-full opacity-75" style={{ left: '50%' }} />
        <span className="absolute left-0 top-0 w-2 h-2 bg-white rounded-full opacity-70" style={{ left: '70%' }} />
        <span className="absolute left-0 top-0 w-3 h-3 bg-white rounded-full opacity-80" style={{ left: '90%' }} />
      </span>
    </span>
  )
}

export function TextSparkles({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`relative inline-block ${className}`} style={style}>
      {children}
      <span className="absolute -top-1 left-0 right-0 h-2 overflow-hidden pointer-events-none z-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-yellow-400 text-xs"
            style={{ left: `${20 + i * 20}%` }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            ✨
          </motion.span>
        ))}
      </span>
    </span>
  )
}

export function TextLights({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`relative inline-block ${className}`} style={style}>
      {children}
      <span className="absolute -top-1 left-0 right-0 h-2 overflow-hidden pointer-events-none z-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1 h-1 rounded-full bg-yellow-400"
            style={{ left: `${15 + i * 15}%` }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </span>
    </span>
  )
}

export function TextPetals({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`relative inline-block ${className}`} style={style}>
      {children}
      <span className="absolute -top-1 left-0 right-0 h-2 overflow-hidden pointer-events-none z-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-pink-300 text-xs"
            style={{ left: `${25 + i * 25}%` }}
            animate={{
              opacity: [0, 1, 0],
              y: [0, -5],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          >
            🌸
          </motion.span>
        ))}
      </span>
    </span>
  )
}

export function TextConfetti({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`relative inline-block ${className}`} style={style}>
      {children}
      <span className="absolute -top-1 left-0 right-0 h-2 overflow-hidden pointer-events-none z-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1.5 h-1.5"
            style={{
              left: `${20 + i * 20}%`,
              backgroundColor: ['#dc2626', '#16a34a', '#3b82f6', '#fbbf24', '#ec4899'][i],
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
              rotate: [0, 180],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </span>
    </span>
  )
}

export function useFestivalTheme() {
  const [activeFestival, setActiveFestival] = useState<FestivalConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkFestival = async () => {
      try {
        const response = await fetch('/api/festivals/active')
        const data = await response.json()
        setActiveFestival(data.activeFestival || null)
      } catch (error) {
        console.error('Error checking festival:', error)
        setActiveFestival(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkFestival()
    const interval = setInterval(checkFestival, 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [])

  return { activeFestival, isLoading }
}

export function FestivalThemeProvider({
  children,
  activeFestival,
}: {
  children: React.ReactNode
  activeFestival: FestivalConfig | null
}) {
  const [showEffects, setShowEffects] = useState(false)

  useEffect(() => {
    const root = document.documentElement

    if (activeFestival) {
      root.style.setProperty('--festival-primary', activeFestival.colors.primary)
      root.style.setProperty('--festival-secondary', activeFestival.colors.secondary)
      root.style.setProperty('--festival-accent', activeFestival.colors.accent)
      if (activeFestival.colors.tertiary) {
        root.style.setProperty('--festival-tertiary', activeFestival.colors.tertiary)
      }
      if (activeFestival.colors.quaternary) {
        root.style.setProperty('--festival-quaternary', activeFestival.colors.quaternary)
      }
      root.classList.add('festival-theme', `festival-${activeFestival.id}`)
    } else {
      root.classList.remove('festival-theme')
      FESTIVAL_IDS.forEach((id) => root.classList.remove(`festival-${id}`))
    }

    return () => {
      root.classList.remove('festival-theme')
      FESTIVAL_IDS.forEach((id) => root.classList.remove(`festival-${id}`))
    }
  }, [activeFestival])

  useEffect(() => {
    if (!activeFestival) {
      setShowEffects(false)
      return
    }

    return runWhenIdle(() => {
      setShowEffects(shouldEnableHeavyVisuals())
    }, 2000)
  }, [activeFestival])

  return (
    <>
      {showEffects && activeFestival ? <FestivalVisuals festival={activeFestival} /> : null}
      {children}
    </>
  )
}

export function FestivalTextDecoration({
  children,
  className,
  festival,
}: {
  children: React.ReactNode
  className?: string
  festival: FestivalConfig | null
}) {
  if (!festival || !festival.textDecoration || festival.textDecoration === 'none') {
    return <>{children}</>
  }

  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${festival.colors.primary}, ${festival.colors.secondary}, ${festival.colors.accent})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }

  switch (festival.textDecoration) {
    case 'snow':
      return <TextSnowPile className={className} style={gradientStyle}>{children}</TextSnowPile>
    case 'sparkles':
      return <TextSparkles className={className} style={gradientStyle}>{children}</TextSparkles>
    case 'lights':
      return <TextLights className={className} style={gradientStyle}>{children}</TextLights>
    case 'petals':
      return <TextPetals className={className} style={gradientStyle}>{children}</TextPetals>
    case 'confetti':
      return <TextConfetti className={className} style={gradientStyle}>{children}</TextConfetti>
    default:
      return <>{children}</>
  }
}

const FESTIVAL_IDS = [
  'christmas',
  'chinese-new-year',
  'valentines',
  'mardi-gras',
  'holi',
  'cherry-blossom',
  'easter',
  'ramadan-eid',
  'oktoberfest',
  'halloween',
  'diwali',
  'day-of-the-dead',
  'hanukkah',
  'new-year',
]
