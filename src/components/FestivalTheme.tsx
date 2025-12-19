'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FestivalConfig } from '@/lib/festivalConfig'
import {
  SnowEffect,
  ConfettiEffect,
  PetalsEffect,
  LightsEffect,
  FireworksEffect,
  ColorPowderEffect,
} from './FestivalEffects'

// Text decoration components
export function TextSnowPile({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
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

export function TextSparkles({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
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

export function TextLights({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
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

export function TextPetals({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
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

export function TextConfetti({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
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

// Decorative elements
function Snowman() {
  return (
    <motion.div
      className="fixed bottom-20 right-10 z-[90] pointer-events-none select-none"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <div className="relative">
        <div className="relative">
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full shadow-lg"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-lg"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
          />
          <motion.div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-lg"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          >
            <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-black rounded-full" />
            <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-black rounded-full" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full transform rotate-45" />
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-3 h-1 border-b-2 border-black rounded-full" />
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-red-600 rounded-t-full" />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-600 rounded-full" />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full" />
          </motion.div>
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 w-8 h-1 bg-amber-800 rounded-full origin-left"
            style={{ transform: 'rotate(-30deg)' }}
            animate={{ rotate: [-30, -25, -30] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-16 left-1/2 translate-x-1/2 w-8 h-1 bg-amber-800 rounded-full origin-right"
            style={{ transform: 'rotate(30deg)' }}
            animate={{ rotate: [30, 25, 30] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  )
}

function GroundSnow() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-[5] overflow-hidden">
      <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
        <path
          d="M0,200 Q150,150 300,170 T600,160 T900,175 T1200,165 L1200,200 L0,200 Z"
          fill="white"
          opacity="0.9"
        />
        <path
          d="M0,200 Q200,140 400,160 T800,150 T1200,170 L1200,200 L0,200 Z"
          fill="white"
          opacity="0.7"
        />
        {Array.from({ length: 15 }).map((_, i) => (
          <circle
            key={i}
            cx={i * 80 + Math.sin(i) * 30}
            cy={180 + Math.cos(i * 2) * 15}
            r={20 + Math.sin(i * 3) * 10}
            fill="white"
            opacity="0.85"
          />
        ))}
      </svg>
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 w-2 h-2 bg-white rounded-full opacity-60"
          style={{
            left: `${(i * 40) % 100}%`,
            bottom: `${10 + (i % 3) * 5}px`,
          }}
          animate={{
            y: [0, -3, 0],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}

// Main hook
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
    // Check every hour to handle date changes
    const interval = setInterval(checkFestival, 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [])

  return { activeFestival, isLoading }
}

// Theme provider component
export function FestivalThemeProvider({
  children,
  activeFestival,
}: {
  children: React.ReactNode
  activeFestival: FestivalConfig | null
}) {
  useEffect(() => {
    const root = document.documentElement

    if (activeFestival) {
      // Apply festival theme colors via CSS variables
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
      // Remove all festival-specific classes
      FESTIVAL_IDS.forEach((id) => root.classList.remove(`festival-${id}`))
    }

    return () => {
      root.classList.remove('festival-theme')
      FESTIVAL_IDS.forEach((id) => root.classList.remove(`festival-${id}`))
    }
  }, [activeFestival])

  // Render visual effects
  const renderEffects = () => {
    if (!activeFestival) return null

    return (
      <>
        {activeFestival.effects.map((effect, index) => {
          switch (effect.type) {
            case 'snow':
              return <SnowEffect key={index} enabled={true} intensity={effect.intensity || 'high'} />
            case 'confetti':
              return (
                <ConfettiEffect
                  key={index}
                  enabled={true}
                  intensity={effect.intensity || 'high'}
                  colors={[
                    activeFestival.colors.primary,
                    activeFestival.colors.secondary,
                    activeFestival.colors.accent,
                    activeFestival.colors.tertiary,
                    activeFestival.colors.quaternary,
                  ].filter(Boolean) as string[]}
                />
              )
            case 'petals':
              return (
                <PetalsEffect
                  key={index}
                  enabled={true}
                  intensity={effect.intensity || 'high'}
                  colors={[
                    activeFestival.colors.primary,
                    activeFestival.colors.secondary,
                    activeFestival.colors.accent,
                  ]}
                />
              )
            case 'lights':
              return (
                <LightsEffect
                  key={index}
                  enabled={true}
                  intensity={effect.intensity || 'medium'}
                  colors={[
                    activeFestival.colors.primary,
                    activeFestival.colors.secondary,
                    activeFestival.colors.accent,
                  ]}
                />
              )
            case 'fireworks':
              return <FireworksEffect key={index} enabled={true} intensity={effect.intensity || 'high'} />
            case 'colorPowder':
              return (
                <ColorPowderEffect
                  key={index}
                  enabled={true}
                  intensity={effect.intensity || 'high'}
                  colors={[
                    activeFestival.colors.primary,
                    activeFestival.colors.secondary,
                    activeFestival.colors.accent,
                    activeFestival.colors.tertiary,
                    activeFestival.colors.quaternary,
                  ].filter(Boolean) as string[]}
                />
              )
            default:
              return null
          }
        })}
        {/* Special decorative elements for specific festivals */}
        {activeFestival.id === 'christmas' && (
          <>
            <Snowman />
            <GroundSnow />
          </>
        )}
      </>
    )
  }

  // Text decoration component based on festival
  const getTextDecoration = (children: React.ReactNode, className?: string) => {
    if (!activeFestival || !activeFestival.textDecoration || activeFestival.textDecoration === 'none') {
      return <>{children}</>
    }

    switch (activeFestival.textDecoration) {
      case 'snow':
        return <TextSnowPile className={className}>{children}</TextSnowPile>
      case 'sparkles':
        return <TextSparkles className={className}>{children}</TextSparkles>
      case 'lights':
        return <TextLights className={className}>{children}</TextLights>
      case 'petals':
        return <TextPetals className={className}>{children}</TextPetals>
      case 'confetti':
        return <TextConfetti className={className}>{children}</TextConfetti>
      default:
        return <>{children}</>
    }
  }

  return (
    <>
      {renderEffects()}
      {children}
    </>
  )
}

// Helper to get text decoration component
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

  switch (festival.textDecoration) {
    case 'snow':
      return <TextSnowPile className={className}>{children}</TextSnowPile>
    case 'sparkles':
      return <TextSparkles className={className}>{children}</TextSparkles>
    case 'lights':
      return <TextLights className={className}>{children}</TextLights>
    case 'petals':
      return <TextPetals className={className}>{children}</TextPetals>
    case 'confetti':
      return <TextConfetti className={className}>{children}</TextConfetti>
    default:
      return <>{children}</>
  }
}

// List of all festival IDs for cleanup
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
