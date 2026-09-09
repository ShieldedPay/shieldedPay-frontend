import { describe, it, expect } from "vitest"
import { parseAndValidateCsv, isValidStellarAddress } from "@/components/admin/csv-batch-upload"

describe("CSV Payroll Batch Parser & Validator", () => {
  it("validates Stellar public keys correctly", () => {
    // Valid 56-char Stellar ed25519 public key
    const validKey = "GBDEVUYTI7C6W4Q4VMSB4AZVXZK5LY4F2QJBLZOH7D2R2BGLQG3PZSPY"
    expect(isValidStellarAddress(validKey)).toBe(true)

    // Invalid: starts with S (secret seed)
    expect(isValidStellarAddress("SBDEVUYTI7C6W4Q4VMSB4AZVXZK5LY4F2QJBLZOH7D2R2BGLQG3PZSPY")).toBe(false)
    // Invalid: length != 56
    expect(isValidStellarAddress("GBDEVUYTI7C6W4Q4VMSB4AZVXZK5LY")).toBe(false)
    // Invalid: lowercase
    expect(isValidStellarAddress("gbdevuyti7c6w4q4vmsb4azvxzk5ly4f2qjblzoh7d2r2bglqg3pzspy")).toBe(false)
    // Invalid: numbers 0, 1, 8, 9 not in RFC4648 base32
    expect(isValidStellarAddress("G1089UYTI7C6W4Q4VMSB4AZVXZK5LY4F2QJBLZOH7D2R2BGLQG3PZSPY")).toBe(false)
  })

  it("parses valid CSV rows and computes salary amounts", () => {
    const csv = `name,stellar_address,salary_usd,currency,external_id
Alice,GBDEVUYTI7C6W4Q4VMSB4AZVXZK5LY4F2QJBLZOH7D2R2BGLQG3PZSPY,7500.50,USD,EMP-01
Bob,GCZNM4Y23V6I7TX7QWY2H5C4A346WBLDOD6IUGQ2S4XJWWY3L7G4ZSPY,8200.00,USD,EMP-02`

    const { valid, errors } = parseAndValidateCsv(csv)
    expect(errors).toHaveLength(0)
    expect(valid).toHaveLength(2)
    expect(valid[0].name).toBe("Alice")
    expect(valid[0].salaryUsd).toBe(7500.5)
    expect(valid[1].name).toBe("Bob")
    expect(valid[1].salaryUsd).toBe(8200)
  })

  it("identifies row errors with descriptive messages", () => {
    const csvWithErrors = `name,stellar_address,salary_usd
,GBDEVUYTI7C6W4Q4VMSB4AZVXZK5LY4F2QJBLZOH7D2R2BGLQG3PZSPY,5000
Charlie,INVALID_ADDRESS,6000
David,GBDEVUYTI7C6W4Q4VMSB4AZVXZK5LY4F2QJBLZOH7D2R2BGLQG3PZSPY,-100`

    const { valid, errors } = parseAndValidateCsv(csvWithErrors)
    expect(valid).toHaveLength(0)
    expect(errors).toHaveLength(3)

    expect(errors[0].field).toBe("name")
    expect(errors[1].field).toBe("stellar_address")
    expect(errors[2].field).toBe("salary_usd")
  })
})
