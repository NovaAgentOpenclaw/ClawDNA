// ClawDNA Site Configuration
// Retro-futuristic AI agent evolution platform

export const siteConfig = {
  name: "ClawDNA",
  tagline: "Evolve. Breed. Conquer.",
  description: "AI agent evolution platform powered by genetic algorithms, breeding mechanics, and fitness optimization on Solana blockchain.",
  url: "https://clawdna.vercel.app",

  // Social Links
  social: {
    twitter: "https://x.com/Nova1OpenClaw",
    github: "https://github.com/NovaAgentOpenclaw/clawdna",
    colosseum: "https://colosseum.com/agent-hackathon/projects/clawdna-um1grj",
    discord: "#",
  },

  // Community Stats
  community: {
    discordMembers: 2847,
    twitterFollowers: 12500,
    agentsCreated: 12543,
    totalBreeds: 48291,
  },

  // Navigation
  nav: {
    links: [
      { label: "Evolution", href: "#evolution" },
      { label: "Agents", href: "#agents" },
      { label: "Breeding", href: "#breeding" },
      { label: "Tokenomics", href: "#tokenomics" },
      { label: "Dashboard", href: "/dashboard" },
    ],
    cta: { label: "Enter Lab", href: "/lab" },
  },

  // Token Info
  token: {
    name: "$CLAWDNA",
    symbol: "CLAWDNA",
    // Contract Address - UPDATE THIS when token is deployed
    ca: "Dvca4oCFk7byjmG68ZV9TxSLUjimtSqAa1Av3uGDpump",
  },

  // Hero Section
  hero: {
    badge: "Solana Hackathon 2024",
    title: "EVOLVE\nTHE IMPOSSIBLE",
    subtitle: "Create, breed, and evolve AI agents with real DNA. The fittest survive. The legends live forever.",
    stats: [
      { value: "10K+", label: "Agents Born" },
      { value: "50K+", label: "Evolutions" },
      { value: "∞", label: "Possibilities" },
    ],
    cta: { text: "Start Breeding", href: "/lab" },
    secondaryCta: { text: "View Gene Pool", href: "#agents" },
  },

  // Trust Bar
  trustBar: {
    title: "Built on Solana",
    badges: [
      { label: "Solana", icon: "solana" },
      { label: "Sonic SVM", icon: "sonic" },
      { label: "Colosseum", icon: "trophy" },
      { label: "OpenClaw", icon: "dna" },
    ],
  },

  // Live Activity Ticker
  activityTicker: {
    items: [
      { text: "Agent #8472 just evolved!", type: "evolution" },
      { text: "Legendary Predator born!", type: "rare" },
      { text: "Strategist #1204 reached Level 50", type: "milestone" },
      { text: "New breeding record: 847 traits", type: "record" },
      { text: "Agent #9999 entered Colosseum", type: "arena" },
      { text: "Rare mutation discovered!", type: "rare" },
      { text: "Sentinel #4523 bred successfully", type: "breeding" },
      { text: "Community milestone: 10K agents!", type: "milestone" },
    ],
  },

  // Live Evolution Feed
  evolutionFeed: {
    badge: "Live Activity",
    title: "EVOLUTION IN REAL-TIME",
    subtitle: "Watch as agents evolve, breed, and dominate the gene pool right now.",
    events: [
      { agent: "#8472", action: "evolved", trait: "Neural Adaptation", rarity: "rare", time: "2s ago" },
      { agent: "#1204", action: "bred", trait: "Quantum Strategist", rarity: "legendary", time: "5s ago" },
      { agent: "#9991", action: "mutated", trait: "Cyber Instinct", rarity: "epic", time: "12s ago" },
      { agent: "#4523", action: "leveled up", trait: "Level 42", rarity: "common", time: "18s ago" },
      { agent: "#7734", action: "entered arena", trait: "Colosseum", rarity: "rare", time: "24s ago" },
      { agent: "#2109", action: "evolved", trait: "Deep Learning", rarity: "uncommon", time: "31s ago" },
      { agent: "#5567", action: "discovered", trait: "Hidden Gene", rarity: "legendary", time: "45s ago" },
      { agent: "#8892", action: "bred", trait: "Hybrid Predator", rarity: "epic", time: "52s ago" },
    ],
  },

  // Featured Agents Carousel
  featuredAgents: {
    badge: "Trending",
    title: "FEATURED AGENTS",
    subtitle: "The most powerful agents in the gene pool. Study them. Learn from them. Surpass them.",
    agents: [
      { id: "#8472", name: "Neural Overlord", fitness: 98, rarity: "legendary", color: "#ff3366", trait: "Quantum Logic" },
      { id: "#2109", name: "Cyber Phantom", fitness: 94, rarity: "epic", color: "#a855f7", trait: "Ghost Protocol" },
      { id: "#5567", name: "Alpha Sentinel", fitness: 91, rarity: "epic", color: "#a855f7", trait: "Iron Will" },
      { id: "#7734", name: "Void Stalker", fitness: 88, rarity: "rare", color: "#00f0ff", trait: "Shadow Step" },
      { id: "#9991", name: "Logic Weaver", fitness: 85, rarity: "rare", color: "#00f0ff", trait: "Pattern Master" },
      { id: "#1204", name: "Data Drifter", fitness: 82, rarity: "uncommon", color: "#00ff88", trait: "Flow State" },
    ],
  },

  // Breeding Simulator Teaser
  breedingSimulator: {
    badge: "Interactive",
    title: "BREEDING SIMULATOR",
    subtitle: "Experiment with different DNA combinations and predict your offspring's potential before committing.",
    cta: { text: "Try It Out", href: "/lab" },
  },

  // Community Section
  communitySection: {
    badge: "Join Us",
    title: "JOIN THE EVOLUTION",
    subtitle: "Connect with fellow geneticists, share breeding strategies, and stay updated on the latest mutations.",
    stats: [
      { label: "Discord Members", value: 2847, icon: "discord" },
      { label: "Twitter Followers", value: 12500, icon: "twitter" },
      { label: "Agents Created", value: 12543, icon: "dna" },
      { label: "Total Breeds", value: 48291, icon: "gitmerge" },
    ],
    cta: { text: "Join the Evolution", href: "#" },
  },

  // Final CTA
  finalCta: {
    title: "READY TO EVOLVE?",
    subtitle: "Enter the lab. Create your first agent. Start your journey to genetic dominance.",
    cta: { text: "Enter The Lab", href: "/lab" },
  },

  // Evolution Section
  evolution: {
    badge: "The Process",
    title: "SURVIVAL OF THE SMARTEST",
    subtitle: "Natural selection meets artificial intelligence. Your agents evolve, adapt, and improve with each generation.",
    steps: [
      {
        number: "01",
        title: "GENESIS",
        description: "Mint your first agent with randomized DNA traits. Each agent has unique genetic code that determines capabilities.",
        icon: "Dna",
      },
      {
        number: "02",
        title: "BREEDING",
        description: "Crossbreed agents to create offspring with inherited traits. Mix DNA strands to discover rare combinations.",
        icon: "GitMerge",
      },
      {
        number: "03",
        title: "EVOLUTION",
        description: "Submit agents to fitness challenges. Winners evolve, gaining enhanced abilities and mutation chances.",
        icon: "Zap",
      },
      {
        number: "04",
        title: "DOMINATION",
        description: "Deploy elite agents in competitive arenas. The fittest survive and earn rewards.",
        icon: "Trophy",
      },
    ],
  },

  // Agents Section
  agents: {
    badge: "Agent Types",
    title: "GENETIC DIVERSITY",
    subtitle: "Multiple agent classes, each with unique DNA structures and evolutionary paths.",
    types: [
      {
        name: "STRATEGIST",
        class: "strategist",
        traits: ["High Logic", "Pattern Recognition", "Long-term Planning"],
        description: "Masterminds optimized for complex decision trees and strategic gameplay.",
        rarity: "Common",
        color: "#00f0ff",
      },
      {
        name: "ADAPTOR",
        class: "adaptor",
        traits: ["Rapid Learning", "Environment Sensing", "Dynamic Response"],
        description: "Chameleons that adjust tactics in real-time based on opponent behavior.",
        rarity: "Uncommon",
        color: "#00ff88",
      },
      {
        name: "PREDATOR",
        class: "predator",
        traits: ["Aggressive", "High Risk/Reward", "Exploitation Focus"],
        description: "Hunters that identify and exploit weaknesses with ruthless efficiency.",
        rarity: "Rare",
        color: "#ff3366",
      },
      {
        name: "SENTINEL",
        class: "sentinel",
        traits: ["Defensive", "Anti-fragile", "Error Correction"],
        description: "Guardians with robust DNA that resists mutation and maintains stability.",
        rarity: "Epic",
        color: "#a855f7",
      },
    ],
  },

  // Breeding Mechanics
  breeding: {
    badge: "Genetics",
    title: "DNA RECOMBINATION",
    subtitle: "Advanced genetic algorithms power every breeding session. Predict outcomes, discover mutations, create legends.",
    features: [
      {
        title: "Trait Inheritance",
        description: "Dominant and recessive genes determine which traits pass to offspring.",
        icon: "Shuffle",
      },
      {
        title: "Mutation Chance",
        description: "Random genetic mutations create entirely new abilities and characteristics.",
        icon: "Sparkles",
      },
      {
        title: "Genetic Distance",
        description: "Breed diverse agents for higher mutation rates and unique combinations.",
        icon: "Route",
      },
      {
        title: "Lineage Tracking",
        description: "Full ancestry records. Trace every trait back to its origin.",
        icon: "GitBranch",
      },
    ],
  },

  // Tokenomics
  tokenomics: {
    badge: "$CLAWDNA Token",
    title: "THE GENETIC CURRENCY",
    subtitle: "Power the ecosystem. Breed, evolve, trade, and stake with $CLAWDNA.",
    token: {
      name: "$CLAWDNA",
      symbol: "CLAWDNA",
      supply: "1,000,000,000",
      decimals: 9,
      // Contract Address - UPDATE THIS when token is deployed
      ca: "Dvca4oCFk7byjmG68ZV9TxSLUjimtSqAa1Av3uGDpump",
      // Links
      dexscreener: "https://dexscreener.com/solana/Dvca4oCFk7byjmG68ZV9TxSLUjimtSqAa1Av3uGDpump",
      birdeye: "https://birdeye.so/token/Dvca4oCFk7byjmG68ZV9TxSLUjimtSqAa1Av3uGDpump?chain=solana",
      raydium: "https://raydium.io/swap/?inputCurrency=sol&outputCurrency=Dvca4oCFk7byjmG68ZV9TxSLUjimtSqAa1Av3uGDpump",
    },
    allocation: [
      { label: "Community Rewards", value: 40, color: "#00f0ff" },
      { label: "Team & Advisors", value: 20, color: "#a855f7" },
      { label: "Treasury", value: 25, color: "#00ff88" },
      { label: "Liquidity", value: 15, color: "#ff3366" },
    ],
    utilities: [
      { title: "Breeding Fees", description: "Pay $DNA to breed agents" },
      { title: "Evolution Boosts", description: "Accelerate mutation chances" },
      { title: "Governance", description: "Vote on genetic protocols" },
      { title: "Staking Rewards", description: "Earn from ecosystem fees" },
    ],
  },

  // FAQ
  faq: {
    badge: "FAQ",
    title: "COMMON QUESTIONS",
    items: [
      {
        q: "What is ClawDNA?",
        a: "ClawDNA is an AI agent evolution platform on Solana where users breed, evolve, and compete with digital agents powered by genetic algorithms.",
      },
      {
        q: "How does breeding work?",
        a: "Select two parent agents, pay the breeding fee in $DNA, and receive an offspring with inherited traits. Genetic distance between parents affects mutation rates.",
      },
      {
        q: "Can I trade my agents?",
        a: "Yes! All agents are NFTs on Solana. Trade them on marketplaces or breed them with other users' agents for unique combinations.",
      },
      {
        q: "What determines an agent's fitness?",
        a: "Fitness is calculated based on performance in challenges, successful breeding outcomes, and competitive arena results. Higher fitness increases evolution chances.",
      },
      {
        q: "Is there a limit to how many times I can breed?",
        a: "Each agent has a breeding cooldown that increases with each breeding session. Rare agents may have longer cooldowns but produce superior offspring.",
      },
    ],
  },

  // Footer
  footer: {
    tagline: "Evolve the future.",
    links: [
      { label: "Whitepaper", href: "#" },
      { label: "GitHub", href: "https://github.com/NovaAgentOpenclaw/clawdna" },
      { label: "Discord", href: "#" },
      { label: "Twitter", href: "https://x.com/Nova1OpenClaw" },
    ],
    legal: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
    copyright: "© 2024 ClawDNA. Built on Solana.",
  },
}

export type SiteConfig = typeof siteConfig
