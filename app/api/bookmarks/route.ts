import { NextResponse } from "next/server"
import prisma, { checkDatabaseConnection } from "@/lib/prisma"
import { mockBookmarks } from "@/lib/mock-data"

// For now, we'll use a fixed userId until we implement authentication
const TEMP_USER_ID = "user-1"

// GET /api/bookmarks - Get user bookmarks
export async function GET() {
  try {
    const isConnected = await checkDatabaseConnection()

    if (isConnected) {
      // Use database if connected
      const bookmarks = await prisma.bookmark.findMany({
        where: {
          userId: TEMP_USER_ID,
        },
      })

      return NextResponse.json(bookmarks.map((b) => b.contestId))
    } else {
      // Use mock data if database is not available
      console.log("Using mock bookmark data due to database connection issues")
      return NextResponse.json(mockBookmarks)
    }
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    // Fallback to mock data on error
    return NextResponse.json(mockBookmarks)
  }
}

// POST /api/bookmarks - Toggle bookmark
export async function POST(request: Request) {
  try {
    const { contestId } = await request.json()
    const isConnected = await checkDatabaseConnection()

    if (isConnected) {
      // Use database if connected
      const existingBookmark = await prisma.bookmark.findFirst({
        where: {
          userId: TEMP_USER_ID,
          contestId,
        },
      })

      if (existingBookmark) {
        // Remove bookmark if it exists
        await prisma.bookmark.delete({
          where: {
            id: existingBookmark.id,
          },
        })

        return NextResponse.json({ message: "Bookmark removed" })
      } else {
        // Add bookmark if it doesn't exist
        await prisma.bookmark.create({
          data: {
            userId: TEMP_USER_ID,
            contestId,
          },
        })

        return NextResponse.json({ message: "Bookmark added" })
      }
    } else {
      // Just return success message if database is not available
      console.log("Using mock bookmark toggle due to database connection issues")
      return NextResponse.json({ message: "Bookmark toggled (mock)" })
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error)
    return NextResponse.json({ message: "Bookmark toggled (mock fallback)" }, { status: 200 })
  }
}

