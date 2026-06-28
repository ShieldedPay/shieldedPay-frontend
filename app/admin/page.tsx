"use client"

import useSWR from "swr"
import { Users, Wallet, FileText, Clock, TrendingUp, DollarSign } from "lucide-react"
import { StatsCard } from "@/components/admin/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, BarChart, Bar } from "recharts"
import type { DashboardStats, Payroll, DisbursementWithEmployee } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Mock chart data
const treasuryData = [
  { month: "Jan", balance: 180000, yield: 450 },
  { month: "Feb", balance: 195000, yield: 487 },
  { month: "Mar", balance: 210000, yield: 525 },
  { month: "Apr", balance: 225000, yield: 562 },
  { month: "May", balance: 240000, yield: 600 },
  { month: "Jun", balance: 252000, yield: 630 },
]

const payrollData = [
  { month: "Jan", amount: 45000 },
  { month: "Feb", amount: 47000 },
  { month: "Mar", amount: 46500 },
  { month: "Apr", amount: 48000 },
  { month: "May", amount: 49500 },
  { month: "Jun", amount: 51200 },
]

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function getStatusColor(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "completed":
    case "withdrawn":
      return "default"
    case "processing":
    case "claimed":
      return "secondary"
    case "pending":
    case "committed":
      return "outline"
    case "failed":
    case "expired":
      return "destructive"
    default:
      return "outline"
  }
}

export default function AdminDashboard() {
  const { data: statsResponse, isLoading: statsLoading } = useSWR<{ success: boolean; data: DashboardStats }>(
    "/api/dashboard/stats",
    fetcher
  )
  const { data: payrollsResponse } = useSWR<{ success: boolean; data: Payroll[] }>(
    "/api/payrolls",
    fetcher
  )
  const { data: disbursementsResponse } = useSWR<{ success: boolean; data: DisbursementWithEmployee[] }>(
    "/api/disbursements",
    fetcher
  )

  const stats = statsResponse?.data
  const recentPayrolls = payrollsResponse?.data?.slice(0, 5) || []
  const recentDisbursements = disbursementsResponse?.data?.slice(0, 5) || []

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back. Here&apos;s your payroll overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statsLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatsCard
              title="Total Employees"
              value={stats?.totalEmployees?.toString() || "0"}
              description="active contractors"
              icon={Users}
            />
            <StatsCard
              title="Active Payrolls"
              value={stats?.activePayrolls?.toString() || "0"}
              description="in progress"
              icon={FileText}
            />
            <StatsCard
              title="Treasury Balance"
              value={formatCurrency(stats?.treasuryBalance || 0)}
              description="available funds"
              icon={Wallet}
              trend={{ value: 4.5, isPositive: true }}
            />
            <StatsCard
              title="Pending Claims"
              value={stats?.pendingClaims?.toString() || "0"}
              description="awaiting withdrawal"
              icon={Clock}
            />
            <StatsCard
              title="Monthly Payroll"
              value={formatCurrency(stats?.monthlyPayroll || 0)}
              description="this month"
              icon={DollarSign}
            />
            <StatsCard
              title="Yield Earned"
              value={formatCurrency(stats?.yieldEarned || 0)}
              description="total returns"
              icon={TrendingUp}
              trend={{ value: 12.3, isPositive: true }}
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Treasury Balance</CardTitle>
            <CardDescription>Monthly balance and yield performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                balance: { label: "Balance", color: "var(--chart-1)" },
                yield: { label: "Yield", color: "var(--chart-3)" },
              }}
              className="h-[240px]"
            >
              <AreaChart data={treasuryData}>
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="var(--chart-1)"
                  fill="url(#balanceGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payroll History</CardTitle>
            <CardDescription>Monthly payroll disbursements</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                amount: { label: "Amount", color: "var(--chart-2)" },
              }}
              className="h-[240px]"
            >
              <BarChart data={payrollData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="amount" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Payrolls</CardTitle>
            <CardDescription>Latest payroll runs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayrolls.length === 0 ? (
                <p className="text-sm text-muted-foreground">No payrolls yet</p>
              ) : (
                recentPayrolls.map((payroll) => (
                  <div
                    key={payroll.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {new Date(payroll.period_start).toLocaleDateString()} - {new Date(payroll.period_end).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payroll.employee_count} employees
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">
                        {formatCurrency(payroll.total_usd)}
                      </span>
                      <Badge variant={getStatusColor(payroll.status)}>
                        {payroll.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Disbursements</CardTitle>
            <CardDescription>Latest payment activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDisbursements.length === 0 ? (
                <p className="text-sm text-muted-foreground">No disbursements yet</p>
              ) : (
                recentDisbursements.map((disbursement) => (
                  <div
                    key={disbursement.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{disbursement.employee_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {disbursement.employee_country}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">
                        {formatCurrency(disbursement.amount_usd)}
                      </span>
                      <Badge variant={getStatusColor(disbursement.status)}>
                        {disbursement.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
