import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DropDownOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

interface DropDownProps {
    value: string;
    onChange: (value: string) => void;
    options: DropDownOption[];
    placeholder?: string;
    label?: string;
    icon?: React.ReactNode; // Input field icon (left)
    error?: string;
    disabled?: boolean;
    className?: string;
}

const DropDown: React.FC<DropDownProps> = ({
    value,
    onChange,
    options,
    placeholder = 'Select option',
    icon,
    error,
    disabled = false,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const selectedOption = options.find(opt => opt.value === value);

    // Only show global icon if implicit placeholder state OR selected option has no icon
    const showGlobalIcon = icon && (!selectedOption || !selectedOption.icon);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Trigger Button */}
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
                    w-full ${showGlobalIcon ? 'pl-11' : 'pl-4'} pr-10 py-2.5 border rounded-xl outline-none transition-all 
                    cursor-pointer bg-white flex items-center min-h-[46px] select-none
                    ${error ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-300 hover:border-secondary focus:border-secondary'}
                    ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}
                    ${isOpen ? 'border-secondary' : ''}
                `}
            >
                {/* Left Input Icon */}
                {showGlobalIcon && (
                    <div className={`absolute left-4 ${error ? 'text-red-400' : 'text-gray-400'}`}>
                        {icon}
                    </div>
                )}

                {/* Selected Value or Placeholder */}
                <div className={`flex items-center gap-2 flex-1 truncate ${!selectedOption ? 'text-gray-400' : 'text-black'}`}>
                    {selectedOption?.icon && (
                        <span className="text-gray-600">{selectedOption.icon}</span>
                    )}
                    <span className="font-medium truncate">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>

                {/* Right Chevron */}
                <ChevronDown
                    size={16}
                    className={`absolute right-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </div>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && !disabled && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden"
                    >
                        <div className="py-1 max-h-64 overflow-y-auto custom-scrollbar">
                            {options.length > 0 ? (
                                options.map((option) => (
                                    <div
                                        key={option.value}
                                        onClick={() => handleSelect(option.value)}
                                        className={`
                                            flex items-center justify-between px-4 py-3 cursor-pointer transition-colors border-b border-gray-200 last:border-0
                                            ${value === option.value ? 'bg-secondary/5 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            {option.icon && (
                                                <div className={`${value === option.value ? 'text-gray-900' : 'text-gray-500'}`}>
                                                    {option.icon}
                                                </div>
                                            )}
                                            <span className={`text-sm ${value === option.value ? 'font-semibold' : 'font-medium'}`}>
                                                {option.label}
                                            </span>
                                        </div>

                                        {value === option.value && (
                                            <Check size={16} className="text-blue-600" />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-4 text-center text-sm text-gray-400">
                                    No options available
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DropDown;
