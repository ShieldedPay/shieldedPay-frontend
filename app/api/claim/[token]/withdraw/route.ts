import { NextRequest, NextResponse } from "next/server"
import { api } from "@/lib/api"

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const result = await api.withdrawPayment(token)
  return NextResponse.json(result)
}
