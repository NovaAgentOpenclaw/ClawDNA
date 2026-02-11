"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { siteConfig } from "@/config/site"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Twitter, Dna, GitMerge, ArrowRight, MessageCircle } from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  discord: MessageCircle,
  twitter: Twitter,
  dna: Dna,
  gitmerge: GitMerge,
}

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

export function CommunitySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="community" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-void" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-green/10 rounded-full blur-[200px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="green" className="mb-4">
            <Users className="w-3 h-3 mr-1" />
            {siteConfig.communitySection.badge}
          </Badge>
          
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-white">{siteConfig.communitySection.title.split(" ").slice(0, 2).join(" ")}</span>{" "}
            <span className="text-gradient">{siteConfig.communitySection.title.split(" ").slice(2).join(" ")}</span>
          </h2>
          
          <p className="font-body text-base text-white/50 max-w-xl mx-auto">
            {siteConfig.communitySection.subtitle}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {siteConfig.communitySection.stats.map((stat, i) => {
            const Icon = iconMap[stat.icon]
            
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-accent-cyan" />
                  </div>
                </div>
                
                <p className="font-display text-3xl font-bold text-white mb-1">
                  {formatNumber(stat.value)}
                </p>
                
                <p className="font-mono text-xs text-white/40 uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Social CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href={siteConfig.social.discord}>
            <Button variant="glitch" size="lg" className="w-full sm:w-auto group">
              <MessageCircle className="mr-2 w-5 h-5" />
              Join Discord
            </Button>
          </a>
          
          <a href={siteConfig.social.twitter}>
            <Button variant="outline" size="lg" className="w-full sm:w-auto group">
              <Twitter className="mr-2 w-5 h-5" />
              Follow on X
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
