import * as XLSX from 'xlsx';

export interface ResumeData {
  personal: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedIn?: string;
    website?: string;
    summary?: string;
  };
  summary: string;
  experience: {
    company: string;
    position: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    highlights?: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    gpa?: string;
  }[];
  skills: {
    skills: string;
  };
  projects?: {
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }[];
  certifications?: {
    name: string;
    issuer: string;
    date?: string;
    expires?: string;
  }[];
  additionalInfo?: string;
}

export async function parseResumeFile(file: File): Promise<ResumeData> {
  if (!file) {
    throw new Error('No file provided');
  }

  // Check file extension
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  
  if (fileExt !== 'xlsx' && fileExt !== 'csv') {
    throw new Error('Unsupported file format. Please upload XLSX or CSV file.');
  }

  // Read file
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const workbook = XLSX.read(buffer, { type: 'array' });

  // Process sheets
  const personal = processSheet(workbook, 'Personal') || [];
  const experience = processSheet(workbook, 'Experience') || [];
  const education = processSheet(workbook, 'Education') || [];
  const skills = processSheet(workbook, 'Skills') || [];
  const projects = processSheet(workbook, 'Projects') || [];
  const certifications = processSheet(workbook, 'Certifications') || [];
  const additionalInfo = processSheet(workbook, 'AdditionalInfo') || [];

  // Process skills into a string format if needed
  const processedSkills = { skills: Array.isArray(skills) ? skills.join(', ') : '' };

  return {
    personal: {
      name: personal?.fullName || personal?.name || '',
      email: personal?.email || '',
      phone: personal?.phone || '',
      location: personal?.location || '',
      linkedIn: personal?.linkedIn || '',
      website: personal?.website || '',
      summary: personal?.summary || '',
    },
    summary: personal?.summary || '',
    experience: experience.map((exp: any) => ({
      company: exp.company || '',
      position: exp.position || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      description: exp.description || '',
      highlights: exp.highlights ? 
        (typeof exp.highlights === 'string' ? exp.highlights.split('\n') : exp.highlights) : 
        [],
    })),
    education: education.map((edu: any) => ({
      institution: edu.institution || '',
      degree: edu.degree || '',
      field: edu.fieldOfStudy || edu.field || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      gpa: edu.gpa || '',
    })),
    skills: typeof skills === 'object' && !Array.isArray(skills) && 'skills' in skills ? 
      skills : 
      { skills: Array.isArray(skills) ? skills.join(', ') : (typeof skills === 'string' ? skills : '') },
    projects: projects?.map((proj: any) => ({
      name: proj?.name || '',
      description: proj?.description || '',
      technologies: Array.isArray(proj?.technologies) 
        ? proj?.technologies 
        : (typeof proj?.technologies === 'string' 
            ? (proj?.technologies as string).split(',').map((t: string) => t.trim())
            : []),
      link: proj?.link || '',
    })),
    certifications: certifications?.map((cert: any) => ({
      name: cert?.name || '',
      issuer: cert?.issuer || '',
      date: cert?.date || '',
      expires: cert?.expires || '',
    })),
    additionalInfo: personal?.additionalInfo || additionalInfo?.[0]?.content || '',
  };
}

function processSheet(workbook: XLSX.WorkBook, sheetName: string) {
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    return null;
  }
  
  return XLSX.utils.sheet_to_json(sheet);
} 