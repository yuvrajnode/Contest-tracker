"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Moon, Sun, Menu, X, Trophy, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeaderProps {
  toggleTheme: () => void
  isDarkMode: boolean
}

export default function Header({ toggleTheme, isDarkMode }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-200",
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Trophy className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              ContestHub
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/admin"
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
            >
              Admin
            </Link>
            <a
              href="https://github.com/yuvrajnode"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <div className="w-px h-5 bg-border mx-1" />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="h-9 w-9 rounded-lg"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </nav>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-9 w-9"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="md:hidden border-t py-3 space-y-1 pb-4">
            <Link
              href="/"
              className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/admin"
              className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
            <a
              href="https://github.com/yuvrajnode"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}
