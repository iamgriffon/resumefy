import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { CVFormType } from "@/components/resume/schemas";
import { formatDate } from "./utils";
import { parse } from "date-fns";

// Resume translations mapping for multiple locales
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
  },
};

// Add optional resumeElement parameter
export const generateResumePDF = async (
  resumeData: CVFormType,
  locale: string = "en"
) => {
  try {
    // Retrieve the translations for the current locale; default to English if not available.
    const translations = resumeTranslations[locale] || resumeTranslations.en;

    // Create a temporary div for rendering the resume content
    const tempElement = document.createElement("div");
    tempElement.id = "temp-resume-container";
    tempElement.className = "resume-preview";
    tempElement.style.position = "absolute";
    tempElement.style.width = "800px";
    tempElement.style.left = "-9999px";
    tempElement.style.top = "0";
    tempElement.style.padding = "20px";
    tempElement.style.backgroundColor = "white";
    document.body.appendChild(tempElement);

    // Generate a professional-looking ATS-optimized resume preview
    tempElement.innerHTML = `
      <div id="temp-resume-preview" style="width: 100%; padding: 30px; font-family: 'Calibri', 'Arial', sans-serif; color: #333333;">
        <!-- Header with name and contact info -->
        <div style="border-bottom: 2px solid #2c5282; padding-bottom: 15px; margin-bottom: 20px;">
          <h1 style="font-size: 28px; margin: 0 0 10px 0; color: #2c5282;">${
            resumeData.personalInfo?.fullName || "Resume"
          }</h1>
          <div style="display: flex; flex-wrap: wrap; gap: 15px; font-size: 14px;">
            ${
              resumeData.personalInfo?.email
                ? `<div style="margin-right: 15px;"><strong>Email:</strong> ${resumeData.personalInfo.email}</div>`
                : ""
            }
            ${
              resumeData.personalInfo?.phone
                ? `<div style="margin-right: 15px;"><strong>Phone:</strong> ${resumeData.personalInfo.phone}</div>`
                : ""
            }
            ${
              resumeData.personalInfo?.location
                ? `<div><strong>Location:</strong> ${resumeData.personalInfo.location}</div>`
                : ""
            }
            ${
              resumeData.personalInfo?.linkedIn
                ? `<div><strong>LinkedIn:</strong> ${resumeData.personalInfo.linkedIn}</div>`
                : ""
            }
          </div>
        </div>
        
        <!-- ${translations.professionalSummary} -->
        ${
          resumeData.personalInfo?.summary
            ? `
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; margin: 0 0 10px 0; color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">${translations.professionalSummary}</h2>
          <p style="margin: 0; line-height: 1.5;">${resumeData.personalInfo.summary}</p>
        </div>
        `
            : ""
        }
        
        <!-- ${translations.workExperience} -->
        ${
          resumeData.experience && resumeData.experience.length > 0
            ? `
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; margin: 0 0 10px 0; color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">${
            translations.workExperience
          }</h2>
          ${resumeData.experience
            .map(
              (exp) => `
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <div style="font-weight: bold;">${exp.position || ""} @ <em>${
                exp.company || ""
              }</em></div>
                <div>${
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
              }</div>
              </div>
              <p style="margin: 0; line-height: 1.4;">${
                exp.description || ""
              }</p>
            </div>
          `
            )
            .join("")}
        </div>
        `
            : ""
        }
        
        <!-- ${translations.education} -->
        ${
          resumeData.education && resumeData.education.length > 0
            ? `
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; margin: 0 0 10px 0; color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">${
            translations.education
          }</h2>
          ${resumeData.education
            .map(
              (edu) => `
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <div style="font-weight: bold;">${edu.degree || ""} - ${
                edu.fieldOfStudy
              }
                <em> @ ${edu.institution || ""} </em>
                </div>
                <div>${
                  formatDate(edu.startDate || "", "MMM/yyyy", locale) || ""
                } - ${
                formatDate(edu.endDate || "", "MMM/yyyy", locale) || ""
              }</div>
              </div>
              <div style="margin-bottom: 5px;">${edu.description || ""}</div>
            </div>
          `
            )
            .join("")}
        </div>
        `
            : ""
        }
        
        <!-- ${translations.skills} -->
        ${
          resumeData.skills && resumeData.skills.skills
            ? `
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; margin: 0 0 10px 0; color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">${
            translations.skills
          }</h2>
          <div style="column-width: 150px; column-gap: 20px;">
            ${resumeData.skills.skills
              .split(",")
              .map(
                (skill) =>
                  `<div style="margin-bottom: 8px; font-weight: medium; font-size: 16px;">${skill.trim()}</div>`
              )
              .join("")}
          </div>
        </div>
        `
            : ""
        }

        <!-- ${translations.certifications} -->
        ${
          resumeData.certifications && resumeData.certifications.length > 0
            ? `
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; margin: 0 0 10px 0; color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">${
            translations.certifications
          }</h2>
          <div>
            ${resumeData.certifications
              .map(
                (cert) => `
              <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <div style="font-weight: bold;">${cert.name || ""}</div>
                  <div>${cert.date || ""}</div>
                </div>
                <div style="margin-bottom: 5px;">${cert.issuer || ""}</div>
                ${
                  cert.expires
                    ? `<div style="font-style: italic; font-size: 14px;">${translations.expires}: ${cert.expires}</div>`
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>
        </div>
        `
            : ""
        }

        <!-- ${translations.additionalInformation} -->
        ${
          resumeData.additionalInfo
            ? `
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; margin: 0 0 10px 0; color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">${translations.additionalInformation}</h2>
          <p style="margin: 0; line-height: 1.5;">${resumeData.additionalInfo}</p>
        </div>
        `
            : ""
        }

        <!-- Hidden ATS keywords for better parsing -->
        <div style="color: white; font-size: 1px; line-height: 1px;">
          ${resumeData.personalInfo?.fullName || ""}
          ${resumeData.personalInfo?.email || ""}
          ${resumeData.personalInfo?.phone || ""}
          ${resumeData.personalInfo?.location || ""}
          ${resumeData.personalInfo?.linkedIn || ""}
          ${resumeData.personalInfo?.summary || ""}
          ${resumeData.skills?.skills || ""}
          ${
            resumeData.experience
              ?.map(
                (exp) => `${exp.company} ${exp.position} ${exp.description}`
              )
              .join(" ") || ""
          }
          ${
            resumeData.education
              ?.map(
                (edu) => `${edu.institution} ${edu.degree} ${edu.fieldOfStudy}`
              )
              .join(" ") || ""
          }
          ${
            resumeData.certifications
              ?.map((cert) => `${cert.name} ${cert.issuer}`)
              .join(" ") || ""
          }
          ${resumeData.additionalInfo || ""}
        </div>
      </div>
    `;

    // Allow a moment for the content to render
    await new Promise((resolve) => setTimeout(resolve, 200));

    const elementToCapture = document.getElementById("temp-resume-preview");
    if (!elementToCapture) throw new Error("Resume preview element not found");

    // Generate a canvas of the temporary element
    const canvas = await html2canvas(elementToCapture, {
      scale: 1.5,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    if (imgWidth <= 0 || imgHeight <= 0)
      throw new Error("Invalid canvas dimensions");

    const imgData = canvas.toDataURL("image/jpeg", 0.8);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 0.95;
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 5; // top margin

    if (
      isNaN(imgX) ||
      isNaN(imgY) ||
      isNaN(imgWidth * ratio) ||
      isNaN(imgHeight * ratio) ||
      !isFinite(imgX) ||
      !isFinite(imgY) ||
      !isFinite(imgWidth * ratio) ||
      !isFinite(imgHeight * ratio) ||
      imgX < 0 ||
      imgY < 0 ||
      imgWidth * ratio <= 0 ||
      imgHeight * ratio <= 0
    ) {
      throw new Error("Invalid PDF coordinates calculated");
    }

    pdf.addImage(
      imgData,
      "JPEG",
      imgX,
      imgY,
      imgWidth * ratio,
      imgHeight * ratio,
      undefined,
      "FAST"
    );

    // Add optimized hidden text for ATS parsing using locale-specific text
    addOptimizedATSText(pdf, resumeData, translations);

    // Clean up temporary element
    document.body.removeChild(tempElement);
    return pdf;
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
    throw error;
  }
};

// Early return is used in the loop below to skip empty sections.
function addOptimizedATSText(
  pdf: jsPDF,
  data: CVFormType,
  translations: Record<string, string>
) {
  pdf.setFontSize(1); // Extremely small font
  pdf.setTextColor(255, 255, 255); // White color (invisible)

  const pdfHeight = pdf.internal.pageSize.getHeight();
  let y = pdfHeight - 10; // Position at bottom of page
  const lineHeight = 1;

  const sections = [
    translations.contact,
    `${data.personalInfo?.fullName || ""} | ${
      data.personalInfo?.email || ""
    } | ${data.personalInfo?.phone || ""} | ${
      data.personalInfo?.linkedIn || ""
    }`,
    translations.workExperience,
    data.experience
      ?.map(
        (exp) =>
          `${exp.position} at ${exp.company} (${exp.startDate}-${exp.endDate})`
      )
      .join(" | ") || "",
    translations.education,
    data.education
      ?.map(
        (edu) => `${edu.degree} in ${edu.fieldOfStudy} at ${edu.institution}`
      )
      .join(" | ") || "",
    translations.skills,
    data.skills?.skills || "",
    translations.certifications,
    data.certifications
      ?.map((cert) => `${cert.name} from ${cert.issuer} (${cert.date})`)
      .join(" | ") || "",
    translations.additionalInformation,
    data.additionalInfo || "",
  ];

  for (const section of sections) {
    if (!section) continue;
    pdf.text(section, 10, y);
    y += lineHeight;
  }
}
