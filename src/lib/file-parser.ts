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

type ExperienceItem = {
  company?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  highlights?: string[] | string;
};

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
  const personal = processSheet(workbook, 'Personal');
  const personalData = Array.isArray(personal) && personal.length > 0 ? personal[0] : {};
  const experience = processSheet(workbook, 'Experience') || [];
  const education = processSheet(workbook, 'Education') || [];
  const skills = processSheet(workbook, 'Skills') || [];
  const projects = processSheet(workbook, 'Projects') || [];
  const certifications = processSheet(workbook, 'Certifications') || [];
  const additionalInfo = processSheet(workbook, 'AdditionalInfo') || [];

  // Process skills into a proper format
  const processedSkills = processSkills(skills);

  return {
    personal: {
      name: (personalData as Partial<ResumeData>['personal'])?.name || '',
      email: (personalData as Partial<ResumeData>['personal'])?.email || '',
      phone: (personalData as Partial<ResumeData>['personal'])?.phone || '',
      location: (personalData as Partial<ResumeData>['personal'])?.location || '',
      linkedIn: (personalData as Partial<ResumeData>['personal'])?.linkedIn || '',
      website: (personalData as Partial<ResumeData>['personal'])?.website || '',
      summary: (personalData as Partial<ResumeData>['personal'])?.summary || '',
    },
    summary: (personalData as Partial<ResumeData>['personal'])?.summary || '',
    experience: (experience as ExperienceItem[]).map((exp) => ({
      company: exp.company || '',
      position: exp.position || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      description: exp.description || '',
      highlights: processHighlights(exp.highlights),
    })),
    education: education.map((edu: any) => ({
      institution: edu.institution || '',
      degree: edu.degree || '',
      field: edu.fieldOfStudy || edu.field || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      gpa: edu.gpa || '',
    })),
    skills: processedSkills,
    projects: projects?.map((proj: any) => ({
      name: proj?.name || '',
      description: proj?.description || '',
      technologies: processTechnologies(proj?.technologies),
      link: proj?.link || '',
    })),
    certifications: certifications?.map((cert: any) => ({
      name: cert?.name || '',
      issuer: cert?.issuer || '',
      date: cert?.date || '',
      expires: cert?.expires || '',
    })),
    additionalInfo: (personalData as any)?.additionalInfo || 
      (Array.isArray(additionalInfo) && additionalInfo.length > 0 ? (additionalInfo[0] as any)?.content : ''),
  };
}

function processSheet(workbook: XLSX.WorkBook, sheetName: string) {
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    return null;
  }
  
  return XLSX.utils.sheet_to_json(sheet);
}

function processHighlights(highlights: string[] | string | undefined): string[] {
  if (!highlights) {
    return [];
  }
  
  if (typeof highlights === 'string') {
    return highlights.split('\n');
  }
  
  return highlights;
}

function processTechnologies(technologies: string[] | string | undefined): string[] {
  if (!technologies) {
    return [];
  }
  
  if (typeof technologies === 'string') {
    return technologies.split(',').map(t => t.trim());
  }
  
  if (Array.isArray(technologies)) {
    return technologies;
  }
  
  return [];
}

function processSkills(skills: any): { skills: string } {
  if (typeof skills === 'object' && !Array.isArray(skills) && 'skills' in skills) {
    return skills;
  }
  
  if (Array.isArray(skills)) {
    return { skills: skills.join(', ') };
  }
  
  if (typeof skills === 'string') {
    return { skills: skills };
  }
  
  return { skills: '' };
} 