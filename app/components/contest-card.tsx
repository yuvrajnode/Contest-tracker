"use client"

import { useState, useEffect, useMemo } from "react"
import { Bookmark, Play, ArrowUpRight } from "lucide-react"
import type { Contest } from "@/app/types/contest"
import { format, formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

const PLATFORM = {
  codeforces: {
    short: "CF",
    label: "Codeforces",
    border: "border-l-red-500",
    text: "text-red-400",
    bg: "bg-red-500/10",
  },
  codechef: {
    short: "CC",
    label: "CodeChef",
    border: "border-l-amber-500",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  leetcode: {
    short: "LC",
    label: "LeetCode",
    border: "border-l-yellow-500",
    text: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
} as const

function pad(n: number) {
  return String(n).padStart(2, "0")
}

function getTimeLeft(ms: number) {
  if (ms <= 0) return null
  const s = Math.floor(ms / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

interface ContestCardProps {
  contest: Contest
  isBookmarked: boolean
  toggleBookmark: (id: string) => void
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
  const timeLeft = getTimeLeft(startTime.getTime() - now.getTime())

  const durationMs = endTime.getTime() - startTime.getTime()
  const dh = Math.floor(durationMs / 3_600_000)
  const dm = Math.floor((durationMs % 3_600_000) / 60_000)
  const durationStr = [dh > 0 && `${dh}h`, dm > 0 && `${dm}m`].filter(Boolean).join(" ")

  const cfg = PLATFORM[contest.platform] ?? PLATFORM.codeforces

  let countdown = ""
  if (timeLeft) {
    countdown =
      timeLeft.days > 0
        ? `${timeLeft.days}d ${pad(timeLeft.hours)}h ${pad(timeLeft.minutes)}m`
        : `${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)}`
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-3.5 rounded-md border bg-card p-4",
        "border-l-[3px] hover:bg-accent/40 transition-colors",
        cfg.border,
        isLive && "ring-1 ring-green-500/20",
      )}
    >
      {/* Top row: platform + date + bookmark */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("text-[11px] font-mono font-bold uppercase tracking-wider", cfg.text)}>
            {cfg.short}
          </span>
          <span className="text-[11px] text-muted-foreground">{format(startTime, "MMM d, yyyy")}</span>
          {isLive && (
            <span className="text-[10px] font-medium text-green-500 flex items-center gap-0.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              live
            </span>
          )}
        </div>
        <button
          onClick={() => toggleBookmark(contest.id)}
          className={cn(
            "transition-all",
            isBookmarked
              ? "text-amber-400 opacity-100"
              : "text-muted-foreground opacity-0 group-hover:opacity-100",
          )}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
        >
          <Bookmark className={cn("h-3.5 w-3.5", isBookmarked && "fill-current")} />
        </button>
      </div>

      {/* Contest name */}
      <p className="text-sm font-medium leading-snug line-clamp-2 text-foreground">
        {contest.name}
      </p>

      {/* Time meta */}
      <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
        <span>{format(startTime, "h:mm a")}</span>
        <span className="opacity-40 mx-0.5">—</span>
        <span>{format(endTime, "h:mm a")}</span>
        <span className="opacity-30 mx-1">·</span>
        <span>{durationStr}</span>
      </div>

      {/* Countdown / status */}
      {isUpcoming && timeLeft && (
        <div>
          <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-0.5">
            Starts in
          </p>
          <p className={cn("font-mono text-xl font-bold tabular-nums leading-none", cfg.text)}>
            {countdown}
          </p>
        </div>
      )}

      {isLive && (
        <div>
          <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-0.5">
            Ends
          </p>
          <p className="font-mono text-base font-semibold text-green-400 leading-none">
            {formatDistanceToNow(endTime, { addSuffix: true })}
          </p>
        </div>
      )}

      {!isUpcoming && !isLive && (
        <p className="text-[11px] text-muted-foreground">
          Ended {formatDistanceToNow(endTime, { addSuffix: true })}
        </p>
      )}

      {/* Bottom row: editorial + CTA */}
      <div className="flex items-center justify-between pt-2 border-t border-border/60 mt-auto">
        {contest.solutionLink ? (
          <a
            href={contest.solutionLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Play className="h-3 w-3 fill-current" />
            Editorial
          </a>
        ) : (
          <span />
        )}
        <a
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "text-[11px] font-medium flex items-center gap-0.5 transition-colors hover:underline underline-offset-2",
            isLive || isUpcoming ? cfg.text : "text-muted-foreground hover:text-foreground",
          )}
        >
          {isLive ? "Join now" : isUpcoming ? "Register" : "View"}
          <ArrowUpRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}
