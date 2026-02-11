"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { FilterSidebar } from "@/components/genepool/filter-sidebar"
import { AgentGrid } from "@/components/genepool/agent-grid"
import { AgentDetailModal } from "@/components/genepool/agent-detail-modal"
import { Navigation } from "@/components/navigation"
import { Agent, FilterState } from "@/lib/agents"
import { MOCK_AGENTS } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal, Dna, Sparkles } from "lucide-react"

export default function GenePoolPage() {
  const [filters, setFilters] = useState<FilterState>({
    classes: [],
    rarities: [],
    generationRange: [0, 10],
    fitnessRange: [0, 100],
    searchQuery: '',
    sortBy: 'newest',
  })
  
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredAgents = useMemo(() => {
    let result = [...MOCK_AGENTS]

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      result = result.filter(agent => 
        agent.name.toLowerCase().includes(query) ||
        agent.id.toLowerCase().includes(query) ||
        agent.class.toLowerCase().includes(query)
      )
    }

    // Class filter
    if (filters.classes.length > 0) {
      result = result.filter(agent => filters.classes.includes(agent.class))
    }

    // Rarity filter
    if (filters.rarities.length > 0) {
      result = result.filter(agent => filters.rarities.includes(agent.rarity))
    }

    // Generation range
    result = result.filter(agent => 
      agent.generation >= filters.generationRange[0] && 
      agent.generation <= filters.generationRange[1]
    )

    // Fitness range
    result = result.filter(agent => 
      agent.fitness >= filters.fitnessRange[0] && 
      agent.fitness <= filters.fitnessRange[1]
    )

    // Sorting
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case 'fitness':
        result.sort((a, b) => b.fitness - a.fitness)
        break
      case 'generation':
        result.sort((a, b) => a.generation - b.generation)
        break
      case 'rarity':
        const rarityWeight = { Common: 1, Uncommon: 2, Rare: 3, Epic: 4, Legendary: 5 }
        result.sort((a, b) => rarityWeight[b.rarity] - rarityWeight[a.rarity])
        break
    }

    return result
  }, [filters])

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedAgent(null), 300)
  }

  const handleBreed = (agent: Agent) => {
    window.location.href = `/lab?parent=${agent.id}`
  }

  const activeFilterCount = 
    filters.classes.length + 
    filters.rarities.length + 
    (filters.generationRange[0] !== 0 || filters.generationRange[1] !== 10 ? 1 : 0) +
    (filters.fitnessRange[0] !== 0 || filters.fitnessRange[1] !== 100 ? 1 : 0)

  return (
    <div className="min-h-screen bg-void">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-accent-cyan/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-cyan/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Dna className="w-4 h-4 text-accent-cyan" />
              <span className="text-sm text-white/70 font-mono">{MOCK_AGENTS.length.toLocaleString()} Unique Agents</span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span className="text-sm text-accent-cyan font-mono">Live Gene Pool</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              <span className="text-gradient">THE GENE POOL</span>
            </h1>
            
            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8">
              Browse, filter, and discover unique AI agents. Find the perfect genetic match for breeding your next evolution.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  type="text"
                  placeholder="Search by name, trait, or ID..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-xl focus:border-accent-cyan focus:ring-accent-cyan"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilters({ ...filters, searchQuery: '' })}
                    className={`text-white/40 hover:text-white ${filters.searchQuery ? 'opacity-100' : 'opacity-0'}`}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Desktop Filter Sidebar */}
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              isOpen={isMobileFilterOpen}
              onClose={() => setIsMobileFilterOpen(false)}
              resultCount={filteredAgents.length}
            />

            {/* Mobile Filter Button & Results */}
            <div className="flex-1 min-w-0">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-6">
                <Button
                  variant="outline"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-accent-cyan text-void font-mono">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </div>

              {/* Quick Filters */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-2 mb-6"
              >
                {[
                  { label: 'Trending', value: 'trending' },
                  { label: 'New Listings', value: 'new' },
                  { label: 'Top Fitness', value: 'fitness' },
                  { label: 'Genesis Only', value: 'genesis' },
                ].map((quickFilter) => (
                  <Button
                    key={quickFilter.value}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-white/60 hover:text-white hover:bg-white/5"
                  >
                    {quickFilter.label}
                  </Button>
                ))}
              </motion.div>

              {/* Agent Grid */}
              <AgentGrid
                agents={MOCK_AGENTS}
                filters={filters}
                onAgentClick={handleAgentClick}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Agent Detail Modal */}
      <AgentDetailModal
        agent={selectedAgent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onBreed={handleBreed}
      />

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-accent-cyan" />
            <span className="font-display text-lg font-semibold text-white">ClawDNA</span>
            <Sparkles className="w-5 h-5 text-accent-cyan" />
          </div>
          
          <p className="text-sm text-white/40">
            Explore the genetic frontier. Breed. Evolve. Conquer.
          </p>
        </div>
      </footer>
    </div>
  )
}
