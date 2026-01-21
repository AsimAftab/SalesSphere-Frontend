import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export interface SingleSelectOption {
    value: string;
    label: string;
    color?: string; // Optional color support for badges/dots
}

interface SingleSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SingleSelectOption[];
    placeholder?: string;
    className?: string;
}

const SingleSelect: React.FC<SingleSelectProps> = ({
    value,
    onChange,
    options,
    placeholder = 'Select Option',
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={`relative ${className}`} ref={ref}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 border rounded-xl flex items-center justify-between cursor-pointer transition-all bg-white
                    ${isOpen ? 'border-secondary ring-2 ring-secondary' : 'border-gray-200 hover:border-gray-300'}`}
            >
                <div className="flex items-center gap-2">
                    {selectedOption?.color && (
                        <div className={`w-2 h-2 rounded-full bg-${selectedOption.color}-500`} />
                    )}
                    <span className={`font-medium ${selectedOption ? 'text-gray-900' : 'text-gray-400'}`}>
                        {selectedOption?.label || placeholder}
                    </span>
                </div>
                <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="dropdown-menu"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                        <div className="max-h-64 overflow-y-auto py-2 custom-scrollbar">
                            {options.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-500 text-center">No options available</div>
                            ) : (
                                options.map((opt) => (
                                    <div
                                        key={opt.value}
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                        className={`px-4 py-2.5 flex items-center gap-3 cursor-pointer transition-colors
                                            ${value === opt.value ? 'bg-secondary/10 text-secondary' : 'hover:bg-gray-100 text-gray-700'}
                                        `}
                                    >
                                        {opt.color && (
                                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${value === opt.value ? 'bg-secondary' : `bg-${opt.color}-500`}`} />
                                        )}
                                        <span className="font-medium">{opt.label}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SingleSelect;
