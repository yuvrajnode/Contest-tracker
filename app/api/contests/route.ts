import { NextResponse } from "next/server"
import prisma, { checkDatabaseConnection } from "@/lib/prisma"
import { mockContests } from "@/lib/mock-data"

// GET /api/contests - Get all contests
export async function GET() {
  try {
    const isConnected = await checkDatabaseConnection()

    if (!isConnected) {
      console.warn("Database unavailable, serving mock contests")
      return NextResponse.json(mockContests)
    }

    const contests = await prisma.contest.findMany({
      orderBy: {
        startTime: "asc",
      },
    })

    return NextResponse.json(contests.length ? contests : mockContests)
  } catch (error) {
    console.error("Error fetching contests:", error)
    return NextResponse.json(mockContests)
  }
}

