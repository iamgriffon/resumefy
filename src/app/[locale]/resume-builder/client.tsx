"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { useTranslations, useLocale } from "next-intl";

export function ResumeBuilderClient() {
  const t = useTranslations("ResumeBuilder");
  const locale = useLocale();
  return (
    <React.Fragment>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Link href={`/${locale}/resume-builder/import`}>
          <Button variant="outline">{t("import")}</Button>
        </Link>
      </div>
    </React.Fragment>
  );
}
