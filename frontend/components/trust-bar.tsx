"use client"

import { motion } from "framer-motion"
import { siteConfig } from "@/config/site"
import { Badge } from "@/components/ui/badge"
import { Dna, Trophy, Zap, Sparkles } from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  solana: Zap,
  sonic: Sparkles,
  trophy: Trophy,
  dna: Dna,
}

export function TrustBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 py-4"
    >
      <span className="font-mono text-xs uppercase tracking-wider text-white/40">
        {siteConfig.trustBar.title}
      </span>
      
      <div className="flex items-center gap-3">
        {siteConfig.trustBar.badges.map((badge, i) => {
          const Icon = iconMap[badge.icon] || Zap
          
          return (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              className="group relative"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-accent-cyan/30 hover:bg-accent-cyan/10 transition-all duration-300">
                <Icon className="w-3.5 h-3.5 text-accent-cyan" />
                <span className="font-mono text-xs text-white/70 group-hover:text-white transition-colors">
                  {badge.label}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
