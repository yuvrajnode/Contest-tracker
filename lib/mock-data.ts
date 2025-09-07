import type { Contest } from "@/app/types/contest"

// Mock data for when the database is not available
export const mockContests: Contest[] = [
  {
    id: "cf-1234",
    name: "Codeforces Round #789 (Div. 2)",
    platform: "codeforces",
    url: "https://codeforces.com/contests/1234",
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 hours duration
    duration: 7200, // 2 hours in seconds
  },
  {
    id: "cf-1235",
    name: "Codeforces Round #790 (Div. 1)",
    platform: "codeforces",
    url: "https://codeforces.com/contests/1235",
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000).toISOString(), // 2.5 hours duration
    duration: 9000, // 2.5 hours in seconds
  },
  {
    id: "cc-123",
    name: "CodeChef Starters 42",
    platform: "codechef",
    url: "https://www.codechef.com/START42",
    startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours duration
    duration: 10800, // 3 hours in seconds
  },
  {
    id: "lc-weekly-300",
    name: "LeetCode Weekly Contest 300",
    platform: "leetcode",
    url: "https://leetcode.com/contest/weekly-contest-300",
    startTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
    endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours duration
    duration: 5400, // 1.5 hours in seconds
  },
  {
    id: "cf-1230",
    name: "Codeforces Round #785 (Div. 2)",
    platform: "codeforces",
    url: "https://codeforces.com/contests/1230",
    startTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    endTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    duration: 7200,
    solutionLink: "https://www.youtube.com/watch?v=example1",
  },
  {
    id: "cc-120",
    name: "CodeChef Starters 40",
    platform: "codechef",
    url: "https://www.codechef.com/START40",
    startTime: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    endTime: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
    duration: 10800,
    solutionLink: "https://www.youtube.com/watch?v=example2",
  },
  {
    id: "lc-weekly-298",
    name: "LeetCode Weekly Contest 298",
    platform: "leetcode",
    url: "https://leetcode.com/contest/weekly-contest-298",
    startTime: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    endTime: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000).toISOString(),
    duration: 5400,
  },
]

// Mock bookmarks
export const mockBookmarks = ["cf-1234", "lc-weekly-300"]

