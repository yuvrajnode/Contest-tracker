"use client"

import type { Platform } from "@/app/types/contest"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookmarkIcon } from "lucide-react"

interface FilterBarProps {
  selectedPlatforms: Platform[]
  setSelectedPlatforms: (platforms: Platform[]) => void
  showUpcoming: boolean
  setShowUpcoming: (show: boolean) => void
  showBookmarksOnly: boolean
  setShowBookmarksOnly: (show: boolean) => void
}

export default function FilterBar({
  selectedPlatforms,
  setSelectedPlatforms,
  showUpcoming,
  setShowUpcoming,
  showBookmarksOnly,
  setShowBookmarksOnly,
}: FilterBarProps) {
  const togglePlatform = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform))
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform])
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">Platforms</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="codeforces"
                checked={selectedPlatforms.includes("codeforces")}
                onCheckedChange={() => togglePlatform("codeforces")}
              />
              <Label htmlFor="codeforces" className="cursor-pointer">
                Codeforces
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="codechef"
                checked={selectedPlatforms.includes("codechef")}
                onCheckedChange={() => togglePlatform("codechef")}
              />
              <Label htmlFor="codechef" className="cursor-pointer">
                CodeChef
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="leetcode"
                checked={selectedPlatforms.includes("leetcode")}
                onCheckedChange={() => togglePlatform("leetcode")}
              />
              <Label htmlFor="leetcode" className="cursor-pointer">
                LeetCode
              </Label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Contest Status</h3>
          <Tabs
            defaultValue={showUpcoming ? "upcoming" : "past"}
            onValueChange={(value) => setShowUpcoming(value === "upcoming")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Bookmarks</h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="bookmarks"
              checked={showBookmarksOnly}
              onCheckedChange={(checked) => setShowBookmarksOnly(checked === true)}
            />
            <Label htmlFor="bookmarks" className="cursor-pointer flex items-center">
              <BookmarkIcon className="h-4 w-4 mr-1" />
              Show bookmarked only
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}

