"use client";

import { useEffect, useState } from "react";
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
import { ResumePreviewer } from "./ResumePreviewer";
export function CSVPreview() {
  const router = useRouter();
  const [data, setData] = useState<CVFormType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("CSVPreview");

  useEffect(() => {
    // Get the imported data from localStorage
    try {
      const storedData = localStorage.getItem("importedCVData");
      if (storedData) {
        setData(JSON.parse(storedData));
      } else {
        setError("No imported data found");
      }
    } catch (err) {
      setError("Error loading the imported data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleEdit = () => {
    router.push("/en/resume-builder/edit");
  };

  const handleConfirm = async () => {
    try {
      // Save data first
      localStorage.setItem("resumeData", JSON.stringify(data));
      
      // Then try to generate PDF
      try {
        const pdf = await generateResumePDF(data as CVFormType);
        pdf.save(`${data?.personalInfo?.fullName || 'resume'}.pdf`);
        alert("Resume data saved and PDF generated successfully!");
      } catch (pdfError) {
        console.error('PDF generation failed:', pdfError);
        alert("Resume data saved but PDF generation failed. You can try again later.");
      }
      
      // Navigate regardless of PDF success
      // router.push("/en/dashboard");
    } catch (err) {
      console.error('Error in saving resume:', err);
      alert("Failed to save resume data.");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading preview...</div>;
  }

  if (error || !data) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <h2 className="text-red-500 font-semibold mb-4">Error</h2>
            <p>{error || "Unable to load preview"}</p>
            <Button
              onClick={() => router.push("/en/resume-builder/import")}
              className="mt-4"
            >
              Back to Import
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Resume Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.personalInfo &&
        Object.keys(data.personalInfo).some(
          (k) => !!data.personalInfo[k as keyof typeof data.personalInfo]
        ) ? (
          <div>
            <h2 className="text-xl font-bold mb-2">Personal Information</h2>
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
                  {data.personalInfo.summary}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 p-4 rounded-md">
            <p className="text-yellow-700">
              Missing fields in CSV file: Personal Information
            </p>
          </div>
        )}

        {data.education && data.education.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold mb-2">Education</h2>
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
                      {edu.startDate} - {edu.endDate}
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
              Missing fields in CSV file: Education
            </p>
          </div>
        )}

        {data.experience && data.experience.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold mb-2">Work Experience</h2>
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
                      {exp.startDate} - {exp.endDate}
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
              Missing fields in CSV file: Work Experience
            </p>
          </div>
        )}

        {data.skills && data.skills.skills ? (
          <div>
            <h2 className="text-xl font-bold mb-2">Skills</h2>
            <p data-testid="skills">{data.skills.skills}</p>
          </div>
        ) : (
          <div className="bg-yellow-50 p-4 rounded-md">
            <p className="text-yellow-700">
              Missing fields in CSV file: Skills
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end items-center gap-2">
        <Button
          onClick={() => router.push("/en/resume-builder/edit")}
          data-testid="edit-button"
          variant="secondary"
        >
          {t("edit", { message: "Edit" })}
        </Button>
        <Button
          data-testid="confirm-button"
          variant="outline"
          onClick={handleConfirm}
        >
          {t("confirm", { message: "Confirm & Save" })}
        </Button>
      </CardFooter>
      <div
        id="resume-preview"
        style={{ position: "absolute", left: "-9999px" }}
      />
    </Card>
  );
}
