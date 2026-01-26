import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Button from '../Button/Button';
import DropDown from '../DropDown/DropDown';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  isClearable?: boolean;
  openToDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  disabledDaysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  error?: boolean;
}

const formatDate = (date: Date | null): string => {
  if (!date) return '';
  return date.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const DatePicker = ({
  value,
  onChange,
  placeholder = 'YYYY-MM-DD',
  className = '',
  isClearable = false,
  openToDate,
  minDate,
  maxDate,
  disabledDaysOfWeek = [],
  error = false
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Force blur on other elements when calendar opens to prevent "double focus" visual
  useEffect(() => {
    if (isOpen) {
      (document.activeElement as HTMLElement)?.blur();
    }
  }, [isOpen]);

  const handleDateSelect = (date: Date) => {
    onChange(date);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          readOnly
          value={formatDate(value)}
          onClick={() => setIsOpen(!isOpen)}
          placeholder={placeholder}
          className={`
            w-full pl-3 ${isClearable && value ? 'pr-16' : 'pr-10'} py-2.5 
            border rounded-xl outline-none cursor-pointer transition-all 
            ${className} 
            ${error
              ? 'border-red-500 focus:ring-red-200'
              : `border-gray-200 ${isOpen ? 'border-secondary ring-2 ring-secondary' : 'focus:border-secondary focus:ring-secondary'} focus:ring-2`
            }
          `}
        />
        {isClearable && value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-9 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none rounded-full"
            aria-label="Clear date"
          >
            <X size={16} />
          </button>
        )}
        <CalendarIcon
          className={`absolute ${isClearable && value ? 'right-3' : 'right-3'} top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 min-w-[320px] bg-white rounded-lg shadow-xl border border-gray-200 left-0 pb-2">
          <Calendar
            value={value}
            onSelect={handleDateSelect}
            openToDate={openToDate}
            minDate={minDate}
            maxDate={maxDate}
            disabledDaysOfWeek={disabledDaysOfWeek}
          />
        </div>
      )}
    </div>
  );
};


interface CalendarProps {
  value: Date | null;
  onSelect: (date: Date) => void;
  openToDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  disabledDaysOfWeek?: number[];
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 80;
  const endYear = currentYear + 10;
  return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
};


const Calendar = ({ value, onSelect, openToDate, minDate, maxDate, disabledDaysOfWeek = [] }: CalendarProps) => {
  // Logic: Priority is Value > openToDate > Current Date
  const [currentDate, setCurrentDate] = useState(() => {
    if (value) return value;
    if (openToDate) return openToDate;
    return new Date();
  });

  // Sync internal view if openToDate changes (e.g., user changes month filter while picker is open)
  // Use a ref to track the previous openToDate timestamp to avoid resetting on reference changes
  const prevOpenToDateRef = useRef<number | undefined>(openToDate?.getTime());

  useEffect(() => {
    const newTime = openToDate?.getTime();
    // Only update if the actual date value has changed, not just the object reference
    if (!value && openToDate && newTime !== prevOpenToDateRef.current) {
      setCurrentDate(openToDate);
      prevOpenToDateRef.current = newTime;
    }
  }, [openToDate, value]);

  const years = useMemo(() => generateYears(), []);

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate = new Date(endOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const days: Date[] = [];
  let day = new Date(startDate);
  while (day <= endDate) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const handlePrevMonth = () => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); };
  const handleNextMonth = () => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); };
  const isSameDay = (d1: Date, d2: Date | null): boolean => { return !!d2 && d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear(); };

  return (
    <div>
      <div className="bg-secondary px-4 py-3 rounded-t-lg text-white">
        <div className="flex items-center justify-between">
          <Button type="button" onClick={handlePrevMonth} variant="ghost" size="icon" className="!hover:scale-100 !text-white hover:!bg-secondary/80"> <ChevronLeft className="h-5 w-5" /> </Button>
          <div className="flex space-x-2">
            <div className="flex space-x-2 items-center justify-center flex-1">
              <div className="w-[130px]">
                <DropDown
                  value={MONTHS[currentDate.getMonth()]}
                  onChange={(val) => {
                    const monthIndex = MONTHS.indexOf(val);
                    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
                  }}
                  options={MONTHS.map(month => ({ value: month, label: month }))}
                  className="h-9 w-full"
                  triggerClassName="!min-h-0 h-9 py-0 !rounded-lg border-none text-sm font-medium text-gray-800"
                  hideScrollbar={true}
                  placeholder="Month"
                />
              </div>
              <div className="w-[100px]">
                <DropDown
                  value={currentDate.getFullYear().toString()}
                  onChange={(val) => {
                    setCurrentDate(new Date(parseInt(val), currentDate.getMonth(), 1));
                  }}
                  options={years.map(year => ({ value: year.toString(), label: year.toString() }))}
                  className="h-9 w-full"
                  triggerClassName="!min-h-0 h-9 py-0 !rounded-lg border-none text-sm font-medium text-gray-800"
                  hideScrollbar={true}
                  placeholder="Year"
                />
              </div>
            </div>
          </div>
          <Button type="button" onClick={handleNextMonth} variant="ghost" size="icon" className="!hover:scale-100 !text-white hover:!bg-secondary/80"> <ChevronRight className="h-5 w-5" /> </Button>
        </div>
        <div className="grid grid-cols-7 text-center text-xs pt-2">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => <div key={day} className="py-1">{day}</div>)}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 p-4">
        {days.map((d, i) => {
          const isCurrentMonth = d.getMonth() === currentDate.getMonth();
          const isSelected = isSameDay(d, value);
          const isToday = isSameDay(d, new Date());

          // Disable logic
          const isBeforeMin = minDate ? d < new Date(minDate.setHours(0, 0, 0, 0)) : false;
          const isAfterMax = maxDate ? d > new Date(maxDate.setHours(23, 59, 59, 999)) : false;
          const isDayOfWeekDisabled = disabledDaysOfWeek.includes(d.getDay());
          const isDisabled = !isCurrentMonth || isBeforeMin || isAfterMax || isDayOfWeekDisabled;

          // Highlight logic (Default circle when no value is selected)
          // Prioritize openToDate (e.g. Start Date) > Today
          const isDefaultHighlight = !value && (openToDate ? isSameDay(d, openToDate) : isToday);

          return (
            <button
              key={i}
              onClick={() => onSelect(d)}
              disabled={isDisabled}
              className={`
                w-9 h-9 flex items-center justify-center rounded-full text-sm
                transition-colors duration-150
                ${isCurrentMonth ? 'text-gray-800' : 'text-gray-300'}
                ${!isSelected && !isDisabled ? 'hover:bg-gray-100 cursor-pointer' : ''}
                ${isSelected ? '!bg-secondary text-white font-semibold' : ''}
                ${isDefaultHighlight && !isDisabled ? 'border border-secondary' : ''}
                ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}
              `}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DatePicker;