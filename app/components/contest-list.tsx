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
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm font-medium text-foreground">No contests found</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
          Try adjusting your filters or sync the latest contests.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
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
