"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  History,
  Coins,
  Sparkles,
  ArrowRightLeft,
  Clock,
  ExternalLink,
  Wallet,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Transaction, TransactionType } from "./MockTransactionModal"

const STORAGE_KEY = "clawdna_transaction_history"

interface TransactionHistoryProps {
  refreshTrigger?: number
}

export function TransactionHistory({ refreshTrigger }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTransactions()
  }, [refreshTrigger])

  const loadTransactions = () => {
    setIsLoading(true)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Transaction[]
        // Sort by timestamp descending
        parsed.sort((a, b) => b.timestamp - a.timestamp)
        setTransactions(parsed)
      }
    } catch (error) {
      console.error("Failed to load transactions:", error)
    } finally {
      // Simulate loading delay for realism
      setTimeout(() => setIsLoading(false), 300)
    }
  }

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const getTransactionIcon = (type: TransactionType) => {
    const icons = {
      mint: Sparkles,
      breed: Coins,
      transfer: ArrowRightLeft,
    }
    const Icon = icons[type]
    return <Icon className="h-4 w-4" />
  }

  const getTransactionColor = (type: TransactionType): string => {
    const colors = {
      mint: "text-purple-400",
      breed: "text-pink-400",
      transfer: "text-blue-400",
    }
    return colors[type]
  }

  const getStatusBadge = (status: Transaction["status"]) => {
    const variants = {
      pending: "secondary" as const,
      confirmed: "green" as const,
      failed: "destructive" as const,
    }
    return (
      <Badge variant={variants[status]} className="text-xs">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatAmount = (amount: number): string => {
    return amount.toFixed(4)
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-white">Transaction History</h3>
        </div>
        <div className="rounded-lg border border-zinc-800">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-white">Transaction History</h3>
        </div>

        <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/50 py-12 px-4">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900">
            <Wallet className="h-8 w-8 text-zinc-600" />
          </div>
          <h4 className="mb-2 text-lg font-medium text-white">No transactions yet</h4>
          <p className="mb-6 max-w-sm text-center text-sm text-zinc-500">
            Your transaction history will appear here once you start minting, breeding, or transferring.
          </p>
          <div className="flex gap-3">
            <Badge variant="outline" className="text-zinc-400">
              <Sparkles className="mr-1 h-3 w-3" /> Mint
            </Badge>
            <Badge variant="outline" className="text-zinc-400">
              <Coins className="mr-1 h-3 w-3" /> Breed
            </Badge>
            <Badge variant="outline" className="text-zinc-400">
              <ArrowRightLeft className="mr-1 h-3 w-3" /> Transfer
            </Badge>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-white">Transaction History</h3>
        </div>
        <span className="text-sm text-zinc-500">{transactions.length} transactions</span>
      </div>

      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Time</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {transactions.map((tx, index) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-zinc-800 transition-colors hover:bg-zinc-900/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={getTransactionColor(tx.type)}>
                        {getTransactionIcon(tx.type)}
                      </span>
                      <span className="capitalize text-zinc-300">{tx.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-zinc-200">
                      {formatAmount(tx.amount)} SOL
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(tx.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 text-zinc-500">
                      <Clock className="h-3 w-3" />
                      <span className="text-sm">{formatTimestamp(tx.timestamp)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {tx.signature && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-500 hover:text-purple-400"
                        onClick={() =>
                          window.open(
                            `https://solscan.io/tx/${tx.signature}`,
                            "_blank"
                          )
                        }
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </motion.div>
  )
}

// Helper function to add a transaction from other components
export function addTransaction(transaction: Transaction): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const transactions: Transaction[] = stored ? JSON.parse(stored) : []
    transactions.unshift(transaction)
    // Keep only last 100 transactions
    const trimmed = transactions.slice(0, 100)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch (error) {
    console.error("Failed to save transaction:", error)
  }
}

// Helper function to clear all transactions
export function clearTransactions(): void {
  localStorage.removeItem(STORAGE_KEY)
}
