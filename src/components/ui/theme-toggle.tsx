"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react";
import { Button } from "./button";
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";
  
  const Component = {
    light: <SunIcon className="dark:hover:text-white" />,
    dark: <MoonIcon className="dark:hover:text-black" />,
  }
  
  return (
    <Button variant="outline" className="w-10 h-10 p-2 rounded-full border-none max-md:w-8 max-md:h-8" size="icon" onClick={() => setTheme(isDark ? "light" : "dark")}>
      {Component[theme as keyof typeof Component]}
    </Button>
  );
}
