'use client'

import { motion } from 'framer-motion'

export function Snowman() {
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

export function GroundSnow() {
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
