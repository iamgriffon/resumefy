"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {  Lightbulb, Menu } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const t = useTranslations("nav");
  const tProject = useTranslations("project");
  const locale = useLocale();

  return (
    <header className="sticky top-0 px-4 sm:px-8 md:px-20 z-50 py-3 w-full border-b shadow-sm bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200">
      <div className="container flex h-14 md:h-16 items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}`}
            className="flex hover:underline items-center gap-2.5 font-bold text-xl transition-colors hover:text-primary relative group"
          >
            <Lightbulb className="h-5 w-5 text-primary group-hover:animate-pulse" />
            <span className="relative">
              {tProject("title")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </span>
          </Link>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher /> 
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="px-2 rounded-full border-none">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[220px] bg-white dark:bg-gray-900 rounded-lg p-4 border shadow-lg"
            >
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="w-full cursor-pointer py-2 transition-colors hover:text-primary">
                  {t("dashboard")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/resume-builder" className="w-full cursor-pointer py-2 transition-colors hover:text-primary">
                  {t("resumeBuilder")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/resume-builder/import"
                  className="w-full cursor-pointer py-2 transition-colors hover:text-primary"
                >
                  {t("import")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex w-full items-center justify-between py-2">
                  <span>{t("theme")}</span>
                  <ThemeToggle />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          <Link href={`/${locale}/dashboard`}>
            <Button
              variant="link"
              className="text-base font-medium hover:bg-secondary/60 hover:text-foreground px-3 py-2 rounded-md transition-colors duration-200"
            >
              {t("dashboard")}
            </Button>
          </Link>
          <Link href={`/${locale}/resume-builder`}>
            <Button
              variant="link"
              className="text-base font-medium hover:bg-secondary/60 hover:text-foreground px-3 py-2 rounded-md transition-colors duration-200"
            >
              {t("resumeBuilder")}
            </Button>
          </Link>
          <Link href={`/${locale}/resume-builder/import`}>
            <Button
              variant="link"
              className="text-base font-medium hover:bg-secondary/60 hover:text-foreground px-3 py-2 rounded-md transition-colors duration-200"
            >
              {t("import")}
            </Button>
          </Link>
          <div className="border-l px-4 border-gray-900 dark:border-gray-50">
            <ThemeToggle />
          </div>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
