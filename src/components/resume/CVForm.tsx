"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cvFormSchema, CVFormType } from "./schemas";
import { useTranslations } from "use-intl";
import { generateResumePDF } from '@/lib/pdf-generator';
import type { ResumeData } from '@/lib/file-parser';
import { ResumePreviewer } from "@/components/resume/ResumePreviewer";

export function CVForm({
  initialData,
  onSubmit,
  submitLabel,
}: {
  initialData?: CVFormType;
  onSubmit?: (data: CVFormType) => void;
  submitLabel?: string;
}) {

  console.log({initialData});

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CVFormType>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: {
      personalInfo: {
        fullName: initialData?.personalInfo?.fullName || "",
        email: initialData?.personalInfo?.email || "",
        phone: initialData?.personalInfo?.phone || "",
        location: initialData?.personalInfo?.location || "",
        linkedIn: initialData?.personalInfo?.linkedIn || "",
        summary: initialData?.personalInfo?.summary || ""
      },
      education: initialData?.education || [],
      experience: initialData?.experience || [],
      skills: { skills: initialData?.skills?.skills || "" },
      certifications: initialData?.certifications || [],
      additionalInfo: initialData?.additionalInfo || ""
    }
  });

  const { 
    fields: educationFields, 
    append: appendEducation 
  } = useFieldArray({
    control,
    name: "education"
  });

  const { 
    fields: experienceFields, 
    append: appendExperience 
  } = useFieldArray({
    control,
    name: "experience"
  });

  const { 
    fields: certificationFields, 
    append: appendCertification 
  } = useFieldArray({
    control,
    name: "certifications"
  });

  const [previewData, setPreviewData] = useState<ResumeData | null>(null);
  const t = useTranslations("resume");

  const submit = (data: CVFormType) => {
    if (onSubmit) {
      try {
        // Only try to generate PDF if we're in the preview/confirm flow
        if (submitLabel === "Confirm & Download") {
          generateResumePDF(data)
            .then(pdf => {
              pdf.save(`${data.personalInfo?.fullName || 'resume'}.pdf`);
              onSubmit(data);
            })
            .catch(err => {
              console.error('Failed to generate PDF:', err);
              // Still call onSubmit even if PDF generation fails
              onSubmit(data);
            });
        } else {
          // Just submit the data without PDF generation for edit flows
          onSubmit(data);
        }
      } catch (error) {
        console.error('Error in form submission:', error);
        onSubmit(data);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-8">
      <Card data-testid="personal-info-card">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label 
              htmlFor="fullName" 
              className="mb-1 block"
              data-testid="fullName-label"
            >
              Full Name
            </Label>
            <Input
              id="fullName"
              data-testid="fullName-input"
              {...register("personalInfo.fullName")}
              className="w-full"
            />
            {errors.personalInfo?.fullName && (
              <div className="text-red-500 text-sm mt-1">
                {errors.personalInfo.fullName.message}
              </div>
            )}
          </div>

          <div className="mb-4">
            <Label 
              htmlFor="email" 
              className="mb-1 block"
              data-testid="email-label"
            >
              Email
            </Label>
            <Input
              id="email"
              data-testid="email-input"
              {...register("personalInfo.email")}
              type="email"
              className="w-full"
            />
            {errors.personalInfo?.email && (
              <div className="text-red-500 text-sm mt-1">
                {errors.personalInfo.email.message}
              </div>
            )}
          </div>

          <div className="mb-4">
            <Label 
              htmlFor="phone" 
              className="mb-1 block"
              data-testid="phone-label"
            >
              Phone
            </Label>
            <Input
              id="phone"
              data-testid="phone-input"
              {...register("personalInfo.phone")}
              className="w-full"
            />
            {errors.personalInfo?.phone && (
              <div className="text-red-500 text-sm mt-1">
                {errors.personalInfo.phone.message}
              </div>
            )}
          </div>

          <div className="mb-4">
            <Label 
              htmlFor="location" 
              className="mb-1 block"
              data-testid="location-label"
            >
              Location
            </Label>
            <Input
              id="location"
              data-testid="location-input"
              {...register("personalInfo.location")}
              className="w-full"
            />
            {errors.personalInfo?.location && (
              <div className="text-red-500 text-sm mt-1">
                {errors.personalInfo.location.message}
              </div>
            )}
          </div>

          <div className="mb-4">
            <Label 
              htmlFor="summary" 
              className="mb-1 block"
              data-testid="summary-label"
            >
              Professional Summary
            </Label>
            <Textarea
              id="summary"
              data-testid="summary-input"
              {...register("personalInfo.summary")}
              className="w-full"
              rows={4}
            />
            {errors.personalInfo?.summary && (
              <div className="text-red-500 text-sm mt-1">
                {errors.personalInfo.summary.message}
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="linkedIn">LinkedIn</Label>
              <Input
                id="linkedIn"
                {...register("personalInfo.linkedIn")}
                placeholder="LinkedIn profile URL"
                data-testid="linkedIn-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="education-card">
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          {educationFields.map((field, index) => (
            <div key={field.id} className="mb-6 p-4 border rounded-md">
              <div className="mb-4">
                <Label 
                  htmlFor={`education-${index}-institution`} 
                  className="mb-1 block"
                  data-testid={`education-${index}-institution-label`}
                >
                  Institution
                </Label>
                <Input
                  id={`education-${index}-institution`}
                  data-testid={`education-${index}-institution-input`}
                  {...register(`education.${index}.institution` as const)}
                  className="w-full"
                />
                {errors.education?.[index]?.institution && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.education[index]?.institution?.message}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <Label 
                  htmlFor={`education-${index}-degree`} 
                  className="mb-1 block"
                  data-testid={`education-${index}-degree-label`}
                >
                  Degree
                </Label>
                <Input
                  id={`education-${index}-degree`}
                  data-testid={`education-${index}-degree-input`}
                  {...register(`education.${index}.degree` as const)}
                  className="w-full"
                />
                {errors.education?.[index]?.degree && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.education[index]?.degree?.message}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <Label 
                  htmlFor={`education-${index}-fieldOfStudy`} 
                  className="mb-1 block"
                  data-testid={`education-${index}-fieldOfStudy-label`}
                >
                  Field of Study
                </Label>
                <Input
                  id={`education-${index}-fieldOfStudy`}
                  data-testid={`education-${index}-fieldOfStudy-input`}
                  {...register(`education.${index}.fieldOfStudy` as const)}
                  className="w-full"
                />
                {errors.education?.[index]?.fieldOfStudy && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.education[index]?.fieldOfStudy?.message}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <Label 
                    htmlFor={`education-${index}-startDate`} 
                    className="mb-1 block"
                    data-testid={`education-${index}-startDate-label`}
                  >
                    Start Date
                  </Label>
                  <Input
                    id={`education-${index}-startDate`}
                    data-testid={`education-${index}-startDate-input`}
                    {...register(`education.${index}.startDate` as const)}
                    className="w-full"
                  />
                  {errors.education?.[index]?.startDate && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.education[index]?.startDate?.message}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <Label 
                    htmlFor={`education-${index}-endDate`} 
                    className="mb-1 block"
                    data-testid={`education-${index}-endDate-label`}
                  >
                    End Date
                  </Label>
                  <Input
                    id={`education-${index}-endDate`}
                    data-testid={`education-${index}-endDate-input`}
                    {...register(`education.${index}.endDate` as const)}
                    className="w-full"
                  />
                  {errors.education?.[index]?.endDate && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.education[index]?.endDate?.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <Label 
                  htmlFor={`education-${index}-description`} 
                  className="mb-1 block"
                  data-testid={`education-${index}-description-label`}
                >
                  Description
                </Label>
                <Textarea
                  id={`education-${index}-description`}
                  data-testid={`education-${index}-description-input`}
                  {...register(`education.${index}.description` as const)}
                  className="w-full"
                  rows={4}
                />
                {errors.education?.[index]?.description && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.education[index]?.description?.message}
                  </div>
                )}
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendEducation({ 
              institution: "", 
              degree: "", 
              fieldOfStudy: "", 
              startDate: "", 
              endDate: "", 
              description: "" 
            })}
          >
            Add Education
          </Button>
        </CardContent>
      </Card>

      <Card data-testid="experience-card">
        <CardHeader>
          <CardTitle>Work Experience</CardTitle>
        </CardHeader>
        <CardContent>
          {experienceFields.map((field, index) => (
            <div key={field.id} className="mb-6 p-4 border rounded-md">
              <div className="mb-4">
                <Label 
                  htmlFor={`experience-${index}-company`} 
                  className="mb-1 block"
                  data-testid={`experience-${index}-company-label`}
                >
                  Company
                </Label>
                <Input
                  id={`experience-${index}-company`}
                  data-testid={`experience-${index}-company-input`}
                  {...register(`experience.${index}.company` as const)}
                  className="w-full"
                />
                {errors.experience?.[index]?.company && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.experience[index]?.company?.message}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <Label 
                  htmlFor={`experience-${index}-position`} 
                  className="mb-1 block"
                  data-testid={`experience-${index}-position-label`}
                >
                  Position
                </Label>
                <Input
                  id={`experience-${index}-position`}
                  data-testid={`experience-${index}-position-input`}
                  {...register(`experience.${index}.position` as const)}
                  className="w-full"
                />
                {errors.experience?.[index]?.position && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.experience[index]?.position?.message}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <Label 
                    htmlFor={`experience-${index}-startDate`} 
                    className="mb-1 block"
                    data-testid={`experience-${index}-startDate-label`}
                  >
                    Start Date
                  </Label>
                  <Input
                    id={`experience-${index}-startDate`}
                    data-testid={`experience-${index}-startDate-input`}
                    {...register(`experience.${index}.startDate` as const)}
                    className="w-full"
                  />
                  {errors.experience?.[index]?.startDate && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.experience[index]?.startDate?.message}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <Label 
                    htmlFor={`experience-${index}-endDate`} 
                    className="mb-1 block"
                    data-testid={`experience-${index}-endDate-label`}
                  >
                    End Date
                  </Label>
                  <Input
                    id={`experience-${index}-endDate`}
                    data-testid={`experience-${index}-endDate-input`}
                    {...register(`experience.${index}.endDate` as const)}
                    className="w-full"
                  />
                  {errors.experience?.[index]?.endDate && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.experience[index]?.endDate?.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <Label 
                  htmlFor={`experience-${index}-description`} 
                  className="mb-1 block"
                  data-testid={`experience-${index}-description-label`}
                >
                  Description
                </Label>
                <Textarea
                  id={`experience-${index}-description`}
                  data-testid={`experience-${index}-description-input`}
                  {...register(`experience.${index}.description` as const)}
                  className="w-full"
                  rows={4}
                />
                {errors.experience?.[index]?.description && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.experience[index]?.description?.message}
                  </div>
                )}
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendExperience({ 
              company: "", 
              position: "", 
              startDate: "", 
              endDate: "", 
              description: "" 
            })}
          >
            Add Experience
          </Button>
        </CardContent>
      </Card>

      <Card data-testid="skills-card">
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label 
              htmlFor="skills" 
              className="mb-1 block"
              data-testid="skills-label"
            >
              Skills (separate with commas)
            </Label>
            <Textarea
              id="skills"
              data-testid="skills-input"
              {...register("skills.skills")}
              className="w-full"
              rows={4}
            />
            {errors.skills?.skills && (
              <div className="text-red-500 text-sm mt-1">
                {errors.skills.skills.message}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 mt-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{t("certifications")}</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendCertification({
              name: "",
              issuer: "",
              date: "",
              expires: ""
            })}
          >
            Add Certification
          </Button>
        </div>
        
        {certificationFields.map((field, index) => (
          <Card key={field.id} className="p-4 relative">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`certifications.${index}.name`}>
                  Certification Name
                </Label>
                <Input
                  id={`certifications.${index}.name`}
                  {...register(`certifications.${index}.name`)}
                  data-testid={`certification-${index}-name-input`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`certifications.${index}.issuer`}>
                  Issuing Organization
                </Label>
                <Input
                  id={`certifications.${index}.issuer`}
                  {...register(`certifications.${index}.issuer`)}
                  data-testid={`certification-${index}-issuer-input`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`certifications.${index}.date`}>
                  Date Issued
                </Label>
                <Input
                  id={`certifications.${index}.date`}
                  {...register(`certifications.${index}.date`)}
                  data-testid={`certification-${index}-date-input`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`certifications.${index}.expires`}>
                  Expiration Date (Optional)
                </Label>
                <Input
                  id={`certifications.${index}.expires`}
                  {...register(`certifications.${index}.expires`)}
                  data-testid={`certification-${index}-expires-input`}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-2 mt-6">
        <Label htmlFor="additionalInfo">Additional Information</Label>
        <Textarea
          id="additionalInfo"
          {...register("additionalInfo")}
          placeholder="Any other relevant information"
          rows={4}
          data-testid="additionalInfo-input"
        />
      </div>

      <div className="flex justify-end mt-6">
        <Button type="submit" variant="destructive" data-testid="cv-form-submit-button">{submitLabel}</Button>
      </div>

      {previewData && (
        <div id="resume-preview" style={{ position: 'absolute', left: '-9999px' }}>
          <ResumePreviewer data={previewData} />
        </div>
      )}
    </form>
  );
}
