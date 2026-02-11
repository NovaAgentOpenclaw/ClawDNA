"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Dna, Sparkles, Zap, GitBranch } from "lucide-react";
import { Agent } from "../../app/lab/data/mock-agents";
import { AgentSlot } from "./agent-slot";
import { CompatibilityMeter } from "./compatibility-meter";
import { TraitPreview } from "./trait-preview";
import { AgentPickerModal } from "./agent-picker-modal";

interface BreedingInterfaceProps {
  agents: Agent[];
}

export function BreedingInterface({ agents }: BreedingInterfaceProps) {
  const [parentA, setParentA] = useState<Agent | null>(null);
  const [parentB, setParentB] = useState<Agent | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectingFor, setSelectingFor] = useState<"A" | "B" | null>(null);

  const handleSelectAgent = (agent: Agent) => {
    if (selectingFor === "A") {
      setParentA(agent);
    } else if (selectingFor === "B") {
      setParentB(agent);
    }
    setIsPickerOpen(false);
    setSelectingFor(null);
  };

  const openPicker = (slot: "A" | "B") => {
    setSelectingFor(slot);
    setIsPickerOpen(true);
  };

  const clearSlot = (slot: "A" | "B") => {
    if (slot === "A") setParentA(null);
    else setParentB(null);
  };

  const bothParentsSelected = parentA && parentB;

  return (
    <div className="space-y-8">
      {/* Parent Selection Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        {/* Connection Line (desktop only) */}
        <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: bothParentsSelected ? 1 : 0.8, 
              opacity: bothParentsSelected ? 1 : 0.3 
            }}
            className="relative"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#a855f7] to-[#00f0ff] flex items-center justify-center shadow-lg shadow-[#a855f7]/30">
              <Dna className="w-8 h-8 text-white" />
            </div>
            {bothParentsSelected && (
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-[#a855f7] to-[#00f0ff]"
              />
            )}
          </motion.div>
        </div>

        {/* Parent A Slot */}
        <AgentSlot
          label="PARENT A"
          agent={parentA}
          onClick={() => openPicker("A")}
          onClear={() => clearSlot("A")}
          color="cyan"
        />

        {/* Parent B Slot */}
        <AgentSlot
          label="PARENT B"
          agent={parentB}
          onClick={() => openPicker("B")}
          onClear={() => clearSlot("B")}
          color="purple"
        />
      </div>

      {/* DNA Preview Panel */}
      <AnimatePresence mode="wait">
        {bothParentsSelected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative overflow-hidden rounded-2xl border border-[#00f0ff]/20 bg-gradient-to-br from-[#0a0a0f] to-[#12121a]"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00f0ff]/5 via-transparent to-[#a855f7]/5 pointer-events-none" />
            
            {/* Animated DNA Helix Background */}
            <div className="absolute right-0 top-0 w-64 h-full opacity-10 pointer-events-none">
              <svg viewBox="0 0 100 200" className="w-full h-full">
                <motion.path
                  d="M50 0 Q70 25 50 50 Q30 75 50 100 Q70 125 50 150 Q30 175 50 200"
                  stroke="url(#dna-gradient)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.path
                  d="M50 0 Q30 25 50 50 Q70 75 50 100 Q30 125 50 150 Q70 175 50 200"
                  stroke="url(#dna-gradient)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <defs>
                  <linearGradient id="dna-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00f0ff" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="relative p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f0ff] to-[#a855f7] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display uppercase tracking-wide">
                    DNA Preview
                  </h3>
                  <p className="text-sm text-white/50">
                    Predicted offspring traits and probabilities
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Compatibility Meter */}
                <CompatibilityMeter parentA={parentA} parentB={parentB} />

                {/* Trait Preview */}
                <TraitPreview parentA={parentA} parentB={parentB} />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-dashed border-white/10 bg-[#0a0a0f]/50 p-12 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
              <GitBranch className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white/50 font-display uppercase mb-2">
              Select Two Parents
            </h3>
            <p className="text-white/30 max-w-md mx-auto">
              Choose two agents from your collection to preview their DNA compatibility 
              and potential offspring traits
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Bar */}
      <motion.div
        initial={false}
        animate={{ 
          opacity: bothParentsSelected ? 1 : 0.5,
          pointerEvents: bothParentsSelected ? "auto" : "none"
        }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl border border-white/5 bg-[#12121a]/50"
      >
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-white/50">Breeding Cost: </span>
            <span className="text-[#00f0ff] font-bold">
              {bothParentsSelected ? "250 $CLAWDNA" : "—"}
            </span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="text-sm">
            <span className="text-white/50">Your Balance: </span>
            <span className="text-white font-medium">12,450 $CLAWDNA</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!bothParentsSelected}
          className="group relative px-8 py-4 rounded-xl font-display font-bold text-lg uppercase tracking-wider overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00f0ff] to-[#a855f7] opacity-100 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#00f0ff] to-[#a855f7] blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
          
          {/* Button Content */}
          <div className="relative flex items-center gap-3 text-[#0a0a0f]">
            <Zap className="w-5 h-5" />
            <span>Initiate Breeding</span>
          </div>
        </motion.button>
      </motion.div>

      {/* Agent Picker Modal */}
      <AgentPickerModal
        isOpen={isPickerOpen}
        onClose={() => {
          setIsPickerOpen(false);
          setSelectingFor(null);
        }}
        agents={agents}
        onSelectAgent={handleSelectAgent}
        selectedAgent={selectingFor === "A" ? parentA : selectingFor === "B" ? parentB : null}
      />
    </div>
  );
}
