import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { CVFormType } from "@/components/resume/schemas";
import { formatDate } from "./utils";
import { parse } from "date-fns";
// Add optional resumeElement parameter
export const generateResumePDF = async (
  resumeData: CVFormType,
  locale: string = "en"
) => {
  try {
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

    // Create a more professional-looking preview optimized for ATS
    tempElement.innerHTML = `
      <div id="temp-resume-preview" style="width: 100%; padding: 30px; font-family: 'Calibri', 'Arial', sans-serif; color: #333;">
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
        
        <!-- Professional Summary - ATS often looks for this section -->
        ${
          resumeData.personalInfo?.summary
            ? `
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; margin: 0 0 10px 0; color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">PROFESSIONAL SUMMARY</h2>
          <p style="margin: 0; line-height: 1.5;">${resumeData.personalInfo.summary}</p>
        </div>
        `
            : ""
        }
        
        <!-- Work Experience - Use standard section title for ATS -->
        ${
          resumeData.experience && resumeData.experience.length > 0
            ? `
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; margin: 0 0 10px 0; color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">WORK EXPERIENCE</h2>
          ${resumeData.experience
            .map(
              (exp) => `
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <div style="font-weight: bold;">${
                  exp.position || ""
                } @ <em>${
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
              <div style="font-style: italic; margin-bottom: 5px;"></div>
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
        
        <!-- Education - Standard section title for ATS -->
        ${
          resumeData.education && resumeData.education.length > 0
            ? `
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; margin: 0 0 10px 0; color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">EDUCATION</h2>
          ${resumeData.education
            .map(
              (edu) => `
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <div style="font-weight: bold;">${edu.degree || ""} in ${
                edu.fieldOfStudy
              }
                <em> @ ${
                  edu.institution || ""
                } </em>
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
        
        <!-- Skills - ATS-friendly format with clear section header -->
        ${
          resumeData.skills && resumeData.skills.skills
            ? `
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; margin: 0 0 10px 0; color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">SKILLS</h2>
          <div style="column-width: 150px; column-gap: 20px;">
            ${resumeData.skills.skills
              .split(",")
              .map((skill) => `<div style="margin-bottom: 8px; font-weight: medium; font-size: 16px;">${skill.trim()}</div>`)
              .join("")}
          </div>
        </div>
        `
            : ""
        }

        <!-- Certifications - ATS-friendly format with clear section header -->
        ${
          resumeData.certifications && resumeData.certifications.length > 0
            ? `
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; margin: 0 0 10px 0; color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">CERTIFICATIONS</h2>
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
                ${cert.expires ? `<div style="font-style: italic; font-size: 14px;">Expires: ${cert.expires}</div>` : ""}
              </div>
            `
              )
              .join("")}
          </div>
        </div>
        `
            : ""
        }

        <!-- Additional Information - Optional section -->
        ${
          resumeData.additionalInfo
            ? `
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; margin: 0 0 10px 0; color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">ADDITIONAL INFORMATION</h2>
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
              ?.map(
                (cert) => `${cert.name} ${cert.issuer}`
              )
              .join(" ") || ""
          }
          ${resumeData.additionalInfo || ""}
        </div>
      </div>
    `;

    // Give the browser a moment to render the content
    await new Promise((resolve) => setTimeout(resolve, 200));

    const elementToCapture = document.getElementById("temp-resume-preview");

    if (!elementToCapture) {
      throw new Error("Resume preview element not found");
    }

    // Create the canvas from the element with lower scale
    const canvas = await html2canvas(elementToCapture, {
      scale: 1.5, // Reduced from 2 to 1.5 for smaller file size
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      imageTimeout: 0,
      removeContainer: true, // Clean up after rendering
    });

    // Get canvas dimensions
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Check if dimensions are valid
    if (imgWidth <= 0 || imgHeight <= 0) {
      throw new Error("Invalid canvas dimensions");
    }

    // Reduce image quality when converting to data URL
    const imgData = canvas.toDataURL('image/jpeg', 0.8); // Use JPEG instead of PNG with 80% quality

    // Create PDF with proper dimensions
    const pdf = new jsPDF({
      orientation: "portrait", // Resumes are usually portrait
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate scaling ratio to fit the content on the page with margins
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 0.95;

    // Calculate position to center the content
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 5; // Small margin at top

    // Make sure none of the coordinates are NaN, infinity, or negative
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

    // Add the image to the PDF with compression
    pdf.addImage(
      imgData,
      'JPEG', // Use JPEG format instead of PNG
      imgX,
      imgY,
      imgWidth * ratio,
      imgHeight * ratio,
      undefined,
      'FAST' // Use compression
    );

    // Add optimized hidden text for ATS parsing
    addOptimizedATSText(pdf, resumeData);

    // Clean up temporary element
    document.body.removeChild(tempElement);

    return pdf;
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
    throw error;
  }
};

// Update function to get pdfHeight from pdf object
function addOptimizedATSText(pdf: jsPDF, data: CVFormType) {
  // Add text to the same page but with white color
  pdf.setFontSize(1); // Extremely small font
  pdf.setTextColor(255, 255, 255); // White color (invisible)
  
  const pdfHeight = pdf.internal.pageSize.getHeight();
  let y = pdfHeight - 10; // Position at bottom of page
  const lineHeight = 1;
  
  // Add only the most important sections that ATS systems look for
  // Use smaller strings and avoid repetition to reduce file size
  
  // ATS-friendly headers and content with essential keywords
  const sections = [
    'CONTACT',
    `${data.personalInfo?.fullName || ''} | ${data.personalInfo?.email || ''} | ${data.personalInfo?.phone || ''} | ${data.personalInfo?.linkedIn || ''}`,
    
    'EXPERIENCE',
    data.experience?.map(exp => 
      `${exp.position} at ${exp.company} (${exp.startDate}-${exp.endDate})`
    ).join(' | ') || '',
    
    'EDUCATION',
    data.education?.map(edu => 
      `${edu.degree} in ${edu.fieldOfStudy} at ${edu.institution}`
    ).join(' | ') || '',
    
    'SKILLS',
    data.skills?.skills || '',
    
    'CERTIFICATIONS',
    data.certifications?.map(cert => 
      `${cert.name} from ${cert.issuer} (${cert.date})`
    ).join(' | ') || '',
    
    'ADDITIONAL INFO',
    data.additionalInfo || ''
  ];
  
  // Add each section to the PDF
  for (const section of sections) {
    // Skip empty sections
    if (!section) continue;
    
    pdf.text(section, 10, y);
    y += lineHeight;
  }
}
