"use client"

// Real wallet integration components
export { WalletContextProvider, useWalletConnection, useWalletTransactions } from "./WalletContextProvider"
export { WalletButton } from "./WalletButton"

// Legacy mock implementations (for demo/testing)
export {
  MockWalletProvider,
  MockWalletContext,
  type MockWalletState,
  type MockWalletActions,
  type MockWalletContextValue,
  type WalletConnectionState,
} from "./MockWalletProvider"

// Wallet UI components
export { DemoModeBadge } from "./DemoModeBadge"
export { MockWalletButton } from "./MockWalletButton"
export { MockBalanceDisplay } from "./MockBalanceDisplay"
export { TransactionHistory } from "./TransactionHistory"
export { MockTransactionModal } from "./MockTransactionModal"
