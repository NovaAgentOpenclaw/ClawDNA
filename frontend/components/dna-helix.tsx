"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function DNAHelix() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState(0)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const scrollRotation = useTransform(scrollYProgress, [0, 1], [0, 360])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  useEffect(() => {
    const unsubscribe = scrollRotation.on("change", (v) => {
      setRotation(v)
    })
    return () => unsubscribe()
  }, [scrollRotation])

  const strandCount = 24
  const radius = 80
  const height = 400
  
  return (
    <motion.div
      ref={containerRef}
      style={{ scale, opacity }}
      className="relative w-[300px] h-[500px] perspective-[1000px]"
    >
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateY(${rotation}deg)`,
          transition: "transform 0.1s ease-out"
        }}
      >
        {/* DNA Strands */}
        {Array.from({ length: strandCount }).map((_, i) => {
          const angle = (i / strandCount) * Math.PI * 2
          const y = (i / strandCount) * height - height / 2
          
          const x1 = Math.cos(angle) * radius
          const z1 = Math.sin(angle) * radius
          
          const x2 = Math.cos(angle + Math.PI) * radius
          const z2 = Math.sin(angle + Math.PI) * radius
          
          const opacity = 0.3 + (Math.sin(angle) + 1) / 2 * 0.7
          
          return (
            <div key={i}>
              {/* Strand 1 */}
              <motion.div
                className="absolute w-4 h-4 rounded-full"
                style={{
                  background: `linear-gradient(135deg, #00f0ff, #a855f7)`,
                  left: `calc(50% + ${x1}px - 8px)`,
                  top: `calc(50% + ${y}px - 8px)`,
                  transform: `translateZ(${z1}px)`,
                  opacity,
                  boxShadow: `0 0 15px rgba(0, 240, 255, ${opacity * 0.5})`,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              />
              
              {/* Strand 2 */}
              <motion.div
                className="absolute w-4 h-4 rounded-full"
                style={{
                  background: `linear-gradient(135deg, #00ff88, #00f0ff)`,
                  left: `calc(50% + ${x2}px - 8px)`,
                  top: `calc(50% + ${y}px - 8px)`,
                  transform: `translateZ(${z2}px)`,
                  opacity,
                  boxShadow: `0 0 15px rgba(0, 255, 136, ${opacity * 0.5})`,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
              />
              
              {/* Connector */}
              <motion.div
                className="absolute h-0.5 origin-left"
                style={{
                  width: `${radius * 2}px`,
                  left: `calc(50% + ${x1}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: `
                    translateZ(${(z1 + z2) / 2}px)
                    rotateY(${-rotation}deg)
                    rotateZ(${Math.atan2(y, x2 - x1) * 180 / Math.PI}deg)
                  `,
                  background: `linear-gradient(90deg, rgba(0, 240, 255, 0.5), rgba(168, 85, 247, 0.5))`,
                  opacity: opacity * 0.3,
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.05 + 0.2, duration: 0.3 }}
              />
            </div>
          )
        })}
        
        {/* Glow center */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[400px] rounded-full blur-[100px]"
          style={{
            background: "radial-gradient(ellipse, rgba(0, 240, 255, 0.2), transparent 70%)"
          }}
        />
      </div>
    </motion.div>
  )
}
