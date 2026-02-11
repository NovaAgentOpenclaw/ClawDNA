"use client";

import { motion } from "framer-motion";
import { Heart, Zap, Sparkles } from "lucide-react";
import { Agent, calculateCompatibility, calculateMutationChance, calculateBreedingCost } from "../../app/lab/data/mock-agents";

interface CompatibilityMeterProps {
  parentA: Agent;
  parentB: Agent;
}

export function CompatibilityMeter({ parentA, parentB }: CompatibilityMeterProps) {
  const compatibility = calculateCompatibility(parentA, parentB);
  const mutationChance = calculateMutationChance(parentA, parentB);
  const breedingCost = calculateBreedingCost(parentA, parentB);

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return "#00ff88";
    if (score >= 60) return "#00f0ff";
    if (score >= 40) return "#ffaa00";
    return "#ff3366";
  };

  const getCompatibilityLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  const color = getCompatibilityColor(compatibility);
  const label = getCompatibilityLabel(compatibility);

  return (
    <div className="space-y-6">
      {/* Compatibility Score */}
      <div className="text-center p-6 rounded-xl bg-white/5 border border-white/5">
        <div className="relative inline-flex items-center justify-center mb-4">
          {/* Background Circle */}
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-white/5"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              stroke={color}
              strokeWidth="8"
              fill="transparent"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 351.86" }}
              animate={{ strokeDasharray: `${(compatibility / 100) * 351.86} 351.86` }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                filter: `drop-shadow(0 0 10px ${color}50)`
              }}
            />
          </svg>
          
          {/* Score */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-bold font-display"
              style={{ color }}
            >
              {compatibility}%
            </motion.span>
            <span className="text-xs text-white/40 uppercase tracking-wider mt-1">Match</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Heart className="w-4 h-4" style={{ color }} />
          <span className="text-sm font-medium" style={{ color }}>
            {label} Compatibility
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Mutation Chance */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#a855f7]" />
            <span className="text-xs text-white/50 uppercase tracking-wider">Mutation</span>
          </div>
          <div className="flex items-baseline gap-1">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold text-[#a855f7] font-display"
            >
              {mutationChance}%
            </motion.span>
          </div>
          <p className="text-xs text-white/30 mt-1">Chance of new traits</p>
        </div>

        {/* Breeding Cost */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-[#00f0ff]" />
            <span className="text-xs text-white/50 uppercase tracking-wider">Cost</span>
          </div>
          <div className="flex items-baseline gap-1">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold text-[#00f0ff] font-display"
            >
              {breedingCost}
            </motion.span>
            <span className="text-xs text-white/50">$DNA</span>
          </div>
          <p className="text-xs text-white/30 mt-1">Required to breed</p>
        </div>
      </div>

      {/* Class Compatibility */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/5">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Class Synergy</h4>
        <div className="flex items-center gap-3">
          <span 
            className="px-3 py-1.5 rounded-lg text-sm font-medium"
            style={{ 
              color: parentA.class === "Strategist" ? "#00f0ff" : 
                     parentA.class === "Predator" ? "#ff3366" :
                     parentA.class === "Sentinel" ? "#00ff88" : "#a855f7",
              background: "rgba(255,255,255,0.05)"
            }}
          >
            {parentA.class}
          </span>
          <span className="text-white/20">×</span>
          <span 
            className="px-3 py-1.5 rounded-lg text-sm font-medium"
            style={{ 
              color: parentB.class === "Strategist" ? "#00f0ff" : 
                     parentB.class === "Predator" ? "#ff3366" :
                     parentB.class === "Sentinel" ? "#00ff88" : "#a855f7",
              background: "rgba(255,255,255,0.05)"
            }}
          >
            {parentB.class}
          </span>
        </div>
        <p className="text-xs text-white/30 mt-3">
          {parentA.class === parentB.class 
            ? "Same class increases trait inheritance consistency"
            : "Different classes may produce hybrid traits with unique abilities"
          }
        </p>
      </div>
    </div>
  );
}
