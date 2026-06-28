"use client"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import { Plus, Play, Eye, Calendar, Hash } from "lucide-react"
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
import { toast } from "sonner"
import type { Payroll, DisbursementWithEmployee } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function getStatusColor(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "completed":
      return "default"
    case "processing":
      return "secondary"
    case "pending":
    case "draft":
      return "outline"
    case "failed":
      return "destructive"
    default:
      return "outline"
  }
}

export default function PayrollPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [newPayroll, setNewPayroll] = useState({
    period_start: "",
    period_end: "",
  })

  const { data: payrollsResponse, isLoading } = useSWR<{
    success: boolean
    data: Payroll[]
  }>("/api/payrolls", fetcher)

  const { data: disbursementsResponse } = useSWR<{
    success: boolean
    data: DisbursementWithEmployee[]
  }>("/api/disbursements", fetcher)

  const payrolls = payrollsResponse?.data || []
  const disbursements = disbursementsResponse?.data || []

  const handleCreatePayroll = async () => {
    if (!newPayroll.period_start || !newPayroll.period_end) {
      toast.error("Please select the payroll period")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/payrolls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPayroll),
      })

      const data = await res.json()
      if (data.success) {
        toast.success("Payroll created successfully")
        setIsCreateDialogOpen(false)
        setNewPayroll({ period_start: "", period_end: "" })
        mutate("/api/payrolls")
        mutate("/api/disbursements")
        mutate("/api/dashboard/stats")
      } else {
        toast.error(data.error || "Failed to create payroll")
      }
    } catch (error) {
      toast.error("Failed to create payroll")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleProcessPayroll = async (payrollId: string) => {
    setProcessingId(payrollId)
    try {
      const res = await fetch(`/api/payrolls/${payrollId}/process`, {
        method: "POST",
      })

      const data = await res.json()
      if (data.success) {
        toast.success("Payroll processed successfully")
        mutate("/api/payrolls")
        mutate("/api/disbursements")
        mutate("/api/dashboard/stats")
        mutate("/api/treasury")
      } else {
        toast.error(data.error || "Failed to process payroll")
      }
    } catch (error) {
      toast.error("Failed to process payroll")
    } finally {
      setProcessingId(null)
    }
  }

  const handleViewPayroll = (payroll: Payroll) => {
    setSelectedPayroll(payroll)
    setIsViewDialogOpen(true)
  }

  const selectedDisbursements = selectedPayroll
    ? disbursements.filter((d) => d.payroll_id === selectedPayroll.id)
    : []

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Payroll</h1>
          <p className="text-muted-foreground">
            Create and manage payroll runs for your contractors.
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Payroll
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Payroll</DialogTitle>
              <DialogDescription>
                Create a new payroll run for all active employees.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel>Period Start</FieldLabel>
                <Input
                  type="date"
                  value={newPayroll.period_start}
                  onChange={(e) =>
                    setNewPayroll({ ...newPayroll, period_start: e.target.value })
                  }
                />
              </Field>
              <Field>
                <FieldLabel>Period End</FieldLabel>
                <Input
                  type="date"
                  value={newPayroll.period_end}
                  onChange={(e) =>
                    setNewPayroll({ ...newPayroll, period_end: e.target.value })
                  }
                />
              </Field>
            </FieldGroup>
            <div className="rounded-lg border bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground">
                This will create disbursements for all active employees with their current salary rates.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleCreatePayroll} disabled={isSubmitting}>
                {isSubmitting && <Spinner className="mr-2" />}
                Create Payroll
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Payrolls Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payroll History</CardTitle>
          <CardDescription>All payroll runs and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-6 w-6" />
            </div>
          ) : payrolls.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No payrolls created yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first payroll to get started
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Merkle Root</TableHead>
                  <TableHead>Processed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrolls.map((payroll) => (
                  <TableRow key={payroll.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {formatDate(payroll.period_start)} - {formatDate(payroll.period_end)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{payroll.employee_count}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(payroll.total_usd)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(payroll.status)}>
                        {payroll.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {payroll.merkle_root ? (
                        <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                          <Hash className="h-3 w-3" />
                          {payroll.merkle_root.substring(0, 8)}...
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {payroll.processed_at
                        ? formatDate(payroll.processed_at)
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPayroll(payroll)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(payroll.status === "draft" || payroll.status === "pending") && (
                          <Button
                            size="sm"
                            onClick={() => handleProcessPayroll(payroll.id)}
                            disabled={processingId === payroll.id}
                          >
                            {processingId === payroll.id ? (
                              <Spinner className="mr-2" />
                            ) : (
                              <Play className="mr-2 h-4 w-4" />
                            )}
                            Process
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Payroll Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payroll Details</DialogTitle>
            <DialogDescription>
              {selectedPayroll && (
                <>
                  Period: {formatDate(selectedPayroll.period_start)} - {formatDate(selectedPayroll.period_end)}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedPayroll && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Total Amount</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(selectedPayroll.total_usd)}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Employees</p>
                  <p className="text-lg font-semibold">{selectedPayroll.employee_count}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant={getStatusColor(selectedPayroll.status)} className="mt-1">
                    {selectedPayroll.status}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-medium">Disbursements</h4>
                <div className="max-h-[300px] overflow-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedDisbursements.map((d) => (
                        <TableRow key={d.id}>
                          <TableCell className="font-medium">{d.employee_name}</TableCell>
                          <TableCell>{d.employee_country}</TableCell>
                          <TableCell>{formatCurrency(d.amount_usd)}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(d.status)}>{d.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {selectedPayroll.merkle_root && (
                <div className="rounded-lg border bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Merkle Root</p>
                  <code className="text-xs break-all">{selectedPayroll.merkle_root}</code>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
