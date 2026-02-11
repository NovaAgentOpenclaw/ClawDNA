"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, useSpring, useTransform } from "framer-motion"
import { RefreshCw, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface MockBalanceDisplayProps {
  initialBalance?: number
  onRefresh?: () => void
}

const SOL_TO_USD_RATE = 150 // Mock rate: 1 SOL = $150

// Animated number component
function AnimatedNumber({
  value,
  decimals = 4,
}: {
  value: number
  decimals?: number
}) {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 })
  const display = useTransform(spring, (current) =>
    current.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  )

  useEffect(() => {
    spring.set(value)
  }, [value, spring])

  return <motion.span>{display}</motion.span>
}

export function MockBalanceDisplay({
  initialBalance = 12.5,
  onRefresh,
}: MockBalanceDisplayProps) {
  const [balance, setBalance] = useState<number>(initialBalance)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Calculate USD equivalent
  const usdValue = balance * SOL_TO_USD_RATE

  const handleRefresh = useCallback(async () => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Simulate slight balance variation (mock fetch)
    const variation = (Math.random() - 0.5) * 0.1
    const newBalance = Math.max(0, balance + variation)
    setBalance(newBalance)
    setLastUpdated(new Date())
    setIsLoading(false)

    onRefresh?.()
  }, [balance, onRefresh])

  const formatLastUpdated = () => {
    return lastUpdated.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-950 to-zinc-900 p-6"
    >
      {/* Background decoration */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-600/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-purple-500/5 blur-2xl" />

      <div className="relative">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20">
              <Wallet className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Wallet Balance</p>
              <p className="text-xs text-zinc-600">Mock Network</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-9 w-9 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <motion.div
              animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
              transition={
                isLoading
                  ? { repeat: Infinity, duration: 1, ease: "linear" }
                  : { duration: 0.2 }
              }
            >
              <RefreshCw className="h-4 w-4" />
            </motion.div>
          </Button>
        </div>

        {/* SOL Balance */}
        <div className="mb-2">
          {isLoading ? (
            <Skeleton className="h-12 w-48" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-white">
                <AnimatedNumber value={balance} decimals={4} />
              </span>
              <span className="text-xl font-medium text-purple-400">SOL</span>
            </div>
          )}
        </div>

        {/* USD Equivalent */}
        <div className="mb-6">
          {isLoading ? (
            <Skeleton className="h-6 w-32" />
          ) : (
            <motion.div
              key={usdValue}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-baseline gap-1"
            >
              <span className="text-lg text-zinc-500">≈ $</span>
              <span className="text-lg font-medium text-zinc-300">
                <AnimatedNumber value={usdValue} decimals={2} />
              </span>
              <span className="text-sm text-zinc-600">USD</span>
            </motion.div>
          )}
        </div>

        {/* Rate info */}
        <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-zinc-500">Mock Rate Active</span>
          </div>
          <span className="text-xs text-zinc-600">
            1 SOL = ${SOL_TO_USD_RATE} USD
          </span>
        </div>

        {/* Last updated */}
        <div className="mt-3 text-right">
          <span className="text-xs text-zinc-700">
            Updated {formatLastUpdated()}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// Hook to use balance in other components
export function useMockBalance() {
  const [balance, setBalance] = useState<number>(12.5)

  const deductAmount = useCallback((amount: number) => {
    setBalance((prev) => Math.max(0, prev - amount))
  }, [])

  const addAmount = useCallback((amount: number) => {
    setBalance((prev) => prev + amount)
  }, [])

  return { balance, setBalance, deductAmount, addAmount }
}
