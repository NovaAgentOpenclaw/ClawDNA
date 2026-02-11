"use client"

import { motion } from "framer-motion"
import { siteConfig } from "@/config/site"
import { Dna, Github, Twitter, MessageCircle } from "lucide-react"

export function Footer() {
  const socialIcons = {
    GitHub: Github,
    Twitter: Twitter,
    Discord: MessageCircle,
  }

  return (
    <footer className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-void" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <motion.a
              href="#"
              className="inline-flex items-center gap-2 mb-6 group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative w-10 h-10 flex items-center justify-center">
                <Dna className="w-8 h-8 text-accent-cyan transition-all duration-300 group-hover:text-accent-purple" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                <span className="text-white">Claw</span>
                <span className="text-accent-cyan">DNA</span>
              </span>
            </motion.a>
            
            <p className="font-display text-3xl font-bold text-white/90 mb-4">
              {siteConfig.footer.tagline}
            </p>
            
            <p className="font-body text-white/50 max-w-sm">
              {siteConfig.description}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-mono text-sm uppercase tracking-wider text-white/40 mb-6">Resources</h4>
            <ul className="space-y-4">
              {siteConfig.footer.links.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="font-body text-white/70 hover:text-accent-cyan transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-mono text-sm uppercase tracking-wider text-white/40 mb-6">Legal</h4>
            <ul className="space-y-4">
              {siteConfig.footer.legal.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="font-body text-white/70 hover:text-accent-cyan transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-mono text-sm text-white/40">
            {siteConfig.footer.copyright}
          </p>
          
          <div className="flex items-center gap-4">
            {Object.entries(socialIcons).map(([name, Icon]) => (
              <motion.a
                key={name}
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-accent-cyan hover:border-accent-cyan/30 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
