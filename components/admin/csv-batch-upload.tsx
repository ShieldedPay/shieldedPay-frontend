"use client"

import React, { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Upload, FileSpreadsheet, AlertTriangle, CheckCircle2, Download, Trash2 } from "lucide-react"
import { toast } from "sonner"

export interface ParsedCsvEmployee {
  rowNumber: number
  name: string
  externalId: string
  email: string
  stellarAddress: string
  salaryUsd: number
  currency: string
}

export interface CsvValidationError {
  rowNumber: number
  field: string
  message: string
  rawValue: string
}

interface CsvBatchUploadProps {
  onImportSuccess?: (employees: ParsedCsvEmployee[]) => void
}

export function isValidStellarAddress(addr: string): boolean {
  if (!addr) return false
  const trimmed = addr.trim()
  if (!trimmed.startsWith("G") || trimmed.length !== 56) return false
  return /^[A-Z2-7]{56}$/.test(trimmed)
}

export function parseAndValidateCsv(text: string): {
  valid: ParsedCsvEmployee[]
  errors: CsvValidationError[]
} {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  if (lines.length === 0) {
    return { valid: [], errors: [{ rowNumber: 0, field: "file", message: "File is empty", rawValue: "" }] }
  }

  // Parse header
  const headerLine = lines[0]
  const headers = headerLine.split(",").map((h) => h.trim().toLowerCase().replace(/['"]/g, ""))

  const nameIdx = headers.findIndex((h) => h === "name" || h === "employee_name")
  const addrIdx = headers.findIndex((h) => h === "address" || h === "stellar_address" || h === "wallet")
  const salaryIdx = headers.findIndex((h) => h === "salary" || h === "amount" || h === "salary_usd" || h === "amount_usd")
  const idIdx = headers.findIndex((h) => h === "id" || h === "external_id" || h === "ext_id")
  const emailIdx = headers.findIndex((h) => h === "email" || h === "employee_email")
  const currIdx = headers.findIndex((h) => h === "currency")

  if (nameIdx === -1 || addrIdx === -1 || salaryIdx === -1) {
    return {
      valid: [],
      errors: [
        {
          rowNumber: 1,
          field: "header",
          message: "CSV must contain columns: 'name', 'stellar_address', and 'salary_usd'",
          rawValue: headerLine,
        },
      ],
    }
  }

  const valid: ParsedCsvEmployee[] = []
  const errors: CsvValidationError[] = []

  for (let i = 1; i < lines.length; i++) {
    const rowNum = i + 1
    const cols = lines[i].split(",").map((c) => c.trim().replace(/^["']|["']$/g, ""))

    const name = cols[nameIdx] || ""
    const stellarAddress = cols[addrIdx] || ""
    const salaryRaw = cols[salaryIdx] || ""
    const externalId = idIdx !== -1 && cols[idIdx] ? cols[idIdx] : `EXT-${rowNum}`
    const email = emailIdx !== -1 && cols[emailIdx] ? cols[emailIdx] : `employee${rowNum}@example.com`
    const currency = currIdx !== -1 && cols[currIdx] ? cols[currIdx].toUpperCase() : "USD"

    let rowHasError = false

    if (!name) {
      errors.push({ rowNumber: rowNum, field: "name", message: "Employee name is required", rawValue: "" })
      rowHasError = true
    }

    if (!isValidStellarAddress(stellarAddress)) {
      errors.push({
        rowNumber: rowNum,
        field: "stellar_address",
        message: "Invalid Stellar public key (must start with G, 56 characters base32)",
        rawValue: stellarAddress,
      })
      rowHasError = true
    }

    const salaryNum = parseFloat(salaryRaw)
    if (isNaN(salaryNum) || salaryNum <= 0) {
      errors.push({
        rowNumber: rowNum,
        field: "salary_usd",
        message: "Salary must be a positive decimal number",
        rawValue: salaryRaw,
      })
      rowHasError = true
    }

    if (!rowHasError) {
      valid.push({
        rowNumber: rowNum,
        name,
        externalId,
        email,
        stellarAddress,
        salaryUsd: Number(salaryNum.toFixed(2)),
        currency,
      })
    }
  }

  return { valid, errors }
}

export function CsvBatchUpload({ onImportSuccess }: CsvBatchUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [validRows, setValidRows] = useState<ParsedCsvEmployee[]>([])
  const [validationErrors, setValidationErrors] = useState<CsvValidationError[]>([])
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileProcess = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      toast.error("Please upload a valid .csv file")
      return
    }

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const { valid, errors } = parseAndValidateCsv(text)
      setValidRows(valid)
      setValidationErrors(errors)

      if (errors.length === 0 && valid.length > 0) {
        toast.success(`Successfully parsed ${valid.length} contractor records!`)
      } else if (errors.length > 0) {
        toast.warning(`Parsed with ${errors.length} validation errors. Review below.`)
      }
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDownloadSample = () => {
    const sampleCsv = `name,stellar_address,salary_usd,currency,external_id,email
Alex Rivera,GBDEVUYTI7C6W4Q4VMSB4AZVXZK5LY4F2QJBLZOH7D2R2BGLQG3PZSPY,8500.00,USD,EXT-101,alex@techglobal.io
Elena Rostova,GA6Z2P4ZQXN2X62V33GZPYQ34C7XKJNWLZ2CUX2F6564E3M3WXYZ4567,9200.50,USD,EXT-102,elena@techglobal.io
Kenji Sato,GCZNM4Y23V6I7TX7QWY2H5C4A346WBLDOD6IUGQ2S4XJWWY3L7G4ZSPY,11000.00,USD,EXT-103,kenji@techglobal.io
Sarah Jenkins,GD537P8ZQXN2X62V33GZPYQ34C7XKJNWLZ2CUX2F6564E3M3WXYZ7890,7800.00,USD,EXT-104,sarah@techglobal.io`

    const blob = new Blob([sampleCsv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "shieldedpay_payroll_sample.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleImport = () => {
    if (validRows.length === 0) {
      toast.error("No valid contractor rows to import")
      return
    }

    if (onImportSuccess) {
      onImportSuccess(validRows)
    }
    toast.success(`Imported ${validRows.length} contractors to payroll!`)
    setIsOpen(false)
    resetState()
  }

  const resetState = () => {
    setValidRows([])
    setValidationErrors([])
    setFileName(null)
  }

  const totalAmount = validRows.reduce((acc, r) => acc + r.salaryUsd, 0)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-primary" />
          <span>Upload CSV Payroll</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Batch CSV Payroll Upload
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownloadSample}
              className="text-xs text-muted-foreground flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              Sample CSV
            </Button>
          </div>
          <DialogDescription>
            Upload a contractor CSV file. We validate Stellar public keys and salary precisions client-side before queuing payments.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-2">
          {/* Dropzone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-primary/40 hover:bg-muted/20"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileProcess(e.target.files[0])
                }
              }}
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium">
                {fileName ? fileName : "Drag and drop payroll CSV or click to browse"}
              </p>
              <p className="text-xs text-muted-foreground">
                Required columns: <code className="text-foreground">name</code>,{" "}
                <code className="text-foreground">stellar_address</code>,{" "}
                <code className="text-foreground">salary_usd</code>
              </p>
            </div>
          </div>

          {/* Metrics summary */}
          {(validRows.length > 0 || validationErrors.length > 0) && (
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center gap-2 text-emerald-500 mb-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-semibold">Valid Contractors</span>
                </div>
                <p className="text-xl font-bold">{validRows.length}</p>
              </div>

              <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center gap-2 text-amber-500 mb-1">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs font-semibold">Validation Errors</span>
                </div>
                <p className="text-xl font-bold">{validationErrors.length}</p>
              </div>

              <div className="rounded-lg border bg-card p-3">
                <span className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Batch Total (USD)
                </span>
                <p className="text-xl font-bold text-primary">
                  ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )}

          {/* Validation Errors Table */}
          {validationErrors.length > 0 && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-destructive flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" />
                  Detected Errors ({validationErrors.length})
                </span>
              </div>
              <div className="max-h-36 overflow-y-auto text-xs">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Row</TableHead>
                      <TableHead>Field</TableHead>
                      <TableHead>Error</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validationErrors.map((err, idx) => (
                      <TableRow key={idx} className="text-destructive">
                        <TableCell className="font-mono">{err.rowNumber}</TableCell>
                        <TableCell className="font-semibold">{err.field}</TableCell>
                        <TableCell>{err.message}</TableCell>
                        <TableCell className="font-mono truncate max-w-[150px]">
                          {err.rawValue || "(empty)"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Valid Contractors Preview */}
          {validRows.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Validated Rows Preview ({validRows.length})
              </span>
              <div className="max-h-48 overflow-y-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Stellar Key</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validRows.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium text-xs">{r.name}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {r.stellarAddress.slice(0, 6)}...{r.stellarAddress.slice(-6)}
                        </TableCell>
                        <TableCell className="font-mono text-xs font-semibold">
                          ${r.salaryUsd.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{r.externalId}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between border-t pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetState}
            disabled={!fileName}
            className="text-xs text-muted-foreground"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Clear
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={validRows.length === 0}>
              Import {validRows.length} Valid Contractors
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
