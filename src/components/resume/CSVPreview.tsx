"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { CVFormType } from "./schemas";
import { useTranslations } from "use-intl";
import { generateResumePDF } from "@/lib/pdf-generator";
import { formatDate } from "@/lib/utils";
import { useLocale } from "next-intl";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function CSVPreview() {
  const router = useRouter();
  const [data, setData] = useState<CVFormType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("CSVPreview");
  const locale = useLocale();

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("importedCVData");
      if (storedData) {
        setData(JSON.parse(storedData));
      } else {
        setError("No imported data found");
      }
    } catch {
      setError("Error loading the imported data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleConfirm = async () => {
    try {
      localStorage.setItem("resumeData", JSON.stringify(data));
      try {
        const pdf = await generateResumePDF(data as CVFormType, locale);
        pdf.save(`${data?.personalInfo?.fullName || "resume"}.pdf`);
        toast({
          title: t("resumeSaved"),
        });
      } catch (pdfError) {
        console.error("PDF generation failed:", pdfError);
        toast({
          title: t("resumeSavedButPDFGenerationFailed"),
        });
      }
    } catch (err) {
      console.error("Error in saving resume:", err);
      toast({
        title: t("failedToSaveResumeData"),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <h2 className="text-red-500 font-semibold mb-4">{t("error")}</h2>
            <p>{"unableToLoad"}</p>
            <Button
              onClick={() => router.push(`/${locale}/resume-builder/import`)}
              className="mt-4"
            >
              {t("backToImport")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <React.Fragment>
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{t("subtitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.personalInfo &&
          Object.keys(data.personalInfo).some(
            (k) => !!data.personalInfo[k as keyof typeof data.personalInfo]
          ) ? (
            <div>
              <h2 className="text-xl font-bold mb-2">{t("personalInfo")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold" data-testid="fullName">
                    {data.personalInfo.fullName}
                  </h3>
                  <p data-testid="email">{data.personalInfo.email}</p>
                  <p data-testid="phone">{data.personalInfo.phone}</p>
                  <p data-testid="location">{data.personalInfo.location}</p>
                </div>
                <div>
                  <p data-testid="summary" className="italic">
                    {`"${data.personalInfo.summary}"`}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-yellow-700">
                {`${t("missingFields")} ${t("missingFieldsPersonalInfo")}`}
              </p>
            </div>
          )}

          {data.education && data.education.length > 0 ? (
            <div>
              <h2 className="text-xl font-bold mb-2">{t("education")}</h2>
              {data.education.map((edu, index) => (
                <div key={index} className="mb-4 p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="font-semibold"
                        data-testid={`education-${index}-institution`}
                      >
                        {edu.institution}
                      </h3>
                      <p data-testid={`education-${index}-degree`}>
                        {edu.degree}{" "}
                        {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p data-testid={`education-${index}-startDate`}>
                        {edu.startDate
                          ? formatDate(edu.startDate, undefined, locale)
                          : ""}{" "}
                        -{" "}
                        {edu.endDate
                          ? formatDate(edu.endDate, undefined, locale)
                          : ""}
                      </p>
                    </div>
                  </div>
                  {edu.description && (
                    <p
                      data-testid={`education-${index}-description`}
                      className="mt-2"
                    >
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-yellow-700">
                {`${t("missingFields")} ${t("missingFieldsEducation")}`}
              </p>
            </div>
          )}

          {data.experience && data.experience.length > 0 ? (
            <div>
              <h2 className="text-xl font-bold mb-2">{t("experience")}</h2>
              {data.experience.map((exp, index) => (
                <div key={index} className="mb-4 p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="font-semibold"
                        data-testid={`experience-${index}-company`}
                      >
                        {exp.company}
                      </h3>
                      <p data-testid={`experience-${index}-position`}>
                        {exp.position}
                      </p>
                    </div>
                    <div className="text-right">
                      <p data-testid={`experience-${index}-startDate`}>
                        {exp.startDate
                          ? formatDate(exp.startDate, undefined, locale)
                          : ""}{" "}
                        -{" "}
                        {exp.endDate
                          ? formatDate(exp.endDate, undefined, locale)
                          : ""}
                      </p>
                    </div>
                  </div>
                  {exp.description && (
                    <p
                      data-testid={`experience-${index}-description`}
                      className="mt-2"
                    >
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-yellow-700">
                {`${t("missingFields")} ${t("missingFieldsExperience")}`}
              </p>
            </div>
          )}

          {data.skills && data.skills.skills ? (
            <div>
              <h2 className="text-xl font-bold mb-2">{t("skills")}</h2>
              <div className="mb-4 p-4 border rounded-md">
                <p data-testid="skills">{data.skills.skills}</p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-yellow-700">
                {`${t("missingFields")} ${t("missingFieldsSkills")}`}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end items-center gap-2">
          <Button
            onClick={() => router.push(`/${locale}/resume-builder/edit`)}
            data-testid="edit-button"
            variant="link"
          >
            {t("edit")}
          </Button>
          <Button
            data-testid="confirm-button"
            variant="outline"
            onClick={handleConfirm}
          >
            {t("confirm")}
          </Button>
        </CardFooter>
        <div
          id="resume-preview"
          style={{ position: "absolute", left: "-9999px" }}
        />
      </Card>
    </React.Fragment>
  );
}
