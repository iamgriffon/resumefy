"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cvFormSchema, CVFormType } from "./schemas";
import { useTranslations } from "use-intl";
import { generateResumePDF } from "@/lib/pdf-generator";
import { MonthYearPicker } from "@/components/ui/date-picker";
import { SaveIcon, MinimizeIcon, MaximizeIcon } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import React, { useState, useMemo, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FormCard } from "./cv-form/form-card";
import { isBefore, isAfter } from "date-fns";

export function CVForm({
  initialData,
  onSubmit,
  submitLabel,
}: {
  initialData?: CVFormType;
  onSubmit?: (data: CVFormType) => void;
  submitLabel?: string;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<CVFormType>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: {
      personalInfo: {
        fullName: initialData?.personalInfo?.fullName || "",
        email: initialData?.personalInfo?.email || "",
        phone: initialData?.personalInfo?.phone || "",
        location: initialData?.personalInfo?.location || "",
        linkedIn: initialData?.personalInfo?.linkedIn || "",
        summary: initialData?.personalInfo?.summary || "",
      },
      education: initialData?.education || [],
      experience: initialData?.experience || [],
      skills: { skills: initialData?.skills?.skills || "" },
      certifications: initialData?.certifications || [],
      additionalInfo: initialData?.additionalInfo || "",
    },
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experience",
  });

  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification,
  } = useFieldArray({
    control,
    name: "certifications",
  });

  const t = useTranslations("resume");
  const pathname = usePathname();

  const parseDate = (dateStr: string | undefined): Date | undefined => {
    if (!dateStr) return undefined;

    const parsedDate = new Date(dateStr);
    return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
  };

  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({
    personalInfo: false,
    education: false,
    experience: false,
    skills: false,
    certifications: false,
  });

  const toggleSection = useCallback(
    (section: string) => {
      setCollapsedSections({
        ...collapsedSections,
        [section]: !collapsedSections[section],
      });
    },
    [collapsedSections]
  );

  const toggleAllSections = useCallback(
    (collapse: boolean) => {
      setCollapsedSections({
        personalInfo: collapse,
        education: collapse,
        experience: collapse,
        skills: collapse,
        certifications: collapse,
      });
    },
    [setCollapsedSections]
  );

  const isAllSectionsCollapsed = useMemo(() => {
    return Object.values(collapsedSections).every((value) => value);
  }, [collapsedSections]);

  const router = useRouter();

  const validateDateOrder = useCallback(
    (startDate: Date | undefined, endDate: Date | undefined): {startDate: Date, endDate: Date} => {
      // Create default dates if any are undefined
      const defaultDate = new Date();
      const validStartDate = startDate || defaultDate;
      const validEndDate = endDate || defaultDate;
      
      // If start date is after end date, set both to the start date
      if (isAfter(validStartDate, validEndDate)) {
        return {startDate: validStartDate, endDate: validStartDate};
      }
      
      // If end date is before start date, set both to the end date
      if (isBefore(validEndDate, validStartDate)) {
        return {startDate: validEndDate, endDate: validEndDate};
      }
      
      // Dates are already in valid order
      return {startDate: validStartDate, endDate: validEndDate};
    },
    []
  );

  const submit = (data: CVFormType) => {
    if (onSubmit) {
      try {
        if (pathname.includes("edit")) {
          generateResumePDF(data)
            .then((pdf) => {
              pdf.save(`${data.personalInfo?.fullName || "resume"}.pdf`);
              onSubmit(data);
            })
            .catch((err) => {
              console.error("Failed to generate PDF:", err);
              onSubmit(data);
            });
        } else {
          console.log("edit");
          onSubmit(data);
        }
      } catch (error) {
        console.error("Error in form submission:", error);
        onSubmit(data);
      }
    }
    localStorage.setItem("importedCVData", JSON.stringify(data));
    router.push(`/resume-builder/preview`);
  };

  return (
    <React.Fragment>
      <article className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {pathname === "/en/resume-builder/edit"
            ? t("editResume")
            : t("createResume")}
        </h1>
        <div className="flex justify-end gap-2 mb-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => toggleAllSections(!isAllSectionsCollapsed)}
          >
            {isAllSectionsCollapsed ? (
              <MaximizeIcon className="h-4 w-4 mr-1" />
            ) : (
              <MinimizeIcon className="h-4 w-4 mr-1" />
            )}
            {isAllSectionsCollapsed ? t("expandAll") : t("collapseAll")}
          </Button>
        </div>
      </article>
      <form onSubmit={handleSubmit(submit)} className="space-y-8">
        <FormCard
          title={t("personalInfo")}
          onToggle={() => toggleSection("personalInfo")}
          isCollapsed={collapsedSections.personalInfo}
          testId="personal-info-card"
        >
          <div className="mb-4">
            <Label
              htmlFor="fullName"
              className="mb-2 block"
              data-testid="fullName-label"
            >
              {t("fullName")}
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
              className="mb-2 block"
              data-testid="email-label"
            >
              {t("email")}
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
              className="mb-2 block"
              data-testid="phone-label"
            >
              {t("phone")}
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
              className="mb-2 block"
              data-testid="location-label"
            >
              {t("location")}
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
              className="mb-2 block"
              data-testid="summary-label"
            >
              {t("summary")}
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
              <Label htmlFor="linkedIn">{t("linkedin")}</Label>
              <Input
                id="linkedIn"
                {...register("personalInfo.linkedIn")}
                placeholder="LinkedIn profile URL"
                data-testid="linkedIn-input"
              />
            </div>
          </div>
        </FormCard>

        <FormCard
          testId="education-card"
          title={t("education")}
          onToggle={() => toggleSection("education")}
          isCollapsed={collapsedSections.education}
        >
          {educationFields.map((field, index) => (
            <div key={field.id} className="mb-6 p-4 border rounded-md">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeEducation(index)}
                disabled={educationFields.length === 1}
                aria-label="Remove education entry"
              >
                ✕
              </Button>

              <div className="mb-4">
                <Label
                  htmlFor={`education-${index}-institution`}
                  className="mb-2 block"
                  data-testid={`education-${index}-institution-label`}
                >
                  {t("institution")}
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
                  className="mb-2 block"
                  data-testid={`education-${index}-degree-label`}
                >
                  {t("degree")}
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
                  className="mb-2 block"
                  data-testid={`education-${index}-fieldOfStudy-label`}
                >
                  {t("fieldOfStudy")}
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
                    className="mb-2 block"
                    data-testid={`education-${index}-startDate-label`}
                  >
                    {t("startDate")}
                  </Label>
                  <Controller
                    control={control}
                    name={`education.${index}.startDate` as const}
                    render={({ field }) => (
                      <MonthYearPicker
                        id={`education-${index}-startDate`}
                        value={
                          parseDate(field.value) ||
                          parseDate(new Date().toISOString().split("T")[0])
                        }
                        onChange={(date) => {
                          if (!date) {
                            field.onChange("");
                            return;
                          }
                          
                          const endDateField = control._formValues.education[index].endDate;
                          // Skip validation if end date is "present"
                          if (endDateField === "present") {
                            field.onChange(date.toISOString().split("T")[0]);
                            return;
                          }
                          
                          const endDate = parseDate(endDateField);
                          const { startDate: newStartDate, endDate: newEndDate } = validateDateOrder(date, endDate);
                          
                          // Update the end date if it changed during validation
                          if (endDate && endDate.getTime() !== newEndDate.getTime()) {
                            setValue(`education.${index}.endDate`, newEndDate.toISOString().split("T")[0]);
                          }
                          
                          field.onChange(newStartDate.toISOString().split("T")[0]);
                        }}
                        placeholder={t("selectStartDate")}
                        data-testid={`education-${index}-startDate-input`}
                      />
                    )}
                  />
                  {errors.education?.[index]?.startDate && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.education[index]?.startDate?.message}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-start justify-between">
                    <Label
                      htmlFor={`education-${index}-endDate`}
                      className="mb-2 block"
                      data-testid={`education-${index}-endDate-label`}
                    >
                      {t("endDate")}
                    </Label>
                  </div>
                  <Controller
                    control={control}
                    name={`education.${index}.endDate` as const}
                    render={({ field }) => (
                      <MonthYearPicker
                        disabled={field.value === "present"}
                        id={`education-${index}-endDate`}
                        value={
                          parseDate(field.value) ||
                          parseDate(new Date().toISOString().split("T")[0])
                        }
                        onChange={(date) => {
                          if (!date) {
                            field.onChange("");
                            return;
                          }
                          
                          const startDateField = control._formValues.education[index].startDate;
                          const startDate = parseDate(startDateField);
                          
                          const { startDate: newStartDate, endDate: newEndDate } = validateDateOrder(startDate, date);
                          
                          // Update both dates if needed
                          if (startDate && startDate.getTime() !== newStartDate.getTime()) {
                            // Start date needed to be updated
                            setValue(`education.${index}.startDate`, newStartDate.toISOString().split("T")[0]);
                          }
                          
                          field.onChange(newEndDate.toISOString().split("T")[0]);
                        }}
                        placeholder={t("selectEndDate")}
                        data-testid={`education-${index}-endDate-input`}
                      />
                    )}
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
                  className="mb-2 block"
                  data-testid={`education-${index}-description-label`}
                >
                  {t("description")}
                </Label>
                <Textarea
                  required
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

              <div className="flex items-center gap-2 mt-2">
                <Controller
                  control={control}
                  name={`education.${index}.endDate` as const}
                  render={({ field: endDateField }) => (
                    <Checkbox
                      id={`education-${index}-present`}
                      checked={
                        typeof endDateField.value === "string" &&
                        endDateField.value.toLowerCase() === "present"
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          endDateField.onChange("present");
                          return;
                        }
                        
                        // When unchecking, set end date to current start date
                        const startDateValue = control._formValues.education[index].startDate;
                        const startDate = parseDate(startDateValue);
                        if (startDate) {
                          endDateField.onChange(startDate.toISOString().split("T")[0]);
                        } else {
                          endDateField.onChange(getCurrentDate());
                        }
                      }}
                    />
                  )}
                />
                <p className="text-sm">{t("currentlyStudying")}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                size="sm"
                onClick={() => removeEducation(index)}
                disabled={educationFields.length === 1}
                aria-label="Remove education entry"
              >
                {t("remove")}
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="my-4"
            size="sm"
            onClick={() =>
              appendEducation({
                institution: "",
                degree: "",
                fieldOfStudy: "",
                startDate: getCurrentDate(),
                endDate: getCurrentDate(),
                description: "",
              })
            }
          >
            {t("addEducation")}
          </Button>
        </FormCard>

        <FormCard
          testId="experience-card"
          title={t("experience")}
          onToggle={() => toggleSection("experience")}
          isCollapsed={collapsedSections.experience}
        >
          {experienceFields.map((field, index) => (
            <div key={field.id} className="mb-6 p-4 border rounded-md relative">
              <div className="mb-4">
                <Label
                  htmlFor={`experience-${index}-company`}
                  className="mb-2 block"
                  data-testid={`experience-${index}-company-label`}
                >
                  {t("company")}
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
                  className="mb-2 block"
                  data-testid={`experience-${index}-position-label`}
                >
                  {t("position")}
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
                    className="mb-2 block"
                    data-testid={`experience-${index}-startDate-label`}
                  >
                    {t("startDate")}
                  </Label>
                  <Controller
                    control={control}
                    name={`experience.${index}.startDate` as const}
                    render={({ field }) => (
                      <MonthYearPicker
                        id={`experience-${index}-startDate`}
                        value={
                          parseDate(field.value) ||
                          parseDate(new Date().toISOString().split("T")[0])
                        }
                        onChange={(date) => {
                          if (!date) {
                            field.onChange("");
                            return;
                          }
                          
                          const endDateField = control._formValues.experience[index].endDate;
                          // Skip validation if end date is "present"
                          if (endDateField === "present") {
                            field.onChange(date.toISOString().split("T")[0]);
                            return;
                          }
                          
                          const endDate = parseDate(endDateField);
                          const { startDate: newStartDate, endDate: newEndDate } = validateDateOrder(date, endDate);
                          
                          // Update the end date if it changed during validation
                          if (endDate && endDate.getTime() !== newEndDate.getTime()) {
                            setValue(`experience.${index}.endDate`, newEndDate.toISOString().split("T")[0]);
                          }
                          
                          field.onChange(newStartDate.toISOString().split("T")[0]);
                        }}
                        placeholder={t("selectStartDate")}
                        data-testid={`experience-${index}-startDate-input`}
                      />
                    )}
                  />
                  {errors.experience?.[index]?.startDate && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.experience[index]?.startDate?.message}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-start justify-between">
                    <Label
                      htmlFor={`experience-${index}-endDate`}
                      className="mb-2 block"
                      data-testid={`experience-${index}-endDate-label`}
                    >
                      {t("endDate")}
                    </Label>
                  </div>
                  <Controller
                    control={control}
                    name={`experience.${index}.endDate` as const}
                    render={({ field }) => (
                      <MonthYearPicker
                        disabled={field.value === "present"}
                        id={`experience-${index}-endDate`}
                        value={
                          parseDate(field.value) ||
                          parseDate(new Date().toISOString().split("T")[0])
                        }
                        onChange={(date) => {
                          if (!date) {
                            field.onChange("");
                            return;
                          }
                          
                          const startDateField = control._formValues.experience[index].startDate;
                          const startDate = parseDate(startDateField);
                          
                          const { startDate: newStartDate, endDate: newEndDate } = validateDateOrder(startDate, date);
                          
                          // Update both dates if needed
                          if (startDate && startDate.getTime() !== newStartDate.getTime()) {
                            // Start date needed to be updated
                            setValue(`experience.${index}.startDate`, newStartDate.toISOString().split("T")[0]);
                          }
                          
                          field.onChange(newEndDate.toISOString().split("T")[0]);
                        }}
                        placeholder={t("selectEndDate")}
                        data-testid={`experience-${index}-endDate-input`}
                      />
                    )}
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
                  className="mb-2 block"
                  data-testid={`experience-${index}-description-label`}
                >
                  {t("description")}
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
              <div className="flex items-center gap-2 mt-2">
                <Controller
                  control={control}
                  name={`experience.${index}.endDate` as const}
                  render={({ field: endDateField }) => (
                    <Checkbox
                      id={`experience-${index}-present`}
                      checked={
                        typeof endDateField.value === "string" &&
                        endDateField.value.toLowerCase() === "present"
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          endDateField.onChange("present");
                          return;
                        }
                        
                        // When unchecking, set end date to current start date
                        const startDateValue = control._formValues.experience[index].startDate;
                        const startDate = parseDate(startDateValue);
                        if (startDate) {
                          endDateField.onChange(startDate.toISOString().split("T")[0]);
                        } else {
                          endDateField.onChange(getCurrentDate());
                        }
                      }}
                    />
                  )}
                />
                <p className="text-sm">{t("currentlyWorking")}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                size="sm"
                onClick={() => removeExperience(index)}
                disabled={experienceFields.length === 1}
                aria-label="Remove experience entry"
              >
                {t("remove")}
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="my-4"
            size="sm"
            onClick={() =>
              appendExperience({
                company: "",
                position: "",
                startDate: getCurrentDate(),
                endDate: getCurrentDate(),
                description: "",
              })
            }
          >
            {t("addExperience")}
          </Button>
        </FormCard>
        <FormCard
          testId="skills-card"
          title={t("skills")}
          onToggle={() => toggleSection("skills")}
          isCollapsed={collapsedSections.skills}
        >
          <Textarea
            id="skills"
            data-testid="skills-input"
            {...register("skills.skills")}
            className="w-full"
            rows={4}
          />
        </FormCard>
        <FormCard
          testId="certifications-card"
          title={t("certifications")}
          onToggle={() => toggleSection("certifications")}
          isCollapsed={collapsedSections.certifications}
        >
          {certificationFields.map((field, index) => (
            <Card key={field.id} className="p-4 not-last:mb-6">
              <div className="mb-4">
                <Label
                  htmlFor={`certification-${index}-name`}
                  className="mb-2 block"
                  data-testid={`certification-${index}-name-label`}
                >
                  {t("certificationName")}
                </Label>
                <Input
                  id={`certification-${index}-name`}
                  data-testid={`certification-${index}-name-input`}
                  {...register(`certifications.${index}.name` as const)}
                  className="w-full"
                />
                {errors.certifications?.[index]?.name && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.certifications[index]?.name?.message}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <Label
                  htmlFor={`certification-${index}-issuer`}
                  className="mb-2 block"
                  data-testid={`certification-${index}-issuer-label`}
                >
                  {t("issuer")}
                </Label>
                <Input
                  id={`certification-${index}-issuer`}
                  data-testid={`certification-${index}-issuer-input`}
                  {...register(`certifications.${index}.issuer` as const)}
                  className="w-full"
                />
                {errors.certifications?.[index]?.issuer && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.certifications[index]?.issuer?.message}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <Label
                  htmlFor={`certification-${index}-issueDate`}
                  className="mb-2 block"
                  data-testid={`certification-${index}-issueDate-label`}
                >
                  {t("issueDate")}
                </Label>
                <Controller
                  control={control}
                  name={`certifications.${index}.date` as const}
                  render={({ field }) => (
                    <MonthYearPicker
                      id={`certification-${index}-issueDate`}
                      value={parseDate(field.value as string)}
                      onChange={(date) => {
                        if (!date) {
                          field.onChange("");
                          return;
                        }
                        
                        // Get the expiration date for validation
                        const expiresField = control._formValues.certifications[index].expires;
                        const expiresDate = parseDate(expiresField);
                        
                        // Validate date order
                        const { startDate: newIssueDate, endDate: newExpiresDate } = validateDateOrder(date, expiresDate);
                        
                        // Update expiration date if needed
                        if (expiresDate && expiresDate.getTime() !== newExpiresDate.getTime()) {
                          setValue(`certifications.${index}.expires`, newExpiresDate.toISOString().split("T")[0]);
                        }
                        
                        // Update issue date
                        field.onChange(newIssueDate.toISOString().split("T")[0]);
                      }}
                      placeholder={t("selectIssueDate")}
                      data-testid={`certification-${index}-issueDate-input`}
                    />
                  )}
                />
                {errors.certifications?.[index]?.date && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.certifications[index]?.date?.message}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <Label
                  htmlFor={`certification-${index}-expirationDate`}
                  className="mb-2 block"
                  data-testid={`certification-${index}-expirationDate-label`}
                >
                  {t("expirationDate")}
                </Label>
                <Controller
                  control={control}
                  name={`certifications.${index}.expires` as const}
                  render={({ field }) => (
                    <MonthYearPicker
                      id={`certification-${index}-expirationDate`}
                      value={parseDate(field.value as string)}
                      onChange={(date) => {
                        if (!date) {
                          field.onChange("");
                          return;
                        }
                        
                        // Get the issue date for validation
                        const issueDateField = control._formValues.certifications[index].date;
                        const issueDate = parseDate(issueDateField);
                        
                        // Validate date order
                        const { startDate: newIssueDate, endDate: newExpiresDate } = validateDateOrder(issueDate, date);
                        
                        // Update issue date if needed
                        if (issueDate && issueDate.getTime() !== newIssueDate.getTime()) {
                          setValue(`certifications.${index}.date`, newIssueDate.toISOString().split("T")[0]);
                        }
                        
                        // Update expiration date
                        field.onChange(newExpiresDate.toISOString().split("T")[0]);
                      }}
                      placeholder={t("selectExpirationDate")}
                      data-testid={`certification-${index}-expirationDate-input`}
                    />
                  )}
                />
                {errors.certifications?.[index]?.expires && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.certifications[index]?.expires?.message}
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                size="sm"
                onClick={() => removeCertification(index)}
                disabled={certificationFields.length === 1}
                aria-label="Remove certification entry"
              >
                {t("remove")}
              </Button>
            </Card>
          ))}
          <Button
            type="button"
            variant="outline"
            className="my-4"
            size="sm"
            onClick={() =>
              appendCertification({
                name: "",
                issuer: "",
                date: getCurrentDate(),
              })
            }
          >
            {t("addCertification")}
          </Button>
        </FormCard>
        <Button
          type="submit"
          className="flex w-full justify-center my-4 px-8"
          variant="outline"
        >
          <SaveIcon className="w-4 h-4 mr-2" /> {submitLabel || t("submit")}
        </Button>
      </form>
    </React.Fragment>
  );
}
