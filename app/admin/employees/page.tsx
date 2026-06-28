"use client"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import { Plus, Search, MoreHorizontal, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import type { EmployeeWithDecryptedName } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const countries = [
  { code: "PH", name: "Philippines", currency: "PHP" },
  { code: "VN", name: "Vietnam", currency: "VND" },
  { code: "ID", name: "Indonesia", currency: "IDR" },
  { code: "TH", name: "Thailand", currency: "THB" },
  { code: "MY", name: "Malaysia", currency: "MYR" },
  { code: "BR", name: "Brazil", currency: "BRL" },
  { code: "MX", name: "Mexico", currency: "MXN" },
  { code: "AR", name: "Argentina", currency: "ARS" },
  { code: "CO", name: "Colombia", currency: "COP" },
  { code: "CL", name: "Chile", currency: "CLP" },
]

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function getStatusColor(status: string): "default" | "secondary" | "destructive" {
  switch (status) {
    case "active":
      return "default"
    case "inactive":
      return "secondary"
    case "terminated":
      return "destructive"
    default:
      return "secondary"
  }
}

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    salary_usd: "",
    country: "",
    currency: "USD",
  })

  const { data: response, isLoading } = useSWR<{
    success: boolean
    data: EmployeeWithDecryptedName[]
  }>("/api/employees", fetcher)

  const employees = response?.data || []

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.external_id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.salary_usd || !newEmployee.country) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newEmployee.name,
          email: newEmployee.email,
          salary_usd: parseFloat(newEmployee.salary_usd),
          currency: newEmployee.currency,
          country: newEmployee.country,
        }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success("Employee added successfully")
        setIsAddDialogOpen(false)
        setNewEmployee({ name: "", email: "", salary_usd: "", country: "", currency: "USD" })
        mutate("/api/employees")
      } else {
        toast.error(data.error || "Failed to add employee")
      }
    } catch (error) {
      toast.error("Failed to add employee")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find((c) => c.code === countryCode)
    setNewEmployee({
      ...newEmployee,
      country: countryCode,
      currency: country?.currency || "USD",
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            Manage your contractor roster and payment details.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Add a new contractor to your payroll roster.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Input
                  placeholder="John Doe"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                />
              </Field>
              <Field>
                <FieldLabel>Email Address</FieldLabel>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, email: e.target.value })
                  }
                />
              </Field>
              <Field>
                <FieldLabel>Country</FieldLabel>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={newEmployee.country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                >
                  <option value="">Select country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field>
                <FieldLabel>Monthly Salary (USD)</FieldLabel>
                <Input
                  type="number"
                  placeholder="5000"
                  value={newEmployee.salary_usd}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, salary_usd: e.target.value })
                  }
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleAddEmployee} disabled={isSubmitting}>
                {isSubmitting && <Spinner className="mr-2" />}
                Add Employee
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span>{employees.length} contractors across {new Set(employees.map(e => e.country)).size} countries</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-6 w-6" />
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No employees found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Try a different search term" : "Add your first employee to get started"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {employee.external_id}
                    </TableCell>
                    <TableCell>{employee.country}</TableCell>
                    <TableCell>{formatCurrency(employee.salary_usd)}</TableCell>
                    <TableCell>{employee.currency}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(employee.status)}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
