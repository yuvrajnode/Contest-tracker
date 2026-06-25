"use client"

import { useState, useEffect, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, BookmarkIcon, Clock, Calendar, Play, Zap } from "lucide-react"
import type { Contest } from "@/app/types/contest"
import { format, formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

const PLATFORM = {
  codeforces: {
    label: "Codeforces",
    bar: "bg-red-500",
    badge: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800",
    accent: "text-red-600 dark:text-red-400",
    countdown: "bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800/60",
  },
  codechef: {
    label: "CodeChef",
    bar: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    accent: "text-amber-600 dark:text-amber-400",
    countdown: "bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/60",
  },
  leetcode: {
    label: "LeetCode",
    bar: "bg-orange-500",
    badge:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800",
    accent: "text-orange-600 dark:text-orange-400",
    countdown: "bg-orange-50 border-orange-200 dark:bg-orange-950/40 dark:border-orange-800/60",
  },
} as const

function getTimeLeft(ms: number) {
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const s = Math.floor(ms / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

const pad = (n: number) => String(n).padStart(2, "0")

interface ContestCardProps {
  contest: Contest
  isBookmarked: boolean
  toggleBookmark: (contestId: string) => void
}

export default function ContestCard({ contest, isBookmarked, toggleBookmark }: ContestCardProps) {
  const startTime = useMemo(() => new Date(contest.startTime), [contest.startTime])
  const endTime = useMemo(() => new Date(contest.endTime), [contest.endTime])
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const isUpcoming = startTime > now
  const isLive = !isUpcoming && endTime > now
  const diffMs = startTime.getTime() - now.getTime()
  const { days, hours, minutes, seconds } = getTimeLeft(diffMs)

  const durationMs = endTime.getTime() - startTime.getTime()
  const dh = Math.floor(durationMs / 3_600_000)
  const dm = Math.floor((durationMs % 3_600_000) / 60_000)

  const cfg = PLATFORM[contest.platform] ?? PLATFORM.codeforces

  const countdownLabel =
    days > 0 ? `${days}d ${pad(hours)}h ${pad(minutes)}m` : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border bg-card text-card-foreground overflow-hidden",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/30",
        isLive && "ring-2 ring-green-500/50",
      )}
    >
      {/* Platform color bar */}
      <div className={cn("h-1 w-full", cfg.bar)} />

      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Top row: badge + bookmark */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={cn("text-xs font-semibold tracking-wide", cfg.badge)}>
              {cfg.label}
            </Badge>
            {isLive && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/60 border border-green-200 dark:border-green-800 rounded-full px-2 py-0.5 animate-pulse">
                ● LIVE
              </span>
            )}
          </div>
          <button
            onClick={() => toggleBookmark(contest.id)}
            className={cn(
              "shrink-0 rounded-full p-1.5 transition-all",
              isBookmarked
                ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-950/60"
                : "text-muted-foreground hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/60",
            )}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <BookmarkIcon className={cn("h-4 w-4 transition-all", isBookmarked && "fill-current scale-110")} />
          </button>
        </div>

        {/* Contest name */}
        <h3 className="font-semibold text-base leading-snug line-clamp-2">{contest.name}</h3>

        {/* Meta info */}
        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{format(startTime, "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>
              {format(startTime, "h:mm a")} – {format(endTime, "h:mm a")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 shrink-0" />
            <span>
              {dh > 0 ? `${dh}h ` : ""}
              {dm > 0 ? `${dm}m` : ""}
              {dh === 0 && dm === 0 ? "< 1m" : ""} duration
            </span>
          </div>
        </div>

        {/* Status block */}
        {isUpcoming && (
          <div className={cn("rounded-xl border p-3", cfg.countdown)}>
            <p className="text-xs text-muted-foreground mb-1">Starts in</p>
            <p className={cn("text-xl font-bold font-mono tabular-nums tracking-tight", cfg.accent)}>
              {countdownLabel}
            </p>
          </div>
        )}

        {isLive && (
          <div className="rounded-xl border border-green-200 dark:border-green-800/60 bg-green-50 dark:bg-green-950/40 p-3">
            <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-0.5">🟢 Contest is LIVE</p>
            <p className="text-sm text-green-600 dark:text-green-400">
              Ends {formatDistanceToNow(endTime, { addSuffix: true })}
            </p>
          </div>
        )}

        {!isUpcoming && !isLive && (
          <div className="rounded-xl border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              Ended {formatDistanceToNow(endTime, { addSuffix: true })}
            </p>
          </div>
        )}

        {/* Solution link */}
        {contest.solutionLink && (
          <a
            href={contest.solutionLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
          >
            <Play className="h-4 w-4 fill-current" />
            Watch Editorial
          </a>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <Button
          className="w-full gap-2"
          variant={isLive || isUpcoming ? "default" : "outline"}
          onClick={() => window.open(contest.url, "_blank")}
        >
          {isLive ? "Join Now" : isUpcoming ? "Register" : "View Contest"}
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
