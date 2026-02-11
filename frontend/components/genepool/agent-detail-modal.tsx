"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Agent, RARITY_COLORS, CLASS_COLORS } from "@/lib/agents"
import { 
  X, 
  Dna, 
  Zap, 
  User, 
  Clock, 
  Sparkles,
  Copy,
  Heart,
  Share2,
  GitBranch,
  Baby
} from "lucide-react"
import { useState } from "react"

interface AgentDetailModalProps {
  agent: Agent | null
  isOpen: boolean
  onClose: () => void
  onBreed?: (agent: Agent) => void
}

export function AgentDetailModal({ agent, isOpen, onClose, onBreed }: AgentDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'traits' | 'dna' | 'lineage'>('traits')
  const [copied, setCopied] = useState(false)

  if (!agent) return null

  const rarityColor = RARITY_COLORS[agent.rarity]
  const classColor = CLASS_COLORS[agent.class]

  const copyDNA = () => {
    navigator.clipboard.writeText(agent.dna)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 lg:inset-10 z-50 overflow-hidden"
          >
            <div className="relative w-full h-full max-w-6xl mx-auto bg-void-secondary border border-white/10 rounded-2xl overflow-hidden flex flex-col lg:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side - Image */}
              <div className="relative lg:w-2/5 h-64 lg:h-full bg-gradient-to-b from-white/5 to-transparent overflow-hidden"
              >
                <div 
                  className="absolute inset-0 opacity-50"
                  style={{
                    background: `radial-gradient(circle at 50% 30%, ${rarityColor}30, transparent 70%)`,
                  }}
                />
                
                <div className="absolute inset-0 flex items-center justify-center p-8"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={agent.image}
                      alt={agent.name}
                      fill
                      className="object-contain drop-shadow-2xl"
                    />
                  </motion.div>
                </div>

                {/* Rarity Badge */}
                <div className="absolute top-4 left-4">
                  <Badge 
                    className="text-sm font-mono uppercase tracking-wider border-0 px-4 py-2"
                    style={{ 
                      backgroundColor: `${rarityColor}30`,
                      color: rarityColor,
                      boxShadow: `0 0 20px ${rarityColor}40`,
                    }}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {agent.rarity}
                  </Badge>
                </div>

                {/* Price Tag (if for sale) */}
                {agent.isForSale && agent.price && (
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-2 bg-void/80 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3"
                    >
                      <Zap className="w-5 h-5 text-accent-cyan" />
                      <div>
                        <p className="text-xs text-white/50 font-mono uppercase">Current Price</p>
                        <p className="text-2xl font-display font-bold text-white">
                          {agent.price} <span className="text-accent-cyan">$DNA</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side - Details */}
              <div className="flex-1 flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10"
                >
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-2">
                      {agent.name}
                    </h2>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm"
                    >
                      <div 
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
                        style={{ 
                          borderColor: `${classColor}40`,
                          backgroundColor: `${classColor}10`,
                        }}
                      >
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: classColor }}
                        />
                        <span style={{ color: classColor }} className="font-mono">
                          {agent.class}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-white/60 font-mono"
                      >
                        <Dna className="w-4 h-4" />
                        Generation {agent.generation}
                      </div>
                      
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-white/60 font-mono"
                      >
                        <Clock className="w-4 h-4" />
                        {formatDate(agent.createdAt)}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10"
                >
                  {(['traits', 'dna', 'lineage'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 text-sm font-mono uppercase tracking-wider transition-colors relative ${
                        activeTab === tab ? 'text-accent-cyan' : 'text-white/40 hover:text-white/60'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-cyan"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-auto p-6"
                >
                  <AnimatePresence mode="wait">
                    {activeTab === 'traits' && (
                      <motion.div
                        key="traits"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        {/* Fitness Overview */}
                        <div className="bg-white/5 rounded-xl p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-mono uppercase tracking-wider text-white/50">
                              Overall Fitness
                            </span>
                            <span 
                              className="text-2xl font-display font-bold"
                              style={{ color: rarityColor }}
                            >
                              {agent.fitness}%
                            </span>
                          </div>
                          <div className="h-3 bg-white/10 rounded-full overflow-hidden"
                          >
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${agent.fitness}%` }}
                              transition={{ duration: 1, delay: 0.3 }}
                              className="h-full rounded-full"
                              style={{ 
                                background: `linear-gradient(90deg, ${classColor}, ${rarityColor})`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Traits List */}
                        <div className="space-y-3"
                        >
                          <h4 className="text-sm font-mono uppercase tracking-wider text-white/50">
                            Genetic Traits
                          </h4>
                          
                          {agent.traits.map((trait, index) => (
                            <motion.div
                              key={trait.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * index }}
                              className="bg-white/5 rounded-lg p-4"
                            >
                              <div className="flex items-center justify-between mb-2"
                              >
                                <div className="flex items-center gap-2"
                                >
                                  <span className="text-white font-medium">{trait.name}</span>
                                  {trait.dominant && (
                                    <Badge variant="purple" className="text-[10px]">
                                      Dominant
                                    </Badge>
                                  )}
                                </div>
                                <span className="font-mono text-white/70">{trait.value}%</span>
                              </div>
                              
                              <div className="h-2 bg-white/10 rounded-full overflow-hidden"
                              >
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{ 
                                    width: `${trait.value}%`,
                                    backgroundColor: trait.dominant ? classColor : `${classColor}80`,
                                  }}
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'dna' && (
                      <motion.div
                        key="dna"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        {/* DNA Visualization */}
                        <div className="bg-white/5 rounded-xl p-6 text-center"
                        >
                          <div className="w-32 h-32 mx-auto mb-4 relative"
                          >
                            <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/20 animate-spin-slow" />
                            <div 
                              className="absolute inset-4 rounded-full flex items-center justify-center"
                              style={{
                                background: `conic-gradient(from 0deg, ${rarityColor}, ${classColor}, ${rarityColor})`,
                              }}
                            >
                              <Dna className="w-8 h-8 text-white" />
                            </div>
                          </div>
                          
                          <h4 className="text-white font-medium mb-2">Genetic Sequence</h4>
                          
                          <div className="flex items-center justify-center gap-2"
                          >
                            <code className="text-xs text-white/50 font-mono bg-white/5 px-3 py-2 rounded-lg break-all">
                              {agent.dna}
                            </code>
                            
                            <button
                              onClick={copyDNA}
                              className="p-2 rounded-lg bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                            >
                              {copied ? (
                                <span className="text-accent-green text-xs">Copied!</span>
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* DNA Stats */}
                        <div className="grid grid-cols-2 gap-4"
                        >
                          <div className="bg-white/5 rounded-xl p-4 text-center"
                          >
                            <p className="text-xs text-white/50 font-mono uppercase mb-1">Gene Count</p>
                            <p className="text-2xl font-display font-bold text-white">{agent.traits.length * 8}</p>
                          </div>
                          
                          <div className="bg-white/5 rounded-xl p-4 text-center"
                          >
                            <p className="text-xs text-white/50 font-mono uppercase mb-1">Dominant Traits</p>
                            <p className="text-2xl font-display font-bold text-white">{agent.traits.filter(t => t.dominant).length}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'lineage' && (
                      <motion.div
                        key="lineage"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        {agent.parents ? (
                          <>
                            <div className="bg-white/5 rounded-xl p-6"
                            >
                              <h4 className="text-sm font-mono uppercase tracking-wider text-white/50 mb-4 flex items-center gap-2"
                              >
                                <GitBranch className="w-4 h-4" />
                                Parentage
                              </h4>
                              
                              <div className="flex items-center justify-center gap-4"
                              >
                                <div className="text-center"
                                >
                                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-2"
                                  >
                                    <span className="text-xs font-mono text-white/50">Parent A</span>
                                  </div>
                                  <span className="text-xs text-white/50 font-mono">{shortenAddress(agent.parents.parentA)}</span>
                                </div>
                                
                                <div className="text-accent-cyan"
                                >
                                  <Baby className="w-6 h-6" />
                                </div>
                                
                                <div className="text-center">
                                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                                    <span className="text-xs font-mono text-white/50">Parent B</span>
                                  </div>
                                  <span className="text-xs text-white/50 font-mono">{shortenAddress(agent.parents.parentB)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-white/5 rounded-xl p-4">
                              <p className="text-sm text-white/70 text-center">
                                This agent was bred from two parents in Generation {agent.generation - 1}.
                              </p>
                            </div>
                          </>
                        ) : (
                          <div className="bg-white/5 rounded-xl p-8 text-center">
                            <Sparkles className="w-12 h-12 text-accent-cyan mx-auto mb-4" />
                            <h4 className="font-display text-lg font-semibold text-white mb-2">Genesis Agent</h4>
                            <p className="text-sm text-white/50">
                              This is a first-generation agent with no parents. It was minted directly into the gene pool.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer - Owner Info & Actions */}
                <div className="p-6 border-t border-white/10 bg-white/5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      
                      <div>
                        <p className="text-xs text-white/50 font-mono uppercase">Owner</p>
                        <p className="text-sm text-white font-medium">
                          {agent.owner.name || shortenAddress(agent.owner.address)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/50 hover:text-white"
                      >
                        <Heart className="w-5 h-5" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/50 hover:text-white"
                      >
                        <Share2 className="w-5 h-5" />
                      </Button>
                      
                      <Button
                        variant="glow"
                        onClick={() => onBreed?.(agent)}
                        className="flex-1 sm:flex-none"
                      >
                        <Dna className="w-4 h-4 mr-2" />
                        Breed with this Agent
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
