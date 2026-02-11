/**
 * MockWalletButton.tsx
 * 
 * Connect/Disconnect button component for the mock wallet.
 * Features loading states, hover animations, and accessibility.
 * 
 * @author Marcus Chen - Principal UI/UX Designer
 * @version 1.0.0
 */

'use client';

import React from 'react';
import { Wallet, Loader2, LogOut, Wallet2 } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useMockWallet } from '@/hooks/useMockWallet';

// =============================================================================
// TYPES
// =============================================================================

export interface MockWalletButtonProps extends Omit<ButtonProps, 'onClick'> {
  /** Show full address instead of truncated version */
  showFullAddress?: boolean;
  /** Custom class for the connected state display */
  connectedClassName?: string;
  /** Custom text for connect button */
  connectText?: string;
  /** Custom text for disconnect button */
  disconnectText?: string;
  /** Show tooltip with additional info */
  showTooltip?: boolean;
}

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  button: `
    relative overflow-hidden
    transition-all duration-300 ease-out
    font-medium tracking-wide
  `,
  connecting: `
    animate-pulse
    cursor-not-allowed
  `,
  connected: `
    bg-gradient-to-r from-emerald-600 to-teal-600
    hover:from-emerald-500 hover:to-teal-500
    border-transparent
    shadow-lg shadow-emerald-500/20
  `,
  disconnected: `
    bg-gradient-to-r from-violet-600 to-purple-600
    hover:from-violet-500 hover:to-purple-500
    border-transparent
    hover:shadow-lg hover:shadow-violet-500/25
  `,
  processing: `
    opacity-80
    cursor-wait
  `,
  balanceBadge: `
    ml-2 px-2 py-0.5
    bg-background/20 
    rounded-full text-xs
    font-mono
  `,
};

// =============================================================================
// COMPONENT
// =============================================================================

export function MockWalletButton({
  className,
  connectedClassName,
  showFullAddress = false,
  connectText = 'Connect Wallet',
  disconnectText = 'Disconnect',
  showTooltip = true,
  size = 'default',
  variant = 'default',
  ...props
}: MockWalletButtonProps) {
  const {
    connectionState,
    address,
    displayAddress,
    balance,
    isProcessingTransaction,
    connect,
    disconnect,
  } = useMockWallet();

  const isConnecting = connectionState === 'connecting';
  const isConnected = connectionState === 'connected';

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================

  const renderButtonContent = () => {
    // Connecting state
    if (isConnecting) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Connecting...</span>
        </>
      );
    }

    // Connected state
    if (isConnected && address) {
      const addressDisplay = showFullAddress ? address : displayAddress;
      
      return (
        <>
          <Wallet2 className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">{addressDisplay}</span>
          <span className="sm:hidden">{displayAddress}</span>
          <span className={cn('hidden md:inline-flex', styles.balanceBadge)}>
            {balance.toFixed(2)} SOL
          </span>
        </>
      );
    }

    // Disconnected state
    return (
      <>
        <Wallet className="mr-2 h-4 w-4" />
        <span>{connectText}</span>
      </>
    );
  };

  // ===========================================================================
  // BUTTON VARIANT
  // ===========================================================================

  const getButtonVariant = (): ButtonProps['variant'] => {
    if (isConnected) return 'default';
    return variant;
  };

  const getButtonClasses = () => {
    return cn(
      styles.button,
      isConnecting && styles.connecting,
      isConnected && styles.connected,
      !isConnected && !isConnecting && styles.disconnected,
      isProcessingTransaction && styles.processing,
      className
    );
  };

  // ===========================================================================
  // HANDLERS
  // ===========================================================================

  const handleClick = () => {
    if (isConnecting || isProcessingTransaction) return;
    
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  // ===========================================================================
  // TOOLTIP CONTENT
  // ===========================================================================

  const renderTooltipContent = () => {
    if (!showTooltip) return null;

    if (isConnected) {
      return (
        <div className="space-y-1">
          <p className="font-medium">Connected (Demo Mode)</p>
          <p className="text-xs text-muted-foreground font-mono">{address}</p>
          <p className="text-xs">Balance: {balance.toFixed(4)} SOL</p>
          <p className="text-xs text-amber-400 mt-1">⚠ Mock wallet - no real transactions</p>
        </div>
      );
    }

    return <p>Connect mock wallet for demo</p>;
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================

  const button = (
    <Button
      className={getButtonClasses()}
      variant={getButtonVariant()}
      size={size}
      onClick={handleClick}
      disabled={isConnecting || isProcessingTransaction}
      aria-label={isConnected ? 'Disconnect wallet' : 'Connect wallet'}
      aria-busy={isConnecting}
      {...props}
    >
      {renderButtonContent()}
    </Button>
  );

  if (!showTooltip) {
    return button;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          className="max-w-xs"
          sideOffset={8}
        >
          {renderTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// =============================================================================
// ALTERNATE: COMPACT VERSION
// =============================================================================

export interface MockWalletButtonCompactProps extends Omit<ButtonProps, 'onClick'> {
  iconOnly?: boolean;
}

/**
 * Compact version of the wallet button for tight spaces (mobile nav, etc.)
 */
export function MockWalletButtonCompact({
  className,
  iconOnly = false,
  size = 'icon',
  ...props
}: MockWalletButtonCompactProps) {
  const {
    connectionState,
    isProcessingTransaction,
    connect,
    disconnect,
  } = useMockWallet();

  const isConnecting = connectionState === 'connecting';
  const isConnected = connectionState === 'connected';

  const handleClick = () => {
    if (isConnecting || isProcessingTransaction) return;
    isConnected ? disconnect() : connect();
  };

  return (
    <Button
      size={size}
      variant={isConnected ? 'default' : 'outline'}
      onClick={handleClick}
      disabled={isConnecting || isProcessingTransaction}
      className={cn(
        'transition-all duration-200 ease-out',
        isConnected && 'bg-emerald-600 hover:bg-emerald-500',
        !isConnected && 'hover:bg-accent',
        className
      )}
      aria-label={isConnected ? 'Disconnect wallet' : 'Connect wallet'}
      {...props}
    >
      {isConnecting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isConnected ? (
        <LogOut className="h-4 w-4" />
      ) : (
        <Wallet className="h-4 w-4" />
      )}
      {!iconOnly && (
        <span className="ml-2 hidden sm:inline">
          {isConnected ? 'Disconnect' : 'Connect'}
        </span>
      )}
    </Button>
  );
}
