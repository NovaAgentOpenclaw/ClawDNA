"use client";

import { motion } from "framer-motion";
import { Shuffle, TrendingUp, Award } from "lucide-react";
import { Agent, predictOffspringRarity, rarityColors } from "../../app/lab/data/mock-agents";

interface TraitPreviewProps {
  parentA: Agent;
  parentB: Agent;
}

export function TraitPreview({ parentA, parentB }: TraitPreviewProps) {
  const prediction = predictOffspringRarity(parentA, parentB);
  
  // Combine and deduplicate traits
  const allTraits = [...parentA.traits, ...parentB.traits];
  const uniqueTraits = allTraits.reduce((acc, trait) => {
    if (!acc.find(t => t.name === trait.name)) {
      acc.push(trait);
    }
    return acc;
  }, [] as typeof allTraits);

  // Calculate inheritance probability for each trait
  const traitProbabilities = uniqueTraits.map(trait => {
    const fromParentA = parentA.traits.find(t => t.name === trait.name);
    const fromParentB = parentB.traits.find(t => t.name === trait.name);
    
    let probability = 50;
    let source: "A" | "B" | "both" = "both";
    
    if (fromParentA && fromParentB) {
      // Both parents have it - higher chance
      probability = 85;
      source = "both";
    } else if (fromParentA) {
      // Only parent A has it
      probability = 60;
      source = "A";
    } else if (fromParentB) {
      // Only parent B has it
      probability = 60;
      source = "B";
    }
    
    return {
      ...trait,
      probability,
      source,
      dominant: fromParentA?.rarity === "legendary" || fromParentA?.rarity === "mythic" ||
                fromParentB?.rarity === "legendary" || fromParentB?.rarity === "mythic"
    };
  }).slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Predicted Rarity */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#ffd700]/10 to-transparent border border-[#ffd700]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#ffd700]/20 flex items-center justify-center">
            <Award className="w-5 h-5 text-[#ffd700]" />
          </div>
          <div>
            <span className="text-xs text-white/50 uppercase tracking-wider">Predicted Rarity</span>
            <div className="flex items-baseline gap-2">
              <span 
                className="text-xl font-bold font-display capitalize"
                style={{ color: rarityColors[prediction.rarity as keyof typeof rarityColors] || "#fff" }}
              >
                {prediction.rarity}
              </span>
              <span className="text-sm text-white/40">({prediction.probability}% confidence)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trait Inheritance */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/5">
        <div className="flex items-center gap-2 mb-4">
          <Shuffle className="w-4 h-4 text-[#00f0ff]" />
          <span className="text-xs text-white/50 uppercase tracking-wider">Trait Inheritance</span>
        </div>

        <div className="space-y-3">
          {traitProbabilities.map((trait, index) => (
            <motion.div
              key={trait.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/70">{trait.name}</span>
                  {trait.dominant && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00ff88]/20 text-[#00ff88]">
                      DOMINANT
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/40">{trait.probability}%</span>
                  <div className="flex gap-0.5">
                    {trait.source === "A" || trait.source === "both" ? (
                      <div className="w-2 h-2 rounded-full bg-[#00f0ff]" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white/10" />
                    )}
                    {trait.source === "B" || trait.source === "both" ? (
                      <div className="w-2 h-2 rounded-full bg-[#a855f7]" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white/10" />
                    )}
                  </div>
                </div>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${trait.probability}%` }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="h-full rounded-full relative"
                  style={{ 
                    background: trait.source === "A" 
                      ? "#00f0ff" 
                      : trait.source === "B" 
                        ? "#a855f7" 
                        : "linear-gradient(90deg, #00f0ff, #a855f7)"
                  }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fitness Prediction */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-[#00ff88]" />
          <span className="text-xs text-white/50 uppercase tracking-wider">Predicted Fitness Range</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-white/30 mb-2">
              <span>Parent Avg: {Math.round((parentA.fitness + parentB.fitness) / 2)}</span>
              <span>Potential: {Math.round((parentA.fitness + parentB.fitness) / 2 + 15)}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden relative">
              {/* Parent markers */}
              <div 
                className="absolute top-0 w-0.5 h-full bg-white/50 z-10"
                style={{ left: `${parentA.fitness}%` }}
              />
              <div 
                className="absolute top-0 w-0.5 h-full bg-white/50 z-10"
                style={{ left: `${parentB.fitness}%` }}
              />
              
              {/* Prediction range */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute h-full rounded-full"
                style={{
                  left: `${Math.round((parentA.fitness + parentB.fitness) / 2) - 10}%`,
                  width: "20%",
                  background: "linear-gradient(90deg, #00ff8830, #00ff88, #00ff8830)"
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
