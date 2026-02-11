import { Agent, AgentClass, Rarity, Trait } from './agents'

const FIRST_NAMES = [
  'Neo', 'Cyber', 'Quantum', 'Nano', 'Syn', 'Digi', 'Meta', 'Hyper',
  'Ultra', 'Mega', 'Cyber', 'Flux', 'Zenith', 'Apex', 'Prime', 'Core',
  'Vector', 'Matrix', 'Cipher', 'Binary', 'Nexus', 'Helix', 'Genom',
  'Chromo', 'Strand', 'Codex', 'Helios', 'Luna', 'Solar', 'Cosmic',
  'Stellar', 'Nebula', 'Void', 'Abyss', 'Phantom', 'Specter', 'Wraith',
  'Revenant', 'Eidolon', 'Chimera', 'Gorgon', 'Hydra', 'Kraken', 'Leviathan'
]

const LAST_NAMES = [
  'X7', '9K', 'Alpha', 'Omega', 'Prime', 'Max', 'Pro', 'Elite',
  'V2', 'III', 'Zero', 'One', 'Unit', 'Node', 'Link', 'Core',
  'Base', 'Root', 'Seed', 'Spawn', 'Clone', 'Fork', 'Merge',
  'Branch', 'Tag', 'Build', 'Deploy', 'Release', 'Beta', 'Gamma',
  'Delta', 'Sigma', 'Zeta', 'Theta', 'Kappa', 'Lambda', 'Psi'
]

const AGENT_CLASSES: AgentClass[] = ['Strategist', 'Adaptor', 'Predator', 'Sentinel']
const RARITIES: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']

const TRAIT_NAMES = [
  'Intelligence', 'Speed', 'Strength', 'Defense', 'Adaptability',
  'Stealth', 'Endurance', 'Accuracy', 'Evasion', 'Regeneration'
]

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function generateRandomDNA(): string {
  return '0x' + Array.from({ length: 32 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
}

function generateTraits(rarity: Rarity): Trait[] {
  const numTraits = getRandomInt(3, 5)
  const selectedTraits = new Set<string>()
  const traits: Trait[] = []
  
  // Base values based on rarity
  const rarityBonus = {
    Common: 10,
    Uncommon: 20,
    Rare: 30,
    Epic: 40,
    Legendary: 50,
  }[rarity]
  
  while (selectedTraits.size < numTraits) {
    const traitName = getRandomItem(TRAIT_NAMES)
    if (!selectedTraits.has(traitName)) {
      selectedTraits.add(traitName)
      const baseValue = getRandomInt(20, 60)
      const value = Math.min(100, baseValue + rarityBonus + getRandomInt(-10, 20))
      traits.push({
        name: traitName,
        value,
        dominant: Math.random() > 0.5,
      })
    }
  }
  
  return traits
}

function calculateFitness(traits: Trait[], rarity: Rarity): number {
  const avgTraitValue = traits.reduce((sum, t) => sum + t.value, 0) / traits.length
  const rarityMultiplier = {
    Common: 1,
    Uncommon: 1.1,
    Rare: 1.2,
    Epic: 1.3,
    Legendary: 1.5,
  }[rarity]
  
  return Math.min(100, Math.round(avgTraitValue * rarityMultiplier))
}

export function generateMockAgents(count: number = 50): Agent[] {
  const agents: Agent[] = []
  
  for (let i = 0; i < count; i++) {
    const firstName = getRandomItem(FIRST_NAMES)
    const lastName = getRandomItem(LAST_NAMES)
    const rarityRoll = Math.random()
    let rarity: Rarity
    
    // Weighted rarity distribution
    if (rarityRoll > 0.98) rarity = 'Legendary'
    else if (rarityRoll > 0.90) rarity = 'Epic'
    else if (rarityRoll > 0.75) rarity = 'Rare'
    else if (rarityRoll > 0.50) rarity = 'Uncommon'
    else rarity = 'Common'
    
    const agentClass = getRandomItem(AGENT_CLASSES)
    const generation = getRandomInt(0, 8)
    const traits = generateTraits(rarity)
    const fitness = calculateFitness(traits, rarity)
    
    // Generate random avatar URL using dicebear
    const avatarSeed = `${firstName}-${lastName}-${i}`
    const avatarStyle = ['bottts', 'lorelei', 'notionists', 'fun-emoji'][getRandomInt(0, 3)]
    
    const agent: Agent = {
      id: `agent-${1000 + i}`,
      name: `${firstName} ${lastName}`,
      image: `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${avatarSeed}&backgroundColor=0a0a0f`,
      class: agentClass,
      rarity,
      generation,
      fitness,
      traits,
      dna: generateRandomDNA(),
      owner: {
        address: `0x${Array.from({ length: 40 }, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('')}`,
        name: Math.random() > 0.7 ? `User${getRandomInt(1000, 9999)}` : undefined,
      },
      createdAt: new Date(Date.now() - getRandomInt(0, 90) * 24 * 60 * 60 * 1000),
      isForSale: Math.random() > 0.7,
    }
    
    // Add price if for sale
    if (agent.isForSale) {
      const basePrice = {
        Common: 100,
        Uncommon: 250,
        Rare: 600,
        Epic: 1500,
        Legendary: 5000,
      }[rarity]
      agent.price = basePrice + getRandomInt(-basePrice * 0.2, basePrice * 0.5)
    }
    
    // Add parents if generation > 0
    if (generation > 0) {
      agent.parents = {
        parentA: `agent-${getRandomInt(1000, 1000 + i)}`,
        parentB: `agent-${getRandomInt(1000, 1000 + i)}`,
      }
    }
    
    agents.push(agent)
  }
  
  return agents
}

// Export a static set of mock agents
export const MOCK_AGENTS = generateMockAgents(50)
