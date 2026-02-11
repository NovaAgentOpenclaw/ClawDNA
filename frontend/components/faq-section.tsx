"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { siteConfig } from "@/config/site"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="faq" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-void via-void-secondary to-void" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-purple/10 rounded-full blur-[200px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="purple" className="mb-4">
            {siteConfig.faq.badge}
          </Badge>
          
          <h2 className="font-display text-4xl sm:text-5xl font-bold">
            <span className="text-white">{siteConfig.faq.title.split(" ")[0]}</span>{" "}
            <span className="text-gradient">{siteConfig.faq.title.split(" ").slice(1).join(" ")}</span>
          </h2>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {siteConfig.faq.items.map((item, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`}
                className="border border-white/5 rounded-xl px-6 bg-white/[0.02] data-[state=open]:border-accent-cyan/30 transition-colors"
              >
                <AccordionTrigger className="font-display text-lg font-bold text-white hover:text-accent-cyan py-6">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="font-body text-white/60 pb-6">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
