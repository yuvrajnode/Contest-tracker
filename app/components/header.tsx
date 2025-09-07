"use client"

import { useState } from "react"
import Link from "next/link"
import { Moon, Sun, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  toggleTheme: () => void
  isDarkMode: boolean
}

export default function Header({ toggleTheme, isDarkMode }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-primary">
            Contest Tracker
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-foreground"
            >
              Home
            </Link>
            <Link
              href="/admin"
              className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-foreground"
            >
              Admin
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/admin"
                className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
              <Button
                variant="ghost"
                className="flex items-center justify-start"
                onClick={() => {
                  toggleTheme()
                  setIsMenuOpen(false)
                }}
              >
                {isDarkMode ? (
                  <>
                    <Sun className="h-5 w-5 mr-2" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5 mr-2" />
                    <span>Dark Mode</span>
                  </>
                )}
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

