"use client"

import useSWR from "swr"
import { TrendingUp, TrendingDown, DollarSign, Users, Globe, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts"
import { Spinner } from "@/components/ui/spinner"
import type { EmployeeWithDecryptedName, Payroll, DisbursementWithEmployee } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Chart data
const monthlyPayroll = [
  { month: "Jan", amount: 45000, employees: 8 },
  { month: "Feb", amount: 47000, employees: 9 },
  { month: "Mar", amount: 46500, employees: 9 },
  { month: "Apr", amount: 48000, employees: 10 },
  { month: "May", amount: 49500, employees: 10 },
  { month: "Jun", amount: 51200, employees: 10 },
]

const claimTimeline = [
  { day: "Mon", claims: 3 },
  { day: "Tue", claims: 5 },
  { day: "Wed", claims: 2 },
  { day: "Thu", claims: 4 },
  { day: "Fri", claims: 6 },
  { day: "Sat", claims: 1 },
  { day: "Sun", claims: 0 },
]

const yieldPerformance = [
  { month: "Jan", yield: 450, rate: 4.2 },
  { month: "Feb", yield: 487, rate: 4.3 },
  { month: "Mar", yield: 525, rate: 4.4 },
  { month: "Apr", yield: 562, rate: 4.5 },
  { month: "May", yield: 600, rate: 4.5 },
  { month: "Jun", yield: 630, rate: 4.5 },
]

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function AnalyticsPage() {
  const { data: employeesResponse, isLoading: employeesLoading } = useSWR<{
    success: boolean
    data: EmployeeWithDecryptedName[]
  }>("/api/employees", fetcher)

  const { data: payrollsResponse } = useSWR<{
    success: boolean
    data: Payroll[]
  }>("/api/payrolls", fetcher)

  const { data: disbursementsResponse } = useSWR<{
    success: boolean
    data: DisbursementWithEmployee[]
  }>("/api/disbursements", fetcher)

  const employees = employeesResponse?.data || []
  const payrolls = payrollsResponse?.data || []
  const disbursements = disbursementsResponse?.data || []

  // Calculate regional distribution
  const regionCounts = employees.reduce((acc, emp) => {
    const region = getRegion(emp.country)
    acc[region] = (acc[region] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const regionData = Object.entries(regionCounts).map(([name, value], index) => ({
    name,
    value,
    color: ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"][index % 4],
  }))

  // Calculate key metrics
  const totalPayroll = payrolls.reduce((sum, p) => sum + p.total_usd, 0)
  const avgSalary = employees.length > 0
    ? employees.reduce((sum, e) => sum + e.salary_usd, 0) / employees.length
    : 0
  const claimRate = disbursements.length > 0
    ? (disbursements.filter((d) => d.status === "claimed" || d.status === "withdrawn").length /
        disbursements.length) * 100
    : 0
  const avgClaimTime = "< 24 hours" // Simulated

  if (employeesLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Insights into your payroll operations and workforce distribution.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Payroll (YTD)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPayroll)}</div>
            <div className="mt-1 flex items-center text-xs text-primary">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12.5% from last year
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Salary
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(avgSalary)}</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              Per contractor/month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Claim Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{claimRate.toFixed(1)}%</div>
            <div className="mt-1 flex items-center text-xs text-primary">
              <TrendingUp className="mr-1 h-3 w-3" />
              Above industry avg
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Claim Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgClaimTime}</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              From notification to withdrawal
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Payroll Trend</CardTitle>
            <CardDescription>Payroll amounts over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                amount: { label: "Payroll", color: "var(--chart-1)" },
              }}
              className="h-[280px]"
            >
              <AreaChart data={monthlyPayroll}>
                <defs>
                  <linearGradient id="payrollGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--chart-1)"
                  fill="url(#payrollGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Regional Distribution</CardTitle>
            <CardDescription>Contractors by geographic region</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                asia: { label: "Asia Pacific", color: "var(--chart-1)" },
                latam: { label: "Latin America", color: "var(--chart-2)" },
              }}
              className="h-[200px]"
            >
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {regionData.map((region) => (
                <div key={region.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: region.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {region.name}: {region.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly Claim Activity</CardTitle>
            <CardDescription>Payment claims per day this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                claims: { label: "Claims", color: "var(--chart-2)" },
              }}
              className="h-[240px]"
            >
              <BarChart data={claimTimeline}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="claims" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Treasury Yield Performance</CardTitle>
            <CardDescription>Monthly yield earnings and APY rate</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                yield: { label: "Yield ($)", color: "var(--chart-3)" },
                rate: { label: "APY (%)", color: "var(--chart-1)" },
              }}
              className="h-[240px]"
            >
              <LineChart data={yieldPerformance}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                  tickFormatter={(v) => `$${v}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                  tickFormatter={(v) => `${v}%`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="yield"
                  stroke="var(--chart-3)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="rate"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Country Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contractor Distribution by Country</CardTitle>
          <CardDescription>Detailed breakdown of your global workforce</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {Object.entries(
              employees.reduce((acc, emp) => {
                acc[emp.country] = (acc[emp.country] || 0) + 1
                return acc
              }, {} as Record<string, number>)
            )
              .sort((a, b) => b[1] - a[1])
              .map(([country, count]) => (
                <div key={country} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{count}</span>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">{getCountryName(country)}</p>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getRegion(countryCode: string): string {
  const asiaPacific = ["PH", "VN", "ID", "TH", "MY", "SG", "IN", "JP", "KR", "AU"]
  const latam = ["BR", "MX", "AR", "CO", "CL", "PE", "EC", "VE"]
  
  if (asiaPacific.includes(countryCode)) return "Asia Pacific"
  if (latam.includes(countryCode)) return "Latin America"
  return "Other"
}

function getCountryName(code: string): string {
  const names: Record<string, string> = {
    PH: "Philippines",
    VN: "Vietnam",
    ID: "Indonesia",
    TH: "Thailand",
    MY: "Malaysia",
    BR: "Brazil",
    MX: "Mexico",
    AR: "Argentina",
    CO: "Colombia",
    CL: "Chile",
  }
  return names[code] || code
}
