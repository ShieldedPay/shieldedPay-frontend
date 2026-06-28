"use client"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import { Plus, ArrowUpRight, ArrowDownLeft, TrendingUp, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, PieChart, Pie, Cell } from "recharts"
import { toast } from "sonner"
import type { TreasuryOperation } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const balanceHistory = [
  { date: "Jan", balance: 180000 },
  { date: "Feb", balance: 195000 },
  { date: "Mar", balance: 210000 },
  { date: "Apr", balance: 225000 },
  { date: "May", balance: 240000 },
  { date: "Jun", balance: 252000 },
]

export default function TreasuryPage() {
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")

  const { data: response, isLoading } = useSWR<{
    success: boolean
    data: {
      balance: number
      totalDeposits: number
      totalWithdrawals: number
      totalYield: number
      operations: TreasuryOperation[]
    }
  }>("/api/treasury", fetcher)

  const treasuryData = response?.data
  const operations = treasuryData?.operations || []

  const pieData = treasuryData
    ? [
        { name: "Available", value: treasuryData.balance, color: "var(--chart-1)" },
        { name: "Yield Earned", value: treasuryData.totalYield, color: "var(--chart-3)" },
      ]
    : []

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/treasury", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "deposit",
          amount_usd: parseFloat(depositAmount),
          description: "Treasury deposit",
        }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success("Deposit successful")
        setIsDepositDialogOpen(false)
        setDepositAmount("")
        mutate("/api/treasury")
        mutate("/api/dashboard/stats")
      } else {
        toast.error(data.error || "Failed to deposit")
      }
    } catch (error) {
      toast.error("Failed to deposit")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getOperationIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-primary" />
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-destructive" />
      case "yield":
        return <TrendingUp className="h-4 w-4 text-primary" />
      default:
        return <Wallet className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getOperationColor = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case "deposit":
        return "default"
      case "withdrawal":
        return "destructive"
      case "yield":
        return "default"
      case "fee":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Treasury</h1>
          <p className="text-muted-foreground">
            Manage your corporate treasury and monitor yield performance.
          </p>
        </div>
        <Dialog open={isDepositDialogOpen} onOpenChange={setIsDepositDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Funds
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Treasury Funds</DialogTitle>
              <DialogDescription>
                Deposit funds into your ShieldedPay treasury.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel>Amount (USD)</FieldLabel>
                <Input
                  type="number"
                  placeholder="10000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </Field>
            </FieldGroup>
            <div className="rounded-lg border bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground">
                Funds will be converted to USDC and deposited into your Stellar treasury account.
                Estimated APY: <span className="font-medium text-primary">4.5%</span>
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDepositDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleDeposit} disabled={isSubmitting}>
                {isSubmitting && <Spinner className="mr-2" />}
                Deposit Funds
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-32 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Balance
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(treasuryData?.balance || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Available for payroll</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Deposits
              </CardTitle>
              <ArrowDownLeft className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(treasuryData?.totalDeposits || 0)}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Withdrawals
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(treasuryData?.totalWithdrawals || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Payroll disbursements</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Yield Earned
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(treasuryData?.totalYield || 0)}
              </div>
              <p className="text-xs text-muted-foreground">4.5% APY</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Balance History</CardTitle>
            <CardDescription>Treasury balance over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                balance: { label: "Balance", color: "var(--chart-1)" },
              }}
              className="h-[280px]"
            >
              <AreaChart data={balanceHistory}>
                <defs>
                  <linearGradient id="treasuryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="var(--chart-1)"
                  fill="url(#treasuryGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fund Allocation</CardTitle>
            <CardDescription>Current treasury composition</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                available: { label: "Available", color: "var(--chart-1)" },
                yield: { label: "Yield", color: "var(--chart-3)" },
              }}
              className="h-[200px]"
            >
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-4 flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[var(--chart-1)]" />
                <span className="text-sm text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[var(--chart-3)]" />
                <span className="text-sm text-muted-foreground">Yield</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Operations</CardTitle>
          <CardDescription>Treasury transactions and activities</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-6 w-6" />
            </div>
          ) : operations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No operations yet</p>
              <p className="text-sm text-muted-foreground">
                Add funds to your treasury to get started
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operations.map((op) => (
                  <TableRow key={op.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getOperationIcon(op.type)}
                        <Badge variant={getOperationColor(op.type)}>{op.type}</Badge>
                      </div>
                    </TableCell>
                    <TableCell
                      className={`font-medium ${
                        op.type === "deposit" || op.type === "yield"
                          ? "text-primary"
                          : "text-destructive"
                      }`}
                    >
                      {op.type === "deposit" || op.type === "yield" ? "+" : "-"}
                      {formatCurrency(op.amount_usd)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {op.description || "-"}
                    </TableCell>
                    <TableCell>
                      {op.stellar_tx_hash ? (
                        <code className="text-xs font-mono text-muted-foreground">
                          {op.stellar_tx_hash.substring(0, 12)}...
                        </code>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(op.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
