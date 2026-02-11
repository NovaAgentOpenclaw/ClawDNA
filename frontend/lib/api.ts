/**
 * ClawDNA API Client
 * Frontend integration with backend API
 */

// API Base URL - uses environment variable or defaults to empty (same domain for serverless)
// Set NEXT_PUBLIC_API_URL to override (e.g., for external backend)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

interface EvolutionParams {
  population_size?: number
  generations?: number
  mutation_rate?: number
  survival_rate?: number
  tournament_size?: number
  random_seed?: number
}

interface EvolutionResult {
  id: string
  status: string
  parameters: EvolutionParams
  generations: any[]
  best_agent: any
  execution_time_ms: number
}

interface EvolutionStats {
  totalEvolutions: number
  avgFitness: number
  bestFitness: number
  activeAgents: number
  recentEvolutions: any[]
}

// Evolution API
export async function runEvolution(params: EvolutionParams): Promise<EvolutionResult> {
  const response = await fetch(`${API_BASE_URL}/api/v1/evolution/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail?.error || "Evolution failed")
  }

  return response.json()
}

export async function getEvolutionResult(id: string): Promise<EvolutionResult> {
  const response = await fetch(`${API_BASE_URL}/api/v1/evolution/results/${id}`)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail?.error || "Failed to fetch result")
  }

  return response.json()
}

export async function listEvolutionResults(limit: number = 100, offset: number = 0): Promise<EvolutionResult[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/evolution/results?limit=${limit}&offset=${offset}`)
  
  if (!response.ok) {
    throw new Error("Failed to fetch evolution results")
  }

  return response.json()
}

// Stats API
export async function fetchEvolutionStats(): Promise<EvolutionStats> {
  try {
    const results = await listEvolutionResults(100)
    
    const totalEvolutions = results.length
    const avgFitness = results.length > 0
      ? results.reduce((sum, r) => sum + (r.best_agent?.fitness || 0), 0) / results.length
      : 0
    const bestFitness = results.length > 0
      ? Math.max(...results.map(r => r.best_agent?.fitness || 0))
      : 0
    
    return {
      totalEvolutions,
      avgFitness,
      bestFitness,
      activeAgents: results.length * 50, // Estimate based on population
      recentEvolutions: results.slice(0, 10).map((r, i) => ({
        generation: r.generations?.length || 0,
        fitness: r.best_agent?.fitness || 0,
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
      }))
    }
  } catch (error) {
    console.error("Failed to fetch stats:", error)
    return {
      totalEvolutions: 0,
      avgFitness: 0,
      bestFitness: 0,
      activeAgents: 0,
      recentEvolutions: []
    }
  }
}

// Real-time updates (mock implementation - replace with WebSocket in production)
export function subscribeToEvolutionUpdates(callback: (update: any) => void): () => void {
  // Mock implementation - polls every 30 seconds
  const interval = setInterval(async () => {
    try {
      const results = await listEvolutionResults(1)
      if (results.length > 0) {
        callback({
          generation: results[0].generations?.length || 0,
          fitness: results[0].best_agent?.fitness || 0,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error("Failed to poll updates:", error)
    }
  }, 30000)

  return () => clearInterval(interval)
}

// Health check
export async function checkHealth(): Promise<{
  status: string
  version: string
  timestamp: string
  checks?: Record<string, any>
}> {
  const response = await fetch(`${API_BASE_URL}/api/v1/evolution/health`)
  
  if (!response.ok) {
    throw new Error("Health check failed")
  }

  return response.json()
}

// Mock data for development (when backend is not available)
export function getMockEvolutionStats(): EvolutionStats {
  return {
    totalEvolutions: 156,
    avgFitness: 3.45,
    bestFitness: 5.82,
    activeAgents: 780,
    recentEvolutions: Array.from({ length: 10 }, (_, i) => ({
      generation: 156 - i,
      fitness: 3.0 + Math.random() * 2.5,
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
    }))
  }
}
