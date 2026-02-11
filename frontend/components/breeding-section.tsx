"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { siteConfig } from "@/config/site"
import { Badge } from "@/components/ui/badge"
import { Shuffle, Sparkles, Route, GitBranch } from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shuffle,
  Sparkles,
  Route,
  GitBranch,
}

export function BreedingSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <section id="breeding" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-void via-void-secondary to-void" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-accent-purple/15 rounded-full blur-[200px] -translate-y-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="cyan" className="mb-4">
              {siteConfig.breeding.badge}
            </Badge>
            
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">{siteConfig.breeding.title.split(" ")[0]}</span>{" "}
              <span className="text-gradient">{siteConfig.breeding.title.split(" ").slice(1).join(" ")}</span>
            </h2>
            
            <p className="font-body text-lg text-white/50 mb-8">
              {siteConfig.breeding.subtitle}
            </p>

            {/* Features list */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="space-y-4"
            >
              {siteConfig.breeding.features.map((feature, i) => {
                const Icon = iconMap[feature.icon]
                
                return (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="group flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] transition-all duration-300 hover:border-accent-cyan/30 hover:bg-white/[0.04]"
                  >
                    <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-accent-cyan/10 border border-accent-cyan/20"
                    >
                      {Icon && <Icon className="w-6 h-6 text-accent-cyan" />}
                    </div>
                    
                    <div>
                      <h3 className="font-display text-lg font-bold text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="font-body text-sm text-white/50">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Right Content - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Parent 1 */}
              <motion.div
                className="absolute top-0 left-0 w-40 h-40"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-accent-cyan/30 to-accent-purple/30 border border-accent-cyan/30 flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-accent-cyan/50 animate-pulse" />
                    <p className="font-mono text-xs text-accent-cyan">PARENT A</p>
                  </div>
                </div>
              </motion.div>

              {/* Parent 2 */}
              <motion.div
                className="absolute top-0 right-0 w-40 h-40"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-accent-purple/30 to-accent-green/30 border border-accent-purple/30 flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-accent-purple/50 animate-pulse" />
                    <p className="font-mono text-xs text-accent-purple">PARENT B</p>
                  </div>
                </div>
              </motion.div>

              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line
                  x1="25%"
                  y1="25%"
                  x2="50%"
                  y2="60%"
                  stroke="url(#gradient1)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;20"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </line>
                <line
                  x1="75%"
                  y1="25%"
                  x2="50%"
                  y2="60%"
                  stroke="url(#gradient2)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;20"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </line>
                
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.5" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#00ff88" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Offspring */}
              <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-accent-cyan/40 via-accent-purple/40 to-accent-green/40 border-2 border-white/20 flex items-center justify-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="relative text-center">
                    <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-accent-cyan to-accent-green animate-pulse shadow-[0_0_30px_rgba(0,240,255,0.5)]" />
                    <p className="font-display text-lg font-bold text-white">OFFSPRING</p>
                    <p className="font-mono text-xs text-accent-cyan mt-1">MUTATION DETECTED</p>
                  </div>
                  
                  {/* DNA animation */}
                  <motion.div
                    className="absolute inset-0 border-2 border-accent-cyan/30 rounded-2xl"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
