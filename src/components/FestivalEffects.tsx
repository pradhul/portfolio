'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Base particle component
function Particle({
  delay,
  duration,
  left,
  emoji,
  size = 20,
}: {
  delay: number
  duration: number
  left: number
  emoji: string
  size?: number
}) {
  const [screenHeight, setScreenHeight] = useState(1000)

  useEffect(() => {
    setScreenHeight(window.innerHeight)
    const handleResize = () => setScreenHeight(window.innerHeight)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: `${left}%`, fontSize: `${size}px` }}
      initial={{ y: -20, opacity: 0, rotate: 0 }}
      animate={{
        y: screenHeight + 20,
        opacity: [0, 1, 1, 0],
        rotate: [0, 360],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {emoji}
    </motion.div>
  )
}

// Confetti particle
function ConfettiParticle({
  delay,
  duration,
  left,
  color,
}: {
  delay: number
  duration: number
  left: number
  color: string
}) {
  const [screenHeight, setScreenHeight] = useState(1000)

  useEffect(() => {
    setScreenHeight(window.innerHeight)
    const handleResize = () => setScreenHeight(window.innerHeight)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${left}%`,
        width: '8px',
        height: '8px',
        backgroundColor: color,
      }}
      initial={{ y: -20, opacity: 0, rotate: 0 }}
      animate={{
        y: screenHeight + 20,
        opacity: [0, 1, 1, 0],
        rotate: [0, 720],
        x: [0, Math.random() * 100 - 50],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeIn',
      }}
    />
  )
}

// Petal component
function Petal({
  delay,
  duration,
  left,
  color,
}: {
  delay: number
  duration: number
  left: number
  color: string
}) {
  const [screenHeight, setScreenHeight] = useState(1000)

  useEffect(() => {
    setScreenHeight(window.innerHeight)
    const handleResize = () => setScreenHeight(window.innerHeight)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${left}%`,
        width: '12px',
        height: '12px',
        backgroundColor: color,
        borderRadius: '50% 0',
        transform: 'rotate(45deg)',
      }}
      initial={{ y: -20, opacity: 0, rotate: 45 }}
      animate={{
        y: screenHeight + 20,
        opacity: [0, 1, 1, 0],
        rotate: [45, 405],
        x: [0, Math.sin(delay) * 50],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

// Light/Twinkle component
function Light({
  delay,
  duration,
  left,
  top,
  color,
}: {
  delay: number
  duration: number
  left: number
  top: number
  color: string
}) {
  return (
    <motion.div
      className="absolute pointer-events-none rounded-full"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: '6px',
        height: '6px',
        backgroundColor: color,
        boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

// Color powder particle (for Holi)
function ColorPowder({
  delay,
  duration,
  left,
  color,
}: {
  delay: number
  duration: number
  left: number
  color: string
}) {
  const [screenHeight, setScreenHeight] = useState(1000)

  useEffect(() => {
    setScreenHeight(window.innerHeight)
    const handleResize = () => setScreenHeight(window.innerHeight)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <motion.div
      className="absolute pointer-events-none rounded-full"
      style={{
        left: `${left}%`,
        width: '16px',
        height: '16px',
        backgroundColor: color,
      }}
      initial={{ y: -20, opacity: 0, scale: 0 }}
      animate={{
        y: screenHeight + 20,
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 1, 0.8],
        x: [0, Math.sin(delay * 2) * 100],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
  )
}

// Snow Effect
export function SnowEffect({ enabled, intensity = 'high' }: { enabled: boolean; intensity?: 'low' | 'medium' | 'high' }) {
  if (!enabled) return null

  const count = intensity === 'high' ? 60 : intensity === 'medium' ? 40 : 20
  const snowflakes = Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10,
    left: Math.random() * 100,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {snowflakes.map((snowflake) => (
        <Particle
          key={snowflake.id}
          delay={snowflake.delay}
          duration={snowflake.duration}
          left={snowflake.left}
          emoji="❄"
          size={20}
        />
      ))}
    </div>
  )
}

// Confetti Effect
export function ConfettiEffect({
  enabled,
  intensity = 'high',
  colors = ['#dc2626', '#16a34a', '#3b82f6', '#fbbf24', '#ec4899', '#9333ea'],
}: {
  enabled: boolean
  intensity?: 'low' | 'medium' | 'high'
  colors?: string[]
}) {
  if (!enabled) return null

  const count = intensity === 'high' ? 80 : intensity === 'medium' ? 50 : 30
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: Math.random() * 3,
    duration: 5 + Math.random() * 5,
    left: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((particle) => (
        <ConfettiParticle
          key={particle.id}
          delay={particle.delay}
          duration={particle.duration}
          left={particle.left}
          color={particle.color}
        />
      ))}
    </div>
  )
}

// Petals Effect
export function PetalsEffect({
  enabled,
  intensity = 'high',
  colors = ['#ec4899', '#f9a8d4', '#ffffff'],
}: {
  enabled: boolean
  intensity?: 'low' | 'medium' | 'high'
  colors?: string[]
}) {
  if (!enabled) return null

  const count = intensity === 'high' ? 50 : intensity === 'medium' ? 30 : 15
  const petals = Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: Math.random() * 4,
    duration: 8 + Math.random() * 8,
    left: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {petals.map((petal) => (
        <Petal
          key={petal.id}
          delay={petal.delay}
          duration={petal.duration}
          left={petal.left}
          color={petal.color}
        />
      ))}
    </div>
  )
}

// Lights Effect (for Diwali, Hanukkah)
export function LightsEffect({
  enabled,
  intensity = 'medium',
  colors = ['#fbbf24', '#f59e0b', '#ffffff'],
}: {
  enabled: boolean
  intensity?: 'low' | 'medium' | 'high'
  colors?: string[]
}) {
  if (!enabled) return null

  const count = intensity === 'high' ? 100 : intensity === 'medium' ? 60 : 30
  const lights = Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: Math.random() * 2,
    duration: 1.5 + Math.random() * 1.5,
    left: Math.random() * 100,
    top: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {lights.map((light) => (
        <Light
          key={light.id}
          delay={light.delay}
          duration={light.duration}
          left={light.left}
          top={light.top}
          color={light.color}
        />
      ))}
    </div>
  )
}

// Fireworks Effect
export function FireworksEffect({
  enabled,
  intensity = 'high',
}: {
  enabled: boolean
  intensity?: 'low' | 'medium' | 'high'
}) {
  if (!enabled) return null

  const count = intensity === 'high' ? 5 : intensity === 'medium' ? 3 : 2
  const fireworkColors = ['#fbbf24', '#dc2626', '#3b82f6', '#16a34a', '#ec4899', '#9333ea', '#ffffff']

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <Firework
          key={i}
          delay={i * 2}
          left={20 + (i * 30)}
          colors={fireworkColors}
        />
      ))}
    </div>
  )
}

function Firework({
  delay,
  left,
  colors,
}: {
  delay: number
  left: number
  colors: string[]
}) {
  const [exploded, setExploded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setExploded(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [delay])

  if (!exploded) return null

  return (
    <div className="absolute" style={{ left: `${left}%`, top: '20%' }}>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 360) / 12
        const color = colors[Math.floor(Math.random() * colors.length)]
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}`,
            }}
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{
              scale: [0, 1, 0],
              x: Math.cos((angle * Math.PI) / 180) * 100,
              y: Math.sin((angle * Math.PI) / 180) * 100,
            }}
            transition={{
              duration: 1.5,
              ease: 'easeOut',
            }}
          />
        )
      })}
    </div>
  )
}

// Color Powder Effect (for Holi)
export function ColorPowderEffect({
  enabled,
  intensity = 'high',
  colors = ['#dc2626', '#16a34a', '#3b82f6', '#fbbf24', '#ec4899'],
}: {
  enabled: boolean
  intensity?: 'low' | 'medium' | 'high'
  colors?: string[]
}) {
  if (!enabled) return null

  const count = intensity === 'high' ? 70 : intensity === 'medium' ? 45 : 25
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: Math.random() * 4,
    duration: 6 + Math.random() * 6,
    left: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((particle) => (
        <ColorPowder
          key={particle.id}
          delay={particle.delay}
          duration={particle.duration}
          left={particle.left}
          color={particle.color}
        />
      ))}
    </div>
  )
}
