"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { FileText, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Header() {
  const t = useTranslations("home")
  const tProject = useTranslations("project")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 px-20 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl transition-colors hover:text-primary">
            <FileText className="h-5 w-5" />
            {tProject("title")}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-base hover:bg-secondary hover:text-foreground">
              Dashboard
            </Button>
          </Link>
          <Link href="/resume-builder">
            <Button variant="ghost" className="text-base hover:bg-secondary hover:text-foreground">
              Resume Builder
            </Button>
          </Link>
          <Link href="/resume-builder/import">
            <Button variant="ghost" className="text-base hover:bg-secondary hover:text-foreground">
              Import
            </Button>
          </Link>
          <ThemeToggle />
        </nav>

        {/* Mobile navigation */}
        <div
          className={cn(
            "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in md:hidden bg-background",
            isMenuOpen ? "slide-in-from-top-2" : "hidden",
          )}
        >
          <div className="flex flex-col space-y-4">
            <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start text-base hover:bg-secondary hover:text-foreground"
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/resume-builder" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start text-base hover:bg-secondary hover:text-foreground"
              >
                Resume Builder
              </Button>
            </Link>
            <Link href="/resume-builder/import" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start text-base hover:bg-secondary hover:text-foreground"
              >
                Import
              </Button>
            </Link>
            <div className="flex justify-end pt-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

