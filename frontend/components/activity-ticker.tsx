"use client"

import { motion } from "framer-motion"
import { Activity, Zap, Trophy, Dna, GitMerge, Sparkles } from "lucide-react"
import { siteConfig } from "@/config/site"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  evolution: Zap,
  rare: Sparkles,
  milestone: Trophy,
  record: Trophy,
  arena: Activity,
  breeding: GitMerge,
}

const colorMap: Record<string, string> = {
  evolution: "#00f0ff",
  rare: "#ff3366",
  milestone: "#00ff88",
  record: "#a855f7",
  arena: "#ff3366",
  breeding: "#a855f7",
}

export function ActivityTicker() {
  const items = [...siteConfig.activityTicker.items, ...siteConfig.activityTicker.items]

  return (
    <div className="relative w-full overflow-hidden py-3 bg-black/30 border-y border-white/5 backdrop-blur-sm">
      {/* Gradient masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-void to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-void to-transparent z-10" />

      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {items.map((item, i) => {
          const Icon = iconMap[item.type] || Activity
          const color = colorMap[item.type] || "#00f0ff"
          
          return (
            <div key={i} className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-6 h-6 rounded-full border"
                style={{ borderColor: `${color}40`, background: `${color}10` }}
              >
                <span style={{ color }}><Icon className="w-3 h-3" /></span>
              </div>
              <span className="font-mono text-sm text-white/70">{item.text}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
