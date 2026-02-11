"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { AgentCard3D } from "./agent-card-3d"
import { Agent, FilterState, RARITY_WEIGHTS } from "@/lib/agents"
import { Grid3X3, List, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AgentGridProps {
  agents: Agent[]
  filters: FilterState
  onAgentClick: (agent: Agent) => void
  hasMore?: boolean
  onLoadMore?: () => void
  isLoading?: boolean
}

export function AgentGrid({ 
  agents, 
  filters, 
  onAgentClick,
  hasMore = false,
  onLoadMore,
  isLoading = false,
}: AgentGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredAgents = useMemo(() => {
    let result = [...agents]

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      result = result.filter(agent => 
        agent.name.toLowerCase().includes(query) ||
        agent.id.toLowerCase().includes(query) ||
        agent.class.toLowerCase().includes(query)
      )
    }

    // Apply class filter
    if (filters.classes.length > 0) {
      result = result.filter(agent => filters.classes.includes(agent.class))
    }

    // Apply rarity filter
    if (filters.rarities.length > 0) {
      result = result.filter(agent => filters.rarities.includes(agent.rarity))
    }

    // Apply generation range filter
    result = result.filter(agent => 
      agent.generation >= filters.generationRange[0] && 
      agent.generation <= filters.generationRange[1]
    )

    // Apply fitness range filter
    result = result.filter(agent => 
      agent.fitness >= filters.fitnessRange[0] && 
      agent.fitness <= filters.fitnessRange[1]
    )

    // Apply sorting
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
        result.sort((a, b) => RARITY_WEIGHTS[b.rarity] - RARITY_WEIGHTS[a.rarity])
        break
    }

    return result
  }, [agents, filters])

  if (filteredAgents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <Grid3X3 className="w-10 h-10 text-white/30" />
        </div>
        <h3 className="font-display text-xl font-semibold text-white mb-2">
          No Agents Found
        </h3>
        <p className="text-white/50 max-w-md">
          Try adjusting your filters or search query to find what you&apos;re looking for.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/50 font-mono">
          Showing <span className="text-white">{filteredAgents.length}</span> agents
        </p>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
            className="w-8 h-8"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
            className="w-8 h-8"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAgents.map((agent, index) => (
            <AgentCard3D
              key={agent.id}
              agent={agent}
              onClick={() => onAgentClick(agent)}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAgents.map((agent, index) => (
            <AgentListItem
              key={agent.id}
              agent={agent}
              onClick={() => onAgentClick(agent)}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {(hasMore || onLoadMore) && (
        <div className="flex justify-center pt-8">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoading}
            className="min-w-[200px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Agents'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

// List view item component
import { RARITY_COLORS, CLASS_COLORS } from "@/lib/agents"
import { Dna, TrendingUp, Zap, User } from "lucide-react"

interface AgentListItemProps {
  agent: Agent
  onClick: () => void
  index: number
}

function AgentListItem({ agent, onClick, index }: AgentListItemProps) {
  const rarityColor = RARITY_COLORS[agent.rarity]
  const classColor = CLASS_COLORS[agent.class]

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      onClick={onClick}
      className="group flex items-center gap-4 p-4 bg-void-secondary/50 border border-white/10 rounded-xl cursor-pointer hover:border-white/20 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={agent.image}
          alt={agent.name}
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: `linear-gradient(135deg, ${rarityColor}20, transparent)`,
          }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-display font-semibold text-white group-hover:text-accent-cyan transition-colors truncate">
            {agent.name}
          </h4>
          <span 
            className="px-2 py-0.5 text-[10px] font-mono uppercase rounded-full flex-shrink-0"
            style={{ 
              backgroundColor: `${rarityColor}20`,
              color: rarityColor,
            }}
          >
            {agent.rarity}
          </span>
        </div>
        
        <div className="flex items-center gap-3 mt-1 text-xs text-white/50">
          <span className="flex items-center gap-1">
            <span 
              className="w-1.5 h-1.5 rounded-full" 
              style={{ backgroundColor: classColor }}
            />
            {agent.class}
          </span>
          <span className="flex items-center gap-1">
            <Dna className="w-3 h-3" />
            Gen {agent.generation}
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {agent.fitness}% Fitness
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="text-right flex-shrink-0">
        {agent.isForSale && agent.price ? (
          <div className="flex items-center gap-1 text-accent-cyan font-mono">
            <Zap className="w-4 h-4" />
            <span className="font-semibold">{agent.price}</span>
            <span className="text-xs text-white/50">DNA</span>
          </div>
        ) : (
          <span className="text-xs text-white/30 font-mono">Not for sale</span>
        )}
        
        <div className="flex items-center justify-end gap-1 mt-1 text-xs text-white/40">
          <User className="w-3 h-3" />
          <span className="font-mono truncate max-w-[100px]">
            {agent.owner.name || `${agent.owner.address.slice(0, 6)}...${agent.owner.address.slice(-4)}`}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
