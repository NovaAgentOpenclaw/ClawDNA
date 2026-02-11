"use client"

import { FC, ReactNode, useMemo, useCallback, useState } from "react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import {
    ConnectionProvider,
    WalletProvider,
    useWallet,
} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom"
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare"
import { clusterApiUrl, Connection } from "@solana/web3.js"

// Import wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css"

interface WalletContextProviderProps {
    children: ReactNode
}

// Configuration
const NETWORK = WalletAdapterNetwork.Devnet
const ENDPOINT = process.env.NEXT_PUBLIC_RPC_URL || clusterApiUrl(NETWORK)

export const WalletContextProvider: FC<WalletContextProviderProps> = ({
    children,
}) => {
    // Initialize wallets - Phantom and Solflare (most common)
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        []
    )

    // Error handler
    const onError = useCallback((error: Error) => {
        console.error("[Wallet Error]", error)
    }, [])

    return (
        <ConnectionProvider endpoint={ENDPOINT}>
            <WalletProvider wallets={wallets} onError={onError} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

// Hook to get wallet connection state
export function useWalletConnection() {
    const { connected, connecting, disconnecting, publicKey, wallet } = useWallet()

    return {
        isConnected: connected,
        isConnecting: connecting,
        isDisconnecting: disconnecting,
        address: publicKey?.toBase58() || null,
        walletName: wallet?.adapter.name || null,
    }
}

// Hook for transaction operations
export function useWalletTransactions() {
    const { publicKey, signTransaction, signAllTransactions, sendTransaction } =
        useWallet()
    const [isProcessing, setIsProcessing] = useState(false)

    const executeTransaction = useCallback(
        async (transaction: any, connection: Connection) => {
            if (!publicKey || !sendTransaction) {
                throw new Error("Wallet not connected")
            }

            setIsProcessing(true)
            try {
                const signature = await sendTransaction(transaction, connection)
                await connection.confirmTransaction(signature, "confirmed")
                return signature
            } finally {
                setIsProcessing(false)
            }
        },
        [publicKey, sendTransaction]
    )

    return {
        canSign: !!signTransaction,
        canSignAll: !!signAllTransactions,
        canSend: !!sendTransaction,
        isProcessing,
        executeTransaction,
    }
}

export default WalletContextProvider
