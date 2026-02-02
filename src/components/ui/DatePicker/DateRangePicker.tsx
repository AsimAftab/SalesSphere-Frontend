import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui';

interface DateRange {
    start: Date | null;
    end: Date | null;
}

interface DateRangePickerProps {
    value: DateRange;
    onChange: (range: DateRange) => void;
    placeholder?: string;
    className?: string;
}

const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

const DateRangePicker = ({
    value,
    onChange,
    placeholder = 'Select Date Range',
    className = '',
}: DateRangePickerProps) => {
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
        if (!value.start || (value.start && value.end)) {
            // Start new range
            onChange({ start: date, end: null });
        } else {
            // Complete range or reset if earlier
            if (date < value.start) {
                onChange({ start: date, end: null });
            } else {
                onChange({ ...value, end: date });
                setIsOpen(false);
            }
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange({ start: null, end: null });
        setIsOpen(false);
    };

    const displayValue = value.start
        ? `${formatDate(value.start)} - ${value.end ? formatDate(value.end) : '...'}`
        : '';

    return (
        <div className="relative w-full" ref={containerRef}>
            <div className="relative">
                <input
                    type="text"
                    readOnly
                    value={displayValue}
                    onClick={() => setIsOpen(!isOpen)}
                    placeholder={placeholder}
                    className={`w-full pl-3 pr-10 py-2.5 border rounded-xl outline-none cursor-pointer transition-all ${className} border-gray-200 focus:ring-2 focus:ring-secondary text-sm font-medium`}
                />
                {value.start && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-9 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none rounded-full hover:bg-gray-100"
                    >
                        <X size={16} />
                    </button>
                )}
                <CalendarIcon
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
                />
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-2 w-full min-w-[300px] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden right-0 sm:left-0 sm:right-auto">
                    <Calendar value={value} onSelect={handleDateSelect} />
                </div>
            )}
        </div>
    );
};

// --- Internal Calendar Component ---

interface CalendarProps {
    value: DateRange;
    onSelect: (date: Date) => void;
}

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 10;
    const endYear = currentYear + 10;
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
};

const Calendar = ({ value, onSelect }: CalendarProps) => {
    const [currentDate, setCurrentDate] = useState(() => value.start || new Date());

    const years = useMemo(() => generateYears(), []);

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday

    const endDate = new Date(endOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // End at Saturday

    const days: Date[] = [];
    const day = new Date(startDate);
    while (day <= endDate) {
        days.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1));
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1));

    const isSameDay = (d1: Date, d2: Date | null) => !!d2 && d1.toDateString() === d2.toDateString();
    const isInRange = (d: Date, range: DateRange) => {
        if (!range.start || !range.end) return false;
        return d > range.start && d < range.end;
    };

    const selectClasses = "bg-transparent text-white p-1 rounded border-0 text-sm font-semibold focus:outline-none cursor-pointer appearance-none";

    return (
        <div>
            {/* Header */}
            <div className="bg-secondary px-4 py-3 text-white">
                <div className="flex items-center justify-between mb-2">
                    <Button onClick={handlePrevMonth} variant="ghost" size="icon" className="!text-white hover:bg-white/20"><ChevronLeft className="w-5 h-5" /></Button>
                    <div className="flex gap-2">
                        <select value={currentDate.getMonth()} onChange={handleMonthChange} className={selectClasses}>
                            {MONTHS.map((m, i) => <option key={m} value={i} className="text-black">{m}</option>)}
                        </select>
                        <select value={currentDate.getFullYear()} onChange={handleYearChange} className={selectClasses}>
                            {years.map(y => <option key={y} value={y} className="text-black">{y}</option>)}
                        </select>
                    </div>
                    <Button onClick={handleNextMonth} variant="ghost" size="icon" className="!text-white hover:bg-white/20"><ChevronRight className="w-5 h-5" /></Button>
                </div>
                <div className="grid grid-cols-7 text-center text-xs font-medium opacity-80">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => <div key={d}>{d}</div>)}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-1 p-2">
                {days.map((d, i) => {
                    const isCurrentMonth = d.getMonth() === currentDate.getMonth();
                    const isStart = isSameDay(d, value.start);
                    const isEnd = isSameDay(d, value.end);
                    const isRange = isInRange(d, value);

                    return (
                        <button
                            key={i}
                            onClick={() => onSelect(d)}
                            disabled={!isCurrentMonth}
                            className={`
                h-8 w-full flex items-center justify-center text-sm rounded-full
                ${!isCurrentMonth ? 'text-gray-300 cursor-default' : 'text-gray-700 hover:bg-gray-100'}
                ${isRange ? '!bg-secondary/10 !text-secondary !rounded-none' : ''}
                ${isStart ? '!bg-secondary !text-white !rounded-full z-10' : ''}
                ${isEnd ? '!bg-secondary !text-white !rounded-full z-10' : ''}
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

export default DateRangePicker;
