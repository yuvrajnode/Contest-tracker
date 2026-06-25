"use client"

import { useState, useEffect, useMemo } from "react"
import { useTheme } from "next-themes"
import ContestList from "@/app/components/contest-list"
import Header from "@/app/components/header"
import FilterBar from "@/app/components/filter-bar"
import type { Contest, Platform } from "@/app/types/contest"
import { fetchContests, fetchBookmarks, toggleBookmark as toggleBookmarkApi, updateContests } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { RefreshCw, Github } from "lucide-react"
import { useToast } from "@/app/hooks/use-toast"
import { cn } from "@/lib/utils"

function CardSkeleton() {
  return (
    <div className="rounded-md border border-l-[3px] border-l-border bg-card p-4 space-y-3 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="h-3 w-6 bg-muted rounded" />
        <div className="h-3 w-20 bg-muted rounded" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3.5 w-full bg-muted rounded" />
        <div className="h-3.5 w-2/3 bg-muted rounded" />
      </div>
      <div className="h-3 w-40 bg-muted rounded" />
      <div className="h-6 w-24 bg-muted rounded" />
      <div className="pt-2 border-t border-border/60 flex justify-between">
        <div className="h-3 w-12 bg-muted rounded" />
        <div className="h-3 w-14 bg-muted rounded" />
      </div>
    </div>
  )
}

export default function Home() {
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(["codeforces", "codechef", "leetcode"])
  const [showUpcoming, setShowUpcoming] = useState(true)
  const [bookmarkedContests, setBookmarkedContests] = useState<string[]>([])
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const [contestsData, bookmarksData] = await Promise.all([fetchContests(), fetchBookmarks()])
        setContests(contestsData)
        setBookmarkedContests(bookmarksData)
      } catch {
        setError("Failed to load contests.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const toggleBookmark = async (contestId: string) => {
    try {
      await toggleBookmarkApi(contestId)
      setBookmarkedContests((prev) =>
        prev.includes(contestId) ? prev.filter((id) => id !== contestId) : [...prev, contestId],
      )
    } catch {
      toast({ title: "Failed to update bookmark", variant: "destructive" })
    }
  }

  const handleSync = async () => {
    try {
      setUpdating(true)
      await updateContests()
      const updated = await fetchContests()
      setContests(updated)
      toast({ title: "Contests synced" })
    } catch {
      toast({ title: "Sync failed", variant: "destructive" })
    } finally {
      setUpdating(false)
    }
  }

  const filteredContests = useMemo(() => {
    const now = new Date()
    return contests
      .filter((c) => selectedPlatforms.includes(c.platform))
      .filter((c) => (showUpcoming ? new Date(c.endTime) > now : new Date(c.endTime) <= now))
      .filter((c) => !showBookmarksOnly || bookmarkedContests.includes(c.id))
      .filter((c) => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) =>
        showUpcoming
          ? new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          : new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
      )
  }, [contests, selectedPlatforms, showUpcoming, bookmarkedContests, showBookmarksOnly, searchQuery])

  const upcomingCount = useMemo(
    () => contests.filter((c) => new Date(c.endTime) > new Date()).length,
    [contests],
  )

  const hasActiveFilters = searchQuery || showBookmarksOnly || selectedPlatforms.length < 3

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header toggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")} isDarkMode={theme === "dark"} />

      {/* Page header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Contests</h1>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              {loading ? (
                "loading…"
              ) : (
                <>
                  <span className="text-foreground font-medium">{upcomingCount}</span>
                  {" upcoming · "}
                  <span className="text-foreground font-medium">{contests.length}</span>
                  {" total · "}
                  <span className="text-foreground font-medium">{bookmarkedContests.length}</span>
                  {" saved"}
                </>
              )}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={updating}
            className="text-xs gap-1.5 h-8 shrink-0"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", updating && "animate-spin")} />
            Sync
          </Button>
        </div>
      </div>

      {/* Main */}
      <main className="container mx-auto px-4 py-5 flex-1">
        <FilterBar
          selectedPlatforms={selectedPlatforms}
          setSelectedPlatforms={setSelectedPlatforms}
          showUpcoming={showUpcoming}
          setShowUpcoming={setShowUpcoming}
          showBookmarksOnly={showBookmarksOnly}
          setShowBookmarksOnly={setShowBookmarksOnly}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Results line */}
        <div className="flex items-center justify-between my-4">
          <p className="text-xs text-muted-foreground">
            {loading
              ? "Loading…"
              : `${filteredContests.length} contest${filteredContests.length !== 1 ? "s" : ""}`}
          </p>
          {hasActiveFilters && !loading && (
            <button
              onClick={() => {
                setSearchQuery("")
                setShowBookmarksOnly(false)
                setSelectedPlatforms(["codeforces", "codechef", "leetcode"])
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-24 text-center gap-3">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Try again
            </Button>
          </div>
        ) : (
          <ContestList
            contests={filteredContests}
            bookmarkedContests={bookmarkedContests}
            toggleBookmark={toggleBookmark}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <span className="font-mono">
            contesthub <span className="opacity-40">—</span> built by{" "}
            <a
              href="https://github.com/yuvrajnode"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              yuvrajnode
            </a>
          </span>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/yuvrajnode/Contest-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Github className="h-3 w-3" />
              Source
            </a>
            {[
              { label: "Codeforces", href: "https://codeforces.com" },
              { label: "CodeChef", href: "https://codechef.com" },
              { label: "LeetCode", href: "https://leetcode.com" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors hidden sm:inline"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
