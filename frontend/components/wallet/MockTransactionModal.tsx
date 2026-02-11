"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Loader2, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export type TransactionType = "mint" | "breed" | "transfer"

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  timestamp: number
  status: "pending" | "confirmed" | "failed"
  signature?: string
}

type TransactionStep = "confirming" | "processing" | "confirmed"

interface MockTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  type: TransactionType
  amount: number
  onComplete?: (transaction: Transaction) => void
}

export function MockTransactionModal({
  isOpen,
  onClose,
  type,
  amount,
  onComplete,
}: MockTransactionModalProps) {
  const [step, setStep] = useState<TransactionStep>("confirming")
  const [signature, setSignature] = useState<string>("")

  // Generate fake Solana signature
  const generateFakeSignature = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < 88; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  useEffect(() => {
    if (!isOpen) {
      setStep("confirming")
      setSignature("")
      return
    }

    // Step 1: Confirming (1 second)
    const confirmingTimer = setTimeout(() => {
      setStep("processing")
    }, 1000)

    // Step 2: Processing (1 second)
    const processingTimer = setTimeout(() => {
      const fakeSig = generateFakeSignature()
      setSignature(fakeSig)
      setStep("confirmed")

      // Create transaction record
      const transaction: Transaction = {
        id: Date.now().toString(),
        type,
        amount,
        timestamp: Date.now(),
        status: "confirmed",
        signature: fakeSig,
      }

      onComplete?.(transaction)
    }, 2000)

    return () => {
      clearTimeout(confirmingTimer)
      clearTimeout(processingTimer)
    }
  }, [isOpen, type, amount, onComplete])

  const handleClose = () => {
    if (step === "confirmed") {
      onClose()
    }
  }

  const getStepIcon = (stepName: TransactionStep) => {
    const isActive = step === stepName
    const isPast =
      (stepName === "confirming" && (step === "processing" || step === "confirmed")) ||
      (stepName === "processing" && step === "confirmed")

    if (isPast) {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500"
        >
          <Check className="h-5 w-5 text-white" />
        </motion.div>
      )
    }

    if (isActive) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600">
          <Loader2 className="h-5 w-5 animate-spin text-white" />
        </div>
      )
    }

    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800">
        <div className="h-2 w-2 rounded-full bg-zinc-600" />
      </div>
    )
  }

  const getStepText = (stepName: TransactionStep) => {
    const texts = {
      confirming: "Confirming...",
      processing: "Processing...",
      confirmed: "Confirmed!",
    }
    return texts[stepName]
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="border-zinc-800 bg-zinc-950 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-white">
            {step === "confirmed" ? "Transaction Complete" : "Processing Transaction"}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-400">
            {type.charAt(0).toUpperCase() + type.slice(1)} {amount} SOL
          </DialogDescription>
        </DialogHeader>

        <div className="my-8 space-y-6">
          {/* Step 1: Confirming */}
          <div className="flex items-center gap-4">
            {getStepIcon("confirming")}
            <div className="flex-1">
              <p
                className={`font-medium ${
                  step === "confirming" ? "text-purple-400" : "text-zinc-300"
                }`}
              >
                {getStepText("confirming")}
              </p>
              <p className="text-sm text-zinc-500">Waiting for confirmation</p>
            </div>
          </div>

          {/* Step 2: Processing */}
          <div className="flex items-center gap-4">
            {getStepIcon("processing")}
            <div className="flex-1">
              <p
                className={`font-medium ${
                  step === "processing" ? "text-purple-400" : step === "confirmed" ? "text-zinc-300" : "text-zinc-500"
                }`}
              >
                {getStepText("processing")}
              </p>
              <p className="text-sm text-zinc-500">Processing on Solana</p>
            </div>
          </div>

          {/* Step 3: Confirmed */}
          <AnimatePresence>
            {step === "confirmed" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
              >
                {getStepIcon("confirmed")}
                <div className="flex-1">
                  <p className="font-medium text-green-400">
                    {getStepText("confirmed")}
                  </p>
                  <p className="text-sm text-zinc-500">Transaction successful</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Signature Display */}
        <AnimatePresence>
          {step === "confirmed" && signature && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3"
            >
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Transaction Signature
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 truncate rounded bg-zinc-950 px-3 py-2 text-xs text-purple-400 font-mono">
                    {signature.slice(0, 20)}...{signature.slice(-20)}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-white"
                    onClick={() =>
                      window.open(`https://solscan.io/tx/${signature}`, "_blank")
                    }
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleClose}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
