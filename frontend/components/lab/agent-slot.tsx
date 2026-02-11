"use client";

import { motion } from "framer-motion";
import { Plus, X, Dna } from "lucide-react";
import { Agent, rarityColors } from "../../app/lab/data/mock-agents";

interface AgentSlotProps {
  label: string;
  agent: Agent | null;
  onClick: () => void;
  onClear: () => void;
  color: "cyan" | "purple";
}

export function AgentSlot({ label, agent, onClick, onClear, color }: AgentSlotProps) {
  const accentColor = color === "cyan" ? "#00f0ff" : "#a855f7";
  const glowColor = color === "cyan" ? "rgba(0, 240, 255, 0.3)" : "rgba(168, 85, 247, 0.3)";

  return (
    <motion.div
      whileHover={!agent ? { scale: 1.01 } : {}}
      className="relative"
    >
      {/* Label */}
      <div className="flex items-center justify-between mb-3">
        <span 
          className="text-xs font-display font-bold uppercase tracking-widest"
          style={{ color: accentColor }}
        >
          {label}
        </span>
        {agent && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-3 h-3 text-white/70" />
          </motion.button>
        )}
      </div>

      {/* Slot */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: agent ? 1 : 1.02 }}
        whileTap={{ scale: agent ? 1 : 0.98 }}
        className="w-full relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 group"
        style={{
          borderColor: agent ? accentColor : "rgba(255, 255, 255, 0.1)",
          borderStyle: agent ? "solid" : "dashed",
          background: agent 
            ? `linear-gradient(135deg, ${accentColor}08, transparent)`
            : "rgba(255, 255, 255, 0.02)",
          boxShadow: agent ? `0 0 30px ${glowColor}` : "none",
        }}
      >
        {agent ? (
          // Agent Selected State
          <div className="p-5 text-left">
            <div className="flex items-start gap-4">
              {/* Agent Avatar */}
              <div 
                className="w-20 h-20 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0"
                style={{ 
                  background: `linear-gradient(135deg, ${rarityColors[agent.rarity]}20, transparent)`,
                  border: `1px solid ${rarityColors[agent.rarity]}40`
                }}
              >
                <Dna className="w-10 h-10" style={{ color: rarityColors[agent.rarity] }} />
                
                {/* Rarity Glow */}
                <div 
                  className="absolute inset-0 opacity-50"
                  style={{
                    background: `radial-gradient(circle at center, ${rarityColors[agent.rarity]}30, transparent 70%)`
                  }}
                />
              </div>

              {/* Agent Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-lg font-bold text-white truncate font-display">
                    {agent.name}
                  </h4>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <span 
                    className="text-xs font-medium px-2 py-0.5 rounded-full uppercase"
                    style={{ 
                      color: rarityColors[agent.rarity],
                      background: `${rarityColors[agent.rarity]}20`
                    }}
                  >
                    {agent.rarity}
                  </span>
                  <span className="text-xs text-white/40">
                    Gen {agent.generation}
                  </span>
                </div>

                {/* Stats */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40 w-14">Fitness</span>
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${agent.fitness}%` }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="h-full rounded-full"
                        style={{ background: accentColor }}
                      />
                    </div>
                    <span className="text-xs text-white/60 w-8 text-right">{agent.fitness}</span>
                  </div>
                </div>

                {/* Class */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-white/30">Class:</span>
                  <span className="text-xs text-white/70">{agent.class}</span>
                </div>
              </div>
            </div>

            {/* Traits Preview */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex flex-wrap gap-2">
                {agent.traits.slice(0, 3).map((trait, i) => (
                  <span 
                    key={i}
                    className="text-xs px-2 py-1 rounded bg-white/5 text-white/50"
                  >
                    {trait.name}: {trait.value}
                  </span>
                ))}
                {agent.traits.length > 3 && (
                  <span className="text-xs px-2 py-1 rounded bg-white/5 text-white/30">
                    +{agent.traits.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Empty State
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center"
              style={{ background: `${accentColor}10` }}
            >
              <Plus className="w-8 h-8" style={{ color: accentColor }} />
            </motion.div>
            <p className="text-white/40 font-medium mb-1">Select an Agent</p>
            <p className="text-white/20 text-sm">Click to choose from your collection</p>
          </div>
        )}

        {/* Hover Border Effect */}
        {!agent && (
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{
              border: `2px solid ${accentColor}`,
              boxShadow: `inset 0 0 20px ${glowColor}`
            }}
          />
        )}
      </motion.button>

      {/* Corner Accents */}
      <div 
        className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 rounded-tl-lg"
        style={{ borderColor: accentColor, opacity: agent ? 1 : 0.3 }}
      />
      <div 
        className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 rounded-br-lg"
        style={{ borderColor: accentColor, opacity: agent ? 1 : 0.3 }}
      />
    </motion.div>
  );
}
