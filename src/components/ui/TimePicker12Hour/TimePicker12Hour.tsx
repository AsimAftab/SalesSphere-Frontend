import React from 'react';
import { Clock } from 'lucide-react';
import type { DropDownOption } from '@/components/ui';
import { DropDown } from '@/components/ui';

interface TimePicker12HourProps {
    value: string; // 24-hour format HH:mm
    onChange: (value: string) => void; // Returns 24-hour format
    error?: boolean;
    disabled?: boolean;
}

const TimePicker12Hour: React.FC<TimePicker12HourProps> = ({
    value,
    onChange,
    error = false,
    disabled = false
}) => {
    // Parse 24-hour time to 12-hour components
    const parse24Hour = (time24: string): { hour: string; minute: string; period: string } => {
        if (!time24 || !time24.includes(':')) {
            return { hour: '09', minute: '00', period: 'AM' };
        }

        const [hourStr, minuteStr] = time24.split(':');
        const hour24 = parseInt(hourStr, 10);
        const period = hour24 >= 12 ? 'PM' : 'AM';
        let hour12 = hour24 % 12;
        if (hour12 === 0) hour12 = 12;

        return {
            hour: hour12.toString().padStart(2, '0'),
            minute: minuteStr,
            period
        };
    };

    // Convert 12-hour components to 24-hour format
    const to24Hour = (hour12: string, minute: string, period: string): string => {
        let hour24 = parseInt(hour12, 10);

        if (period === 'AM' && hour24 === 12) {
            hour24 = 0;
        } else if (period === 'PM' && hour24 !== 12) {
            hour24 += 12;
        }

        return `${hour24.toString().padStart(2, '0')}:${minute}`;
    };

    const { hour, minute, period } = parse24Hour(value);

    // Combined time value (HH:MM format in 12-hour)
    const combinedTimeValue = `${hour}:${minute}`;

    const handleTimeChange = (newTime: string) => {
        const [newHour, newMinute] = newTime.split(':');
        onChange(to24Hour(newHour, newMinute, period));
    };

    const handlePeriodChange = (newPeriod: string) => {
        onChange(to24Hour(hour, minute, newPeriod));
    };

    // Generate combined time options (HH:MM) in 30-minute intervals
    const timeOptions: DropDownOption[] = [];
    for (let h = 1; h <= 12; h++) {
        for (let m = 0; m < 60; m += 30) { // 00 and 30 minutes only
            const hourStr = h.toString().padStart(2, '0');
            const minuteStr = m.toString().padStart(2, '0');
            const timeValue = `${hourStr}:${minuteStr}`;
            timeOptions.push({
                label: timeValue,
                value: timeValue
            });
        }
    }

    const periodOptions: DropDownOption[] = [
        { label: 'AM', value: 'AM' },
        { label: 'PM', value: 'PM' }
    ];

    return (
        <div className="flex gap-2 items-center">
            {/* Combined Hour:Minute */}
            <div className="flex-1">
                <DropDown
                    value={combinedTimeValue}
                    onChange={handleTimeChange}
                    options={timeOptions}
                    placeholder="HH:MM"
                    disabled={disabled}
                    error={error ? 'Invalid' : undefined}
                    icon={<Clock size={16} />}
                    hideScrollbar={true}
                    isSearchable={true}
                />
            </div>

            {/* AM/PM */}
            <div style={{ width: '100px' }}>
                <DropDown
                    value={period}
                    onChange={handlePeriodChange}
                    options={periodOptions}
                    disabled={disabled}
                    error={error ? 'Invalid' : undefined}
                    hideScrollbar={true}
                />
            </div>
        </div>
    );
};

export default TimePicker12Hour;
