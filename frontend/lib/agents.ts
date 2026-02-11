// Agent types and interfaces for ClawDNA

export type AgentClass = 'Strategist' | 'Adaptor' | 'Predator' | 'Sentinel'

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary'

export interface Trait {
  name: string
  value: number // 0-100
  dominant: boolean
}

export interface Agent {
  id: string
  name: string
  image: string
  class: AgentClass
  rarity: Rarity
  generation: number
  fitness: number // 0-100
  traits: Trait[]
  dna: string // hex string representing DNA
  owner: {
    address: string
    name?: string
    avatar?: string
  }
  parents?: {
    parentA: string
    parentB: string
  }
  createdAt: Date
  isForSale: boolean
  price?: number // in $CLAWDNA
}

export interface FilterState {
  classes: AgentClass[]
  rarities: Rarity[]
  generationRange: [number, number]
  fitnessRange: [number, number]
  searchQuery: string
  sortBy: 'newest' | 'fitness' | 'generation' | 'rarity'
}

export const RARITY_COLORS: Record<Rarity, string> = {
  Common: '#00f0ff',    // cyan
  Uncommon: '#00ff88',  // green
  Rare: '#ff3366',      // rose
  Epic: '#a855f7',      // purple
  Legendary: '#ffaa00', // amber/gold
}

export const RARITY_WEIGHTS: Record<Rarity, number> = {
  Common: 1,
  Uncommon: 2,
  Rare: 3,
  Epic: 4,
  Legendary: 5,
}

export const CLASS_COLORS: Record<AgentClass, string> = {
  Strategist: '#3b82f6', // blue
  Adaptor: '#a855f7',    // purple
  Predator: '#ff3366',   // rose
  Sentinel: '#00ff88',   // green
}

export const CLASS_DESCRIPTIONS: Record<AgentClass, string> = {
  Strategist: 'Masters of planning and tactical superiority',
  Adaptor: 'Versatile agents that evolve to match any challenge',
  Predator: 'Aggressive hunters optimized for combat',
  Sentinel: 'Defensive specialists with unmatched resilience',
}
