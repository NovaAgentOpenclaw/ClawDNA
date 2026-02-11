/**
 * useMockWallet.ts
 * 
 * Custom React hook for accessing the mock wallet context.
 * Provides type-safe access to wallet state and actions.
 * 
 * @author Marcus Chen - Principal UI/UX Designer
 * @version 1.0.0
 */

'use client';

import { useContext, useCallback, useMemo } from 'react';
import { MockWalletContext, MockWalletContextValue } from '@/components/wallet/MockWalletProvider';

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook for accessing mock wallet state and actions
 * 
 * @throws {Error} If used outside of MockWalletProvider
 * @returns {MockWalletContextValue} Wallet state and action methods
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { connectionState, connect, disconnect, balance } = useMockWallet();
 *   
 *   return (
 *     <button onClick={connect}>
 *       {connectionState === 'connected' ? `Balance: ${balance} SOL` : 'Connect'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useMockWallet(): MockWalletContextValue {
  const context = useContext(MockWalletContext);

  if (context === null) {
    throw new Error(
      'useMockWallet must be used within a MockWalletProvider. ' +
      'Please wrap your component tree with <MockWalletProvider>.'
    );
  }

  return context;
}

// =============================================================================
// SELECTOR HOOKS (For performance optimization)
// =============================================================================

/**
 * Hook that only returns connection state
 * Useful when you only need to know if wallet is connected
 */
export function useMockWalletConnectionState() {
  const { connectionState } = useMockWallet();
  return connectionState;
}

/**
 * Hook that returns boolean connection status
 */
export function useIsMockWalletConnected(): boolean {
  const { connectionState } = useMockWallet();
  return connectionState === 'connected';
}

/**
 * Hook that returns connection progress
 */
export function useIsMockWalletConnecting(): boolean {
  const { connectionState } = useMockWallet();
  return connectionState === 'connecting';
}

/**
 * Hook that only returns wallet address info
 */
export function useMockWalletAddress() {
  const { address, displayAddress } = useMockWallet();
  return useMemo(
    () => ({ address, displayAddress }),
    [address, displayAddress]
  );
}

/**
 * Hook that only returns balance
 */
export function useMockWalletBalance(): number {
  const { balance } = useMockWallet();
  return balance;
}

/**
 * Hook that returns formatted balance with currency
 */
export function useFormattedMockWalletBalance(
  decimals: number = 4,
  currency: string = 'SOL'
): string {
  const { balance } = useMockWallet();
  return useMemo(
    () => `${balance.toFixed(decimals)} ${currency}`,
    [balance, decimals, currency]
  );
}

/**
 * Hook that returns transaction state
 */
export function useMockWalletTransactionState() {
  const { isProcessingTransaction, simulateTransaction } = useMockWallet();
  return { isProcessingTransaction, simulateTransaction };
}

/**
 * Hook that returns error state and clear function
 */
export function useMockWalletError() {
  const { error, clearError } = useMockWallet();
  return { error, clearError };
}

// =============================================================================
// ACTION HOOKS
// =============================================================================

/**
 * Hook that provides a simple connect/disconnect toggle
 */
export function useMockWalletToggle() {
  const { connectionState, connect, disconnect } = useMockWallet();

  const toggle = useCallback(() => {
    if (connectionState === 'connected') {
      disconnect();
    } else if (connectionState === 'disconnected') {
      connect();
    }
  }, [connectionState, connect, disconnect]);

  return {
    toggle,
    connect,
    disconnect,
    canToggle: connectionState !== 'connecting',
    isConnected: connectionState === 'connected',
  };
}

/**
 * Hook for handling transactions with loading state
 */
export function useMockWalletTransaction() {
  const { 
    isProcessingTransaction, 
    simulateTransaction, 
    balance,
    connectionState 
  } = useMockWallet();

  const executeTransaction = useCallback(
    async (amount: number = 0.1): Promise<{ success: boolean; error?: string }> => {
      if (connectionState !== 'connected') {
        return { success: false, error: 'Wallet not connected' };
      }

      if (balance < amount) {
        return { success: false, error: 'Insufficient balance' };
      }

      const success = await simulateTransaction(amount);
      return { success };
    },
    [connectionState, balance, simulateTransaction]
  );

  return {
    isProcessingTransaction,
    executeTransaction,
    canExecute: connectionState === 'connected' && !isProcessingTransaction,
    maxAmount: balance,
  };
}

// =============================================================================
// UTILITY HOOKS
// =============================================================================

/**
 * Hook that provides a refresh function for balance
 */
export function useMockWalletRefresh() {
  const { refreshBalance } = useMockWallet();
  return refreshBalance;
}

/**
 * Hook that returns all wallet metadata
 */
export function useMockWalletMeta() {
  const { isMockWallet } = useMockWallet();
  return { isMockWallet };
}

// =============================================================================
// DEBUG HOOK (Development only)
// =============================================================================

/**
 * Hook that logs wallet state changes (development only)
 */
export function useMockWalletDebug() {
  const context = useMockWallet();

  if (process.env.NODE_ENV === 'development') {
    console.log('[MockWallet Debug]', {
      connectionState: context.connectionState,
      address: context.address,
      balance: context.balance,
      isProcessing: context.isProcessingTransaction,
      error: context.error,
    });
  }

  return context;
}
