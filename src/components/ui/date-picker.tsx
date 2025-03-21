"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useLocale } from "next-intl";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./select";
import { useTranslations } from "use-intl";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

export function MonthYearPicker({
  value,
  onChange,
  placeholder = "Select date",
  className,
  disabled = false,
  id,
}: DatePickerProps) {
  const locale = useLocale();
  const t = useTranslations('datePicker');
  
  const formatDate = (date: Date) => {
    try {
      return new Intl.DateTimeFormat(locale, { 
        year: 'numeric', 
        month: '2-digit' 
      }).format(date);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      return format(date, 'MM/yyyy');
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 + 10 + 1 }, (_, i) => 1950 + i);
  const months = Array.from({ length: 12 }, (_, i) => i);
  
  // Initialize with value if provided, otherwise undefined
  const [selectedMonth, setSelectedMonth] = React.useState<number | undefined>(
    value ? value.getMonth() : undefined
  );
  const [selectedYear, setSelectedYear] = React.useState<number | undefined>(
    value ? value.getFullYear() : undefined
  );
  
  // Only update the date when month/year selection changes
  const handleSelectionChange = (month: number | undefined, year: number | undefined) => {
    if (year !== undefined && month !== undefined) {
      const newDate = new Date(year, month, 1);
      onChange(newDate);
    }
  };

  // Update local state when prop value changes
  React.useEffect(() => {
    if (!value) return;
    
    const month = value.getMonth();
    const year = value.getFullYear();
    
    // Only update if different to avoid loops
    if (month !== selectedMonth || year !== selectedYear) {
      setSelectedMonth(month);
      setSelectedYear(year);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const monthNames = React.useMemo(() => {
    return months.map(month => {
      const date = new Date(2000, month, 1);
      return new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
    });
  }, [locale, months]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? formatDate(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-4 bg-white z-50 fixed" align="start">
        <div className="grid grid-cols-2 gap-4 w-[320px]">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('month')}</label>
            <Select
              value={selectedMonth?.toString()}
              onValueChange={(value) => {
                const newMonth = parseInt(value);
                setSelectedMonth(newMonth);
                handleSelectionChange(newMonth, selectedYear);
              }}
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder={t('month')} />
              </SelectTrigger>
              <SelectContent className="bg-white z-50 cursor-pointer max-h-60 overflow-y-auto">
                {months.map((month) => (
                  <SelectItem key={month} value={month.toString()}>
                    {monthNames[month]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('year')}</label>
            <Select
              value={selectedYear?.toString()}
              onValueChange={(value) => {
                const newYear = parseInt(value);
                setSelectedYear(newYear);
                handleSelectionChange(selectedMonth, newYear);
              }}
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder={t('year')} />
              </SelectTrigger>
              <SelectContent className="bg-white z-50 cursor-pointer max-h-60 overflow-y-auto">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 