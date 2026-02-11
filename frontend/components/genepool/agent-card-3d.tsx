"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Agent, RARITY_COLORS, CLASS_COLORS } from "@/lib/agents"
import { Dna, TrendingUp, Zap } from "lucide-react"

interface AgentCard3DProps {
  agent: Agent
  onClick: () => void
  index?: number
}

export function AgentCard3D({ agent, onClick, index = 0 }: AgentCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = ((y - centerY) / centerY) * -10
    const rotateY = ((x - centerX) / centerX) * 10
    
    setTransform({ rotateX, rotateY, scale: 1.02 })
  }

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0, scale: 1 })
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const rarityColor = RARITY_COLORS[agent.rarity]
  const classColor = CLASS_COLORS[agent.class]

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
        transformStyle: 'preserve-3d',
      }}
      className="group relative cursor-pointer"
    >
      {/* Glow Effect */}
      <div 
        className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{ 
          background: `linear-gradient(135deg, ${rarityColor}40, ${classColor}40)`,
        }}
      />
      
      {/* Card */}
      <div className="relative bg-void-secondary border border-white/10 rounded-xl overflow-hidden group-hover:border-white/20 transition-colors duration-300">
        {/* Rarity Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge 
            className="text-xs font-mono uppercase tracking-wider border-0"
            style={{ 
              backgroundColor: `${rarityColor}20`,
              color: rarityColor,
              boxShadow: `0 0 10px ${rarityColor}30`,
            }}
          >
            {agent.rarity}
          </Badge>
        </div>

        {/* Price Badge (if for sale) */}
        {agent.isForSale && agent.price && (
          <div className="absolute top-3 right-3 z-10">
            <Badge 
              variant="glow" 
              className="text-xs font-mono"
            >
              <Zap className="w-3 h-3 mr-1" />
              {agent.price} DNA
            </Badge>
          </div>
        )}

        {/* Image Container */}
        <div className="relative aspect-square bg-gradient-to-b from-white/5 to-transparent overflow-hidden"
        >
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${rarityColor}30, transparent 70%)`,
            }}
          />
          
          <Image
            src={agent.image}
            alt={agent.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-void-secondary via-transparent to-transparent opacity-60" />
          
          {/* 3D Depth Elements */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(135deg, transparent 40%, ${rarityColor}10 50%, transparent 60%)`,
              transform: 'translateZ(20px)',
            }}
          />
        </div>

        {/* Content */}
        <div className="p-4 space-y-3"
        >
          {/* Name & Class */}
          <div>
            <h3 className="font-display text-lg font-bold text-white group-hover:text-accent-cyan transition-colors truncate">
              {agent.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: classColor }}
              />
              <span className="text-xs text-white/60 font-mono">
                {agent.class}
              </span>
              <span className="text-white/30">•</span>
              <span className="text-xs text-white/60 font-mono flex items-center gap-1">
                <Dna className="w-3 h-3" />
                Gen {agent.generation}
              </span>
            </div>
          </div>

          {/* Fitness Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/50 font-mono uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Fitness
              </span>
              <span className="font-mono font-semibold" style={{ color: rarityColor }}>
                {agent.fitness}%
              </span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${agent.fitness}%` }}
                transition={{ duration: 0.8, delay: index * 0.05 + 0.3 }}
                className="h-full rounded-full"
                style={{ 
                  background: `linear-gradient(90deg, ${classColor}, ${rarityColor})`,
                  boxShadow: `0 0 10px ${rarityColor}50`,
                }}
              />
            </div>
          </div>

          {/* Traits Preview */}
          <div className="flex flex-wrap gap-1.5">
            {agent.traits.slice(0, 3).map((trait) => (
              <span 
                key={trait.name}
                className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50 font-mono"
              >
                {trait.name}
              </span>
            ))}
            {agent.traits.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50 font-mono">
                +{agent.traits.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Glow Line */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent, ${rarityColor}, transparent)`,
          }}
        />
      </div>
    </motion.div>
  )
}
