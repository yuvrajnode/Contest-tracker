"use client"

import type { Contest } from "@/app/types/contest"
import ContestCard from "./contest-card"
import { Trophy } from "lucide-react"

interface ContestListProps {
  contests: Contest[]
  bookmarkedContests: string[]
  toggleBookmark: (contestId: string) => void
}

export default function ContestList({ contests, bookmarkedContests, toggleBookmark }: ContestListProps) {
  if (contests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
          <Trophy className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No contests found</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Try adjusting your filters or sync the latest contests from the button above.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
