"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { siteConfig } from "@/config/site"
import { Badge } from "@/components/ui/badge"
import { Dna, GitMerge, Zap, Trophy } from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Dna,
  GitMerge,
  Zap,
  Trophy,
}

export function EvolutionSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section id="evolution" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-void via-void-secondary to-void" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-purple/10 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <Badge variant="purple" className="mb-4">
            {siteConfig.evolution.badge}
          </Badge>
          
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">{siteConfig.evolution.title.split(" ").slice(0, 2).join(" ")}</span>{" "}
            <span className="text-gradient">{siteConfig.evolution.title.split(" ").slice(2).join(" ")}</span>
          </h2>
          
          <p className="font-body text-lg text-white/50 max-w-2xl mx-auto">
            {siteConfig.evolution.subtitle}
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {siteConfig.evolution.steps.map((step, i) => {
            const Icon = iconMap[step.icon]
            
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group relative"
              >
                <div className="relative p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:border-accent-cyan/30 hover:bg-white/[0.04] h-full">
                  {/* Step number */}
                  <div className="absolute -top-4 -right-4 font-display text-6xl font-bold text-white/5 group-hover:text-accent-cyan/10 transition-colors">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="relative w-14 h-14 mb-6 flex items-center justify-center rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 border border-white/10 group-hover:border-accent-cyan/30 transition-colors"
                  >
                    {Icon && <Icon className="w-7 h-7 text-accent-cyan" />}
                    <div className="absolute inset-0 rounded-xl bg-accent-cyan/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-display text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="font-body text-sm text-white/50 leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* Connector line */}
                  {i < siteConfig.evolution.steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-accent-cyan/50 to-transparent" />
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
