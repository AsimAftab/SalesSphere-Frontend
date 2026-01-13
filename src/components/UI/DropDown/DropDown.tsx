import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DropDownOption {
    value: string;
    label: string;
}

interface DropDownProps {
    value: string;
    onChange: (value: string) => void;
    options: DropDownOption[];
    placeholder?: string;
    label?: string; // Optional if we want to include label inside, but mostly for aria
    icon?: React.ReactNode;
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
                    w-full pl-11 pr-10 py-2.5 border rounded-xl outline-none transition-all 
                    cursor-pointer bg-white flex items-center min-h-[46px] select-none
                    ${error ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200 hover:border-secondary/50 focus:ring-2 focus:ring-secondary/20'}
                    ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}
                    ${isOpen ? 'ring-2 ring-secondary/20 border-secondary' : ''}
                `}
            >
                {/* Left Icon */}
                {icon && (
                    <div className={`absolute left-4 ${error ? 'text-red-400' : 'text-gray-400'}`}>
                        {icon}
                    </div>
                )}

                {/* Selected Value or Placeholder */}
                <span className={`flex-1 font-medium truncate ${!selectedOption ? 'text-gray-400' : 'text-black'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>

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
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar overflow-hidden"
                    >
                        <div className="p-1">
                            {options.length > 0 ? (
                                options.map((option) => (
                                    <div
                                        key={option.value}
                                        onClick={() => handleSelect(option.value)}
                                        className={`
                                            flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors
                                            ${value === option.value ? 'bg-secondary/10 text-secondary font-semibold' : 'text-gray-700 hover:bg-gray-50'}
                                        `}
                                    >
                                        <span className="truncate">{option.label}</span>
                                        {value === option.value && <Check size={14} className="text-secondary flex-shrink-0" />}
                                    </div>
                                ))
                            ) : (
                                <div className="px-3 py-4 text-center text-sm text-gray-400">
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
