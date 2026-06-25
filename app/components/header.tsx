"use client"

import { useState } from "react"
import Link from "next/link"
import { Moon, Sun, Menu, X, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeaderProps {
  toggleTheme: () => void
  isDarkMode: boolean
}

export default function Header({ toggleTheme, isDarkMode }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="h-14 flex items-center justify-between">
          <Link href="/" className="font-mono font-bold text-[15px] tracking-tight select-none">
            contest<span className="text-primary">hub</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Admin
            </Link>
            <a
              href="https://github.com/yuvrajnode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label={isDarkMode ? "Light mode" : "Dark mode"}
            >
              {isDarkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </Button>
          </nav>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
              {isDarkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-8 w-8"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden border-t py-3 pb-4 space-y-0.5">
            {[
              { label: "Home", href: "/" },
              { label: "Admin", href: "/admin" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center px-2 py-2 text-sm text-muted-foreground hover:text-foreground rounded-sm hover:bg-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <a
              href="https://github.com/yuvrajnode"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground hover:text-foreground rounded-sm hover:bg-accent transition-colors"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}
