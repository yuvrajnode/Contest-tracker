import { NextResponse } from "next/server"
import prisma, { checkDatabaseConnection } from "@/lib/prisma"
import axios from "axios"
import { mockContests } from "@/lib/mock-data"

// POST /api/contests/update - Update contests from external APIs
export async function POST() {
  try {
    // Fetch contests from all platforms
    const [codeforcesContests, codechefContests, leetcodeContests] = await Promise.all([
      fetchCodeforcesContests(),
      fetchCodeChefContests(),
      fetchLeetCodeContests(),
    ])

    const allContests = [...codeforcesContests, ...codechefContests, ...leetcodeContests]

    const isConnected = await checkDatabaseConnection()

    if (isConnected) {
      // Update database with new contests (upsert)
      for (const contest of allContests) {
        await prisma.contest.upsert({
          where: { id: contest.id },
          update: contest,
          create: contest,
        })
      }

      return NextResponse.json({ message: "Contests updated successfully" })
    } else {
      // Just return success message if database is not available
      console.log("Skipping database update due to connection issues")
      return NextResponse.json({
        message: "Contests fetched but not saved to database due to connection issues",
        contests: allContests,
      })
    }
  } catch (error) {
    console.error("Error updating contests:", error)
    return NextResponse.json(
      { message: "Failed to update contests, using mock data", contests: mockContests },
      { status: 200 },
    )
  }
}

// Fetch contests from Codeforces
async function fetchCodeforcesContests() {
  try {
    const response = await axios.get("https://codeforces.com/api/contest.list")
    const contests = response.data.result.filter((contest) => !contest.phase.includes("FINISHED"))

    return contests.map((contest) => ({
      id: `cf-${contest.id}`,
      name: contest.name,
      platform: "codeforces",
      url: `https://codeforces.com/contests/${contest.id}`,
      startTime: new Date(contest.startTimeSeconds * 1000),
      endTime: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000),
      duration: contest.durationSeconds,
    }))
  } catch (error) {
    console.error("Error fetching Codeforces contests:", error)
    return []
  }
}

// Fetch contests from CodeChef
async function fetchCodeChefContests() {
  try {
    // CodeChef doesn't have a public API, so we would need to scrape the website
    // This is a simplified example with mock data
    return [
      {
        id: "cc-START100",
        name: "CodeChef Starters 100",
        platform: "codechef",
        url: "https://www.codechef.com/START100",
        startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours duration
        duration: 10800, // 3 hours in seconds
      },
      {
        id: "cc-COOK150",
        name: "CodeChef Cook-Off 150",
        platform: "codechef",
        url: "https://www.codechef.com/COOK150",
        startTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000), // 2.5 hours duration
        duration: 9000, // 2.5 hours in seconds
      },
    ]
  } catch (error) {
    console.error("Error fetching CodeChef contests:", error)
    return []
  }
}

// Fetch contests from LeetCode
async function fetchLeetCodeContests() {
  try {
    // LeetCode doesn't have a public API for contests, so we would need to scrape or use a third-party API
    // This is a simplified example with mock data
    return [
      {
        id: "lc-weekly-350",
        name: "LeetCode Weekly Contest 350",
        platform: "leetcode",
        url: "https://leetcode.com/contest/weekly-contest-350",
        startTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
        endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000), // 1.5 hours duration
        duration: 5400, // 1.5 hours in seconds
      },
      {
        id: "lc-biweekly-125",
        name: "LeetCode Biweekly Contest 125",
        platform: "leetcode",
        url: "https://leetcode.com/contest/biweekly-contest-125",
        startTime: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000), // 13 days from now
        endTime: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000), // 1.5 hours duration
        duration: 5400, // 1.5 hours in seconds
      },
    ]
  } catch (error) {
    console.error("Error fetching LeetCode contests:", error)
    return []
  }
}

