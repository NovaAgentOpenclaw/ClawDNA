"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { siteConfig } from "@/config/site"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Check, ExternalLink } from "lucide-react"

export function TokenomicsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [copied, setCopied] = useState(false)

  const copyCA = () => {
    if (siteConfig.tokenomics.token.ca && siteConfig.tokenomics.token.ca !== "COMING_SOON") {
      navigator.clipboard.writeText(siteConfig.tokenomics.token.ca)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  }

  // Calculate pie chart segments
  let cumulativePercent = 0
  const segments = siteConfig.tokenomics.allocation.map((item) => {
    const start = cumulativePercent
    cumulativePercent += item.value
    return {
      ...item,
      start,
      end: cumulativePercent,
    }
  })

  return (
    <section id="tokenomics" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-void" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-accent-cyan/10 rounded-full blur-[200px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <Badge variant="glow" className="mb-4">
            {siteConfig.tokenomics.badge}
          </Badge>
          
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">THE</span>{" "}
            <span className="text-gradient">GENETIC CURRENCY</span>
          </h2>
          
          <p className="font-body text-lg text-white/50 max-w-2xl mx-auto">
            {siteConfig.tokenomics.subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Token Info & Chart */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Token Card */}
            <Card className="mb-4 border-accent-cyan/20 bg-gradient-to-br from-accent-cyan/5 to-transparent">
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center"
                  >
                    <span className="font-display text-3xl font-bold text-void">$</span>
                  </div>
                  
                  <div>
                    <h3 className="font-display text-3xl font-bold text-white mb-1">
                      {siteConfig.tokenomics.token.name}
                    </h3>
                    <div className="flex items-center gap-4 font-mono text-sm">
                      <span className="text-white/50">Total Supply:</span>
                      <span className="text-accent-cyan">{siteConfig.tokenomics.token.supply}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contract Address Card */}
            <Card className="mb-8 border-accent-purple/20 bg-gradient-to-br from-accent-purple/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-white/40">
                      Contract Address (CA)
                    </span>
                    {siteConfig.tokenomics.token.ca !== "COMING_SOON" && (
                      <div className="flex gap-2">
                        {siteConfig.tokenomics.token.dexscreener && (
                          <a 
                            href={siteConfig.tokenomics.token.dexscreener}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/40 hover:text-accent-cyan transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div 
                    onClick={copyCA}
                    className={`
                      flex items-center justify-between gap-4 p-4 rounded-lg 
                      border border-white/10 bg-void/50
                      ${siteConfig.tokenomics.token.ca !== "COMING_SOON" ? "cursor-pointer hover:border-accent-purple/50 transition-colors" : ""}
                    `}
                  >
                    <code className="font-mono text-sm text-white/80 truncate">
                      {siteConfig.tokenomics.token.ca === "COMING_SOON" 
                        ? "🔒 Token launch coming soon..." 
                        : siteConfig.tokenomics.token.ca
                      }
                    </code>
                    
                    {siteConfig.tokenomics.token.ca !== "COMING_SOON" && (
                      <button className="flex-shrink-0 text-white/40 hover:text-accent-cyan transition-colors">
                        {copied ? (
                          <Check className="w-5 h-5 text-accent-green" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <div className="relative w-64 h-64 mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {segments.map((segment, i) => {
                  const startAngle = (segment.start / 100) * Math.PI * 2
                  const endAngle = (segment.end / 100) * Math.PI * 2
                  
                  const x1 = 50 + 40 * Math.cos(startAngle)
                  const y1 = 50 + 40 * Math.sin(startAngle)
                  const x2 = 50 + 40 * Math.cos(endAngle)
                  const y2 = 50 + 40 * Math.sin(endAngle)
                  
                  const largeArc = segment.value > 50 ? 1 : 0
                  
                  return (
                    <motion.path
                      key={i}
                      d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={segment.color}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                    />
                  )
                })}
                <circle cx="50" cy="50" r="25" fill="#0a0a0f" />
              </svg>
              
              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="font-display text-2xl font-bold text-white">$DNA</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-8 space-y-3">
              {siteConfig.tokenomics.allocation.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ background: item.color }}
                    />
                    <span className="font-body text-sm text-white/70">{item.label}</span>
                  </div>
                  <span className="font-mono text-sm text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Utilities */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <h3 className="font-display text-2xl font-bold text-white mb-6">
              Token Utilities
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {siteConfig.tokenomics.utilities.map((utility, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="group p-6 rounded-xl border border-white/5 bg-white/[0.02] transition-all duration-300 hover:border-accent-cyan/30 hover:bg-white/[0.04]"
                >
                  <h4 className="font-display text-lg font-bold text-white mb-2 group-hover:text-accent-cyan transition-colors">
                    {utility.title}
                  </h4>
                  <p className="font-body text-sm text-white/50">
                    {utility.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
