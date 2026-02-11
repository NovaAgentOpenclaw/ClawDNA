"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { siteConfig } from "@/config/site"
import { Copy, Check, Dna } from "lucide-react"

export function TokenBanner() {
  const [copied, setCopied] = useState(false)
  const ca = siteConfig.token.ca

  const handleCopy = async () => {
    if (ca === "COMING_SOON") return
    await navigator.clipboard.writeText(ca)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed top-16 sm:top-20 left-0 right-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xl border border-accent-cyan/30 bg-void/80 backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(0,240,255,0.3)]">
          {/* Animated gradient border */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-cyan/20 via-accent-purple/20 to-accent-cyan/20 opacity-50" />
          
          {/* Glow effect */}
          <div className="absolute -top-1/2 -left-1/4 w-1/2 h-full bg-accent-cyan/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -right-1/4 w-1/2 h-full bg-accent-purple/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3">
            {/* Token Label */}
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30">
                <Dna className="w-4 h-4 text-accent-cyan" />
                <div className="absolute inset-0 bg-accent-cyan/20 blur-md rounded-lg" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-white text-sm sm:text-base">
                  {siteConfig.token.name}
                </span>
                <span className="hidden sm:inline text-white/40 text-xs">|</span>
                <span className="text-white/60 text-xs sm:text-sm font-mono">Contract Address</span>
              </div>
            </div>

            {/* CA Field */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none relative group">
                <div className="absolute inset-0 bg-accent-cyan/5 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <code className="relative block w-full sm:w-auto px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs sm:text-sm font-mono text-accent-cyan/90 truncate max-w-[200px] sm:max-w-[280px] lg:max-w-[400px]">
                  {ca}
                </code>
              </div>
              
              <button
                onClick={handleCopy}
                disabled={ca === "COMING_SOON"}
                className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan/20 hover:border-accent-cyan/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-accent-green" />
                ) : (
                  <Copy className="w-4 h-4 transition-transform group-hover:scale-110" />
                )}
                {copied && (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono text-accent-green whitespace-nowrap"
                  >
                    Copied!
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
