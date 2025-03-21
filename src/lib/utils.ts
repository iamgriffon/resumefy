import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { enUS, es } from "date-fns/locale";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: string | Date,
  formatStr: string = "MMM/yyyy",
  locale: string = "en"
) {
  const localeMap = {
    en: enUS,
    es: es,
  };
  
  // Handle special cases like "PRESENT"
  if (typeof date === 'string' && date.toLowerCase() === 'present') {
    return 'Present';
  }
  
  try {
    // Try to create a valid date
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return typeof date === 'string' ? date : 'Present';
    }
    
    return format(dateObj, formatStr, {
      locale: localeMap[locale as keyof typeof localeMap],
    });
  } catch (error) {
    // If formatting fails, return the original string or empty string
    console.error('Error formatting date:', error);
    return typeof date === 'string' ? date : '';
  }
}
