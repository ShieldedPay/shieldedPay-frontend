import { NextRequest, NextResponse } from "next/server"
import { api } from "@/lib/api"

export async function GET() {
  const result = await api.getEmployees()
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = await api.createEmployee(body)
  return NextResponse.json(result)
}
