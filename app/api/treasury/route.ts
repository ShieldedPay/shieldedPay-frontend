import { NextResponse } from "next/server"
import { api } from "@/lib/api"

export async function GET() {
  const result = await api.getTreasury()
  return NextResponse.json(result)
}
