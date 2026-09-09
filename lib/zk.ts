/**
 * Zero-Knowledge and Cryptographic primitives for ShieldedPay Client
 * Implements Merkle proof verification, domain-separated leaf hashing,
 * and nullifier derivation matching ShieldedPay Soroban Smart Contracts.
 */

// Pure JS SHA-256 implementation for universal compatibility (Browser, Node, WebWorkers, JSDOM)
function sha256Sync(bytes: Uint8Array): Uint8Array {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  let H0 = 0x6a09e667, H1 = 0xbb67ae85, H2 = 0x3c6ef372, H3 = 0xa54ff53a;
  let H4 = 0x510e527f, H5 = 0x9b05688c, H6 = 0x1f83d9ab, H7 = 0x5be0cd19;

  const l = bytes.length;
  const bitLen = l * 8;
  const padLen = ((l + 8) >> 6) + 1;
  const words = new Uint32Array(padLen * 16);

  for (let i = 0; i < l; i++) {
    words[i >> 2] |= bytes[i] << (24 - (i % 4) * 8);
  }
  words[l >> 2] |= 0x80 << (24 - (l % 4) * 8);
  words[words.length - 1] = bitLen >>> 0;
  words[words.length - 2] = Math.floor(bitLen / 0x100000000);

  const W = new Uint32Array(64);

  for (let i = 0; i < words.length; i += 16) {
    for (let t = 0; t < 16; t++) {
      W[t] = words[i + t];
    }
    for (let t = 16; t < 64; t++) {
      const s0 = (rightRotate(W[t - 15], 7) ^ rightRotate(W[t - 15], 18) ^ (W[t - 15] >>> 3)) >>> 0;
      const s1 = (rightRotate(W[t - 2], 17) ^ rightRotate(W[t - 2], 19) ^ (W[t - 2] >>> 10)) >>> 0;
      W[t] = (W[t - 16] + s0 + W[t - 7] + s1) >>> 0;
    }

    let a = H0, b = H1, c = H2, d = H3, e = H4, f = H5, g = H6, h = H7;

    for (let t = 0; t < 64; t++) {
      const S1 = (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) >>> 0;
      const ch = ((e & f) ^ (~e & g)) >>> 0;
      const temp1 = (h + S1 + ch + K[t] + W[t]) >>> 0;
      const S0 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) >>> 0;
      const maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0;
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    H0 = (H0 + a) >>> 0;
    H1 = (H1 + b) >>> 0;
    H2 = (H2 + c) >>> 0;
    H3 = (H3 + d) >>> 0;
    H4 = (H4 + e) >>> 0;
    H5 = (H5 + f) >>> 0;
    H6 = (H6 + g) >>> 0;
    H7 = (H7 + h) >>> 0;
  }

  const out = new Uint8Array(32);
  const hashes = [H0, H1, H2, H3, H4, H5, H6, H7];
  for (let i = 0; i < 8; i++) {
    out[i * 4] = (hashes[i] >>> 24) & 0xff;
    out[i * 4 + 1] = (hashes[i] >>> 16) & 0xff;
    out[i * 4 + 2] = (hashes[i] >>> 8) & 0xff;
    out[i * 4 + 3] = hashes[i] & 0xff;
  }
  return out;
}

function rightRotate(x: number, n: number): number {
  return ((x >>> n) | (x << (32 - n))) >>> 0;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.substring(i, i + 2), 16);
  }
  return bytes;
}

export function stringToBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

/**
 * Universal SHA-256 hash function returning hex string
 */
export function sha256(data: Uint8Array | string): string {
  const bytes = typeof data === "string" ? stringToBytes(data) : data;
  return bytesToHex(sha256Sync(bytes));
}

/**
 * Computes a leaf hash with domain separation prefix 0x00
 * matches Soroban contract: sha256(0x00 || recipient || amount || token || salt)
 */
export function computeDisbursementLeafClient(
  recipient: string,
  amount: number,
  token: string,
  saltHex: string
): string {
  const prefix = new Uint8Array([0x00]);
  const recipientBytes = stringToBytes(recipient);
  const amountBytes = stringToBytes(String(amount));
  const tokenBytes = stringToBytes(token);
  const saltBytes = hexToBytes(saltHex);

  const totalLen =
    prefix.length +
    recipientBytes.length +
    amountBytes.length +
    tokenBytes.length +
    saltBytes.length;

  const combined = new Uint8Array(totalLen);
  let offset = 0;

  combined.set(prefix, offset);
  offset += prefix.length;
  combined.set(recipientBytes, offset);
  offset += recipientBytes.length;
  combined.set(amountBytes, offset);
  offset += amountBytes.length;
  combined.set(tokenBytes, offset);
  offset += tokenBytes.length;
  combined.set(saltBytes, offset);

  return sha256(combined);
}

/**
 * Computes branch pair hash with domain separation prefix 0x01
 * matches Soroban contract: sha256(0x01 || left || right)
 */
export function hashBranchPairClient(leftHex: string, rightHex: string): string {
  const prefix = new Uint8Array([0x01]);
  const leftBytes = hexToBytes(leftHex);
  const rightBytes = hexToBytes(rightHex);

  const combined = new Uint8Array(prefix.length + leftBytes.length + rightBytes.length);
  combined.set(prefix, 0);
  combined.set(leftBytes, prefix.length);
  combined.set(rightBytes, prefix.length + leftBytes.length);

  return sha256(combined);
}

/**
 * Derives a nullifier hash from secret and commitment/leaf.
 * Prevents double-spending on Soroban while keeping recipient identity shielded.
 */
export function deriveNullifierClient(secret: string, commitment: string): string {
  return sha256(`${secret}:${commitment}`);
}

/**
 * Verifies a Merkle proof client-side against the expected root using index parity.
 * Returns true if valid, false if invalid.
 */
export function verifyMerkleProofClient(
  leafHex: string,
  proof: string[],
  rootHex: string,
  index: number
): boolean {
  if (!rootHex) return false;
  let computed = leafHex;
  let idx = index;

  for (const sibling of proof) {
    if (idx % 2 === 0) {
      computed = hashBranchPairClient(computed, sibling);
    } else {
      computed = hashBranchPairClient(sibling, computed);
    }
    idx = Math.floor(idx / 2);
  }

  return computed.toLowerCase() === rootHex.toLowerCase();
}
