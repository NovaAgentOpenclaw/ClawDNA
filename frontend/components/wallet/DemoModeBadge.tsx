"use client"

import React from "react"
import { useMockWalletMeta } from "@/hooks/useMockWallet"

interface DemoModeBadgeProps {
  className?: string
  static?: boolean
}

export function DemoModeBadge({ className = "", static: isStatic = false }: DemoModeBadgeProps) {
  const { isMockWallet } = useMockWalletMeta()
  
  // Only show if wallet provider is present and is mock wallet
  if (!isMockWallet) return null

  return (
    <span className={`demo-badge ${isStatic ? "demo-badge-static" : ""} ${className}`}>
      Demo Mode
    </span>
  )
}

export function DemoModeBanner() {
  const { isMockWallet } = useMockWalletMeta()
  
  if (!isMockWallet) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-500/20 border-t border-amber-500/30 py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-amber-400 text-sm">
        <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
        <span className="font-medium">Demo Mode Active</span>
        <span className="text-amber-400/70">— Transactions are simulated and no real funds are used</span>
      </div>
    </div>
  )
}
