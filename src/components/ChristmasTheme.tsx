'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ChristmasConfig {
  enabled: boolean
  startMonth: number // 11 for December (0-indexed)
  endMonth: number // 0 for January (0-indexed)
  endDay: number // Day after which to disable (e.g., 2 for Jan 2nd)
}

// Configuration - can be easily adjusted
const CHRISTMAS_CONFIG: ChristmasConfig = {
  enabled: true, // Set to false to disable Christmas theme entirely
  startMonth: 11, // December (0-indexed, so 11 = December)
  endMonth: 0, // January (0-indexed, so 0 = January)
  endDay: 2, // Disable after January 2nd
}

export function useChristmasTheme() {
  const [isChristmas, setIsChristmas] = useState(false)

  useEffect(() => {
    if (!CHRISTMAS_CONFIG.enabled) {
      setIsChristmas(false)
      return
    }

    const checkDate = () => {
      const now = new Date()
      const month = now.getMonth()
      const day = now.getDate()

      // Check if it's December (month 11)
      if (month === CHRISTMAS_CONFIG.startMonth) {
        setIsChristmas(true)
        return
      }

      // Check if it's January and before the end day
      if (month === CHRISTMAS_CONFIG.endMonth && day <= CHRISTMAS_CONFIG.endDay) {
        setIsChristmas(true)
        return
      }

      setIsChristmas(false)
    }

    checkDate()
    // Check daily to handle date changes
    const interval = setInterval(checkDate, 1000 * 60 * 60) // Check every hour
    return () => clearInterval(interval)
  }, [])

  return isChristmas
}

// Snowflake component
function Snowflake({ delay, duration, left }: { delay: number; duration: number; left: number }) {
  const [screenHeight, setScreenHeight] = useState(1000)

  useEffect(() => {
    setScreenHeight(window.innerHeight)
    const handleResize = () => setScreenHeight(window.innerHeight)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <motion.div
      className="absolute text-white text-2xl pointer-events-none select-none"
      style={{ left: `${left}%` }}
      initial={{ y: -20, opacity: 0 }}
      animate={{
        y: screenHeight + 20,
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      ❄
    </motion.div>
  )
}

// Snow effect component
export function SnowEffect({ enabled }: { enabled: boolean }) {
  if (!enabled) return null

  const snowflakes = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10,
    left: Math.random() * 100,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {snowflakes.map((snowflake) => (
        <Snowflake
          key={snowflake.id}
          delay={snowflake.delay}
          duration={snowflake.duration}
          left={snowflake.left}
        />
      ))}
    </div>
  )
}

// Snowman component
function Snowman() {
  return (
    <motion.div
      className="fixed bottom-20 right-10 z-[90] pointer-events-none select-none"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <div className="relative">
        {/* Snowman body - three circles */}
        <div className="relative">
          {/* Bottom circle */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full shadow-lg"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Middle circle */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-lg"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
          />
          {/* Head */}
          <motion.div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-lg"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          >
            {/* Eyes */}
            <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-black rounded-full" />
            <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-black rounded-full" />
            {/* Nose (carrot) */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full transform rotate-45" />
            {/* Mouth */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-3 h-1 border-b-2 border-black rounded-full" />
            {/* Hat */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-red-600 rounded-t-full" />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-600 rounded-full" />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full" />
          </motion.div>
          {/* Arms (sticks) */}
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

// Snow pile on text component
function TextSnowPile({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`} style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
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

// Ground snow component
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
        {/* Snow mounds */}
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
      {/* Additional snowflakes on ground */}
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

// Christmas theme wrapper that applies Christmas colors
export function ChristmasThemeProvider({ 
  children, 
  isChristmas 
}: { 
  children: React.ReactNode
  isChristmas: boolean 
}) {
  useEffect(() => {
    const root = document.documentElement
    
    if (isChristmas) {
      // Apply Christmas theme colors via CSS variables - More red dominant
      root.style.setProperty('--christmas-primary', '#b91c1c') // Deeper red
      root.style.setProperty('--christmas-secondary', '#dc2626') // Bright red
      root.style.setProperty('--christmas-accent', '#991b1b') // Dark red
      root.style.setProperty('--christmas-green', '#16a34a') // Green accent
      root.style.setProperty('--christmas-gold', '#fbbf24') // Gold accent
      root.classList.add('christmas-theme')
    } else {
      root.classList.remove('christmas-theme')
    }

    return () => {
      root.classList.remove('christmas-theme')
    }
  }, [isChristmas])

  return (
    <>
      {isChristmas && (
        <>
          <Snowman />
          <GroundSnow />
        </>
      )}
      {children}
    </>
  )
}

// Export TextSnowPile for use in page components
export { TextSnowPile }
