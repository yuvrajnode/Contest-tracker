"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import ContestList from "@/app/components/contest-list"
import Header from "@/app/components/header"
import FilterBar from "@/app/components/filter-bar"
import type { Contest, Platform } from "@/app/types/contest"
import { fetchContests, fetchBookmarks, toggleBookmark as toggleBookmarkApi, updateContests } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useToast } from "@/app/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function Home() {
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(["codeforces", "codechef", "leetcode"])
  const [showUpcoming, setShowUpcoming] = useState(true)
  const [bookmarkedContests, setBookmarkedContests] = useState<string[]>([])
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  // Load contests and bookmarks
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch contests and bookmarks
        const contestsData = await fetchContests()
        const bookmarksData = await fetchBookmarks()

        setContests(contestsData)
        setBookmarkedContests(bookmarksData)

        // Check if we're using mock data
        if (contestsData.length > 0 && contestsData[0].id.startsWith("cf-")) {
          setUsingMockData(true)
        }
      } catch (err) {
        setError("Failed to load data. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Handle toggling bookmarks
  const toggleBookmark = async (contestId: string) => {
    try {
      await toggleBookmarkApi(contestId)

      // Update local state
      setBookmarkedContests((prev) =>
        prev.includes(contestId) ? prev.filter((id) => id !== contestId) : [...prev, contestId],
      )
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookmark. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle updating contests from external APIs
  const handleUpdateContests = async () => {
    try {
      setUpdating(true)
      await updateContests()

      // Reload contests after update
      const updatedContests = await fetchContests()
      setContests(updatedContests)

      toast({
        title: "Success",
        description: "Contests updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contests. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const filteredContests = contests
    .filter((contest) => selectedPlatforms.includes(contest.platform))
    .filter((contest) => {
      const isUpcoming = new Date(contest.startTime) > new Date()
      return showUpcoming ? isUpcoming : !isUpcoming
    })
    .filter((contest) => !showBookmarksOnly || bookmarkedContests.includes(contest.id))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header toggleTheme={toggleTheme} isDarkMode={theme === "dark"} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center md:text-left">
            Competitive Programming Contest Tracker
          </h1>

          <Button variant="outline" className="mt-4 md:mt-0" onClick={handleUpdateContests} disabled={updating}>
            <RefreshCw className={`h-4 w-4 mr-2 ${updating ? "animate-spin" : ""}`} />
            {updating ? "Updating..." : "Update Contests"}
          </Button>
        </div>

        {usingMockData && (
          <Alert className="mb-6 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-800 dark:text-amber-300" />
            <AlertTitle className="text-amber-800 dark:text-amber-300">Using mock data</AlertTitle>
            <AlertDescription className="text-amber-800 dark:text-amber-300">
              Unable to connect to the database. Using mock data instead. Changes will not be saved.
            </AlertDescription>
          </Alert>
        )}

        <FilterBar
          selectedPlatforms={selectedPlatforms}
          setSelectedPlatforms={setSelectedPlatforms}
          showUpcoming={showUpcoming}
          setShowUpcoming={setShowUpcoming}
          showBookmarksOnly={showBookmarksOnly}
          setShowBookmarksOnly={setShowBookmarksOnly}
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          <ContestList
            contests={filteredContests}
            bookmarkedContests={bookmarkedContests}
            toggleBookmark={toggleBookmark}
          />
        )}
      </main>
    </div>
  )
}

