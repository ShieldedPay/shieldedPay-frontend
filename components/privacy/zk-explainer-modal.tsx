"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Lock, GitFork, KeyRound, CheckCircle2, Info } from "lucide-react"

interface ZkExplainerModalProps {
  trigger?: React.ReactNode
  defaultOpen?: boolean
}

export function ZkExplainerModal({ trigger, defaultOpen = false }: ZkExplainerModalProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <Info className="h-3.5 w-3.5 text-primary" />
            <span>How Privacy Works</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg">Zero-Knowledge Payroll Privacy</DialogTitle>
              <DialogDescription>
                How cryptographic commitments and Soroban nullifiers safeguard your compensation.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-2 space-y-4">
          <TabsList className="grid grid-cols-4 w-full h-9">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="commitments" className="text-xs">1. Commitments</TabsTrigger>
            <TabsTrigger value="merkle" className="text-xs">2. Merkle Tree</TabsTrigger>
            <TabsTrigger value="nullifier" className="text-xs">3. Nullifiers</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 text-sm">
            <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                Public Ledger, Private Salaries
              </h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                On transparent blockchains like Stellar, standard transfers expose all salaries, wallet addresses, and balances to the public. ShieldedPay utilizes zero-knowledge commitment schemes to allow enterprise employers to disburse global payroll while guaranteeing that:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="flex items-start gap-2 p-2.5 rounded-lg border bg-card text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Nobody can see how much you were paid</span>
                </div>
                <div className="flex items-start gap-2 p-2.5 rounded-lg border bg-card text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Coworkers cannot view peer salaries</span>
                </div>
                <div className="flex items-start gap-2 p-2.5 rounded-lg border bg-card text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Your employer cannot link your wallet to future claims</span>
                </div>
                <div className="flex items-start gap-2 p-2.5 rounded-lg border bg-card text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Zero gas fees wasted through pre-flight proof verification</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Commitments Tab */}
          <TabsContent value="commitments" className="space-y-3 text-sm">
            <div className="rounded-xl border bg-card p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-primary" />
                  Domain-Separated Leaf Hash
                </span>
                <Badge variant="outline" className="font-mono text-[10px]">Prefix: 0x00</Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Before uploading payroll, each disbursement is masked as an irreversible cryptographic leaf:
              </p>
              <div className="rounded-md bg-muted p-2.5 font-mono text-[11px] text-primary break-all">
                leaf = SHA256(0x00 || recipient_id || amount_usd || token || salt_32_bytes)
              </div>
              <p className="text-xs text-muted-foreground">
                Because the random 256-bit salt is never revealed on-chain, external observers cannot guess or brute-force salary values.
              </p>
            </div>
          </TabsContent>

          {/* Merkle Tree Tab */}
          <TabsContent value="merkle" className="space-y-3 text-sm">
            <div className="rounded-xl border bg-card p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs flex items-center gap-1.5">
                  <GitFork className="h-4 w-4 text-primary" />
                  Cryptographic Inclusion Proof
                </span>
                <Badge variant="outline" className="font-mono text-[10px]">Prefix: 0x01</Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All employee leaf hashes are structured into a binary Merkle tree. Only the 32-byte <strong>Merkle Root</strong> is stored on the Soroban smart contract.
              </p>
              <div className="rounded-md bg-muted p-2.5 font-mono text-[11px] text-primary break-all">
                branch = SHA256(0x01 || left_sibling || right_sibling)
              </div>
              <p className="text-xs text-muted-foreground">
                When claiming, your browser submits a small path of sibling hashes. The smart contract validates that your payment is included in the company payroll without knowing which employee you are.
              </p>
            </div>
          </TabsContent>

          {/* Nullifiers Tab */}
          <TabsContent value="nullifier" className="space-y-3 text-sm">
            <div className="rounded-xl border bg-card p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs flex items-center gap-1.5">
                  <KeyRound className="h-4 w-4 text-primary" />
                  Double-Spend Prevention
                </span>
                <Badge variant="secondary" className="text-[10px]">Unlinkable</Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                To prevent an employee from claiming the same voucher more than once, your browser derives an unforgeable nullifier:
              </p>
              <div className="rounded-md bg-muted p-2.5 font-mono text-[11px] text-primary break-all">
                nullifier = SHA256(claim_secret || &quot;:&quot; || commitment_hash)
              </div>
              <p className="text-xs text-muted-foreground">
                The Soroban smart contract checks if the nullifier was previously spent. If unused, it marks it spent and releases the XLM tokens to your destination wallet. The nullifier cannot be mathematically linked back to your leaf commitment or wallet address.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex justify-end">
          <Button size="sm" onClick={() => setOpen(false)}>
            Got it, thanks
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
