"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Dna, Filter, ChevronDown } from "lucide-react";
import { Agent, rarityColors, classColors } from "../../app/lab/data/mock-agents";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AgentPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  agents: Agent[];
  onSelectAgent: (agent: Agent) => void;
  selectedAgent: Agent | null;
}

export function AgentPickerModal({ 
  isOpen, 
  onClose, 
  agents, 
  onSelectAgent,
  selectedAgent 
}: AgentPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRarity, setFilterRarity] = useState<string | null>(null);
  const [filterClass, setFilterClass] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.class.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = !filterRarity || agent.rarity === filterRarity;
    const matchesClass = !filterClass || agent.class === filterClass;
    return matchesSearch && matchesRarity && matchesClass;
  });

  const rarities = ["common", "uncommon", "rare", "epic", "legendary", "mythic"];
  const classes = Array.from(new Set(agents.map(a => a.class)));

  const clearFilters = () => {
    setFilterRarity(null);
    setFilterClass(null);
    setSearchQuery("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0 gap-0 bg-[#0a0a0f] border border-[#00f0ff]/20 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f0ff] to-[#a855f7] flex items-center justify-center">
                <Dna className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white font-display uppercase tracking-wide">
                  Select Agent
                </DialogTitle>
                <p className="text-sm text-white/50">
                  Choose from your collection of {agents.length} agents
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white/50 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Search & Filters */}
        <div className="p-4 border-b border-white/5 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                placeholder="Search by name or class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#00f0ff]/50"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`border-white/10 hover:bg-white/5 ${showFilters ? 'bg-[#00f0ff]/10 border-[#00f0ff]/30' : ''}`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-4">
                  {/* Rarity Filter */}
                  <div>
                    <span className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Rarity</span>
                    <div className="flex flex-wrap gap-2">
                      {rarities.map((rarity) => (
                        <button
                          key={rarity}
                          onClick={() => setFilterRarity(filterRarity === rarity ? null : rarity)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase transition-all ${
                            filterRarity === rarity 
                              ? 'ring-1' 
                              : 'hover:bg-white/5'
                          }`}
                          style={{
                            color: rarityColors[rarity as keyof typeof rarityColors],
                            background: filterRarity === rarity 
                              ? `${rarityColors[rarity as keyof typeof rarityColors]}20`
                              : 'rgba(255,255,255,0.03)',
                            borderColor: rarityColors[rarity as keyof typeof rarityColors]
                          }}
                        >
                          {rarity}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Class Filter */}
                  <div>
                    <span className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Class</span>
                    <div className="flex flex-wrap gap-2">
                      {classes.map((cls) => (
                        <button
                          key={cls}
                          onClick={() => setFilterClass(filterClass === cls ? null : cls)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            filterClass === cls 
                              ? 'ring-1 ring-white/30 bg-white/10' 
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                          style={{
                            color: classColors[cls] || "#fff"
                          }}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(filterRarity || filterClass || searchQuery) && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-[#00f0ff] hover:underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Agent Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredAgents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredAgents.map((agent, index) => (
                <motion.button
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    onSelectAgent(agent);
                    onClose();
                  }}
                  className={`relative p-4 rounded-xl border text-left transition-all hover:scale-[1.02] ${
                    selectedAgent?.id === agent.id
                      ? 'border-[#00f0ff] bg-[#00f0ff]/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  {/* Selected Indicator */}
                  {selectedAgent?.id === agent.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#00f0ff] flex items-center justify-center">
                      <svg className="w-3 h-3 text-[#0a0a0f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div 
                      className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
                      style={{ 
                        background: `linear-gradient(135deg, ${rarityColors[agent.rarity]}30, transparent)`,
                        border: `1px solid ${rarityColors[agent.rarity]}50`
                      }}
                    >
                      <Dna className="w-7 h-7" style={{ color: rarityColors[agent.rarity] }} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-white truncate font-display">{agent.name}</h4>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span 
                          className="text-[10px] px-1.5 py-0.5 rounded uppercase"
                          style={{ 
                            color: rarityColors[agent.rarity],
                            background: `${rarityColors[agent.rarity]}20`
                          }}
                        >
                          {agent.rarity}
                        </span>
                        <span className="text-[10px] text-white/40">
                          Gen {agent.generation}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span 
                          className="font-medium"
                          style={{ color: classColors[agent.class] || "#fff" }}
                        >
                          {agent.class}
                        </span>
                        <span className="text-white/40">
                          Fitness: {agent.fitness}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                <Search className="w-8 h-8 text-white/20" />
              </div>
              <h3 className="text-lg font-medium text-white/50 mb-1">No agents found</h3>
              <p className="text-sm text-white/30">Try adjusting your filters</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 flex justify-between items-center">
          <span className="text-sm text-white/40">
            {filteredAgents.length} agent{filteredAgents.length !== 1 ? 's' : ''} available
          </span>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-white/10 hover:bg-white/5"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
