import { CVFormType } from '@/components/resume/schemas';

export async function parseCSV<T>(file: File): Promise<T> {
  return new Promise((resolve, reject) => {
    // First, read the file as text to process it manually
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        // Process each section of the CSV
        const parsedData = processCustomCSVFormat(lines);
        resolve(parsedData as unknown as T);
      } catch (error) {
        reject(`Error processing CSV data: ${error}`);
      }
    };
    
    reader.onerror = () => {
      reject('Failed to read file');
    };
    
    reader.readAsText(file);
  });
}

function processCustomCSVFormat(lines: string[]): CVFormType {
  // Initialize with empty data
  const result: CVFormType = {
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedIn: '',
      summary: ''
    },
    education: [],
    experience: [],
    skills: { skills: '' },
    certifications: [],
    additionalInfo: ''
  };
  
  let currentSection = '';
  let headers: string[] = [];
  
  // Process line by line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check for section headers
    if (line.toLowerCase().startsWith('section,')) {
      const lineContent = line.toLowerCase();
      
      if (lineContent.includes('fullname') || lineContent.includes('personal')) {
        currentSection = 'personal';
        headers = parseCSVLine(line);
        continue;
      } else if (lineContent.includes('institution') || lineContent.includes('education')) {
        currentSection = 'education';
        headers = parseCSVLine(line);
        continue;
      } else if (lineContent.includes('company') || lineContent.includes('experience')) {
        currentSection = 'experience';
        headers = parseCSVLine(line);
        continue;
      } else if (lineContent.includes('skills')) {
        currentSection = 'skills';
        // Next line will contain the skills
        continue;
      } else if (lineContent.includes('name') || lineContent.includes('certifications')) {
        currentSection = 'certifications';
        headers = parseCSVLine(line);
        continue;
      }
    }
    
    // Process data based on current section
    if (currentSection === 'skills') {
      // For skills, the line itself contains the skills list
      if (!line.toLowerCase().startsWith('section,')) {
        result.skills.skills = line.replace(/^"|"$/g, '');
      }
      continue;
    }
    
    // For other sections that use headers
    if (currentSection && headers.length > 0 && 
        currentSection !== 'skills' && 
        !line.toLowerCase().startsWith('section,')) {
      
      const values = parseCSVLine(line);
      const rowData: any = {};
      
      // Map values to headers
      headers.forEach((header, index) => {
        if (index < values.length) {
          rowData[header] = values[index];
        }
      });
      
      // Add to appropriate section
      if (currentSection === 'personal') {
        result.personalInfo = {
          fullName: rowData.fullName || '',
          email: rowData.email || '',
          phone: rowData.phone || '',
          location: rowData.location || '',
          linkedIn: rowData.linkedIn || '',
          summary: rowData.summary || ''
        };
        
        // Additional info is in the personal section
        result.additionalInfo = rowData.additionalInfo || '';
      } else if (currentSection === 'education') {
        result.education.push({
          institution: rowData.institution || '',
          degree: rowData.degree || '',
          fieldOfStudy: rowData.fieldOfStudy || '',
          startDate: rowData.startDate || '',
          endDate: rowData.endDate || '',
          description: rowData.description || ''
        });
      } else if (currentSection === 'experience') {
        result.experience.push({
          company: rowData.company || '',
          position: rowData.position || '',
          startDate: rowData.startDate || '',
          endDate: rowData.endDate || '',
          description: rowData.description || ''
        });
      } else if (currentSection === 'certifications') {
        result.certifications.push({
          name: rowData.name || '',
          issuer: rowData.issuer || '',
          date: rowData.date || '',
          expires: rowData.expires || ''
        });
      }
    }
  }
  
  return result;
}

// Simple CSV line parser that handles quoted values
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last field
  result.push(current.trim().replace(/^"|"$/g, ''));
  
  return result;
}
