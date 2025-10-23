import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../Button/Button';

// Define the props for our DatePicker
interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
}

// Helper function to format the date
const formatDate = (date: Date | null): string => {
  if (!date) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Main DatePicker Component
 * This combines an input field with a calendar popover.
 */
const DatePicker = ({ value, onChange, placeholder = 'Select a date' }: DatePickerProps) => {
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
    <div className="relative w-full max-w-xs" ref={containerRef}>
      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          readOnly
          value={formatDate(value)}
          onClick={() => setIsOpen(!isOpen)}
          placeholder={placeholder}
          className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
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

const Calendar = ({ value, onSelect }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(value || new Date());

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

  const isSameDay = (d1: Date, d2: Date | null) => {
    return d2 && d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  };

  return (
    <div>
      {/* --- MODIFIED: Header with secondary background and white text --- */}
      {/* Increased py-3 for more vertical padding and removed the inner mb-4 */}
      <div className="bg-secondary px-4 py-3 rounded-t-lg"> 
        <div className="flex items-center justify-between"> {/* Removed mb-4 */}
          <Button
            onClick={handlePrevMonth}
            variant="ghost"
            size="icon"
            className="!hover:scale-100 !text-white hover:!bg-secondary/80"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-base font-semibold text-white"> {/* Adjusted text-size for better prominence */}
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <Button
            onClick={handleNextMonth}
            variant="ghost"
            size="icon"
            className="!hover:scale-100 !text-white hover:!bg-secondary/80"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* --- MODIFIED: Days of the Week inside the header --- */}
        {/* Added some top padding to separate from month/year and py-1 for spacing */}
        <div className="grid grid-cols-7 text-center text-xs text-white pt-2"> 
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <div key={day} className="py-1">{day}</div>
          ))}
        </div>
      </div>

      {/* Dates Grid - p-4 added to this container for padding between header and dates*/}
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
                ${isSameDay(d, new Date()) && !isSelected ? 'border-2 border-secondary' : ''} {/* Highlight today's date */}
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