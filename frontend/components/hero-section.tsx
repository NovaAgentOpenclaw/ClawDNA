"use client"

import { motion } from "framer-motion"
import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DNAHelix } from "./dna-helix"
import { ParticleField } from "./particle-field"
import { ArrowRight, Sparkles, Twitter, Github, Trophy } from "lucide-react"
import { ActivityTicker } from "./activity-ticker"
import { TrustBar } from "./trust-bar"

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  const socialIcons = [
    { icon: Twitter, href: siteConfig.social.twitter, label: "X (Twitter)" },
    { icon: Github, href: siteConfig.social.github, label: "GitHub" },
    { icon: Trophy, href: siteConfig.social.colosseum, label: "Colosseum Hackathon" },
  ]

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden pt-32 sm:pt-28">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-0 bg-gradient-to-b from-void via-void/90 to-void" />
      <div className="particles-container">
        <ParticleField />
      </div>
      
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-purple/20 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-cyan/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div variants={itemVariants}>
              <Badge variant="glow" className="mb-6">
                <Sparkles className="w-3 h-3 mr-1" />
                {siteConfig.hero.badge}
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-accent text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] tracking-tight mb-6"
            >
              {siteConfig.hero.title.split("\n").map((line, i) => (
                <span key={i} className="block">
                  <span className="text-gradient">{line}</span>
                </span>
              ))}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="font-body text-lg sm:text-xl text-white/60 max-w-xl mx-auto lg:mx-0 mb-8"
            >
              {siteConfig.hero.subtitle}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >
              <a href={siteConfig.hero.cta.href}>
                <Button variant="glow" size="xl" className="group w-full sm:w-auto">
                  {siteConfig.hero.cta.text}
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>
              
              <a href={siteConfig.hero.secondaryCta.href}>
                <Button variant="glitch" size="xl" className="w-full sm:w-auto">
                  {siteConfig.hero.secondaryCta.text}
                </Button>
              </a>
            </motion.div>

            {/* Social Icons */}
            <motion.div
              variants={itemVariants}
              className="flex gap-4 justify-center lg:justify-start mb-12"
            >
              {socialIcons.map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group flex items-center justify-center w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-accent-cyan hover:border-accent-cyan/50 hover:bg-accent-cyan/10 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                  <div className="absolute inset-0 rounded-xl bg-accent-cyan/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.a>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-8 justify-center lg:justify-start"
            >
              {siteConfig.hero.stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="font-display text-3xl sm:text-4xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="font-mono text-xs uppercase tracking-wider text-white/40">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - DNA Helix */}
          <div className="hidden lg:flex justify-center items-center">
            <DNAHelix />
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="relative z-10 mt-auto">
        <TrustBar />
      </div>

      {/* Activity Ticker */}
      <div className="relative z-10">
        <ActivityTicker />
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-void to-transparent" />
    </section>
  )
}
