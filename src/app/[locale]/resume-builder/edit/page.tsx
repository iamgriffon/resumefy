"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CVForm } from "@/components/resume/CVForm";
import { useTranslations } from "next-intl";
import { CVFormType } from "@/components/resume/schemas";
export default function ResumeEditPage() {
  const [resumeData, setResumeData] = useState<CVFormType | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("ResumeBuilder");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const savedData = localStorage.getItem("importedCVData");

    if (savedData) {
      try {
        setResumeData(JSON.parse(savedData));
      } catch (error) {
        console.error("Failed to parse resume data:", error);
      }
    }

    setLoading(false);
  }, []);

  const handleSubmit = (formData: CVFormType) => {
    console.log({ formData });
    localStorage.setItem("importedCVData", JSON.stringify(formData));

    // Redirect back to preview
    router.push("/en/resume-builder/preview");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">{t("noResumeData")}</h1>
        <p>{t("startFresh")}</p>
        <button
          onClick={() => router.push("/en/resume-builder/")}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {t("createNew")}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{t("editResume")}</h1>
      <CVForm
        initialData={resumeData}
        onSubmit={handleSubmit}
        submitLabel={t("saveChanges", { message: "Save Changes" })}
      />
    </div>
  );
}
