import { jsPDF } from "jspdf";
import { CVFormType } from "@/components/resume/schemas";
import { formatDate } from "./utils";
import { parse } from "date-fns";

const resumeTranslations: Record<string, Record<string, string>> = {
  en: {
    professionalSummary: "PROFESSIONAL SUMMARY",
    workExperience: "WORK EXPERIENCE",
    education: "EDUCATION",
    skills: "SKILLS",
    certifications: "CERTIFICATIONS",
    additionalInformation: "ADDITIONAL INFORMATION",
    contact: "CONTACT",
    expires: "Expires",
    phone: "Phone",
    location: "Location",
  },
  es: {
    professionalSummary: "RESUMEN PROFESIONAL",
    workExperience: "EXPERIENCIA LABORAL",
    education: "EDUCACIÓN",
    skills: "HABILIDADES",
    certifications: "CERTIFICACIONES",
    additionalInformation: "INFORMACIÓN ADICIONAL",
    contact: "CONTACTO",
    expires: "Expira en",
    phone: "Teléfono",
    location: "Ubicación",
  },
  "pt-BR": {
    professionalSummary: "RESUMO PROFISSIONAL",
    workExperience: "EXPERIÊNCIA PROFISSIONAL",
    education: "EDUCAÇÃO",
    skills: "HABILIDADES",
    certifications: "CERTIFICAÇÕES",
    additionalInformation: "INFORMAÇÕES ADICIONAIS",
    contact: "CONTATO",
    expires: "Expira em",
    phone: "Telefone",
    location: "Localização",
  },
  zh: {
    professionalSummary: "專業摘要",
    workExperience: "工作經驗",
    education: "教育",
    skills: "技能",
    certifications: "證書",
    additionalInformation: "附加信息",
    contact: "聯絡方式",
    expires: "過期",
    location: "位置",
    phone: "電話",
  },
};

export const generateResumePDF = async (
  resumeData: CVFormType,
  locale: string = "en"
) => {
  try {
    const translations = resumeTranslations[locale] || resumeTranslations.en;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    let yPosition = margin;

    pdf.setFontSize(24);
    pdf.setTextColor(44, 82, 130); // #2c5282
    pdf.text(resumeData.personalInfo?.fullName || "Resume", margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setTextColor(51, 51, 51); // #333333
    if (resumeData.personalInfo?.email) {
      pdf.setFont("Helvetica", "bold");
      pdf.text("Email:", margin, yPosition);
      pdf.setFont("Helvetica", "normal");
      const emailLabelWidth = pdf.getTextWidth("Email:");
      pdf.text(
        resumeData.personalInfo.email,
        margin + emailLabelWidth + 2,
        yPosition
      );
      yPosition += 5;
    }

    if (resumeData.personalInfo?.phone) {
      pdf.setFont("Helvetica", "bold");
      pdf.text(`${translations.phone}:`, margin, yPosition);
      pdf.setFont("Helvetica", "normal");
      const phoneLabelWidth = pdf.getTextWidth(`${translations.phone}:`);
      pdf.text(
        resumeData.personalInfo.phone,
        margin + phoneLabelWidth + 2,
        yPosition
      );
      yPosition += 5;
    }

    if (resumeData.personalInfo?.location) {
      pdf.setFont("Helvetica", "bold");
      pdf.text(`${translations.location}:`, margin, yPosition);
      pdf.setFont("Helvetica", "normal");
      const locationLabelWidth = pdf.getTextWidth(`${translations.location}:`);
      pdf.text(
        resumeData.personalInfo.location,
        margin + locationLabelWidth + 2,
        yPosition
      );
      yPosition += 5;
    }

    if (resumeData.personalInfo?.linkedIn) {
      pdf.setFont("Helvetica", "bold");
      pdf.text("LinkedIn:", margin, yPosition);
      pdf.setFont("Helvetica", "normal");
      const linkedInLabelWidth = pdf.getTextWidth("LinkedIn:");
      const linkedInText = resumeData.personalInfo.linkedIn;
      pdf.setFont("Helvetica", "italic");
      pdf.setTextColor(44, 82, 130); // #2c5282
      pdf.textWithLink(
        linkedInText,
        margin + linkedInLabelWidth + 2,
        yPosition,
        {
          url: linkedInText.startsWith("http")
            ? linkedInText
            : `https://${linkedInText}`,
        }
      );
      yPosition += 5;
    }
    yPosition += 3;

    pdf.setFont("Helvetica", "normal");
    pdf.setDrawColor(44, 82, 130); // #2c5282
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    const truncateText = (text: string, maxWidth: number): string => {
      if (pdf.getTextWidth(text) <= maxWidth) return text;

      const ellipsis = "...";
      let truncated = text;
      while (
        truncated.length > 3 &&
        pdf.getTextWidth(truncated + ellipsis) > maxWidth
      ) {
        truncated = truncated.slice(0, -1);
      }
      return truncated + ellipsis;
    };

    const addSectionTitle = (title: string) => {
      if (yPosition > pageHeight - margin - 30) {
        pdf.addPage();
        yPosition = margin;
      }

      if (yPosition > margin + 15) {
        yPosition += 2;
      }

      pdf.setFontSize(14);
      pdf.setTextColor(44, 82, 130); // #2c5282
      pdf.text(title, margin, yPosition);
      yPosition += 2;

      pdf.setDrawColor(226, 232, 240); // #e2e8f0
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;
    };

    const addContent = (text: string, fontSize = 10) => {
      if (!text) return;

      pdf.setFontSize(fontSize);
      pdf.setTextColor(51, 51, 51); // #333333

      const textLines = pdf.splitTextToSize(text, contentWidth);
      
      if (yPosition + (textLines.length * 5) > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.text(textLines, margin, yPosition);
      yPosition += textLines.length * 5 + 5;
    };

    if (resumeData.personalInfo?.summary) {
      addSectionTitle(translations.professionalSummary);
      addContent(resumeData.personalInfo.summary);
      yPosition += 2;
    }

    if (resumeData.experience && !!resumeData.experience.length) {
      addSectionTitle(translations.workExperience);

      for (const exp of resumeData.experience) {
        const estimatedHeight = 20; // Base height for company and date
        const descriptionLines = exp.description 
          ? pdf.splitTextToSize(exp.description, contentWidth).length
          : 0;
        const totalEstimatedHeight = estimatedHeight + (descriptionLines * 5);
        
        if (yPosition + totalEstimatedHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setFontSize(12);
        pdf.setFont("Helvetica", "bold");
        pdf.setTextColor(51, 51, 51);

        const position = `${exp.position || ""} @ ${exp.company || ""}`;
        const dateRange = `${
          exp.startDate
            ? formatDate(
                parse(exp.startDate, "yyyy-MM", new Date()),
                "MMM/yyyy",
                locale
              )
            : ""
        } - ${
          exp.endDate
            ? formatDate(
                parse(exp.endDate, "yyyy-MM", new Date()),
                "MMM/yyyy",
                locale
              )
            : ""
        }`;

        const dateWidth = pdf.getTextWidth(dateRange);
        const padding = 10;
        const maxPositionWidth = pageWidth - 2 * margin - dateWidth - padding;

        const truncatedPosition = truncateText(position, maxPositionWidth);
        pdf.text(truncatedPosition, margin, yPosition);
        pdf.text(dateRange, pageWidth - margin - dateWidth, yPosition);
        yPosition += 5;

        if (exp.description) {
          yPosition += 1;
          pdf.setFont("Helvetica", "normal");
          addContent(exp.description);
        } else {
          yPosition += 5;
        }
      }
      yPosition += 2;
    }

    if (resumeData.education && !!resumeData.education.length) {
      addSectionTitle(translations.education);

      for (const edu of resumeData.education) {
        const estimatedHeight = 20; // Base height for degree and date
        const descriptionLines = edu.description 
          ? pdf.splitTextToSize(edu.description, contentWidth).length
          : 0;
        const totalEstimatedHeight = estimatedHeight + (descriptionLines * 5);
        
        if (yPosition + totalEstimatedHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setFontSize(12);
        pdf.setFont("Helvetica", "bold");
        pdf.setTextColor(51, 51, 51);

        const degreeText = `${edu.degree || ""} @ ${edu.institution}`;
        const dateRange = `${
          formatDate(edu.startDate || "", "MMM/yyyy", locale) || ""
        } - ${formatDate(edu.endDate || "", "MMM/yyyy", locale) || ""}`;

        const dateWidth = pdf.getTextWidth(dateRange);
        const padding = 10;
        const maxDegreeWidth = pageWidth - 2 * margin - dateWidth - padding;

        const truncatedDegree = truncateText(degreeText, maxDegreeWidth);
        pdf.text(truncatedDegree, margin, yPosition);
        pdf.text(dateRange, pageWidth - margin - dateWidth, yPosition);

        yPosition += 5;

        if (edu.fieldOfStudy) {
          yPosition += 1;
          pdf.setFontSize(11);
          pdf.setFont("Helvetica", "normal");
          pdf.text(edu.fieldOfStudy, margin, yPosition);
          yPosition += 8;
        }

        if (edu.description) {
          pdf.setFont("Helvetica", "italic");
          addContent(edu.description);
        } else {
          yPosition += 5;
        }
      }
      yPosition += 2;
    }

    pdf.setFont("Helvetica", "normal");
    if (resumeData.skills && resumeData.skills.skills) {
      const skills = resumeData.skills.skills.split(",").map((skill) => skill.trim());
      const skillsPerColumn = Math.ceil(skills.length / 3);
      const estimatedHeight = skillsPerColumn * 5 + 15; // Height per item + padding
      
      if (yPosition + estimatedHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      
      addSectionTitle(translations.skills);

      let columnCount = 0;
      let currentColumn = 0;

      const startY = yPosition;

      for (const skill of skills) {
        const xPosition = margin + currentColumn * (contentWidth / 3);
        pdf.setFontSize(10);
        pdf.setTextColor(51, 51, 51);
        pdf.text(`• ${skill}`, xPosition, yPosition);

        columnCount++;

        if (columnCount >= skillsPerColumn) {
          columnCount = 0;
          currentColumn++;

          if (currentColumn >= 3) {
            currentColumn = 0;
            yPosition += 5;
          } else {
            yPosition = startY;
          }
        } else {
          yPosition += 5;
        }
      }

      if (currentColumn > 0) {
        yPosition = startY + skillsPerColumn * 5;
      }

      yPosition += 8;
    }

    if (resumeData.certifications && !!resumeData.certifications.length) {
      const certHeight = resumeData.certifications.reduce((total, cert) => {
        return total + 15 + (cert.issuer ? 5 : 0) + (cert.expires ? 5 : 0);
      }, 10);
      
      if (yPosition + certHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      
      addSectionTitle(translations.certifications);

      for (const cert of resumeData.certifications) {
        pdf.setFontSize(12);
        pdf.setTextColor(51, 51, 51);
        pdf.text(cert.name || "", margin, yPosition);

        if (cert.date) {
          const dateWidth = pdf.getTextWidth(cert.date);
          pdf.text(cert.date, pageWidth - margin - dateWidth, yPosition);
        }
        yPosition += 5;

        if (cert.issuer) {
          pdf.setFontSize(10);
          pdf.text(cert.issuer, margin, yPosition);
          yPosition += 5;
        }

        if (cert.expires) {
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          pdf.text(
            `${translations.expires}: ${cert.expires}`,
            margin,
            yPosition
          );
          yPosition += 5;
        }

        yPosition += 3;
      }
      yPosition += 2; // Extra spacing at the end of section
    }

    if (resumeData.additionalInfo) {
      const infoLines = pdf.splitTextToSize(resumeData.additionalInfo, contentWidth).length;
      const infoHeight = infoLines * 5 + 15;
      
      if (yPosition + infoHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      
      addSectionTitle(translations.additionalInformation);
      addContent(resumeData.additionalInfo);
    }

    addATSOptimizationTags(pdf, resumeData);

    return pdf;
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
    throw error;
  }
};

function addATSOptimizationTags(pdf: jsPDF, data: CVFormType) {
  pdf.setProperties({
    title: `Resume - ${data.personalInfo?.fullName || ""}`,
    subject: data.personalInfo?.summary || "",
    keywords: data.skills?.skills || "",
    creator: "Resumefy by iamgriffon",
  });

  const tagsToAdd = [
    data.personalInfo?.fullName || "",
    data.personalInfo?.email || "",
    data.personalInfo?.phone || "",
    data.skills?.skills || "",
  ];

  pdf.setFontSize(0.1);
  pdf.setTextColor(255, 255, 255);
  pdf.text(tagsToAdd.join(", "), 1, 1);
}
