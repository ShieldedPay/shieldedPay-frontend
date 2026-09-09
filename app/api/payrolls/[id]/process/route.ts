import { NextRequest, NextResponse } from "next/server"
import { api } from "@/lib/api"

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const result = await api.processPayroll(id)
  return NextResponse.json(result)
}
