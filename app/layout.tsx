import type React from "react"
import { ThemeProvider } from "@/app/components/theme-provider"
import { Toaster } from "sonner" // Import Toaster from Sonner
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Contest Tracker</title>
        <meta
          name="description"
          content="Track competitive programming contests from Codeforces, CodeChef, and LeetCode"
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster position="top-center" /> {/* Use Sonner's Toaster */}
        </ThemeProvider>
      </body>
    </html>
  )
}