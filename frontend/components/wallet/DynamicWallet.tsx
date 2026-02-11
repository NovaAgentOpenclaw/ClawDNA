"use client"

/**
 * Dynamic wallet wrapper for SSR compatibility
 * This component handles the client-side only rendering required by wallet adapters
 */

import dynamic from "next/dynamic"
import { ReactNode, FC } from "react"

// Dynamically import wallet components to avoid SSR issues
const WalletContextProviderInternal = dynamic(
    () => import("./WalletContextProvider").then((mod) => mod.WalletContextProvider),
    {
        ssr: false,
        loading: () => null,
    }
)

const WalletButtonInternal = dynamic(
    () => import("./WalletButton").then((mod) => mod.WalletButton),
    {
        ssr: false,
        loading: () => (
            <button className="px-4 py-2 bg-white/5 rounded-lg text-white/50 animate-pulse">
                Loading...
            </button>
        ),
    }
)

interface DynamicWalletProviderProps {
    children: ReactNode
}

/**
 * Use this provider in layout.tsx for SSR-safe wallet integration
 */
export const DynamicWalletProvider: FC<DynamicWalletProviderProps> = ({ children }) => {
    return <WalletContextProviderInternal>{children}</WalletContextProviderInternal>
}

/**
 * SSR-safe wallet button component
 */
export const DynamicWalletButton: FC<{ className?: string }> = ({ className }) => {
    return <WalletButtonInternal className={className} />
}

export default DynamicWalletProvider
