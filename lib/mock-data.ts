import type {
  Organization,
  EmployeeWithDecryptedName,
  Payroll,
  DisbursementWithEmployee,
  TreasuryOperation,
  DashboardStats,
  ClaimInfo,
} from "./types"

export const mockOrganization: Organization = {
  id: "org_shielded_01",
  name: "TechGlobal Inc.",
  stellar_treasury_address: "GAYOAOQ7XQ26K7254U2K654Y4SFFLRODXCSQGCSJ3SJJWTY6N6BRLG5J",
  created_at: "2026-01-15T09:00:00Z",
  updated_at: "2026-09-01T12:00:00Z",
}

export const mockEmployees: EmployeeWithDecryptedName[] = [
  {
    id: "emp_01",
    org_id: "org_shielded_01",
    external_id: "EXT-101",
    email_hash: "a4f83e20bb43c8d19f854be7e3c129486c67efcf38a081534b8c9d233cf9f142",
    name: "Alex Rivera",
    salary_usd: 8500,
    currency: "USD",
    country: "Portugal",
    status: "active",
    stellar_address: "GBDEVUYTI7C6W4Q4VMSB4AZVXZK5LY4F2QJBLZOH7D2R2BGLQG3PZSPY",
    created_at: "2026-01-20T10:00:00Z",
    updated_at: "2026-08-01T14:30:00Z",
  },
  {
    id: "emp_02",
    org_id: "org_shielded_01",
    external_id: "EXT-102",
    email_hash: "d2f5e18237c18a245598129e012bcfe891238491823abce12839123812739182",
    name: "Elena Rostova",
    salary_usd: 9200,
    currency: "USD",
    country: "Estonia",
    status: "active",
    stellar_address: "GA6Z2P4ZQXN2X62V33GZPYQ34C7XKJNWLZ2CUX2F6564E3M3WXYZ4567",
    created_at: "2026-02-01T11:00:00Z",
    updated_at: "2026-08-01T14:30:00Z",
  },
  {
    id: "emp_03",
    org_id: "org_shielded_01",
    external_id: "EXT-103",
    email_hash: "8273618291028374619283746192837461928374619283746192837461928374",
    name: "Kenji Sato",
    salary_usd: 11000,
    currency: "USD",
    country: "Japan",
    status: "active",
    stellar_address: "GCZNM4Y23V6I7TX7QWY2H5C4A346WBLDOD6IUGQ2S4XJWWY3L7G4ZSPY",
    created_at: "2026-02-15T08:00:00Z",
    updated_at: "2026-08-01T14:30:00Z",
  },
  {
    id: "emp_04",
    org_id: "org_shielded_01",
    external_id: "EXT-104",
    email_hash: "9182736451029384756102938475610293847561029384756102938475610293",
    name: "Sarah Jenkins",
    salary_usd: 7800,
    currency: "USD",
    country: "United Kingdom",
    status: "active",
    stellar_address: "GD537P8ZQXN2X62V33GZPYQ34C7XKJNWLZ2CUX2F6564E3M3WXYZ7890",
    created_at: "2026-03-01T09:30:00Z",
    updated_at: "2026-08-01T14:30:00Z",
  },
]

export const mockPayrolls: Payroll[] = [
  {
    id: "pr_2026_08",
    org_id: "org_shielded_01",
    period_start: "2026-08-01",
    period_end: "2026-08-31",
    status: "completed",
    total_usd: 36500,
    employee_count: 4,
    merkle_root: "9e5c464450259b19e9f193cb9d4fb971bcba9a83853110a248fca8a4d46797ea",
    created_at: "2026-08-28T10:00:00Z",
    processed_at: "2026-08-31T18:00:00Z",
  },
  {
    id: "pr_2026_09",
    org_id: "org_shielded_01",
    period_start: "2026-09-01",
    period_end: "2026-09-30",
    status: "pending",
    total_usd: 36500,
    employee_count: 4,
    merkle_root: "4a8c9913bc54df1103adba112f458ce39bb5c110294fec1982aa00bdf12984ea",
    created_at: "2026-09-08T11:00:00Z",
    processed_at: null,
  },
]

export const mockDisbursements: DisbursementWithEmployee[] = [
  {
    id: "disb_01",
    payroll_id: "pr_2026_08",
    employee_id: "emp_01",
    employee_name: "Alex Rivera",
    employee_country: "Portugal",
    amount_usd: 8500,
    amount_xlm: 70833.3333333,
    status: "withdrawn",
    commitment_hash: "6f528a474d2b270a3194a2bcfc2a93949f55e09be0d10b77e8a34293f0b0ca12",
    nullifier: "3e4b77f98124018ca472506e12e8cf38b19a712f5a043818e950bc491950e93a",
    stellar_tx_hash: "a490d3d52033bc8834f82810a9f029c9efb12398492040182390849201948201",
    claim_token: "demo-claimed-token",
    claimed_at: "2026-09-01T12:00:00Z",
    withdrawn_at: "2026-09-01T12:05:00Z",
    created_at: "2026-08-28T10:00:00Z",
  },
  {
    id: "disb_02",
    payroll_id: "pr_2026_09",
    employee_id: "emp_01",
    employee_name: "Alex Rivera",
    employee_country: "Portugal",
    amount_usd: 8500,
    amount_xlm: 70833.3333333,
    status: "committed",
    commitment_hash: "d4f3b1109a823758b21c56ea843bc401f78235cb9948ecba827103859203875a",
    nullifier: null,
    stellar_tx_hash: null,
    claim_token: "voucher-test-token-101",
    claimed_at: null,
    withdrawn_at: null,
    created_at: "2026-09-08T11:00:00Z",
  },
  {
    id: "disb_03",
    payroll_id: "pr_2026_09",
    employee_id: "emp_02",
    employee_name: "Elena Rostova",
    employee_country: "Estonia",
    amount_usd: 9200,
    amount_xlm: 76666.6666667,
    status: "committed",
    commitment_hash: "8274ac9183bce491823746a18293740192837461928374619283746192837461",
    nullifier: null,
    stellar_tx_hash: null,
    claim_token: "voucher-test-token-102",
    claimed_at: null,
    withdrawn_at: null,
    created_at: "2026-09-08T11:00:00Z",
  },
]

export const mockTreasuryOperations: TreasuryOperation[] = [
  {
    id: "top_01",
    org_id: "org_shielded_01",
    type: "deposit",
    amount_usd: 250000,
    amount_xlm: 2083333.3333333,
    description: "Initial treasury capital injection",
    stellar_tx_hash: "d9e4a8123982348a829103984029384029384029384029384029384029384029",
    created_at: "2026-07-01T10:00:00Z",
  },
  {
    id: "top_02",
    org_id: "org_shielded_01",
    type: "yield",
    amount_usd: 630,
    amount_xlm: 5250,
    description: "August DeFi vault yield accrued (4.5% APY)",
    stellar_tx_hash: "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    created_at: "2026-08-31T23:59:59Z",
  },
  {
    id: "top_03",
    org_id: "org_shielded_01",
    type: "withdrawal",
    amount_usd: 36500,
    amount_xlm: 304166.6666667,
    description: "Payroll disbursement settlement - August 2026",
    stellar_tx_hash: "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    created_at: "2026-08-31T18:00:00Z",
  },
]

export const mockStats: DashboardStats = {
  totalEmployees: 4,
  activePayrolls: 1,
  treasuryBalance: 214130,
  pendingClaims: 2,
  monthlyPayroll: 36500,
  yieldEarned: 2430,
}

export function getMockClaimByToken(token: string): (ClaimInfo & {
  recipient?: string
  salt?: string
  merkle_root?: string
  merkle_proof?: string[]
  leaf_index?: number
}) | null {
  if (token === "demo-claimed-token") {
    return {
      disbursement_id: "disb_01",
      amount_usd: 8500,
      amount_xlm: 70833.3333333,
      status: "withdrawn",
      period_start: "2026-08-01",
      period_end: "2026-08-31",
      org_name: "TechGlobal Inc.",
      recipient: "GBDEVUYTI7C6W4Q4VMSB4AZVXZK5LY4F2QJBLZOH7D2R2BGLQG3PZSPY",
      salt: "1111111111111111111111111111111111111111111111111111111111111111",
      merkle_root: "9e5c464450259b19e9f193cb9d4fb971bcba9a83853110a248fca8a4d46797ea",
      merkle_proof: ["2222222222222222222222222222222222222222222222222222222222222222"],
      leaf_index: 0,
    }
  }

  // Default mock for any valid test token (e.g. voucher-test-token-101 or unknown tokens)
  return {
    disbursement_id: "disb_02",
    amount_usd: 8500,
    amount_xlm: 70833.3333333,
    status: "committed",
    period_start: "2026-09-01",
    period_end: "2026-09-30",
    org_name: "TechGlobal Inc.",
    recipient: "GBDEVUYTI7C6W4Q4VMSB4AZVXZK5LY4F2QJBLZOH7D2R2BGLQG3PZSPY",
    salt: "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
    merkle_root: "4a8c9913bc54df1103adba112f458ce39bb5c110294fec1982aa00bdf12984ea",
    merkle_proof: [
      "8274ac9183bce491823746a18293740192837461928374619283746192837461",
      "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    ],
    leaf_index: 0,
  }
}
