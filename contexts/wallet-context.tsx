"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"

export type WalletType = "Freighter" | "xBull" | "Albedo"
export type StellarNetwork = "testnet" | "mainnet"

export interface WalletState {
  isConnected: boolean
  walletType: WalletType | null
  network: StellarNetwork
  address: string | null
  balance: number
}

interface WalletContextType {
  wallet: WalletState
  connect: (type?: WalletType) => Promise<void>
  disconnect: () => void
  switchNetwork: (network: StellarNetwork) => void
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

const STORAGE_KEY = "shieldedpay_wallet_session"

function generateMockStellarAddress(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  let addr = "G"
  for (let i = 0; i < 55; i++) {
    addr += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return addr
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    walletType: null,
    network: "testnet",
    address: null,
    balance: 0,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Restore session from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setWallet(parsed)
      }
    } catch {
      // ignore
    }
  }, [])

  const connect = useCallback(async (type: WalletType = "Freighter") => {
    // Check if browser extension exists or simulate connection
    let simulatedAddr = generateMockStellarAddress()

    // If Freighter window object exists, or fallback to mock
    if (type === "Freighter" && typeof window !== "undefined" && (window as any).freighter) {
      try {
        const addr = await (window as any).freighter.getPublicKey()
        if (addr) simulatedAddr = addr
      } catch {
        // Fallback to simulated connection
      }
    }

    const newState: WalletState = {
      isConnected: true,
      walletType: type,
      network: wallet.network || "testnet",
      address: simulatedAddr,
      balance: 14250.75,
    }

    setWallet(newState)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
    } catch {
      // ignore
    }
    setIsModalOpen(false)
  }, [wallet.network])

  const disconnect = useCallback(() => {
    const cleared: WalletState = {
      isConnected: false,
      walletType: null,
      network: wallet.network,
      address: null,
      balance: 0,
    }
    setWallet(cleared)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [wallet.network])

  const switchNetwork = useCallback((network: StellarNetwork) => {
    setWallet((prev) => {
      const updated = { ...prev, network }
      try {
        if (prev.isConnected) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        }
      } catch {
        // ignore
      }
      return updated
    })
  }, [])

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connect,
        disconnect,
        switchNetwork,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
