"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { siteConfig } from "@/config/site"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, ArrowRight, Dna, Shuffle } from "lucide-react"

export function BreedingSimulatorTeaser() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="simulator" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-void via-void-secondary to-void" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent-cyan/10 rounded-full blur-[200px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="cyan" className="mb-4">
              <Play className="w-3 h-3 mr-1" />
              {siteConfig.breedingSimulator.badge}
            </Badge>
            
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-white">{siteConfig.breedingSimulator.title.split(" ")[0]}</span>{" "}
              <span className="text-gradient">{siteConfig.breedingSimulator.title.split(" ").slice(1).join(" ")}</span>
            </h2>
            
            <p className="font-body text-base text-white/50 mb-8 max-w-md">
              {siteConfig.breedingSimulator.subtitle}
            </p>

            <a href={siteConfig.breedingSimulator.cta.href}>
              <Button variant="glow" size="lg" className="group">
                {siteConfig.breedingSimulator.cta.text}
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
          </motion.div>

          {/* Right Content - Mini Simulator Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
              {/* Preview Header */}
              <div className="flex items-center gap-2 mb-6">
                <Dna className="w-5 h-5 text-accent-cyan" />
                <span className="font-mono text-sm text-white/60">Breeding Preview</span>
              </div>

              {/* Parents */}
              <div className="flex items-center justify-between mb-6">
                {/* Parent A */}
                <motion.div
                  className="w-24 h-24 rounded-xl border border-accent-cyan/30 bg-accent-cyan/10 flex items-center justify-center"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-1 rounded-full bg-accent-cyan/50" />
                    <p className="font-mono text-xs text-accent-cyan">Parent A</p>
                  </div>
                </motion.div>

                {/* Connection */}
                <div className="flex flex-col items-center">
                  <Shuffle className="w-5 h-5 text-white/30 mb-2" />
                  <div className="w-16 h-0.5 bg-gradient-to-r from-accent-cyan/50 via-accent-purple/50 to-accent-green/50" />
                </div>

                {/* Parent B */}
                <motion.div
                  className="w-24 h-24 rounded-xl border border-accent-purple/30 bg-accent-purple/10 flex items-center justify-center"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-1 rounded-full bg-accent-purple/50" />
                    <p className="font-mono text-xs text-accent-purple">Parent B</p>
                  </div>
                </motion.div>
              </div>

              {/* Prediction */}
              <div className="p-4 rounded-xl border border-accent-green/30 bg-accent-green/5">
                <p className="font-mono text-xs text-white/40 mb-2">Predicted Offspring</p>
                <div className="flex items-center gap-4">
                  <motion.div
                    className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-green flex items-center justify-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Dna className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <div className="flex-1">
                    <p className="font-display font-bold text-white mb-1">Hybrid Strategist</p>
                    <div className="flex gap-2">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-accent-cyan/20 text-accent-cyan">92% Logic</span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-accent-green/20 text-accent-green">15% Mutate</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { label: "Fitness", value: "89%", color: "#00f0ff" },
                  { label: "Rarity", value: "Epic", color: "#a855f7" },
                  { label: "Traits", value: "12", color: "#00ff88" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-3 rounded-lg bg-white/5">
                    <p className="font-mono text-xs text-white/40 mb-1">{stat.label}</p>
                    <p className="font-display font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
