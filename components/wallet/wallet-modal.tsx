"use client"

import React, { useState } from "react"
import { useWallet, type WalletType, type StellarNetwork } from "@/contexts/wallet-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Check, Copy, ExternalLink, Globe, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

const WALLETS: { id: WalletType; name: string; description: string; badge: string }[] = [
  {
    id: "Freighter",
    name: "Freighter",
    description: "Official Stellar browser extension wallet by SDF",
    badge: "Recommended",
  },
  {
    id: "xBull",
    name: "xBull Wallet",
    description: "Multi-platform secure Stellar & Soroban smart wallet",
    badge: "Popular",
  },
  {
    id: "Albedo",
    name: "Albedo",
    description: "Web-based delegator key management for Stellar",
    badge: "Web3",
  },
]

export function WalletModal() {
  const { wallet, connect, disconnect, switchNetwork, isModalOpen, setIsModalOpen } = useWallet()
  const [copied, setCopied] = useState(false)
  const [connectingType, setConnectingType] = useState<WalletType | null>(null)

  const handleCopy = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address)
      setCopied(true)
      toast.success("Wallet address copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSelectWallet = async (type: WalletType) => {
    setConnectingType(type)
    try {
      await connect(type)
      toast.success(`Connected to ${type} on ${wallet.network}`)
    } catch {
      toast.error(`Failed to connect to ${type}`)
    } finally {
      setConnectingType(null)
    }
  }

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            {wallet.isConnected ? "Stellar Wallet Connected" : "Connect Stellar Wallet"}
          </DialogTitle>
          <DialogDescription>
            {wallet.isConnected
              ? "Authenticated admin session with Stellar Soroban payroll contracts."
              : "Connect your organization admin wallet to sign and verify Soroban payroll transactions."}
          </DialogDescription>
        </DialogHeader>

        {/* Network Selection Banner */}
        <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium">Target Stellar Network</span>
          </div>
          <div className="flex gap-1.5">
            {(["testnet", "mainnet"] as StellarNetwork[]).map((net) => (
              <Button
                key={net}
                variant={wallet.network === net ? "default" : "outline"}
                size="sm"
                className="h-7 px-2.5 text-xs capitalize"
                onClick={() => {
                  switchNetwork(net)
                  toast.info(`Switched network to Stellar ${net}`)
                }}
              >
                {net}
              </Button>
            ))}
          </div>
        </div>

        {wallet.isConnected && wallet.address ? (
          <div className="space-y-4">
            <div className="rounded-xl border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-semibold">{wallet.walletType}</span>
                </div>
                <Badge variant="outline" className="capitalize text-xs">
                  {wallet.network}
                </Badge>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Public Key / Address</p>
                <div className="flex items-center justify-between rounded-md bg-muted/60 px-2.5 py-1.5 font-mono text-xs">
                  <span>{truncateAddress(wallet.address)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-2"
                    onClick={handleCopy}
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t text-xs">
                <span className="text-muted-foreground">Admin Balance:</span>
                <span className="font-semibold text-primary">
                  {wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })} XLM
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="flex-1 text-destructive hover:bg-destructive/10"
                onClick={() => {
                  disconnect()
                  toast.info("Wallet disconnected")
                }}
              >
                Disconnect Wallet
              </Button>
              <Button
                variant="default"
                className="flex-1"
                onClick={() => setIsModalOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {WALLETS.map((w) => (
              <button
                key={w.id}
                disabled={connectingType !== null}
                onClick={() => handleSelectWallet(w.id)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border bg-card hover:bg-accent/60 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{w.name}</span>
                      <Badge variant="secondary" className="text-[10px] h-4 px-1.5 py-0">
                        {w.badge}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{w.description}</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
