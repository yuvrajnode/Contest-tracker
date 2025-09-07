export type Platform = "codeforces" | "codechef" | "leetcode"

export interface Contest {
  id: string
  name: string
  platform: Platform
  url: string
  startTime: string
  endTime: string
  duration: number // in seconds
  solutionLink?: string
  createdAt?: string
  updatedAt?: string
}

export interface Bookmark {
  id: string
  userId: string
  contestId: string
  createdAt: string
}

