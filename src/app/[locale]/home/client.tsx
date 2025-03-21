"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, FileText, Upload, Download } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import React from "react";

export function HomeClient() {
  const t = useTranslations("home");
  const locale = useLocale();
  return (
    <React.Fragment>
      <section className="py-10 md:py-12 bg-gradient-to-b from-background to-secondary/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                {t("title")}
              </h1>
              <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
                {t("description")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
              <Link href={`/${locale}/resume-builder`}>
                <Button
                  size="lg"
                  variant="link"
                  className="w-full sm:w-auto gap-2 group"
                >
                  {t("build")}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href={`/${locale}/resume-builder/import`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto gap-2"
                >
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
              <h3 className="text-xl font-semibold">
                {t("features.ats.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("features.ats.description")}
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">
                {t("features.import.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("features.import.description")}
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Download className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">
                {t("features.export.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("features.export.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter">
              {t("cta.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-[600px]">
              {t("cta.description")}
            </p>
            <Link href={`/${locale}/dashboard`}>
              <Button size="lg" variant="link" className="gap-2 group">
                {t("cta.button")}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}
