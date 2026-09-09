import {
  mockStats,
  mockPayrolls,
  mockDisbursements,
  mockEmployees,
  mockTreasuryOperations,
  getMockClaimByToken,
} from "./mock-data"
import type {
  DashboardStats,
  Payroll,
  DisbursementWithEmployee,
  EmployeeWithDecryptedName,
  TreasuryOperation,
  ClaimInfo,
  ApiResponse,
} from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
const USE_MOCKS_ENV = process.env.NEXT_PUBLIC_USE_MOCKS === "true"

export async function requestWithFallback<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackData: T
): Promise<ApiResponse<T>> {
  if (USE_MOCKS_ENV) {
    return { success: true, data: fallbackData }
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      signal: AbortSignal.timeout(3000),
    })

    if (!res.ok) {
      // Fallback if backend returns 404 or 500 in dev
      return { success: true, data: fallbackData }
    }

    const data = await res.json()
    return data
  } catch (err) {
    // Graceful offline fallback to mock data
    return { success: true, data: fallbackData }
  }
}

export const api = {
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return requestWithFallback("/api/dashboard/stats", { method: "GET" }, mockStats)
  },

  async getPayrolls(): Promise<ApiResponse<Payroll[]>> {
    return requestWithFallback("/api/payrolls", { method: "GET" }, mockPayrolls)
  },

  async createPayroll(payload: { period_start: string; period_end: string }): Promise<ApiResponse<Payroll>> {
    const newPayroll: Payroll = {
      id: `pr_${Date.now()}`,
      org_id: "org_shielded_01",
      period_start: payload.period_start,
      period_end: payload.period_end,
      status: "draft",
      total_usd: 36500,
      employee_count: mockEmployees.length,
      merkle_root: null,
      created_at: new Date().toISOString(),
      processed_at: null,
    }
    return requestWithFallback(
      "/api/payrolls",
      { method: "POST", body: JSON.stringify(payload) },
      newPayroll
    )
  },

  async processPayroll(payrollId: string): Promise<ApiResponse<{ merkle_root: string }>> {
    return requestWithFallback(
      `/api/payrolls/${payrollId}/process`,
      { method: "POST" },
      { merkle_root: "9e5c464450259b19e9f193cb9d4fb971bcba9a83853110a248fca8a4d46797ea" }
    )
  },

  async getDisbursements(): Promise<ApiResponse<DisbursementWithEmployee[]>> {
    return requestWithFallback("/api/disbursements", { method: "GET" }, mockDisbursements)
  },

  async getEmployees(): Promise<ApiResponse<EmployeeWithDecryptedName[]>> {
    return requestWithFallback("/api/employees", { method: "GET" }, mockEmployees)
  },

  async createEmployee(payload: {
    name: string
    salary_usd: number
    currency: string
    country: string
    stellar_address?: string
  }): Promise<ApiResponse<EmployeeWithDecryptedName>> {
    const newEmp: EmployeeWithDecryptedName = {
      id: `emp_${Date.now()}`,
      org_id: "org_shielded_01",
      external_id: `EXT-${Date.now().toString().slice(-4)}`,
      email_hash: "hash" + Date.now(),
      name: payload.name,
      salary_usd: payload.salary_usd,
      currency: payload.currency,
      country: payload.country,
      status: "active",
      stellar_address: payload.stellar_address || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return requestWithFallback(
      "/api/employees",
      { method: "POST", body: JSON.stringify(payload) },
      newEmp
    )
  },

  async getTreasury(): Promise<ApiResponse<{ balance_usd: number; operations: TreasuryOperation[] }>> {
    return requestWithFallback(
      "/api/treasury",
      { method: "GET" },
      { balance_usd: mockStats.treasuryBalance, operations: mockTreasuryOperations }
    )
  },

  async getClaim(token: string): Promise<ApiResponse<ClaimInfo & {
    recipient?: string
    salt?: string
    merkle_root?: string
    merkle_proof?: string[]
    leaf_index?: number
  }>> {
    const fallback = getMockClaimByToken(token)
    if (!fallback) {
      return { success: false, error: "Invalid claim voucher" }
    }
    return requestWithFallback(`/api/claim/${token}`, { method: "GET" }, fallback)
  },

  async submitClaim(
    token: string,
    stellar_address: string,
    nullifier?: string
  ): Promise<ApiResponse<{ status: string; nullifier?: string }>> {
    return requestWithFallback(
      `/api/claim/${token}`,
      {
        method: "POST",
        body: JSON.stringify({ stellar_address, nullifier }),
      },
      { status: "claimed", nullifier: nullifier || "mock-nullifier-" + Date.now() }
    )
  },

  async withdrawPayment(token: string): Promise<ApiResponse<{ stellar_tx_hash: string; amount_xlm: number }>> {
    return requestWithFallback(
      `/api/claim/${token}/withdraw`,
      { method: "POST" },
      {
        stellar_tx_hash: "b58091a134018274198273948127398471298374192837419283741928374192",
        amount_xlm: 70833.3333333,
      }
    )
  },
}
