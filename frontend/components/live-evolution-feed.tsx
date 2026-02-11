"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { siteConfig } from "@/config/site"
import { Badge } from "@/components/ui/badge"
import { Zap, GitMerge, Sparkles, TrendingUp, Activity, Dna } from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  evolved: Zap,
  bred: GitMerge,
  mutated: Sparkles,
  "leveled up": TrendingUp,
  "entered arena": Activity,
  discovered: Dna,
}

const rarityColors: Record<string, string> = {
  common: "#64748b",
  uncommon: "#00ff88",
  rare: "#00f0ff",
  epic: "#a855f7",
  legendary: "#ff3366",
}

export function LiveEvolutionFeed() {
  const [events, setEvents] = useState(siteConfig.evolutionFeed.events)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    setIsInView(true)
    
    // Simulate new events coming in
    const interval = setInterval(() => {
      const actions = ["evolved", "bred", "mutated", "leveled up", "entered arena", "discovered"]
      const traits = ["Neural Adaptation", "Quantum Logic", "Cyber Instinct", "Shadow Step", "Iron Will", "Ghost Protocol"]
      const rarities = ["common", "uncommon", "rare", "epic", "legendary"]
      
      const newEvent = {
        agent: `#${Math.floor(Math.random() * 9999)}`,
        action: actions[Math.floor(Math.random() * actions.length)],
        trait: traits[Math.floor(Math.random() * traits.length)],
        rarity: rarities[Math.floor(Math.random() * rarities.length)],
        time: "just now",
      }
      
      setEvents(prev => [newEvent, ...prev.slice(0, 7)])
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section id="live-feed" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-void via-void-secondary to-void" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-cyan/10 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="cyan" className="mb-4">
            <Activity className="w-3 h-3 mr-1" />
            {siteConfig.evolutionFeed.badge}
          </Badge>
          
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-white">{siteConfig.evolutionFeed.title.split(" ").slice(0, 2).join(" ")}</span>{" "}
            <span className="text-gradient">{siteConfig.evolutionFeed.title.split(" ").slice(2).join(" ")}</span>
          </h2>
          
          <p className="font-body text-base text-white/50 max-w-xl mx-auto">
            {siteConfig.evolutionFeed.subtitle}
          </p>
        </motion.div>

        {/* Live Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent-green/10 border border-accent-green/30">
            <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            <span className="font-mono text-xs text-accent-green uppercase tracking-wider">Live</span>
          </div>
        </motion.div>

        {/* Events Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {events.map((event, i) => {
              const Icon = iconMap[event.action] || Activity
              const color = rarityColors[event.rarity]
              
              return (
                <motion.div
                  key={`${event.agent}-${i}`}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -20 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  layout
                  className="group relative p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300"
                >
                  {/* Glow effect */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${color}10, transparent 70%)`
                    }}
                  />
                  
                  <div className="relative">
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex items-center justify-center w-8 h-8 rounded-lg border"
                          style={{ borderColor: `${color}40`, background: `${color}10` }}
                        >
                          <span style={{ color }}><Icon className="w-4 h-4" /></span>
                        </div>
                        <span className="font-mono text-sm text-white/60">{event.time}</span>
                      </div>
                      
                      <span
                        className="font-mono text-xs uppercase tracking-wider px-2 py-0.5 rounded border"
                        style={{
                          borderColor: `${color}40`,
                          color,
                          background: `${color}10`
                        }}
                      >
                        {event.rarity}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-1">
                      <p className="font-display text-lg font-bold text-white">
                        Agent {event.agent}
                      </p>
                      <p className="font-mono text-xs text-white/40 uppercase tracking-wider">
                        {event.action}
                      </p>
                      <p className="font-body text-sm" style={{ color }}>
                        {event.trait}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
