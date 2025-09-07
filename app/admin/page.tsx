"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/app/hooks/use-toast"
import { addSolutionLink, fetchContests } from "@/lib/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Youtube, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formSchema = z.object({
  platform: z.enum(["codeforces", "codechef", "leetcode"], {
    required_error: "Please select a platform",
  }),
  contestId: z.string().min(1, {
    message: "Contest ID is required",
  }),
  youtubeLink: z.string().url({
    message: "Please enter a valid YouTube URL",
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function AdminPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAutoFetching, setIsAutoFetching] = useState(false)
  const [usingMockData, setUsingMockData] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if we're using mock data
    const checkMockData = async () => {
      try {
        const contestsData = await fetchContests()
        if (contestsData.length > 0 && contestsData[0].id.startsWith("cf-")) {
          setUsingMockData(true)
        }
      } catch (error) {
        console.error("Error checking mock data:", error)
      }
    }

    checkMockData()
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: undefined,
      contestId: "",
      youtubeLink: "",
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true)
      await addSolutionLink(values)

      toast({
        title: "Solution link added",
        description: "The YouTube solution link has been successfully added to the contest.",
      })

      form.reset()
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to add solution link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleAutoFetch() {
    try {
      setIsAutoFetching(true)

      const response = await fetch("/api/youtube/auto-fetch", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to auto-fetch YouTube links")
      }

      const data = await response.json()

      toast({
        title: "Auto-fetch completed",
        description: `Found ${Object.values(data.results).reduce((acc: any, curr: any) => acc + curr.matched, 0)} matches across all platforms.`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to auto-fetch YouTube links. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAutoFetching(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">Admin Dashboard</h1>

      {usingMockData && (
        <Alert className="mb-6 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-800 dark:text-amber-300" />
          <AlertTitle className="text-amber-800 dark:text-amber-300">Using mock data</AlertTitle>
          <AlertDescription className="text-amber-800 dark:text-amber-300">
            Unable to connect to the database. Using mock data instead. Changes will not be saved.
          </AlertDescription>
        </Alert>
      )}

      <div className="max-w-md mx-auto">
        <Tabs defaultValue="manual">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="manual">Manual Link</TabsTrigger>
            <TabsTrigger value="auto">Auto-Fetch</TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <Card>
              <CardHeader>
                <CardTitle>Add Solution Link</CardTitle>
                <CardDescription>Connect YouTube solution videos to past contests</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="platform"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Platform</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="codeforces">Codeforces</SelectItem>
                              <SelectItem value="codechef">CodeChef</SelectItem>
                              <SelectItem value="leetcode">LeetCode</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Select the platform where the contest was hosted</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contestId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contest ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter contest ID" {...field} />
                          </FormControl>
                          <FormDescription>The unique identifier for the contest</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="youtubeLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>YouTube Solution Link</FormLabel>
                          <FormControl>
                            <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                          </FormControl>
                          <FormDescription>Link to the YouTube video with the contest solution</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isSubmitting || usingMockData}>
                      {isSubmitting ? "Submitting..." : "Add Solution Link"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auto">
            <Card>
              <CardHeader>
                <CardTitle>Auto-Fetch Solution Links</CardTitle>
                <CardDescription>Automatically fetch solution links from YouTube channels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  This will search the configured YouTube channels for videos that match past contests and automatically
                  add the links.
                </p>

                <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-md border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    Make sure you have set up the YouTube API key and channel IDs in your environment variables.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleAutoFetch} disabled={isAutoFetching || usingMockData}>
                  <Youtube className="h-4 w-4 mr-2" />
                  {isAutoFetching ? "Fetching..." : "Auto-Fetch Solution Links"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

