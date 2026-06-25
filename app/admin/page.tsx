"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/app/hooks/use-toast"
import { addSolutionLink } from "@/lib/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Youtube, Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"

const formSchema = z.object({
  platform: z.enum(["codeforces", "codechef", "leetcode"], {
    required_error: "Please select a platform",
  }),
  contestId: z.string().min(1, { message: "Contest ID is required" }),
  youtubeLink: z.string().url({ message: "Please enter a valid YouTube URL" }),
})

type FormValues = z.infer<typeof formSchema>

export default function AdminPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAutoFetching, setIsAutoFetching] = useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { platform: undefined, contestId: "", youtubeLink: "" },
  })

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true)
      await addSolutionLink(values)
      toast({ title: "Solution link added", description: "The YouTube link has been linked to the contest." })
      form.reset()
    } catch {
      toast({ title: "Error", description: "Failed to add solution link. Please try again.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleAutoFetch() {
    try {
      setIsAutoFetching(true)
      // Fixed: correct API path
      const response = await fetch("/api/solutions/youtube/auto-fetch", { method: "POST" })
      if (!response.ok) throw new Error("Auto-fetch failed")
      const data = await response.json()
      const total = Object.values(data.results ?? {}).reduce((acc: number, curr: unknown) => {
        if (typeof curr === "object" && curr !== null && "matched" in curr) {
          return acc + (curr as { matched: number }).matched
        }
        return acc
      }, 0)
      toast({ title: "Auto-fetch complete", description: `Found ${total} match(es) across all platforms.` })
    } catch {
      toast({ title: "Auto-fetch failed", description: "Check your YouTube API key in environment variables.", variant: "destructive" })
    } finally {
      setIsAutoFetching(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header bar */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">Manage solution links for past contests</p>
        </div>

        <div className="max-w-lg">
          <Tabs defaultValue="manual">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="manual">Manual Link</TabsTrigger>
              <TabsTrigger value="auto">Auto-Fetch</TabsTrigger>
            </TabsList>

            <TabsContent value="manual">
              <Card>
                <CardHeader>
                  <CardTitle>Add Solution Link</CardTitle>
                  <CardDescription>Connect a YouTube editorial to a past contest</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      <FormField
                        control={form.control}
                        name="platform"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Platform</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a platform" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="codeforces">Codeforces</SelectItem>
                                <SelectItem value="codechef">CodeChef</SelectItem>
                                <SelectItem value="leetcode">LeetCode</SelectItem>
                              </SelectContent>
                            </Select>
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
                              <Input placeholder="e.g. cf-2050, lc-weekly-455" {...field} />
                            </FormControl>
                            <FormDescription>The unique contest ID from the database</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="youtubeLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>YouTube Solution URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://youtube.com/watch?v=…" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                        <Youtube className="h-4 w-4" />
                        {isSubmitting ? "Saving…" : "Save Solution Link"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="auto">
              <Card>
                <CardHeader>
                  <CardTitle>Auto-Fetch from YouTube</CardTitle>
                  <CardDescription>
                    Search configured YouTube channels and match videos to past contests automatically
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-xl border bg-muted/50 p-4 text-sm text-muted-foreground space-y-1.5">
                    <p className="font-medium text-foreground">Required environment variables:</p>
                    <code className="block text-xs">YOUTUBE_API_KEY</code>
                    <code className="block text-xs">LEETCODE_CHANNEL_ID</code>
                    <code className="block text-xs">CODEFORCES_CHANNEL_ID</code>
                    <code className="block text-xs">CODECHEF_CHANNEL_ID</code>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full gap-2" onClick={handleAutoFetch} disabled={isAutoFetching}>
                    <Sparkles className="h-4 w-4" />
                    {isAutoFetching ? "Fetching…" : "Auto-Fetch Solution Links"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
