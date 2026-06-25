import type { Contest, Platform } from "@/app/types/contest"

export async function fetchContests(): Promise<Contest[]> {
  const response = await fetch("/api/contests")
  if (!response.ok) throw new Error("Failed to fetch contests")
  return response.json()
}

export async function toggleBookmark(contestId: string): Promise<void> {
  const response = await fetch("/api/bookmarks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contestId }),
  })
  if (!response.ok) throw new Error("Failed to toggle bookmark")
}

export async function addSolutionLink(data: {
  platform: Platform
  contestId: string
  youtubeLink: string
}): Promise<void> {
  const response = await fetch("/api/solutions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to add solution link")
}

// API returns string[] of contest IDs directly
export async function fetchBookmarks(): Promise<string[]> {
  try {
    const response = await fetch("/api/bookmarks")
    if (!response.ok) return []
    return response.json()
  } catch {
    return []
  }
}

export async function updateContests(): Promise<void> {
  const response = await fetch("/api/contests/update", { method: "POST" })
  if (!response.ok) throw new Error("Failed to update contests")
}
