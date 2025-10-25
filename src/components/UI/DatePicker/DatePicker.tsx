import React, { useState, useRef, useEffect, useMemo } from 'react'; 
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../Button/Button';

// --- UPDATED to accept className ---
interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string; // This will be passed to the input
}

// Helper function to format the date
const formatDate = (date: Date | null): string => {
  if (!date) return '';
  // Switched to en-CA to get YYYY-MM-DD format which is often more universal
  return date.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Main DatePicker Component
 * This combines an input field with a calendar popover.
 */
const DatePicker = ({ value, onChange, placeholder = 'Select a date', className = '' }: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close the calendar if the user clicks outside of it
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleDateSelect = (date: Date) => {
    onChange(date);
    setIsOpen(false);
  };

  return (
    // Removed max-w-xs to allow parent to control width
    <div className="relative w-full" ref={containerRef}>
      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          readOnly
          value={formatDate(value)}
          onClick={() => setIsOpen(!isOpen)}
          placeholder={placeholder}
          // --- UPDATED to merge default classes with the passed-in className ---
          className={`w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer ${className}`}
        />
        <CalendarIcon
          className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
        />
      </div>

      {/* Calendar Popover */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <Calendar value={value} onSelect={handleDateSelect} />
        </div>
      )}
    </div>
  );
};


/**
 * Reusable Calendar Component
 * This is the core calendar grid and logic.
 */
interface CalendarProps {
  value: Date | null;
  onSelect: (date: Date) => void;
}

// --- NEW: Constants for dropdowns ---
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 80; // Go 80 years back
  const endYear = currentYear + 10;   // Go 10 years forward
  return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
};


const Calendar = ({ value, onSelect }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(value || new Date());

  // --- NEW: Generate year list ---
  // useMemo ensures this array isn't recalculated on every render
  const years = useMemo(() => generateYears(), []);

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday
  const endDate = new Date(endOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // End on Saturday

  const days = [];
  let day = new Date(startDate);

  while (day <= endDate) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // --- NEW: Handlers for dropdowns ---
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1));
  };

  const isSameDay = (d1: Date, d2: Date | null) => {
    return d2 && d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  };

  // --- STYLING for dropdowns ---
  const selectClasses = "bg-white/10 text-white p-1 rounded border-0 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-white cursor-pointer";

  return (
    <div>
      {/* --- MODIFIED: Header with Dropdowns --- */}
      <div className="bg-secondary px-4 py-3 rounded-t-lg">
        <div className="flex items-center justify-between">
          {/* Previous Month Button */}
          <Button
            onClick={handlePrevMonth}
            variant="ghost"
            size="icon"
            className="!hover:scale-100 !text-white hover:!bg-secondary/80"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          {/* --- NEW: Month and Year Dropdowns --- */}
          <div className="flex space-x-2">
            <select
              value={currentDate.getMonth()}
              onChange={handleMonthChange}
              className={selectClasses}
            >
              {MONTHS.map((month, index) => (
                <option key={month} value={index} className="text-black">
                  {month}
                </option>
              ))}
            </select>
            <select
              value={currentDate.getFullYear()}
              onChange={handleYearChange}
              className={selectClasses}
            >
              {years.map(year => (
                <option key={year} value={year} className="text-black">
                  {year}
                </option>
              ))}
            </select>
          </div>
          {/* --- END: Dropdowns --- */}

          {/* Next Month Button */}
          <Button
            onClick={handleNextMonth}
            variant="ghost"
            size="icon"
            className="!hover:scale-100 !text-white hover:!bg-secondary/80"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Days of the Week */}
        <div className="grid grid-cols-7 text-center text-xs text-white pt-2">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <div key={day} className="py-1">{day}</div>
          ))}
        </div>
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-7 gap-1 p-4">
        {days.map((d, i) => {
          const isCurrentMonth = d.getMonth() === currentDate.getMonth();
          const isSelected = isSameDay(d, value);
          
          return (
            <button
              key={i}
              onClick={() => onSelect(d)}
              className={`
                w-9 h-9 flex items-center justify-center rounded-full text-sm
                transition-colors duration-200
                ${isCurrentMonth ? 'text-gray-800' : 'text-gray-300'}
                ${!isSelected && isCurrentMonth ? 'hover:bg-gray-100' : ''}
                ${isSelected ? '!bg-secondary text-white' : ''}
                ${isSameDay(d, new Date()) && !isSelected ? 'border-2 border-secondary' : ''}
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