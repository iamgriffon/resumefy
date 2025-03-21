"use client"

import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { ArrowRight, FileText, Upload, Download } from "lucide-react"

export default function HomePage() {
  const t = useTranslations("home")

  return (
    <div className="flex flex-col">
      <main>
        {/* Hero Section */}
        <section className="py-10 md:py-12 bg-gradient-to-b from-background to-secondary/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">{t("title")}</h1>
                <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">{t("description")}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
                <Link href="/resume-builder">
                  <Button size="lg" className="w-full sm:w-auto gap-2 group">
                    {t("build")}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/resume-builder/import">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                    {t("upload")}
                    <Upload className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">ATS-Friendly Templates</h3>
                <p className="text-muted-foreground">
                  Our templates are designed to pass through Applicant Tracking Systems with ease.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Import Your Data</h3>
                <p className="text-muted-foreground">Quickly import your existing resume data from CSV files.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Download className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Export as PDF</h3>
                <p className="text-muted-foreground">Download your polished resume as a professional PDF document.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter">Ready to build your professional resume?</h2>
              <p className="text-xl text-muted-foreground max-w-[600px]">
                Get started today and land your dream job with a resume that stands out.
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

