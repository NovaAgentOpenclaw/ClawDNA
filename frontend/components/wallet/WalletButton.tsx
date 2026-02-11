"use client"

import { FC, useState, useCallback } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
    Wallet,
    LogOut,
    Copy,
    Check,
    ChevronDown,
    ExternalLink
} from "lucide-react"

interface WalletButtonProps {
    className?: string
}

export const WalletButton: FC<WalletButtonProps> = ({ className }) => {
    const { connected, connecting, disconnect, publicKey, wallet } = useWallet()
    const { setVisible } = useWalletModal()
    const [copied, setCopied] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)

    // Truncate address for display
    const truncatedAddress = publicKey
        ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
        : null

    // Copy address to clipboard
    const copyAddress = useCallback(async () => {
        if (publicKey) {
            await navigator.clipboard.writeText(publicKey.toBase58())
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }, [publicKey])

    // Open wallet modal
    const handleConnect = useCallback(() => {
        setVisible(true)
    }, [setVisible])

    // Handle disconnect
    const handleDisconnect = useCallback(async () => {
        await disconnect()
        setShowDropdown(false)
    }, [disconnect])

    // View on explorer
    const viewOnExplorer = useCallback(() => {
        if (publicKey) {
            window.open(
                `https://explorer.solana.com/address/${publicKey.toBase58()}?cluster=devnet`,
                "_blank"
            )
        }
    }, [publicKey])

    // Not connected state
    if (!connected) {
        return (
            <Button
                variant="glow"
                size="sm"
                onClick={handleConnect}
                disabled={connecting}
                className={className}
            >
                <Wallet className="w-4 h-4 mr-2" />
                {connecting ? "Connecting..." : "Connect Wallet"}
            </Button>
        )
    }

    // Connected state with dropdown
    return (
        <div className="relative">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDropdown(!showDropdown)}
                className={`border-accent-cyan/30 hover:border-accent-cyan/60 ${className}`}
            >
                {wallet?.adapter.icon && (
                    <img
                        src={wallet.adapter.icon}
                        alt={wallet.adapter.name}
                        className="w-4 h-4 mr-2 rounded-full"
                    />
                )}
                <span className="text-accent-cyan font-mono">{truncatedAddress}</span>
                <ChevronDown
                    className={`w-4 h-4 ml-2 transition-transform ${showDropdown ? "rotate-180" : ""
                        }`}
                />
            </Button>

            <AnimatePresence>
                {showDropdown && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowDropdown(false)}
                        />

                        {/* Dropdown Menu */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-2 z-50 min-w-[200px] bg-void/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                        >
                            {/* Wallet Info */}
                            <div className="p-4 border-b border-white/10">
                                <div className="flex items-center gap-2 mb-1">
                                    {wallet?.adapter.icon && (
                                        <img
                                            src={wallet.adapter.icon}
                                            alt={wallet.adapter.name}
                                            className="w-5 h-5 rounded-full"
                                        />
                                    )}
                                    <span className="text-white font-medium">
                                        {wallet?.adapter.name}
                                    </span>
                                </div>
                                <p className="text-white/50 text-xs font-mono">
                                    {publicKey?.toBase58()}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="p-2">
                                <button
                                    onClick={copyAddress}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    {copied ? (
                                        <Check className="w-4 h-4 text-accent-green" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                    <span>{copied ? "Copied!" : "Copy Address"}</span>
                                </button>

                                <button
                                    onClick={viewOnExplorer}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    <span>View on Explorer</span>
                                </button>

                                <div className="my-2 border-t border-white/10" />

                                <button
                                    onClick={handleDisconnect}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Disconnect</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default WalletButton
