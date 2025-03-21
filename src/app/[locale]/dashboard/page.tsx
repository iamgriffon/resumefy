"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Upload, Clock, Plus, Settings } from "lucide-react"

export default function DashboardPage() {
  const t = useTranslations("home")

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your resumes and create new ones</p>
          </div>
          <div className="flex gap-2">
            <Link href="/resume-builder">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Resume
              </Button>
            </Link>
            <Link href="/resume-builder/import">
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Import
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-3 bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Create New Resume
              </CardTitle>
              <CardDescription>Start from scratch and create a new resume</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Build a professional resume with our easy-to-use builder. Choose from multiple templates and customize
                to your needs.
              </p>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 pt-4">
              <Link href="/resume-builder" className="w-full">
                <Button className="w-full gap-2">
                  {t("build")}
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-3 bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Import Resume
              </CardTitle>
              <CardDescription>Import your existing resume data</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Already have a resume? Import your data from a CSV file and quickly generate a professional-looking
                resume.
              </p>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 pt-4">
              <Link href="/resume-builder/import" className="w-full">
                <Button variant="outline" className="w-full gap-2">
                  Import from CSV
                  <Upload className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-3 bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Templates
              </CardTitle>
              <CardDescription>Browse and select resume templates</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Choose from a variety of professional templates designed to help you stand out and pass ATS systems.
              </p>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 pt-4">
              <Button variant="secondary" className="w-full gap-2" disabled>
                Coming Soon
                <Clock className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Recent Resumes</h2>
          <div className="bg-muted/30 rounded-lg p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/60 mb-4" />
            <h3 className="text-lg font-medium mb-2">No resumes yet</h3>
            <p className="text-muted-foreground mb-6">Create your first resume to see it here</p>
            <Link href="/resume-builder">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Resume
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

