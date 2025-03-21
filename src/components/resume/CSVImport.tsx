"use client";

import { useState } from "react";
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
import { useTranslations } from "use-intl";

export default function CSVImport() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('CSVImport');

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
      router.push("/en/resume-builder/preview");
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to import CSV");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Import Resume from CSV</CardTitle>
        <CardDescription>
          Upload a CSV file to import your resume data
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
            <Button onClick={handleImport} disabled={!file || isUploading} data-testid="import-button">
              {isUploading ? "Importing..." : "Import"}
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/en/resume-builder")}
              disabled={isUploading}
              data-testid="cancel-import-button"
            >
              Cancel
            </Button>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium mb-1">
              CSV Format Requirements:
            </h3>
            <p className="text-sm text-gray-600">
              Your CSV file should include columns for personal information
              (name, email, phone, location, summary), education (institution,
              degree, field, dates, description), work experience (company,
              position, dates, description), and skills.
            </p>
            <div className="mt-2">
              <a
                href="/sample-resume.csv"
                download
                className="text-sm text-blue-600 hover:underline"
              >
                Download Sample CSV Template
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
