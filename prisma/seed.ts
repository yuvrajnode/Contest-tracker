import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.bookmark.deleteMany()
  await prisma.contest.deleteMany()

  // Create sample contests
  const contests = [
    {
      id: "cf-1234",
      name: "Codeforces Round #789 (Div. 2)",
      platform: "codeforces",
      url: "https://codeforces.com/contests/1234",
      startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours duration
      duration: 7200, // 2 hours in seconds
    },
    {
      id: "cf-1235",
      name: "Codeforces Round #790 (Div. 1)",
      platform: "codeforces",
      url: "https://codeforces.com/contests/1235",
      startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000), // 2.5 hours duration
      duration: 9000, // 2.5 hours in seconds
    },
    {
      id: "cc-123",
      name: "CodeChef Starters 42",
      platform: "codechef",
      url: "https://www.codechef.com/START42",
      startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours duration
      duration: 10800, // 3 hours in seconds
    },
    {
      id: "lc-weekly-300",
      name: "LeetCode Weekly Contest 300",
      platform: "leetcode",
      url: "https://leetcode.com/contest/weekly-contest-300",
      startTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
      endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000), // 1.5 hours duration
      duration: 5400, // 1.5 hours in seconds
    },
    {
      id: "cf-1230",
      name: "Codeforces Round #785 (Div. 2)",
      platform: "codeforces",
      url: "https://codeforces.com/contests/1230",
      startTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      endTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      duration: 7200,
      solutionLink: "https://www.youtube.com/watch?v=example1",
    },
    {
      id: "cc-120",
      name: "CodeChef Starters 40",
      platform: "codechef",
      url: "https://www.codechef.com/START40",
      startTime: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      endTime: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
      duration: 10800,
      solutionLink: "https://www.youtube.com/watch?v=example2",
    },
    {
      id: "lc-weekly-298",
      name: "LeetCode Weekly Contest 298",
      platform: "leetcode",
      url: "https://leetcode.com/contest/weekly-contest-298",
      startTime: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      endTime: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000),
      duration: 5400,
    },
  ]

  for (const contest of contests) {
    await prisma.contest.create({
      data: contest,
    })
  }

  // Create sample bookmarks
  await prisma.bookmark.create({
    data: {
      userId: "user-1",
      contestId: "cf-1234",
    },
  })

  await prisma.bookmark.create({
    data: {
      userId: "user-1",
      contestId: "lc-weekly-300",
    },
  })

  console.log("Database has been seeded!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

