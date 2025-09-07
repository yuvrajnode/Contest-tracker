import { NextResponse } from "next/server"
import prisma, { checkDatabaseConnection } from "@/lib/prisma"
import { google } from "googleapis"

// POST /api/youtube/auto-fetch - Auto-fetch YouTube solution links
export async function POST() {
  try {
    const isConnected = await checkDatabaseConnection()

    if (!isConnected) {
      console.log("Skipping YouTube auto-fetch due to database connection issues")
      return NextResponse.json({
        message: "Auto-fetch skipped due to database connection issues",
        results: { mock: { total: 0, matched: 0 } },
      })
    }

    // Initialize YouTube API client
    const youtube = google.youtube({
      version: "v3",
      auth: process.env.YOUTUBE_API_KEY,
    })

    // Get channel IDs from environment variables
    const channelIds = {
      leetcode: process.env.LEETCODE_CHANNEL_ID,
      codeforces: process.env.CODEFORCES_CHANNEL_ID,
      codechef: process.env.CODECHEF_CHANNEL_ID,
    }

    const results: Record<string, { total: number; matched: number }> = {}

    // For each platform, fetch videos and match them to contests
    for (const [platform, channelId] of Object.entries(channelIds)) {
      if (!channelId) continue

      // Get videos from the channel
      const response = await youtube.search.list({
        channelId,
        part: ["snippet"],
        order: "date",
        maxResults: 50,
      })

      const videos = response.data.items || []
      results[platform] = { total: videos.length, matched: 0 }

      // Get all contests for this platform
      const contests = await prisma.contest.findMany({
        where: {
          platform: platform as any,
          endTime: {
            lt: new Date(), // Only past contests
          },
        },
      })

      // Try to match videos to contests
      for (const video of videos) {
        if (!video.snippet) continue
        const title = video.snippet.title?.toLowerCase() || ""

        for (const contest of contests) {
          // Check if video title contains contest name or ID
          const contestName = contest.name.toLowerCase()
          const contestId = contest.id.toLowerCase()

          if (title.includes(contestName) || title.includes(contestId)) {
            // Update contest with solution link
            await prisma.contest.update({
              where: {
                id: contest.id,
              },
              data: {
                solutionLink: `https://www.youtube.com/watch?v=${video.id?.videoId}`,
              },
            })

            results[platform].matched++
            break
          }
        }
      }
    }

    return NextResponse.json({
      message: "Auto-fetch completed",
      results,
    })
  } catch (error) {
    console.error("Error auto-fetching YouTube links:", error)
    return NextResponse.json(
      {
        message: "Auto-fetch failed, using mock response",
        results: { mock: { total: 0, matched: 0 } },
      },
      { status: 200 },
    )
  }
}

