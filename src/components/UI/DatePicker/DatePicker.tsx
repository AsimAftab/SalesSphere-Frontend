import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Button from '../Button/Button';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  isClearable?: boolean;
  openToDate?: Date; // Added to fix TS error and support month-sync
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
  openToDate
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
          className={`w-full pl-3 ${isClearable && value ? 'pr-16' : 'pr-10'} py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${className}`}
        />
        {isClearable && value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-9 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-1 focus:ring-red-500 rounded-full hover:bg-gray-100"
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
        <div className="absolute z-10 mt-2 w-full min-w-[280px] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {/* Passed openToDate down to the Calendar component */}
          <Calendar value={value} onSelect={handleDateSelect} openToDate={openToDate} />
        </div>
      )}
    </div>
  );
};


interface CalendarProps {
  value: Date | null;
  onSelect: (date: Date) => void;
  openToDate?: Date; // Added prop
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


const Calendar = ({ value, onSelect, openToDate }: CalendarProps) => {
  // Logic: Priority is Value > openToDate > Current Date
  const [currentDate, setCurrentDate] = useState(() => {
    if (value) return value;
    if (openToDate) return openToDate;
    return new Date();
  });

  // Sync internal view if openToDate changes (e.g., user changes month filter while picker is open)
  useEffect(() => {
    if (!value && openToDate) {
      setCurrentDate(openToDate);
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
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => { setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1)); };
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => { setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1)); };
  const isSameDay = (d1: Date, d2: Date | null): boolean => { return !!d2 && d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear(); };

  const selectClasses = "bg-transparent text-white p-1 rounded border-0 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-white cursor-pointer appearance-none";

  return (
    <div>
      <div className="bg-secondary px-4 py-3 rounded-t-lg text-white">
        <div className="flex items-center justify-between">
          <Button onClick={handlePrevMonth} variant="ghost" size="icon" className="!hover:scale-100 !text-white hover:!bg-secondary/80"> <ChevronLeft className="h-5 w-5" /> </Button>
          <div className="flex space-x-2">
            <select value={currentDate.getMonth()} onChange={handleMonthChange} className={selectClasses}>
              {MONTHS && MONTHS.map((month, index) => (<option key={month} value={index} className="text-black bg-white">{month}</option>))}
            </select>
            <select value={currentDate.getFullYear()} onChange={handleYearChange} className={selectClasses}>
              {years && years.map(year => (<option key={year} value={year} className="text-black bg-white">{year}</option>))}
            </select>
          </div>
          <Button onClick={handleNextMonth} variant="ghost" size="icon" className="!hover:scale-100 !text-white hover:!bg-secondary/80"> <ChevronRight className="h-5 w-5" /> </Button>
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

          return (
            <button
              key={i}
              onClick={() => onSelect(d)}
              disabled={!isCurrentMonth}
              className={`
                w-9 h-9 flex items-center justify-center rounded-full text-sm
                transition-colors duration-150
                ${isCurrentMonth ? 'text-gray-800' : 'text-gray-300'}
                ${!isSelected && isCurrentMonth ? 'hover:bg-gray-100 cursor-pointer' : ''}
                ${isSelected ? '!bg-secondary text-white font-semibold' : ''}
                ${isToday && !isSelected && isCurrentMonth ? 'border border-secondary' : ''}
                ${!isCurrentMonth ? 'cursor-not-allowed' : ''}
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