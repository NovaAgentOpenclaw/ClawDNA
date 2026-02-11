// Mock data for agents collection
export interface Trait {
  name: string;
  value: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
}

export interface Agent {
  id: string;
  name: string;
  generation: number;
  fitness: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  class: string;
  traits: Trait[];
  image?: string;
  breedingCooldown?: number;
}

export const mockAgents: Agent[] = [
  {
    id: "agent-001",
    name: "Neon Genesis",
    generation: 0,
    fitness: 87,
    rarity: "rare",
    class: "Strategist",
    traits: [
      { name: "Intelligence", value: "High", rarity: "rare" },
      { name: "Speed", value: "Medium", rarity: "common" },
      { name: "Adaptability", value: "High", rarity: "epic" },
      { name: "Memory", value: "Photographic", rarity: "legendary" },
    ],
    breedingCooldown: 0,
  },
  {
    id: "agent-002",
    name: "Cyber Predator",
    generation: 1,
    fitness: 92,
    rarity: "epic",
    class: "Predator",
    traits: [
      { name: "Aggression", value: "Extreme", rarity: "epic" },
      { name: "Stealth", value: "High", rarity: "rare" },
      { name: "Reflexes", value: "Lightning", rarity: "legendary" },
      { name: "Stamina", value: "Medium", rarity: "common" },
    ],
    breedingCooldown: 2,
  },
  {
    id: "agent-003",
    name: "Quantum Sentinel",
    generation: 0,
    fitness: 78,
    rarity: "uncommon",
    class: "Sentinel",
    traits: [
      { name: "Defense", value: "High", rarity: "rare" },
      { name: "Alertness", value: "Medium", rarity: "common" },
      { name: "Loyalty", value: "Absolute", rarity: "epic" },
      { name: "Shielding", value: "Basic", rarity: "common" },
    ],
    breedingCooldown: 0,
  },
  {
    id: "agent-004",
    name: "Void Walker",
    generation: 2,
    fitness: 95,
    rarity: "legendary",
    class: "Adaptor",
    traits: [
      { name: "Teleportation", value: "Master", rarity: "mythic" },
      { name: "Camouflage", value: "Perfect", rarity: "legendary" },
      { name: "Intelligence", value: "Genius", rarity: "legendary" },
      { name: "Speed", value: "Warp", rarity: "mythic" },
    ],
    breedingCooldown: 5,
  },
  {
    id: "agent-005",
    name: "Binary Phantom",
    generation: 1,
    fitness: 82,
    rarity: "rare",
    class: "Strategist",
    traits: [
      { name: "Hacking", value: "Advanced", rarity: "rare" },
      { name: "Stealth", value: "High", rarity: "rare" },
      { name: "Logic", value: "Perfect", rarity: "epic" },
      { name: "Creativity", value: "Low", rarity: "common" },
    ],
    breedingCooldown: 1,
  },
  {
    id: "agent-006",
    name: "Neon Fury",
    generation: 3,
    fitness: 88,
    rarity: "epic",
    class: "Predator",
    traits: [
      { name: "Strength", value: "Superior", rarity: "epic" },
      { name: "Rage", value: "Controlled", rarity: "rare" },
      { name: "Tactics", value: "Advanced", rarity: "rare" },
      { name: "Endurance", value: "High", rarity: "uncommon" },
    ],
    breedingCooldown: 3,
  },
  {
    id: "agent-007",
    name: "Data Wraith",
    generation: 0,
    fitness: 75,
    rarity: "common",
    class: "Adaptor",
    traits: [
      { name: "Learning", value: "Fast", rarity: "uncommon" },
      { name: "Memory", value: "Good", rarity: "common" },
      { name: "Analysis", value: "Standard", rarity: "common" },
      { name: "Intuition", value: "Basic", rarity: "common" },
    ],
    breedingCooldown: 0,
  },
  {
    id: "agent-008",
    name: "Crimson Guardian",
    generation: 2,
    fitness: 90,
    rarity: "epic",
    class: "Sentinel",
    traits: [
      { name: "Protection", value: "Master", rarity: "legendary" },
      { name: "Vitality", value: "High", rarity: "rare" },
      { name: "Aura", value: "Healing", rarity: "epic" },
      { name: "Resistance", value: "Elemental", rarity: "rare" },
    ],
    breedingCooldown: 4,
  },
  {
    id: "agent-009",
    name: "Mythic Architect",
    generation: 4,
    fitness: 98,
    rarity: "mythic",
    class: "Strategist",
    traits: [
      { name: "Creation", value: "Divine", rarity: "mythic" },
      { name: "Wisdom", value: "Ancient", rarity: "mythic" },
      { name: "Foresight", value: "Perfect", rarity: "legendary" },
      { name: "Charisma", value: "Magnetic", rarity: "epic" },
    ],
    breedingCooldown: 7,
  },
  {
    id: "agent-010",
    name: "Shadow Stalker",
    generation: 1,
    fitness: 85,
    rarity: "rare",
    class: "Predator",
    traits: [
      { name: "Tracking", value: "Expert", rarity: "rare" },
      { name: "Silence", value: "Absolute", rarity: "epic" },
      { name: "Precision", value: "Surgical", rarity: "rare" },
      { name: "Patience", value: "Infinite", rarity: "uncommon" },
    ],
    breedingCooldown: 2,
  },
];

export const rarityColors = {
  common: "#00f0ff",
  uncommon: "#00ff88",
  rare: "#ff3366",
  epic: "#a855f7",
  legendary: "#ffaa00",
  mythic: "#ffd700",
};

export const rarityGradients = {
  common: "from-[#00f0ff]/20 to-[#00f0ff]/5",
  uncommon: "from-[#00ff88]/20 to-[#00ff88]/5",
  rare: "from-[#ff3366]/20 to-[#ff3366]/5",
  epic: "from-[#a855f7]/20 to-[#a855f7]/5",
  legendary: "from-[#ffaa00]/20 to-[#ffaa00]/5",
  mythic: "from-[#ffd700]/20 to-[#ffd700]/5",
};

export const classColors: Record<string, string> = {
  Strategist: "#00f0ff",
  Predator: "#ff3366",
  Sentinel: "#00ff88",
  Adaptor: "#a855f7",
};

// Calculate compatibility between two agents
export function calculateCompatibility(parentA: Agent | null, parentB: Agent | null): number {
  if (!parentA || !parentB) return 0;
  
  let score = 50; // Base compatibility
  
  // Same class bonus/penalty
  if (parentA.class === parentB.class) {
    score += 10; // Bonus for same class
  } else {
    score += 20; // Higher bonus for diverse classes
  }
  
  // Generation gap penalty
  const genDiff = Math.abs(parentA.generation - parentB.generation);
  score -= genDiff * 5;
  
  // Fitness average contribution
  const avgFitness = (parentA.fitness + parentB.fitness) / 2;
  score += (avgFitness - 50) * 0.3;
  
  // Rarity bonus
  const rarityBonus = {
    common: 0,
    uncommon: 2,
    rare: 5,
    epic: 8,
    legendary: 12,
    mythic: 15,
  };
  score += rarityBonus[parentA.rarity] + rarityBonus[parentB.rarity];
  
  // Clamp between 0 and 100
  return Math.min(100, Math.max(0, Math.round(score)));
}

// Calculate mutation chance
export function calculateMutationChance(parentA: Agent | null, parentB: Agent | null): number {
  if (!parentA || !parentB) return 0;
  
  let chance = 5; // Base 5%
  
  // Higher rarity = higher mutation chance
  const rarityMultiplier = {
    common: 1,
    uncommon: 1.2,
    rare: 1.5,
    epic: 2,
    legendary: 3,
    mythic: 5,
  };
  
  chance *= (rarityMultiplier[parentA.rarity] + rarityMultiplier[parentB.rarity]) / 2;
  
  // Generation factor
  const avgGen = (parentA.generation + parentB.generation) / 2;
  chance += avgGen * 0.5;
  
  return Math.min(50, Math.round(chance * 10) / 10);
}

// Calculate breeding cost
export function calculateBreedingCost(parentA: Agent | null, parentB: Agent | null): number {
  if (!parentA || !parentB) return 0;
  
  let cost = 100; // Base cost
  
  // Generation cost increase
  const avgGen = (parentA.generation + parentB.generation) / 2;
  cost += avgGen * 25;
  
  // Rarity cost
  const rarityCost = {
    common: 0,
    uncommon: 25,
    rare: 50,
    epic: 100,
    legendary: 200,
    mythic: 500,
  };
  cost += rarityCost[parentA.rarity] + rarityCost[parentB.rarity];
  
  return Math.round(cost);
}

// Predict offspring rarity
export function predictOffspringRarity(parentA: Agent | null, parentB: Agent | null): {
  rarity: string;
  probability: number;
} {
  if (!parentA || !parentB) return { rarity: "-", probability: 0 };
  
  const rarities = ["common", "uncommon", "rare", "epic", "legendary", "mythic"];
  const parentAIndex = rarities.indexOf(parentA.rarity);
  const parentBIndex = rarities.indexOf(parentB.rarity);
  const avgIndex = Math.round((parentAIndex + parentBIndex) / 2);
  
  // Mutation can increase rarity
  const mutationChance = calculateMutationChance(parentA, parentB);
  const predictedIndex = Math.min(rarities.length - 1, avgIndex + (Math.random() > 0.5 ? 1 : 0));
  
  return {
    rarity: rarities[predictedIndex],
    probability: Math.round(60 + Math.random() * 30),
  };
}
