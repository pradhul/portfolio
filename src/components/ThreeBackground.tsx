'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

function FloatingParticles({ count = 2000 }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const light = useRef<THREE.PointLight>(null)

  const particles = useMemo(() => {
    const temp = []
    const colors = ['#d9a441', '#ece5d8', '#9a7430', '#a89f8e']
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const x = Math.cos((i / 100) * Math.PI * 2) * factor
      const y = Math.sin((i / 100) * Math.PI * 2) * factor
      const z = (Math.random() - 0.5) * 50
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      temp.push({ time, factor, speed, x, y, z, color })
    }
    return temp
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return
    
    particles.forEach((particle, i) => {
      const { factor, speed, x, y, z } = particle
      const t = particle.time + state.clock.elapsedTime * speed
      
      mesh.current!.setMatrixAt(
        i,
        new THREE.Matrix4().compose(
          new THREE.Vector3(
            x + Math.cos((t / 10) + factor) + (Math.sin(t * 1) / 10),
            y + Math.sin((t / 10) + factor) + (Math.cos(t * 2) / 10),
            z + Math.cos((t / 10) + factor)
          ),
          new THREE.Quaternion(),
          new THREE.Vector3(0.2, 0.2, 0.2)
        )
      )
    })
    
    mesh.current.instanceMatrix.needsUpdate = true
    
    if (light.current) {
      light.current.position.x = state.mouse.x * 15
      light.current.position.y = state.mouse.y * 15
    }
  })

  return (
    <>
      <pointLight ref={light} distance={40} intensity={4} color="#d9a441" />
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshPhongMaterial color="#d9a441" emissive="#d9a441" emissiveIntensity={0.15} />
      </instancedMesh>
    </>
  )
}

function FloatingOrbs() {
  const group1 = useRef<THREE.Group>(null)
  const group2 = useRef<THREE.Group>(null)
  const group3 = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (group1.current) {
      group1.current.rotation.x = state.clock.elapsedTime * 0.1
      group1.current.rotation.y = state.clock.elapsedTime * 0.15
      group1.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 2
    }
    if (group2.current) {
      group2.current.rotation.x = state.clock.elapsedTime * -0.12
      group2.current.rotation.y = state.clock.elapsedTime * 0.18
      group2.current.position.y = Math.cos(state.clock.elapsedTime * 0.4) * 2
    }
    if (group3.current) {
      group3.current.rotation.x = state.clock.elapsedTime * 0.08
      group3.current.rotation.y = state.clock.elapsedTime * -0.2
      group3.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 1.5
    }
  })

  return (
    <>
      <group ref={group1} position={[-15, 5, -20]}>
        <Sphere args={[2, 32, 32]}>
          <meshStandardMaterial 
            color="#d9a441" 
            emissive="#d9a441" 
            emissiveIntensity={0.15}
            transparent 
            opacity={0.2}
            wireframe
          />
        </Sphere>
      </group>
      <group ref={group2} position={[15, -5, -25]}>
        <Sphere args={[1.5, 32, 32]}>
          <meshStandardMaterial 
            color="#a89f8e" 
            emissive="#a89f8e" 
            emissiveIntensity={0.15}
            transparent 
            opacity={0.2}
            wireframe
          />
        </Sphere>
      </group>
      <group ref={group3} position={[0, 0, -30]}>
        <Sphere args={[1.8, 32, 32]}>
          <meshStandardMaterial 
            color="#9a7430" 
            emissive="#9a7430" 
            emissiveIntensity={0.15}
            transparent 
            opacity={0.2}
            wireframe
          />
        </Sphere>
      </group>
    </>
  )
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[#0f0d0b]" />
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.4} color="#d9a441" />
        <pointLight position={[-10, -10, 10]} intensity={0.4} color="#a89f8e" />
        <FloatingParticles count={800} />
        <FloatingOrbs />
      </Canvas>
    </div>
  )
}
