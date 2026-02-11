"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Dna, Zap, Microscope, GitBranch } from "lucide-react";
import { mockAgents } from "./data/mock-agents";
import { BreedingInterface } from "@/components/lab/breeding-interface";

// Tab configuration
const tabs = [
  { id: "breed", label: "BREED", icon: Dna, description: "Combine DNA to create new agents" },
  { id: "evolve", label: "EVOLVE", icon: Zap, description: "Submit agents to evolution challenges" },
  { id: "simulate", label: "SIMULATE", icon: Microscope, description: "Preview DNA combinations" },
  { id: "lineage", label: "LINEAGE", icon: GitBranch, description: "View ancestry and breeding history" },
];

export default function LabPage() {
  const [activeTab, setActiveTab] = useState("breed");

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#00f0ff]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#a855f7]/5 rounded-full blur-[150px]" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 240, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 240, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Scan Lines */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl sm:text-5xl font-bold font-accent uppercase tracking-tight"
                  >
                    <span className="bg-gradient-to-r from-[#00f0ff] to-[#a855f7] bg-clip-text text-transparent">
                      THE LAB
                    </span>
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/50 mt-2 text-lg"
                  >
                    Where DNA meets destiny. Breed, evolve, and create legends.
                  </motion.p>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                  <span className="text-sm text-white/70">12,450</span>
                  <span className="text-sm text-white/40">$CLAWDNA</span>
                </motion.div>
              </div>
            </div>

            {/* Tab Navigation */}
            <nav className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <motion.button
                    key={tab.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-2 px-4 py-4 font-display font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
                      isActive ? 'text-white' : 'text-white/40 hover:text-white/70'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00f0ff] to-[#a855f7]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "breed" && (
              <BreedingInterface agents={mockAgents} />
            )}
            
            {activeTab === "evolve" && (
              <div className="text-center py-24">
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[#00f0ff]/20 to-[#a855f7]/20 flex items-center justify-center">
                  <Zap className="w-12 h-12 text-[#00f0ff]" />
                </div>
                <h2 className="text-3xl font-bold text-white font-display uppercase mb-4">Evolution Challenges</h2>
                <p className="text-white/50 max-w-md mx-auto mb-8">
                  Submit your agents to rigorous challenges and watch them evolve. 
                  The fittest survive, the strongest thrive.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ffaa00]/10 border border-[#ffaa00]/20 text-[#ffaa00] text-sm">
                  <span>Coming Soon</span>
                </div>
              </div>
            )}
            
            {activeTab === "simulate" && (
              <div className="text-center py-24">
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[#00f0ff]/20 to-[#a855f7]/20 flex items-center justify-center">
                  <Microscope className="w-12 h-12 text-[#a855f7]" />
                </div>
                <h2 className="text-3xl font-bold text-white font-display uppercase mb-4">DNA Simulator</h2>
                <p className="text-white/50 max-w-md mx-auto mb-8">
                  Experiment with DNA combinations without spending tokens. 
                  Perfect your breeding strategy before committing.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ffaa00]/10 border border-[#ffaa00]/20 text-[#ffaa00] text-sm">
                  <span>Coming Soon</span>
                </div>
              </div>
            )}
            
            {activeTab === "lineage" && (
              <div className="text-center py-24">
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[#00f0ff]/20 to-[#a855f7]/20 flex items-center justify-center">
                  <GitBranch className="w-12 h-12 text-[#00ff88]" />
                </div>
                <h2 className="text-3xl font-bold text-white font-display uppercase mb-4">Your Lineage</h2>
                <p className="text-white/50 max-w-md mx-auto mb-8">
                  Trace your breeding history through an interactive family tree. 
                  See how your agents evolved across generations.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ffaa00]/10 border border-[#ffaa00]/20 text-[#ffaa00] text-sm">
                  <span>Coming Soon</span>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
