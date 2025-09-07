import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/contests - Get all contests
export async function GET() {
  try {
    const contests = await prisma.contest.findMany({
      orderBy: {
        startTime: "asc",
      },
    })

    return NextResponse.json(contests)
  } catch (error) {
    console.error("Error fetching contests:", error)
    return NextResponse.json({ error: "Failed to fetch contests" }, { status: 500 })
  }
}

