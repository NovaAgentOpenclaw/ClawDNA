"use client"

import React, { useState } from "react"
import { 
  useMockWallet, 
  useIsMockWalletConnected,
  useMockWalletAddress 
} from "@/hooks/useMockWallet"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut, Loader2 } from "lucide-react"

interface ConnectButtonProps {
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
}

export function ConnectButton({ className = "", size = "default" }: ConnectButtonProps) {
  const { connect, disconnect, connectionState } = useMockWallet()
  const isConnected = useIsMockWalletConnected()
  const { displayAddress } = useMockWalletAddress()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await connect()
    } finally {
      setIsConnecting(false)
    }
  }

  if (isConnected && displayAddress) {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={disconnect}
        className={`wallet-btn wallet-connect-btn border-wallet-primary/30 hover:border-wallet-primary/60 hover:bg-wallet-primary/10 ${className}`}
      >
        <LogOut className="w-4 h-4 mr-2" />
        <span className="font-mono">{displayAddress}</span>
      </Button>
    )
  }

  return (
    <Button
      variant="default"
      size={size}
      onClick={handleConnect}
      disabled={isConnecting || connectionState === 'connecting'}
      className={`wallet-btn wallet-btn-primary wallet-connect-btn ${className}`}
    >
      {isConnecting || connectionState === 'connecting' ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </>
      )}
    </Button>
  )
}
