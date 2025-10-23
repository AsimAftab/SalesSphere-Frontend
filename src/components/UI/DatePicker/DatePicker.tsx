// src/components/UI/DatePicker/DatePicker.tsx
import React from 'react';

interface DatePickerProps {
  value: Date | string | null;
  onChange: (date: Date | string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  className = '',
  placeholder = 'Select date',
  disabled = false,
  min,
  max,
}) => {
  // Convert Date object to YYYY-MM-DD string format
  const formatDateToString = (date: Date | string | null): string => {
    if (!date) return '';

    if (typeof date === 'string') {
      return date;
    }

    // If it's a Date object, format it to YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value;

    if (!dateString) {
      onChange('');
      return;
    }

    // Check if the parent component expects a Date object or string
    // For now, we'll pass the string and let the parent handle conversion
    onChange(dateString);
  };

  const dateValue = formatDateToString(value);

  return (
    <input
      type="date"
      value={dateValue}
      onChange={handleChange}
      disabled={disabled}
      min={min}
      max={max}
      className={`
        w-full px-3 py-2
        border border-gray-300 rounded-md
        text-sm text-gray-700
        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
        disabled:bg-gray-100 disabled:cursor-not-allowed
        ${className}
      `.trim()}
      placeholder={placeholder}
    />
  );
};

export default DatePicker;
