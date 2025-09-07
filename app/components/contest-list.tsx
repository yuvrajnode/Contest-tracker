"use client"

import type { Contest } from "@/app/types/contest"
import ContestCard from "./contest-card"

interface ContestListProps {
  contests: Contest[]
  bookmarkedContests: string[]
  toggleBookmark: (contestId: string) => void
}

export default function ContestList({ contests, bookmarkedContests, toggleBookmark }: ContestListProps) {
  if (contests.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-600 dark:text-gray-300">No contests found matching your filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contests.map((contest) => (
        <ContestCard
          key={contest.id}
          contest={contest}
          isBookmarked={bookmarkedContests.includes(contest.id)}
          toggleBookmark={toggleBookmark}
        />
      ))}
    </div>
  )
}

