'use client'
import { useEffect, useRef, useState } from 'react'

interface Dot {
  x: number
  y: number
  originalX: number
  originalY: number
  vx: number
  vy: number
  radius: number
}

export default function InteractiveDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const dotsRef = useRef<Dot[]>([])
  const mouseRef = useRef({ x: 0, y: 0, isActive: false })
  const scrollRef = useRef(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create dots - reduced density for better performance
    const dots: Dot[] = []
    const spacing = 80 // Increased spacing to reduce dot count
    const cols = Math.ceil(window.innerWidth / spacing)
    const rows = Math.ceil(window.innerHeight / spacing)
    const offsetX = (window.innerWidth - (cols - 1) * spacing) / 2
    const offsetY = (window.innerHeight - (rows - 1) * spacing) / 2

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = offsetX + j * spacing + (Math.random() - 0.5) * 20
        const y = offsetY + i * spacing + (Math.random() - 0.5) * 20
        dots.push({
          x,
          y,
          originalX: x,
          originalY: y,
          vx: 0,
          vy: 0,
          radius: 2 + Math.random() * 1.5
        })
      }
    }
    dotsRef.current = dots

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      mouseRef.current.isActive = true
    }

    // Mouse leave handler
    const handleMouseLeave = () => {
      mouseRef.current.isActive = false
    }

    // Touch handler
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX
        mouseRef.current.y = e.touches[0].clientY
        mouseRef.current.isActive = true
      }
    }

    const handleTouchEnd = () => {
      mouseRef.current.isActive = false
    }

    // Scroll handler
    const handleScroll = () => {
      scrollRef.current = window.scrollY
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const mouse = mouseRef.current
      const scroll = scrollRef.current
      const dots = dotsRef.current
      const mouseRadius = 150
      const scrollInfluence = 0.3

      dots.forEach((dot) => {
        // Reset velocity
        dot.vx *= 0.85
        dot.vy *= 0.85

        // Mouse interaction
        if (mouse.isActive) {
          const dx = mouse.x - dot.x
          const dy = mouse.y - dot.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < mouseRadius) {
            const force = (mouseRadius - distance) / mouseRadius
            const angle = Math.atan2(dy, dx)
            // Repel dots from mouse
            dot.vx -= Math.cos(angle) * force * 0.5
            dot.vy -= Math.sin(angle) * force * 0.5
          }
        }

        // Scroll interaction - subtle vertical movement
        dot.vy += Math.sin(scroll * 0.01) * scrollInfluence * 0.1

        // Return to original position with spring effect
        const returnForceX = (dot.originalX - dot.x) * 0.05
        const returnForceY = (dot.originalY - dot.y) * 0.05
        dot.vx += returnForceX
        dot.vy += returnForceY

        // Apply velocity
        dot.x += dot.vx
        dot.y += dot.vy

        // Subtle floating animation
        const time = Date.now() * 0.001
        dot.x += Math.sin(time + dot.originalX * 0.01) * 0.1
        dot.y += Math.cos(time + dot.originalY * 0.01) * 0.1

        // Draw dot
        const distanceToMouse = mouse.isActive 
          ? Math.sqrt(Math.pow(mouse.x - dot.x, 2) + Math.pow(mouse.y - dot.y, 2))
          : Infinity
        
        const baseOpacity = distanceToMouse < mouseRadius ? 0.6 : 0.22

        // Draw outer glow first
        const glowGradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, dot.radius * 3)
        glowGradient.addColorStop(0, `rgba(217, 164, 65, ${baseOpacity * 0.3})`)
        glowGradient.addColorStop(0.5, `rgba(217, 164, 65, ${baseOpacity * 0.15})`)
        glowGradient.addColorStop(1, 'rgba(217, 164, 65, 0)')
        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.radius * 3, 0, Math.PI * 2)
        ctx.fill()

        // Draw main dot in warm brass
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(217, 164, 65, ${baseOpacity})`
        ctx.fill()
        
        // Add inner highlight for depth
        const highlightGradient = ctx.createRadialGradient(
          dot.x - dot.radius * 0.3, 
          dot.y - dot.radius * 0.3, 
          0, 
          dot.x, 
          dot.y, 
          dot.radius
        )
        highlightGradient.addColorStop(0, `rgba(236, 229, 216, ${baseOpacity * 0.5})`)
        highlightGradient.addColorStop(1, `rgba(217, 164, 65, ${baseOpacity * 0.25})`)
        ctx.fillStyle = highlightGradient
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.radius * 0.7, 0, Math.PI * 2)
        ctx.fill()

        // Draw subtle glow for dots near mouse
        if (mouse.isActive) {
          const dx = mouse.x - dot.x
          const dy = mouse.y - dot.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < mouseRadius) {
            const glowOpacity = (1 - distance / mouseRadius) * 0.25
            const gradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, dot.radius * 3)
            gradient.addColorStop(0, `rgba(217, 164, 65, ${glowOpacity})`)
            gradient.addColorStop(1, 'rgba(217, 164, 65, 0)')
            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(dot.x, dot.y, dot.radius * 3, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('scroll', handleScroll)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isMounted])

  if (!isMounted) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-[5] pointer-events-none"
      style={{ background: 'transparent' }}
    />
  )
}

