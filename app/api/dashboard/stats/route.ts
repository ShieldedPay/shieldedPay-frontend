import { NextResponse } from "next/server"
import { api } from "@/lib/api"

export async function GET() {
  const result = await api.getDashboardStats()
  return NextResponse.json(result)
}
