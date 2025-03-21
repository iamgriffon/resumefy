"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Upload, Clock, Plus, Settings } from "lucide-react"

export default function DashboardPage() {
  const t = useTranslations("home")
  const d = useTranslations("dashboard")
  return (
    <div className="flex flex-col justify-center items-center">
      <main className="flex-1 container py-10">
        <div className="flex flex-col w-full md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{d("title")}</h1>
            <p className="text-muted-foreground mt-1">{d("subtitle")}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/resume-builder">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {d("newResume")}
              </Button>
            </Link>
            <Link href="/resume-builder/import">
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                {d("import")}
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-3 bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {d("createNewResume")}
              </CardTitle>
              <CardDescription className="h-10 mt-1">{d("createResumeDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4 h-20">
                {d("createResumeDescription2")}
              </p>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 pt-4">
              <Link href="/resume-builder" className="w-full">
                <Button variant="outline" className="w-full gap-2">
                  {t("build")}
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-3 bg-primary/5 ">
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                {d("import")}
              </CardTitle>
              <CardDescription className="h-10 mt-1">{d("importDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4 h-20">
                {d("importDescription2")}
              </p>
            </CardContent>
            <CardFooter className="border-t h-20 bg-muted/20 pt-4">
              <Link href="/resume-builder/import" className="w-full">
                <Button variant="outline" className="w-full gap-2">
                  {d("import")}
                  <Upload className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-3 bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                {d("templates")}
              </CardTitle>
              <CardDescription className="h-10 mt-1">{d("templatesDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4 h-20">
                {d("templatesDescription2")}
              </p>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 pt-4">
              <Button variant="secondary" className="w-full gap-2" disabled>
                {d("comingSoon")}
                <Clock className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">{d("recentResumes")}</h2>
          <div className="bg-muted/30 rounded-lg p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/60 mb-4" />
            <h3 className="text-lg font-medium mb-2">{d("noResumes")}</h3>
            <Link href="/resume-builder">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {d("createResume")}
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

