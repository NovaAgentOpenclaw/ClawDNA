"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Activity, TrendingUp, Users, Zap, BarChart3, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchEvolutionStats, subscribeToEvolutionUpdates, checkHealth } from "@/lib/api"

interface Stats {
  totalEvolutions: number
  avgFitness: number
  bestFitness: number
  activeAgents: number
  recentEvolutions: any[]
}

interface BackendStatus {
  status: string
  version: string
  checks?: Record<string, any>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalEvolutions: 0,
    avgFitness: 0,
    bestFitness: 0,
    activeAgents: 0,
    recentEvolutions: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToEvolutionUpdates((update) => {
      setStats(prev => ({
        ...prev,
        recentEvolutions: [update, ...prev.recentEvolutions].slice(0, 10)
      }))
    })
    
    return () => unsubscribe()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Check backend health
      const health = await checkHealth()
      setBackendStatus(health)
      
      // Load stats
      const data = await fetchEvolutionStats()
      setStats(data)
    } catch (err: any) {
      console.error("Failed to load data:", err)
      setError(err.message || "Failed to connect to backend")
      
      // Fallback to mock data if backend is not available
      setStats({
        totalEvolutions: 156,
        avgFitness: 3.45,
        bestFitness: 5.82,
        activeAgents: 780,
        recentEvolutions: Array.from({ length: 10 }, (_, i) => ({
          generation: 156 - i,
          fitness: 3.0 + Math.random() * 2.5,
          timestamp: new Date(Date.now() - i * 60000).toISOString(),
        }))
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-void pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Dashboard <span className="text-cyan-400">Real-time</span>
              </h1>
              <p className="text-gray-400">
                Monitor evolution metrics and agent performance live
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={isLoading}
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          {/* Backend Status */}
          {backendStatus && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-gray-400">Backend:</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                backendStatus.status === 'healthy' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {backendStatus.status}
              </span>
              <span className="text-gray-500">v{backendStatus.version}</span>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
              <p className="text-gray-500 text-xs mt-1">
                Using mock data. Backend may still be deploying...
              </p>
            </div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Evolutions"
            value={stats.totalEvolutions}
            icon={<Activity className="w-5 h-5 text-cyan-400" />}
            trend="+12%"
            isLoading={isLoading}
          />
          <StatCard
            title="Average Fitness"
            value={stats.avgFitness.toFixed(2)}
            icon={<TrendingUp className="w-5 h-5 text-green-400" />}
            trend="+5.3%"
            isLoading={isLoading}
          />
          <StatCard
            title="Best Fitness"
            value={stats.bestFitness.toFixed(2)}
            icon={<Zap className="w-5 h-5 text-yellow-400" />}
            trend="New record"
            isLoading={isLoading}
          />
          <StatCard
            title="Active Agents"
            value={stats.activeAgents}
            icon={<Users className="w-5 h-5 text-purple-400" />}
            trend="+8"
            isLoading={isLoading}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-surface-900 border-surface-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                Fitness History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FitnessChart data={stats.recentEvolutions} />
            </CardContent>
          </Card>

          <Card className="bg-surface-900 border-surface-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                Recent Evolutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecentEvolutionsList evolutions={stats.recentEvolutions} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  isLoading 
}: { 
  title: string
  value: string | number
  icon: React.ReactNode
  trend: string
  isLoading: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-surface-900 border-surface-800 hover:border-cyan-500/30 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-surface-800 rounded-lg">
              {icon}
            </div>
            <span className="text-xs text-green-400 font-medium">
              {trend}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">
              {isLoading ? (
                <span className="animate-pulse">--</span>
              ) : (
                value
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function FitnessChart({ data }: { data: any[] }) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No evolution data yet
      </div>
    )
  }

  const maxValue = Math.max(...data.map(d => d.fitness || 0), 1)
  
  return (
    <div className="h-64 flex items-end gap-2">
      {data.slice(0, 20).map((item, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${((item.fitness || 0) / maxValue) * 100}%` }}
          transition={{ delay: i * 0.05 }}
          className="flex-1 bg-gradient-to-t from-cyan-500/20 to-cyan-400 rounded-t"
        />
      ))}
    </div>
  )
}

function RecentEvolutionsList({ evolutions }: { evolutions: any[] }) {
  if (evolutions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No recent evolutions
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto">
      {evolutions.map((evo, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center justify-between p-3 bg-surface-800 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-white font-medium">
                Generation {evo.generation || i + 1}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(evo.timestamp || Date.now()).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-400 font-medium">
              {(evo.fitness || 0).toFixed(2)}
            </p>
            <p className="text-xs text-gray-400">fitness</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
