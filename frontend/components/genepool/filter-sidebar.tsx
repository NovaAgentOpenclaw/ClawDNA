"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, SlidersHorizontal, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  AgentClass, 
  Rarity, 
  FilterState, 
  RARITY_COLORS, 
  CLASS_COLORS,
  CLASS_DESCRIPTIONS 
} from "@/lib/agents"

interface FilterSidebarProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  isOpen: boolean
  onClose: () => void
  resultCount: number
}

const AGENT_CLASSES: AgentClass[] = ['Strategist', 'Adaptor', 'Predator', 'Sentinel']
const RARITIES: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']
const SORT_OPTIONS: { value: FilterState['sortBy']; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'fitness', label: 'Highest Fitness' },
  { value: 'generation', label: 'Generation' },
  { value: 'rarity', label: 'Rarity' },
]

export function FilterSidebar({ 
  filters, 
  onFilterChange, 
  isOpen, 
  onClose,
  resultCount 
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    class: true,
    rarity: true,
    generation: true,
    fitness: true,
    sort: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const toggleClass = (agentClass: AgentClass) => {
    const newClasses = filters.classes.includes(agentClass)
      ? filters.classes.filter(c => c !== agentClass)
      : [...filters.classes, agentClass]
    onFilterChange({ ...filters, classes: newClasses })
  }

  const toggleRarity = (rarity: Rarity) => {
    const newRarities = filters.rarities.includes(rarity)
      ? filters.rarities.filter(r => r !== rarity)
      : [...filters.rarities, rarity]
    onFilterChange({ ...filters, rarities: newRarities })
  }

  const clearAllFilters = () => {
    onFilterChange({
      classes: [],
      rarities: [],
      generationRange: [0, 10],
      fitnessRange: [0, 100],
      searchQuery: '',
      sortBy: 'newest',
    })
  }

  const activeFilterCount = 
    filters.classes.length + 
    filters.rarities.length + 
    (filters.generationRange[0] !== 0 || filters.generationRange[1] !== 10 ? 1 : 0) +
    (filters.fitnessRange[0] !== 0 || filters.fitnessRange[1] !== 100 ? 1 : 0)

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort By */}
      <div className="border-b border-white/10 pb-4">
        <button 
          onClick={() => toggleSection('sort')}
          className="w-full flex items-center justify-between text-sm font-mono uppercase tracking-wider text-white/60 mb-3 hover:text-white transition-colors"
        >
          Sort By
          <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.sort ? '' : '-rotate-90'}`} />
        </button>
        <AnimatePresence>
          {expandedSections.sort && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2"
            >
              {SORT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="sort"
                    value={option.value}
                    checked={filters.sortBy === option.value}
                    onChange={() => onFilterChange({ ...filters, sortBy: option.value })}
                    className="w-4 h-4 accent-accent-cyan"
                  />
                  <span className={`text-sm transition-colors ${
                    filters.sortBy === option.value ? 'text-accent-cyan' : 'text-white/70 group-hover:text-white'
                  }`}>
                    {option.label}
                  </span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Class Filter */}
      <div className="border-b border-white/10 pb-4">
        <button 
          onClick={() => toggleSection('class')}
          className="w-full flex items-center justify-between text-sm font-mono uppercase tracking-wider text-white/60 mb-3 hover:text-white transition-colors"
        >
          Class
          <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.class ? '' : '-rotate-90'}`} />
        </button>
        <AnimatePresence>
          {expandedSections.class && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2"
            >
              {AGENT_CLASSES.map((agentClass) => (
                <label
                  key={agentClass}
                  className="flex items-center gap-3 cursor-pointer group"
                  title={CLASS_DESCRIPTIONS[agentClass]}
                >
                  <input
                    type="checkbox"
                    checked={filters.classes.includes(agentClass)}
                    onChange={() => toggleClass(agentClass)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 accent-accent-cyan"
                  />
                  <span 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CLASS_COLORS[agentClass] }}
                  />
                  <span className={`text-sm transition-colors ${
                    filters.classes.includes(agentClass) ? 'text-white' : 'text-white/70 group-hover:text-white'
                  }`}>
                    {agentClass}
                  </span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rarity Filter */}
      <div className="border-b border-white/10 pb-4">
        <button 
          onClick={() => toggleSection('rarity')}
          className="w-full flex items-center justify-between text-sm font-mono uppercase tracking-wider text-white/60 mb-3 hover:text-white transition-colors"
        >
          Rarity
          <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.rarity ? '' : '-rotate-90'}`} />
        </button>
        <AnimatePresence>
          {expandedSections.rarity && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2"
            >
              {RARITIES.map((rarity) => (
                <label
                  key={rarity}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.rarities.includes(rarity)}
                    onChange={() => toggleRarity(rarity)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5"
                    style={{ accentColor: RARITY_COLORS[rarity] }}
                  />
                  <span 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: RARITY_COLORS[rarity] }}
                  />
                  <span className={`text-sm transition-colors ${
                    filters.rarities.includes(rarity) ? 'text-white' : 'text-white/70 group-hover:text-white'
                  }`}>
                    {rarity}
                  </span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Generation Range */}
      <div className="border-b border-white/10 pb-4">
        <button 
          onClick={() => toggleSection('generation')}
          className="w-full flex items-center justify-between text-sm font-mono uppercase tracking-wider text-white/60 mb-3 hover:text-white transition-colors"
        >
          Generation
          <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.generation ? '' : '-rotate-90'}`} />
        </button>
        <AnimatePresence>
          {expandedSections.generation && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between text-xs text-white/50 font-mono">
                <span>Gen {filters.generationRange[0]}</span>
                <span>Gen {filters.generationRange[1]}</span>
              </div>
              <div className="relative h-2 bg-white/10 rounded-full">
                <div 
                  className="absolute h-full bg-gradient-to-r from-accent-cyan to-accent-purple rounded-full"
                  style={{
                    left: `${(filters.generationRange[0] / 10) * 100}%`,
                    right: `${100 - (filters.generationRange[1] / 10) * 100}%`,
                  }}
                />
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={filters.generationRange[0]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    if (val <= filters.generationRange[1]) {
                      onFilterChange({ 
                        ...filters, 
                        generationRange: [val, filters.generationRange[1]] 
                      })
                    }
                  }}
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                />
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={filters.generationRange[1]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    if (val >= filters.generationRange[0]) {
                      onFilterChange({ 
                        ...filters, 
                        generationRange: [filters.generationRange[0], val] 
                      })
                    }
                  }}
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fitness Range */}
      <div className="pb-4">
        <button 
          onClick={() => toggleSection('fitness')}
          className="w-full flex items-center justify-between text-sm font-mono uppercase tracking-wider text-white/60 mb-3 hover:text-white transition-colors"
        >
          Fitness Score
          <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.fitness ? '' : '-rotate-90'}`} />
        </button>
        <AnimatePresence>
          {expandedSections.fitness && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between text-xs text-white/50 font-mono">
                <span>{filters.fitnessRange[0]}%</span>
                <span>{filters.fitnessRange[1]}%</span>
              </div>
              <div className="relative h-2 bg-white/10 rounded-full">
                <div 
                  className="absolute h-full bg-gradient-to-r from-accent-green to-accent-cyan rounded-full"
                  style={{
                    left: `${filters.fitnessRange[0]}%`,
                    right: `${100 - filters.fitnessRange[1]}%`,
                  }}
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={filters.fitnessRange[0]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    if (val <= filters.fitnessRange[1]) {
                      onFilterChange({ 
                        ...filters, 
                        fitnessRange: [val, filters.fitnessRange[1]] 
                      })
                    }
                  }}
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={filters.fitnessRange[1]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    if (val >= filters.fitnessRange[0]) {
                      onFilterChange({ 
                        ...filters, 
                        fitnessRange: [filters.fitnessRange[0], val] 
                      })
                    }
                  }}
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-24 bg-void-secondary/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg font-semibold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-accent-cyan" />
              Filters
            </h2>
            {activeFilterCount > 0 && (
              <Badge variant="glow" className="text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          
          <FilterContent />
          
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="w-full mt-4 text-white/60 hover:text-white"
            >
              Clear All Filters
            </Button>
          )}
          
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-xs text-white/50 font-mono text-center">
              {resultCount} agent{resultCount !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-void-secondary border-t border-white/10 rounded-t-3xl z-50 lg:hidden max-h-[85vh] overflow-auto"
            >
              <div className="sticky top-0 bg-void-secondary z-10 px-6 py-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-accent-cyan" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="glow" className="text-xs ml-2">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </h2>
                  <button 
                    onClick={onClose}
                    className="p-2 text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <FilterContent />
              </div>
              
              <div className="sticky bottom-0 bg-void-secondary border-t border-white/10 p-4 space-y-3">
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    onClick={clearAllFilters}
                    className="w-full text-white/60 hover:text-white"
                  >
                    Clear All Filters
                  </Button>
                )}
                <Button
                  variant="glow"
                  onClick={onClose}
                  className="w-full"
                >
                  Show {resultCount} Result{resultCount !== 1 ? 's' : ''}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
