import React, { Suspense } from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import ClaimPage from "@/app/claim/[token]/page"

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    loading: vi.fn(() => "test-toast"),
    dismiss: vi.fn(),
  },
}))

function renderWithSwr(ui: React.ReactNode) {
  return render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <Suspense fallback={<div>Loading...</div>}>
        {ui}
      </Suspense>
    </SWRConfig>
  )
}

describe("Multi-Step Claim Workflow Component Coverage", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("renders voucher lookup details and step 1 wallet input", async () => {
    const mockClaimData = {
      success: true,
      data: {
        disbursement_id: "disb_02",
        amount_usd: 8500,
        amount_xlm: 70833.33,
        status: "committed",
        period_start: "2026-09-01",
        period_end: "2026-09-30",
        org_name: "TechGlobal Inc.",
        recipient: "GBDEVUYTI7C6W4Q4VMSB4AZVXZK5LY4F2QJBLZOH7D2R2BGLQG3PZSPY",
        salt: "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
        merkle_root: "4a8c9913bc54df1103adba112f458ce39bb5c110294fec1982aa00bdf12984ea",
        merkle_proof: ["8274ac9183bce491823746a18293740192837461928374619283746192837461"],
      },
    }

    global.fetch = vi.fn().mockImplementation((url) => {
      if (String(url).includes("/api/claim/test-token")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockClaimData),
        })
      }
      return Promise.reject(new Error("Unknown route"))
    })

    renderWithSwr(<ClaimPage params={{ token: "test-token" }} />)

    await waitFor(() => {
      expect(screen.getByText("You Have a Payment Waiting")).toBeInTheDocument()
      expect(screen.getByText("$8,500.00")).toBeInTheDocument()
      expect(screen.getByText("Step 1: Enter Your Stellar Wallet")).toBeInTheDocument()
      expect(screen.getByText("Client-Side Verification")).toBeInTheDocument()
    })
  })

  it("renders success receipt state when status is withdrawn", async () => {
    const mockWithdrawnData = {
      success: true,
      data: {
        disbursement_id: "disb_01",
        amount_usd: 8500,
        amount_xlm: 70833.33,
        status: "withdrawn",
        period_start: "2026-08-01",
        period_end: "2026-08-31",
        org_name: "TechGlobal Inc.",
        stellar_tx_hash: "a490d3d52033bc8834f82810a9f029c9efb12398492040182390849201948201",
      },
    }

    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockWithdrawnData),
      })
    )

    renderWithSwr(<ClaimPage params={{ token: "withdrawn-token" }} />)

    await waitFor(() => {
      expect(screen.getByText("Payment Complete")).toBeInTheDocument()
      expect(screen.getByText(/70,833\.33/)).toBeInTheDocument()
      expect(screen.getByText("a490d3d52033bc8834f82810a9f029c9efb12398492040182390849201948201")).toBeInTheDocument()
    })
  })

  it("handles step 2 withdraw state when claim status is claimed", async () => {
    const mockClaimedData = {
      success: true,
      data: {
        disbursement_id: "disb_03",
        amount_usd: 9200,
        amount_xlm: 76666.6666667,
        status: "claimed",
        period_start: "2026-09-01",
        period_end: "2026-09-30",
        org_name: "TechGlobal Inc.",
      },
    }

    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockClaimedData),
      })
    )

    renderWithSwr(<ClaimPage params={{ token: "claimed-token" }} />)

    await waitFor(() => {
      expect(screen.getByText("Step 2: Withdraw to Your Wallet")).toBeInTheDocument()
      expect(screen.getByText("Withdraw 76,666.6666667 XLM")).toBeInTheDocument()
    })
  })
})
