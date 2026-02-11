"use client"

import React from "react"
import { useMockWallet } from "@/hooks/useMockWallet"

export type TransactionStatus = "pending" | "success" | "failed"

interface TransactionStatusBadgeProps {
  status: TransactionStatus
  className?: string
}

export function TransactionStatusBadge({ status, className = "" }: TransactionStatusBadgeProps) {
  const statusClasses = {
    pending: "tx-status-pending",
    success: "tx-status-success",
    failed: "tx-status-failed",
  }

  const statusLabels = {
    pending: "Pending",
    success: "Success",
    failed: "Failed",
  }

  return (
    <span className={`tx-status ${statusClasses[status]} ${className}`}>
      {statusLabels[status]}
    </span>
  )
}

interface TransactionListProps {
  className?: string
  limit?: number
}

// Mock transaction data for display
const MOCK_TRANSACTIONS = [
  { id: "1", signature: "5xK9...mP2Q", status: "success" as TransactionStatus, timestamp: Date.now() - 100000, type: "Transfer" },
  { id: "2", signature: "8nR3...vL7K", status: "pending" as TransactionStatus, timestamp: Date.now() - 50000, type: "Breeding" },
  { id: "3", signature: "2mP8...xN4J", status: "failed" as TransactionStatus, timestamp: Date.now() - 200000, type: "Mint" },
]

export function TransactionList({ className = "", limit }: TransactionListProps) {
  const { connectionState } = useMockWallet()
  const isConnected = connectionState === 'connected'

  if (!isConnected) {
    return (
      <div className={`text-white/50 text-sm ${className}`}>
        Connect wallet to view transactions
      </div>
    )
  }

  const displayTransactions = limit ? MOCK_TRANSACTIONS.slice(0, limit) : MOCK_TRANSACTIONS

  if (displayTransactions.length === 0) {
    return (
      <div className={`text-white/50 text-sm ${className}`}>
        No transactions yet
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {displayTransactions.map((tx) => (
        <TransactionItem key={tx.id} transaction={tx} />
      ))}
    </div>
  )
}

function TransactionItem({ transaction }: { transaction: typeof MOCK_TRANSACTIONS[0] }) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit" 
    })
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-wallet-primary/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-wallet-primary/10 flex items-center justify-center">
          <span className="text-wallet-primary text-xs font-bold">
            {transaction.type.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div>
          <div className="text-white font-medium text-sm">{transaction.type}</div>
          <div className="text-white/50 text-xs font-mono">
            {transaction.signature}
          </div>
        </div>
      </div>
      <div className="text-right">
        <TransactionStatusBadge status={transaction.status} />
        <div className="text-white/50 text-xs mt-1">{formatTime(transaction.timestamp)}</div>
      </div>
    </div>
  )
}
