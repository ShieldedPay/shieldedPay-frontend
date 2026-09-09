"use client"

import React from "react"
import { useWallet } from "@/contexts/wallet-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet } from "lucide-react"

export function WalletConnectButton() {
  const { wallet, setIsModalOpen } = useWallet()

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`
  }

  if (wallet.isConnected && wallet.address) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 h-9 px-3 border-primary/30 hover:border-primary/60"
      >
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-mono text-xs font-medium">{truncateAddress(wallet.address)}</span>
        <Badge variant="secondary" className="capitalize text-[10px] h-4 px-1.5 py-0 font-normal">
          {wallet.network}
        </Badge>
      </Button>
    )
  }

  return (
    <Button
      size="sm"
      onClick={() => setIsModalOpen(true)}
      className="flex items-center gap-2 h-9"
    >
      <Wallet className="h-4 w-4" />
      <span>Connect Wallet</span>
    </Button>
  )
}
