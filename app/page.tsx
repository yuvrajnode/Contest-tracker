"use client"

import { useState, useEffect, useMemo } from "react"
import { useTheme } from "next-themes"
import ContestList from "@/app/components/contest-list"
import Header from "@/app/components/header"
import FilterBar from "@/app/components/filter-bar"
import type { Contest, Platform } from "@/app/types/contest"
import { fetchContests, fetchBookmarks, toggleBookmark as toggleBookmarkApi, updateContests } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { RefreshCw, Trophy, Clock, Bookmark, Zap, ChevronDown, Github } from "lucide-react"
import { useToast } from "@/app/hooks/use-toast"
import { cn } from "@/lib/utils"

function ContestSkeleton() {
  return (
    <div className="rounded-2xl border bg-card overflow-hidden animate-pulse">
      <div className="h-1 bg-muted" />
      <div className="p-5 space-y-4">
        <div className="flex justify-between">
          <div className="h-5 w-24 bg-muted rounded-full" />
          <div className="h-5 w-5 bg-muted rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-32 bg-muted rounded" />
          <div className="h-3 w-40 bg-muted rounded" />
          <div className="h-3 w-28 bg-muted rounded" />
        </div>
        <div className="h-16 bg-muted rounded-xl" />
        <div className="h-10 bg-muted rounded-lg" />
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
        setError("Failed to load contests. Please try again.")
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
      toast({ title: "Error", description: "Failed to update bookmark.", variant: "destructive" })
    }
  }

  const handleSync = async () => {
    try {
      setUpdating(true)
      await updateContests()
      const updated = await fetchContests()
      setContests(updated)
      toast({ title: "Synced!", description: "Contests updated successfully." })
    } catch {
      toast({ title: "Sync failed", description: "Could not fetch latest contests.", variant: "destructive" })
    } finally {
      setUpdating(false)
    }
  }

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

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

  const clearFilters = () => {
    setSearchQuery("")
    setShowBookmarksOnly(false)
    setSelectedPlatforms(["codeforces", "codechef", "leetcode"])
  }

  return (
    <div className="min-h-screen bg-background">
      <Header toggleTheme={toggleTheme} isDarkMode={theme === "dark"} />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-background to-violet-500/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.015]" />

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border bg-card/80 backdrop-blur px-3 py-1 text-sm font-medium text-muted-foreground mb-6 shadow-sm">
            <Zap className="h-3.5 w-3.5 text-primary" />
            Live data · Codeforces · CodeChef · LeetCode
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 max-w-3xl leading-[1.1]">
            Never miss a{" "}
            <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              contest
            </span>{" "}
            again
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Your competitive programming command center. Track upcoming contests, bookmark favorites, and access
            editorial solutions — all in one clean dashboard.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={handleSync} disabled={updating} className="gap-2 shadow-lg shadow-primary/20">
              <RefreshCw className={cn("h-4 w-4", updating && "animate-spin")} />
              {updating ? "Syncing…" : "Sync Latest Contests"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                setShowBookmarksOnly(true)
                document.getElementById("contests")?.scrollIntoView({ behavior: "smooth" })
              }}
              className="gap-2"
            >
              <Bookmark className="h-4 w-4" />
              My Bookmarks
            </Button>
          </div>

          {/* Stats row */}
          <div className="mt-12 flex flex-wrap gap-8">
            {[
              { icon: Trophy, label: "Upcoming", value: upcomingCount },
              { icon: Clock, label: "Total Tracked", value: contests.length },
              { icon: Bookmark, label: "Bookmarked", value: bookmarkedContests.length },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold tabular-nums leading-none">
                    {loading ? <span className="inline-block h-7 w-8 bg-muted rounded animate-pulse" /> : value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-muted-foreground/50 animate-bounce hidden md:block">
          <ChevronDown className="h-5 w-5" />
        </div>
      </section>

      {/* ── Contest Dashboard ─────────────────────────────── */}
      <main id="contests" className="container mx-auto px-4 py-10">
        {/* Filters */}
        <div className="mb-6">
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
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-muted-foreground">
            {loading
              ? "Loading contests…"
              : `${filteredContests.length} contest${filteredContests.length !== 1 ? "s" : ""}`}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-sm text-primary hover:underline font-medium">
              Clear filters
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <ContestSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-destructive font-medium mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
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

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t bg-muted/30 mt-12">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">ContestHub</span>
            <span>— Built for competitive programmers</span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/yuvrajnode"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            {[
              { label: "Codeforces", href: "https://codeforces.com" },
              { label: "CodeChef", href: "https://codechef.com" },
              { label: "LeetCode", href: "https://leetcode.com" },
            ].map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
