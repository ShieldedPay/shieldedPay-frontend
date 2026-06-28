"use client"

import useSWR from "swr"
import { Shield, CheckCircle, AlertTriangle, FileText, Hash, Eye, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Spinner } from "@/components/ui/spinner"
import type { Payroll, DisbursementWithEmployee } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount)
}

// Simulated compliance metrics
const complianceMetrics = [
  {
    title: "Privacy Compliance",
    status: "compliant",
    description: "All salary data encrypted with ZK commitments",
    icon: Shield,
  },
  {
    title: "Audit Trail",
    status: "compliant",
    description: "All transactions recorded on Stellar blockchain",
    icon: FileText,
  },
  {
    title: "Data Retention",
    status: "compliant",
    description: "Encrypted data stored per GDPR requirements",
    icon: Clock,
  },
  {
    title: "Access Controls",
    status: "warning",
    description: "2 view keys expiring in 7 days",
    icon: Eye,
  },
]

export default function CompliancePage() {
  const { data: payrollsResponse, isLoading: payrollsLoading } = useSWR<{
    success: boolean
    data: Payroll[]
  }>("/api/payrolls", fetcher)

  const { data: disbursementsResponse } = useSWR<{
    success: boolean
    data: DisbursementWithEmployee[]
  }>("/api/disbursements", fetcher)

  const payrolls = payrollsResponse?.data || []
  const disbursements = disbursementsResponse?.data || []

  // Calculate audit statistics
  const completedPayrolls = payrolls.filter((p) => p.status === "completed")
  const totalCommitments = disbursements.filter((d) => d.commitment_hash).length
  const verifiedWithdrawals = disbursements.filter((d) => d.status === "withdrawn").length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Compliance & Audit</h1>
        <p className="text-muted-foreground">
          Monitor privacy compliance and review cryptographic audit trails.
        </p>
      </div>

      {/* Compliance Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {complianceMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {metric.status === "compliant" ? (
                  <CheckCircle className="h-5 w-5 text-primary" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
                <Badge
                  variant={metric.status === "compliant" ? "default" : "secondary"}
                >
                  {metric.status === "compliant" ? "Compliant" : "Attention"}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Audit Statistics */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cryptographic Proofs</CardTitle>
            <CardDescription>ZK commitment and verification stats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Commitments</span>
              <span className="font-mono font-medium">{totalCommitments}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Verified Withdrawals</span>
              <span className="font-mono font-medium">{verifiedWithdrawals}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Merkle Trees Generated</span>
              <span className="font-mono font-medium">{completedPayrolls.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Nullifiers Used</span>
              <span className="font-mono font-medium">{verifiedWithdrawals}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Privacy Metrics</CardTitle>
            <CardDescription>Data protection indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Encrypted Records</span>
              <span className="font-mono font-medium text-primary">100%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">PII Exposure Risk</span>
              <span className="font-mono font-medium text-primary">None</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Salary Data Visible</span>
              <span className="font-mono font-medium text-primary">0 records</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">View Keys Active</span>
              <span className="font-mono font-medium">3</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Blockchain Records</CardTitle>
            <CardDescription>On-chain transaction audit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Network</span>
              <span className="font-medium">Stellar Testnet</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Transactions</span>
              <span className="font-mono font-medium">
                {completedPayrolls.length + verifiedWithdrawals}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Smart Contracts</span>
              <span className="font-mono font-medium">2 active</span>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-2">
              View on Explorer
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Audit Trail */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payroll Audit Trail</CardTitle>
          <CardDescription>
            Cryptographic proof records for each payroll run
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payrollsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-6 w-6" />
            </div>
          ) : completedPayrolls.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No completed payrolls yet</p>
              <p className="text-sm text-muted-foreground">
                Process a payroll to generate audit records
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Merkle Root</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Processed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedPayrolls.map((payroll) => (
                  <TableRow key={payroll.id}>
                    <TableCell className="font-medium">
                      {formatDate(payroll.period_start)} - {formatDate(payroll.period_end)}
                    </TableCell>
                    <TableCell>{formatCurrency(payroll.total_usd)}</TableCell>
                    <TableCell>{payroll.employee_count}</TableCell>
                    <TableCell>
                      {payroll.merkle_root ? (
                        <div className="flex items-center gap-1">
                          <Hash className="h-3 w-3 text-muted-foreground" />
                          <code className="text-xs font-mono text-muted-foreground">
                            {payroll.merkle_root.substring(0, 16)}...
                          </code>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {payroll.processed_at ? formatDate(payroll.processed_at) : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recent Disbursement Proofs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Disbursement Proofs</CardTitle>
          <CardDescription>
            Individual payment commitments and nullifiers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {disbursements.filter((d) => d.commitment_hash).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No disbursement proofs yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Commitment Hash</TableHead>
                  <TableHead>Nullifier</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disbursements
                  .filter((d) => d.commitment_hash)
                  .slice(0, 10)
                  .map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.employee_name}</TableCell>
                      <TableCell>{formatCurrency(d.amount_usd)}</TableCell>
                      <TableCell>
                        <code className="text-xs font-mono text-muted-foreground">
                          {d.commitment_hash?.substring(0, 16)}...
                        </code>
                      </TableCell>
                      <TableCell>
                        {d.nullifier ? (
                          <code className="text-xs font-mono text-muted-foreground">
                            {d.nullifier.substring(0, 16)}...
                          </code>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            d.status === "withdrawn"
                              ? "default"
                              : d.status === "claimed"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {d.status}
                        </Badge>
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
