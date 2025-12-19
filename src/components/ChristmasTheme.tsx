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

  const snowflakes = Array.from({ length: 50 }, (_, i) => ({
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
      // Apply Christmas theme colors via CSS variables
      root.style.setProperty('--christmas-primary', '#dc2626') // Red
      root.style.setProperty('--christmas-secondary', '#16a34a') // Green
      root.style.setProperty('--christmas-accent', '#fbbf24') // Gold
      root.classList.add('christmas-theme')
    } else {
      root.classList.remove('christmas-theme')
    }

    return () => {
      root.classList.remove('christmas-theme')
    }
  }, [isChristmas])

  return <>{children}</>
}
