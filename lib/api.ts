import type { Contest, Platform } from "@/app/types/contest"

// Fetch all contests
export async function fetchContests(): Promise<Contest[]> {
  try {
    const response = await fetch("/api/contests")
    if (!response.ok) {
      throw new Error("Failed to fetch contests")
    }
    return response.json()
  } catch (error) {
    console.error("Error fetching contests:", error)
    throw error
  }
}

// Toggle bookmark for a contest
export async function toggleBookmark(contestId: string): Promise<void> {
  try {
    const response = await fetch("/api/bookmarks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contestId }),
    })

    if (!response.ok) {
      throw new Error("Failed to toggle bookmark")
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error)
    throw error
  }
}

// Add solution link to a contest
export async function addSolutionLink(data: {
  platform: Platform
  contestId: string
  youtubeLink: string
}): Promise<void> {
  try {
    const response = await fetch("/api/solutions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to add solution link")
    }
  } catch (error) {
    console.error("Error adding solution link:", error)
    throw error
  }
}

// Fetch user bookmarks
export async function fetchBookmarks(): Promise<string[]> {
  try {
    const response = await fetch("/api/bookmarks")
    if (!response.ok) {
      throw new Error("Failed to fetch bookmarks")
    }
    const data = await response.json()
    return data.map((bookmark: any) => bookmark.contestId)
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    return []
  }
}

// Update contests from external APIs
export async function updateContests(): Promise<void> {
  try {
    const response = await fetch("/api/contests/update", {
      method: "POST",
    })

    if (!response.ok) {
      throw new Error("Failed to update contests")
    }
  } catch (error) {
    console.error("Error updating contests:", error)
    throw error
  }
}

