"use client"

import React from "react"
import { 
  useMockWalletBalance,
  useIsMockWalletConnected,
  useFormattedMockWalletBalance 
} from "@/hooks/useMockWallet"

interface BalanceDisplayProps {
  className?: string
  size?: "small" | "default" | "large"
  showUsd?: boolean
}

export function BalanceDisplay({ 
  className = "", 
  size = "default",
  showUsd = true 
}: BalanceDisplayProps) {
  const isConnected = useIsMockWalletConnected()
  const balance = useMockWalletBalance()
  const formattedBalance = useFormattedMockWalletBalance(4, 'SOL')

  const sizeClasses = {
    small: "wallet-balance-small",
    default: "wallet-balance",
    large: "wallet-balance-large",
  }

  if (!isConnected) {
    return (
      <div className={`text-white/50 ${className}`}>
        <span className="text-sm">Not connected</span>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <div className={`${sizeClasses[size]}`}>
        {balance.toLocaleString()} <span className="text-lg font-medium">SOL</span>
      </div>
      {showUsd && (
        <div className="text-white/50 text-sm mt-1">
          ≈ ${(balance * 25).toLocaleString()} USD
        </div>
      )}
    </div>
  )
}
