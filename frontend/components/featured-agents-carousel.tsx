"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { siteConfig } from "@/config/site"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Flame, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react"

const rarityLabels: Record<string, string> = {
  legendary: "Legendary",
  epic: "Epic",
  rare: "Rare",
  uncommon: "Uncommon",
  common: "Common",
}

export function FeaturedAgentsCarousel() {
  const ref = useRef(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
      setTimeout(checkScroll, 300)
    }
  }

  return (
    <section id="featured" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-void" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-purple/10 rounded-full blur-[200px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="purple" className="mb-4">
            <Flame className="w-3 h-3 mr-1" />
            {siteConfig.featuredAgents.badge}
          </Badge>
          
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-white">{siteConfig.featuredAgents.title.split(" ")[0]}</span>{" "}
            <span className="text-gradient">{siteConfig.featuredAgents.title.split(" ").slice(1).join(" ")}</span>
          </h2>
          
          <p className="font-body text-base text-white/50 max-w-xl mx-auto">
            {siteConfig.featuredAgents.subtitle}
          </p>
        </motion.div>

        {/* Navigation Arrows */}
        <div className="hidden md:flex justify-end gap-2 mb-6">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="p-2 rounded-lg border border-white/10 bg-white/5 hover:border-accent-cyan/30 hover:bg-accent-cyan/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 text-white/70" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="p-2 rounded-lg border border-white/10 bg-white/5 hover:border-accent-cyan/30 hover:bg-accent-cyan/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 text-white/70" />
          </button>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {siteConfig.featuredAgents.agents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex-shrink-0 w-[280px] snap-start"
            >
              <Card className="group relative overflow-hidden border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-500 h-full"
              >
                {/* Glow effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${agent.color}20, transparent 70%)`
                  }}
                />

                <CardContent className="relative p-5">
                  {/* Top row */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-mono text-xs text-white/40">{agent.id}</span>
                    <span
                      className="font-mono text-xs uppercase tracking-wider px-2 py-0.5 rounded border"
                      style={{
                        borderColor: `${agent.color}40`,
                        color: agent.color,
                        background: `${agent.color}10`
                      }}
                    >
                      {rarityLabels[agent.rarity]}
                    </span>
                  </div>
                  
                  {/* Agent Visual */}
                  <div className="relative mb-4 aspect-[4/3] rounded-xl overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${agent.color}15, transparent)` }}
                  >
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        background: `radial-gradient(circle, ${agent.color}30 0%, transparent 70%)`
                      }}
                    >
                      <motion.div
                        className="w-20 h-20 rounded-full"
                        style={{
                          background: `linear-gradient(135deg, ${agent.color}, ${agent.color}80)`,
                          boxShadow: `0 0 40px ${agent.color}50`
                        }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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
                  
                  {/* Info */}
                  <div className="space-y-2">
                    <h3 className="font-display text-xl font-bold" style={{ color: agent.color }}>
                      {agent.name}
                    </h3>
                    
                    <p className="font-mono text-xs text-white/40 uppercase tracking-wider">
                      {agent.trait}
                    </p>
                    
                    {/* Fitness Bar */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-white/40" />
                          <span className="font-mono text-xs text-white/40">Fitness</span>
                        </div>
                        <span className="font-mono text-sm font-bold" style={{ color: agent.color }}>
                          {agent.fitness}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: agent.color }}
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${agent.fitness}%` } : {}}
                          transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mobile scroll indicator */}
        <div className="md:hidden flex justify-center gap-2 mt-4">
          {siteConfig.featuredAgents.agents.map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />
          ))}
        </div>
      </div>
    </section>
  )
}
