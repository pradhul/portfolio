'use client'

import { useEffect, useState } from 'react'

interface ChristmasConfig {
  enabled: boolean
  startMonth: number
  endMonth: number
  endDay: number
}

const CHRISTMAS_CONFIG: ChristmasConfig = {
  enabled: true,
  startMonth: 11,
  endMonth: 0,
  endDay: 2,
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

      if (month === CHRISTMAS_CONFIG.startMonth) {
        setIsChristmas(true)
        return
      }

      if (month === CHRISTMAS_CONFIG.endMonth && day <= CHRISTMAS_CONFIG.endDay) {
        setIsChristmas(true)
        return
      }

      setIsChristmas(false)
    }

    checkDate()
    const interval = setInterval(checkDate, 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [])

  return isChristmas
}
