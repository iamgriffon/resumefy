"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CVFormType } from "./schemas";
import { parseCSV } from "@/lib/parser/parseCSV";
import { useTranslations, useLocale } from "next-intl";

export default function CSVImport() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('CSVImport');
  const locale = useLocale();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError(t('invalidFileType', { message: 'Please upload a valid CSV file' }));
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError(t('noFileSelected', { message: 'Please select a file to import' }));
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const parsedData = await parseCSV<CVFormType>(file);
      localStorage.setItem("importedCVData", JSON.stringify(parsedData));
      router.push(`/${locale}/resume-builder/preview`);
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to import CSV");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <React.Fragment>
      <h1 className="text-3xl w-full mx-auto max-w-3xl font-bold mb-8">
        {t("title")}
      </h1>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{t("subtitle")}</CardTitle>
        <CardDescription>
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Input
              id="csv-file"
              data-testid="csv-file-input"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleImport} variant={!file || isUploading ? "link" : "outline"} disabled={!file || isUploading} data-testid="import-button">
              {isUploading ? t("importing") : t("import")}
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push(`/${locale}/resume-builder`)}
              disabled={isUploading}
              data-testid="cancel-import-button"
            >
              {t("cancel")}
            </Button>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium mb-1">
              {t("fileRequirements")}
            </h3>
            <CardDescription>
              {t("fileRequirementsDesc")}
            </CardDescription>
            <div className="mt-2">
              <a
                href="/sample-resume.csv"
                download
                className="text-sm text-blue-600 hover:underline"
              >
                {t("downloadTemplate")}
              </a>
            </div>
          </div>
          </div>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
