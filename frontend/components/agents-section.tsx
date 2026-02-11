"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { siteConfig } from "@/config/site"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export function AgentsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  const rarityColors: Record<string, string> = {
    Common: "#00f0ff",
    Uncommon: "#00ff88",
    Rare: "#ff3366",
    Epic: "#a855f7",
  }

  return (
    <section id="agents" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-void" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent-green/10 rounded-full blur-[200px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <Badge variant="green" className="mb-4">
            {siteConfig.agents.badge}
          </Badge>
          
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">{siteConfig.agents.title.split(" ")[0]}</span>{" "}
            <span className="text-gradient">{siteConfig.agents.title.split(" ").slice(1).join(" ")}</span>
          </h2>
          
          <p className="font-body text-lg text-white/50 max-w-2xl mx-auto">
            {siteConfig.agents.subtitle}
          </p>
        </motion.div>

        {/* Agent Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {siteConfig.agents.types.map((agent, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="group"
            >
              <Card className="relative overflow-hidden border-white/5 bg-white/[0.02] transition-all duration-500 hover:border-white/10 h-full"
              >
                {/* Glow effect on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${agent.color}20, transparent 70%)`
                  }}
                />
                
                <CardContent className="relative p-6">
                  {/* Rarity badge */}
                  <div className="flex justify-between items-start mb-6">
                    <span 
                      className="font-mono text-xs uppercase tracking-wider px-2 py-1 rounded border"
                      style={{ 
                        borderColor: `${agent.color}40`,
                        color: agent.color,
                        background: `${agent.color}10`
                      }}
                    >
                      {agent.rarity}
                    </span>
                  </div>
                  
                  {/* Agent visual placeholder */}
                  <div className="relative mb-6 aspect-square rounded-xl overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${agent.color}10, transparent)` }}
                  >
                    <div 
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        background: `radial-gradient(circle, ${agent.color}30 0%, transparent 70%)`
                      }}
                    >
                      <div 
                        className="w-24 h-24 rounded-full animate-morph"
                        style={{
                          background: `linear-gradient(135deg, ${agent.color}, ${agent.color}80)`,
                          boxShadow: `0 0 40px ${agent.color}50`
                        }}
                      />
                    </div>
                    
                    {/* Animated rings */}
                    <div 
                      className="absolute inset-4 border rounded-full animate-spin-slow opacity-30"
                      style={{ borderColor: agent.color }}
                    />
                    <div 
                      className="absolute inset-8 border rounded-full animate-spin-slow opacity-20"
                      style={{ 
                        borderColor: agent.color,
                        animationDirection: "reverse",
                        animationDuration: "15s"
                      }}
                    />
                  </div>
                  
                  {/* Name */}
                  <h3 
                    className="font-display text-2xl font-bold mb-2"
                    style={{ color: agent.color }}
                  >
                    {agent.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="font-body text-sm text-white/50 mb-4 line-clamp-2">
                    {agent.description}
                  </p>
                  
                  {/* Traits */}
                  <div className="space-y-2">
                    <p className="font-mono text-xs uppercase tracking-wider text-white/30 mb-2">Traits</p>
                    {agent.traits.map((trait, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <div 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: agent.color }}
                        />
                        <span className="font-body text-sm text-white/70">{trait}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
