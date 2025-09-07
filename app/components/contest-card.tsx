"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, BookmarkIcon, Clock, Calendar } from "lucide-react"
import type { Contest } from "@/app/types/contest"
import { formatDistanceToNow, format } from "date-fns"

interface ContestCardProps {
  contest: Contest
  isBookmarked: boolean
  toggleBookmark: (contestId: string) => void
}

export default function ContestCard({ contest, isBookmarked, toggleBookmark }: ContestCardProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("")
  const startTime = new Date(contest.startTime)
  const endTime = new Date(contest.endTime)
  const isUpcoming = startTime > new Date()

  // Calculate duration in hours and minutes
  const durationMs = endTime.getTime() - startTime.getTime()
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60))
  const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

  useEffect(() => {
    if (!isUpcoming) return

    const updateTimeRemaining = () => {
      const now = new Date()
      if (startTime <= now) {
        setTimeRemaining("Started")
        return
      }

      setTimeRemaining(formatDistanceToNow(startTime, { addSuffix: true }))
    }

    updateTimeRemaining()
    const interval = setInterval(updateTimeRemaining, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [startTime, isUpcoming])

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "codeforces":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      case "codechef":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "leetcode":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge className={`${getPlatformColor(contest.platform)}`}>{contest.platform}</Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleBookmark(contest.id)}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <BookmarkIcon className={`h-5 w-5 ${isBookmarked ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
          </Button>
        </div>
        <CardTitle className="text-lg line-clamp-2" title={contest.name}>
          {contest.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{format(startTime, "PPP")}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Clock className="h-4 w-4 mr-2" />
            <span>
              {format(startTime, "p")} - {format(endTime, "p")}
            </span>
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            Duration: {durationHours}h {durationMinutes > 0 ? `${durationMinutes}m` : ""}
          </div>
          {isUpcoming && <div className="font-medium text-primary">{timeRemaining}</div>}
          {!isUpcoming && contest.solutionLink && (
            <div className="mt-2">
              <a
                href={contest.solutionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center"
              >
                <span>Watch Solution</span>
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => window.open(contest.url, "_blank")}>
          <span>Go to Contest</span>
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )
}

