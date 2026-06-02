import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()

  const route = await prisma.route.create({
    data: {
      name: body.name,
      runId: body.runId,
    },
  })

  return NextResponse.json(route)
}