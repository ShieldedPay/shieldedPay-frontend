"use client"

import { use, useState } from "react"
import useSWR from "swr"
import { Shield, Wallet, CheckCircle, AlertCircle, ArrowRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import type { ClaimInfo } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function formatXLM(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

interface ClaimPageProps {
  params: Promise<{ token: string }>
}

export default function ClaimPage({ params }: ClaimPageProps) {
  const { token } = use(params)
  const [stellarAddress, setStellarAddress] = useState("")
  const [isClaiming, setIsClaiming] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [withdrawResult, setWithdrawResult] = useState<{
    stellar_tx_hash: string
    amount_xlm: number
  } | null>(null)

  const { data: response, isLoading, error, mutate } = useSWR<{
    success: boolean
    data?: ClaimInfo
    error?: string
  }>(`/api/claim/${token}`, fetcher)

  const claim = response?.data

  const handleClaim = async () => {
    if (!stellarAddress) {
      toast.error("Please enter your Stellar wallet address")
      return
    }

    if (!stellarAddress.startsWith("G") || stellarAddress.length !== 56) {
      toast.error("Please enter a valid Stellar address (starts with G, 56 characters)")
      return
    }

    setIsClaiming(true)
    try {
      const res = await fetch(`/api/claim/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stellar_address: stellarAddress }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success("Claim submitted successfully!")
        mutate()
      } else {
        toast.error(data.error || "Failed to submit claim")
      }
    } catch (error) {
      toast.error("Failed to submit claim")
    } finally {
      setIsClaiming(false)
    }
  }

  const handleWithdraw = async () => {
    setIsWithdrawing(true)
    try {
      const res = await fetch(`/api/claim/${token}/withdraw`, {
        method: "POST",
      })

      const data = await res.json()
      if (data.success) {
        toast.success("Withdrawal successful!")
        setWithdrawResult(data.data)
        mutate()
      } else {
        toast.error(data.error || "Failed to withdraw")
      }
    } catch (error) {
      toast.error("Failed to withdraw")
    } finally {
      setIsWithdrawing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (error || !response?.success || !claim) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Invalid Claim Link</CardTitle>
            <CardDescription>
              This claim link is invalid or has expired. Please contact your employer for a new link.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Already withdrawn - show success receipt
  if (claim.status === "withdrawn" || withdrawResult) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Payment Complete</CardTitle>
            <CardDescription>
              Your payment has been successfully withdrawn to your Stellar wallet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">Amount Received</p>
              <p className="text-3xl font-bold text-primary">
                {formatXLM(withdrawResult?.amount_xlm || claim.amount_xlm || 0)} XLM
              </p>
              <p className="text-sm text-muted-foreground">
                ({formatCurrency(claim.amount_usd)})
              </p>
            </div>

            {withdrawResult?.stellar_tx_hash && (
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs break-all flex-1">
                    {withdrawResult.stellar_tx_hash}
                  </code>
                  <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground mb-1">Payment Period</p>
              <p className="text-sm font-medium">
                {formatDate(claim.period_start)} - {formatDate(claim.period_end)}
              </p>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Paid by {claim.org_name} via ShieldedPay
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">ShieldedPay</span>
          </div>
          <Badge variant="secondary">Secure Claim</Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl p-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            You Have a Payment Waiting
          </h1>
          <p className="text-muted-foreground">
            From {claim.org_name} for the period of {formatDate(claim.period_start)} - {formatDate(claim.period_end)}
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-4xl font-bold text-primary">
              {formatCurrency(claim.amount_usd)}
            </CardTitle>
            <CardDescription>
              {claim.amount_xlm
                ? `${formatXLM(claim.amount_xlm)} XLM`
                : "Converting to XLM..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-2">
              <Badge
                variant={
                  claim.status === "committed" || claim.status === "claimed"
                    ? "default"
                    : "secondary"
                }
              >
                {claim.status === "committed"
                  ? "Ready to Claim"
                  : claim.status === "claimed"
                  ? "Claimed - Ready to Withdraw"
                  : claim.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Claim Flow */}
        {claim.status === "committed" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Step 1: Enter Your Stellar Wallet
              </CardTitle>
              <CardDescription>
                Enter your Stellar wallet address to claim this payment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Stellar Wallet Address</FieldLabel>
                  <Input
                    placeholder="G..."
                    value={stellarAddress}
                    onChange={(e) => setStellarAddress(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your Stellar public key (starts with G, 56 characters)
                  </p>
                </Field>
              </FieldGroup>
              <Button
                className="w-full"
                onClick={handleClaim}
                disabled={isClaiming || !stellarAddress}
              >
                {isClaiming ? (
                  <Spinner className="mr-2" />
                ) : (
                  <ArrowRight className="mr-2 h-4 w-4" />
                )}
                Claim Payment
              </Button>
            </CardContent>
          </Card>
        )}

        {claim.status === "claimed" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Step 2: Withdraw to Your Wallet
              </CardTitle>
              <CardDescription>
                Your claim has been verified. Click below to withdraw the funds to your Stellar wallet.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="font-medium">
                    {formatXLM(claim.amount_xlm || 0)} XLM
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Network Fee</span>
                  <span className="font-medium">~0.00001 XLM</span>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={handleWithdraw}
                disabled={isWithdrawing}
              >
                {isWithdrawing ? (
                  <Spinner className="mr-2" />
                ) : (
                  <Wallet className="mr-2 h-4 w-4" />
                )}
                Withdraw {formatXLM(claim.amount_xlm || 0)} XLM
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Privacy Notice */}
        <div className="mt-8 rounded-lg border bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Privacy Protected</p>
              <p className="text-xs text-muted-foreground mt-1">
                This payment uses zero-knowledge proofs to protect your privacy. 
                Your employer cannot see your wallet address or track your withdrawals.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
