"use client"

import type { Platform } from "@/app/types/contest"
import { Input } from "@/components/ui/input"
import { Search, X, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const PLATFORMS: { id: Platform; short: string; activeText: string }[] = [
  { id: "codeforces", short: "CF", activeText: "text-red-400" },
  { id: "codechef", short: "CC", activeText: "text-amber-400" },
  { id: "leetcode", short: "LC", activeText: "text-yellow-400" },
]

interface FilterBarProps {
  selectedPlatforms: Platform[]
  setSelectedPlatforms: (p: Platform[]) => void
  showUpcoming: boolean
  setShowUpcoming: (v: boolean) => void
  showBookmarksOnly: boolean
  setShowBookmarksOnly: (v: boolean) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
}

export default function FilterBar({
  selectedPlatforms,
  setSelectedPlatforms,
  showUpcoming,
  setShowUpcoming,
  showBookmarksOnly,
  setShowBookmarksOnly,
  searchQuery,
  setSearchQuery,
}: FilterBarProps) {
  const togglePlatform = (p: Platform) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length === 1) return
      setSelectedPlatforms(selectedPlatforms.filter((x) => x !== p))
    } else {
      setSelectedPlatforms([...selectedPlatforms, p])
    }
  }

  return (
    <div className="space-y-2.5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search contests…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 pr-8 h-9 text-sm bg-muted/40 border-border focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-1 flex-wrap">
        {/* Platform toggles */}
        {PLATFORMS.map((p) => {
          const active = selectedPlatforms.includes(p.id)
          return (
            <button
              key={p.id}
              onClick={() => togglePlatform(p.id)}
              className={cn(
                "h-7 px-2.5 rounded text-xs font-mono font-semibold transition-colors select-none",
                active
                  ? cn("bg-accent", p.activeText)
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
              )}
            >
              {p.short}
            </button>
          )
        })}

        <div className="h-4 w-px bg-border mx-0.5" />

        {/* Upcoming / Past joined toggle */}
        <div className="flex rounded overflow-hidden border border-border text-xs h-7">
          <button
            onClick={() => setShowUpcoming(true)}
            className={cn(
              "px-3 transition-colors font-medium",
              showUpcoming
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
            )}
          >
            Upcoming
          </button>
          <button
            onClick={() => setShowUpcoming(false)}
            className={cn(
              "px-3 border-l border-border transition-colors font-medium",
              !showUpcoming
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
            )}
          >
            Past
          </button>
        </div>

        <div className="h-4 w-px bg-border mx-0.5" />

        {/* Saved toggle */}
        <button
          onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
          className={cn(
            "h-7 px-2.5 rounded text-xs flex items-center gap-1.5 transition-colors font-medium select-none",
            showBookmarksOnly
              ? "text-amber-400 bg-amber-400/10"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
          )}
        >
          <Star className={cn("h-3 w-3", showBookmarksOnly && "fill-current")} />
          Saved
        </button>
      </div>
    </div>
  )
}
