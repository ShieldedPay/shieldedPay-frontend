import { NextRequest, NextResponse } from "next/server"
import { api } from "@/lib/api"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const result = await api.getClaim(token)
  return NextResponse.json(result)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const body = await req.json()
  const result = await api.submitClaim(token, body.stellar_address, body.nullifier)
  return NextResponse.json(result)
}
