/**
 * MockWalletProvider.tsx
 * 
 * React Context Provider for simulating Web3 wallet connection without
 * real blockchain interaction. Designed for ClawDNA demo environments.
 * 
 * @author Marcus Chen - Principal UI/UX Designer
 * @version 1.0.0
 */

'use client';

import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
  useEffect,
} from 'react';

// =============================================================================
// TYPES
// =============================================================================

export type WalletConnectionState = 'disconnected' | 'connecting' | 'connected';

export interface MockWalletState {
  /** Current connection state of the mock wallet */
  connectionState: WalletConnectionState;
  /** Simulated Solana wallet address (Base58 format) */
  address: string | null;
  /** Display-ready truncated address (e.g., "7x9k...A2mP") */
  displayAddress: string | null;
  /** Mock SOL balance (10-100 SOL) */
  balance: number;
  /** Whether a transaction is being processed */
  isProcessingTransaction: boolean;
  /** Error message if connection/transactions fail */
  error: string | null;
  /** Indicates this is a demo/mock wallet for UI indicators */
  isMockWallet: true;
}

export interface MockWalletActions {
  /** Initiate mock wallet connection */
  connect: () => Promise<void>;
  /** Disconnect mock wallet */
  disconnect: () => void;
  /** Simulate a transaction with delay */
  simulateTransaction: (amount?: number) => Promise<boolean>;
  /** Refresh mock balance */
  refreshBalance: () => void;
  /** Clear any error state */
  clearError: () => void;
}

export type MockWalletContextValue = MockWalletState & MockWalletActions;

interface MockWalletProviderProps {
  children: ReactNode;
  /** Initial balance for the mock wallet (default: random 10-100) */
  initialBalance?: number;
  /** Connection delay in ms (default: 1500) */
  connectionDelayMs?: number;
  /** Transaction delay in ms (default: 1000-2000 random) */
  transactionDelayMs?: { min: number; max: number };
}

// =============================================================================
// CONSTANTS
// =============================================================================

const BASE58_CHARS = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const SOLANA_ADDRESS_LENGTH = 44;
const DISPLAY_TRUNCATE_LENGTH = 4;

const DEFAULT_CONNECTION_DELAY = 1500;
const DEFAULT_TRANSACTION_DELAY = { min: 1000, max: 2000 };
const MIN_BALANCE = 10;
const MAX_BALANCE = 100;

// =============================================================================
// CONTEXT
// =============================================================================

export const MockWalletContext = createContext<MockWalletContextValue | null>(null);

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Generates a random Solana-compatible Base58 address
 * Solana addresses are 32-44 characters in Base58 encoding
 */
function generateMockSolanaAddress(): string {
  let address = '';
  for (let i = 0; i < SOLANA_ADDRESS_LENGTH; i++) {
    address += BASE58_CHARS.charAt(Math.floor(Math.random() * BASE58_CHARS.length));
  }
  return address;
}

/**
 * Truncates address for display (e.g., "7x9k...A2mP")
 */
function truncateAddress(address: string): string {
  if (address.length <= DISPLAY_TRUNCATE_LENGTH * 2 + 3) return address;
  return `${address.slice(0, DISPLAY_TRUNCATE_LENGTH)}...${address.slice(-DISPLAY_TRUNCATE_LENGTH)}`;
}

/**
 * Generates random SOL balance between min and max
 */
function generateRandomBalance(min: number = MIN_BALANCE, max: number = MAX_BALANCE): number {
  return Number((Math.random() * (max - min) + min).toFixed(4));
}

/**
 * Sleep utility for simulating async delays
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

export function MockWalletProvider({
  children,
  initialBalance,
  connectionDelayMs = DEFAULT_CONNECTION_DELAY,
  transactionDelayMs = DEFAULT_TRANSACTION_DELAY,
}: MockWalletProviderProps) {
  // State
  const [connectionState, setConnectionState] = useState<WalletConnectionState>('disconnected');
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(() => initialBalance ?? generateRandomBalance());
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Computed
  const displayAddress = useMemo(() => 
    address ? truncateAddress(address) : null,
    [address]
  );

  // =============================================================================
  // ACTIONS
  // =============================================================================

  const connect = useCallback(async () => {
    // Prevent multiple connection attempts
    if (connectionState === 'connecting' || connectionState === 'connected') {
      return;
    }

    setError(null);
    setConnectionState('connecting');

    try {
      // Simulate network delay
      await sleep(connectionDelayMs);

      // Generate mock wallet data
      const newAddress = generateMockSolanaAddress();
      setAddress(newAddress);
      setBalance(generateRandomBalance());
      setConnectionState('connected');

      // Log for debugging (remove in production)
      console.log('[MockWallet] Connected:', { address: newAddress, balance });
    } catch (err) {
      setError('Failed to connect wallet. Please try again.');
      setConnectionState('disconnected');
      console.error('[MockWallet] Connection error:', err);
    }
  }, [connectionState, connectionDelayMs, balance]);

  const disconnect = useCallback(() => {
    setConnectionState('disconnected');
    setAddress(null);
    setBalance(0);
    setError(null);
    console.log('[MockWallet] Disconnected');
  }, []);

  const simulateTransaction = useCallback(async (amount: number = 0.1): Promise<boolean> => {
    if (connectionState !== 'connected') {
      setError('Wallet not connected');
      return false;
    }

    if (balance < amount) {
      setError('Insufficient balance for transaction');
      return false;
    }

    setIsProcessingTransaction(true);
    setError(null);

    try {
      // Random delay between min and max
      const delay = Math.random() * 
        (transactionDelayMs.max - transactionDelayMs.min) + 
        transactionDelayMs.min;
      
      await sleep(delay);

      // Simulate occasional transaction failure (5% chance)
      if (Math.random() < 0.05) {
        throw new Error('Transaction failed: Network error');
      }

      // Update balance
      setBalance((prev) => Number((prev - amount).toFixed(4)));
      
      console.log('[MockWallet] Transaction complete:', { amount, remainingBalance: balance - amount });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setError(errorMessage);
      console.error('[MockWallet] Transaction error:', err);
      return false;
    } finally {
      setIsProcessingTransaction(false);
    }
  }, [connectionState, balance, transactionDelayMs]);

  const refreshBalance = useCallback(() => {
    if (connectionState === 'connected') {
      // Simulate small fluctuation in balance
      const fluctuation = (Math.random() - 0.5) * 0.1;
      setBalance((prev) => Number((prev + fluctuation).toFixed(4)));
    }
  }, [connectionState]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // =============================================================================
  // AUTO-REFRESH BALANCE (OPTIONAL - DEMO EFFECT)
  // =============================================================================

  useEffect(() => {
    if (connectionState !== 'connected') return;

    // Refresh balance every 30 seconds to simulate live updates
    const interval = setInterval(refreshBalance, 30000);
    return () => clearInterval(interval);
  }, [connectionState, refreshBalance]);

  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================

  const contextValue = useMemo<MockWalletContextValue>(
    () => ({
      // State
      connectionState,
      address,
      displayAddress,
      balance,
      isProcessingTransaction,
      error,
      isMockWallet: true,
      // Actions
      connect,
      disconnect,
      simulateTransaction,
      refreshBalance,
      clearError,
    }),
    [
      connectionState,
      address,
      displayAddress,
      balance,
      isProcessingTransaction,
      error,
      connect,
      disconnect,
      simulateTransaction,
      refreshBalance,
      clearError,
    ]
  );

  return (
    <MockWalletContext.Provider value={contextValue}>
      {children}
    </MockWalletContext.Provider>
  );
}

// =============================================================================
// HOOK (MOVED TO SEPARATE FILE - useMockWallet.ts)
// =============================================================================

// Hook implementation is in src/hooks/useMockWallet.ts
