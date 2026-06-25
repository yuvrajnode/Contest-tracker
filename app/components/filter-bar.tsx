"use client"

import type { Platform } from "@/app/types/contest"
import { Input } from "@/components/ui/input"
import { Search, X, Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"

const PLATFORMS: { id: Platform; label: string; active: string; inactive: string }[] = [
  {
    id: "codeforces",
    label: "Codeforces",
    active: "bg-red-100 border-red-400 text-red-800 dark:bg-red-950 dark:border-red-600 dark:text-red-200",
    inactive:
      "border-red-200 text-red-600 dark:border-red-900 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40",
  },
  {
    id: "codechef",
    label: "CodeChef",
    active: "bg-amber-100 border-amber-400 text-amber-800 dark:bg-amber-950 dark:border-amber-600 dark:text-amber-200",
    inactive:
      "border-amber-200 text-amber-600 dark:border-amber-900 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40",
  },
  {
    id: "leetcode",
    label: "LeetCode",
    active:
      "bg-orange-100 border-orange-400 text-orange-800 dark:bg-orange-950 dark:border-orange-600 dark:text-orange-200",
    inactive:
      "border-orange-200 text-orange-600 dark:border-orange-900 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40",
  },
]

interface FilterBarProps {
  selectedPlatforms: Platform[]
  setSelectedPlatforms: (platforms: Platform[]) => void
  showUpcoming: boolean
  setShowUpcoming: (show: boolean) => void
  showBookmarksOnly: boolean
  setShowBookmarksOnly: (show: boolean) => void
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
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search contests by name…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-9 h-10"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Platform pills */}
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            onClick={() => togglePlatform(p.id)}
            className={cn(
              "inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-all select-none",
              selectedPlatforms.includes(p.id) ? p.active : p.inactive,
            )}
          >
            {p.label}
          </button>
        ))}

        <div className="h-6 w-px bg-border" />

        {/* Upcoming / Past */}
        {(["upcoming", "past"] as const).map((val) => (
          <button
            key={val}
            onClick={() => setShowUpcoming(val === "upcoming")}
            className={cn(
              "inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-all capitalize select-none",
              (val === "upcoming") === showUpcoming
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {val}
          </button>
        ))}

        <div className="h-6 w-px bg-border" />

        {/* Bookmarks */}
        <button
          onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-all select-none",
            showBookmarksOnly
              ? "bg-yellow-100 border-yellow-400 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-600 dark:text-yellow-200"
              : "border-border text-muted-foreground hover:bg-muted",
          )}
        >
          <Bookmark className={cn("h-3.5 w-3.5", showBookmarksOnly && "fill-current")} />
          Bookmarks
        </button>
      </div>
    </div>
  )
}
