import { describe, it, expect } from "vitest"
import {
  computeDisbursementLeafClient,
  hashBranchPairClient,
  deriveNullifierClient,
  verifyMerkleProofClient,
  sha256,
} from "@/lib/zk"
import { createHash } from "crypto"

describe("ShieldedPay ZK Cryptographic Primitives", () => {
  const recipient = "GBDEVUYTI7C6W4Q4VMSB4AZVXZK5LY4F2QJBLZOH7D2R2BGLQG3PZSPY"
  const amount = 8500
  const token = "USDC"
  const salt = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"

  it("computes domain-separated disbursement leaves identically to Soroban contract and backend", () => {
    const clientLeaf = computeDisbursementLeafClient(recipient, amount, token, salt)
    
    // Expected node crypto leaf
    const buf = Buffer.concat([
      Buffer.from([0x00]),
      Buffer.from(recipient, "utf-8"),
      Buffer.from(String(amount), "utf-8"),
      Buffer.from(token, "utf-8"),
      Buffer.from(salt, "hex"),
    ])
    const expectedLeaf = createHash("sha256").update(buf).digest("hex")

    expect(clientLeaf).toBe(expectedLeaf)
    expect(clientLeaf).toHaveLength(64)
  })

  it("computes domain-separated branch pairs correctly", () => {
    const left = "a".repeat(64)
    const right = "b".repeat(64)
    const branch = hashBranchPairClient(left, right)

    const buf = Buffer.concat([
      Buffer.from([0x01]),
      Buffer.from(left, "hex"),
      Buffer.from(right, "hex"),
    ])
    const expected = createHash("sha256").update(buf).digest("hex")
    expect(branch).toBe(expected)
  })

  it("derives deterministic nullifier protecting against double-spending", () => {
    const secret = "voucher-secret-test-999"
    const commitment = "c".repeat(64)
    const nullifier = deriveNullifierClient(secret, commitment)

    const expected = createHash("sha256").update(`${secret}:${commitment}`).digest("hex")
    expect(nullifier).toBe(expected)
    expect(nullifier).toHaveLength(64)
  })

  it("verifies valid Merkle proofs client-side", () => {
    const leaf = computeDisbursementLeafClient(recipient, amount, token, salt)
    const sibling = "f".repeat(64)
    const root = hashBranchPairClient(leaf, sibling)

    const proof = [sibling]
    const isValid = verifyMerkleProofClient(leaf, proof, root, 0)
    expect(isValid).toBe(true)

    // With incorrect root, must return false
    const isBadRootValid = verifyMerkleProofClient(leaf, proof, "1234567890".repeat(6) + "1234", 0)
    expect(isBadRootValid).toBe(false)

    // With incorrect leaf, must return false
    const isBadLeafValid = verifyMerkleProofClient("0".repeat(64), proof, root, 0)
    expect(isBadLeafValid).toBe(false)
  })
})
