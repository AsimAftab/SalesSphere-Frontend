import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DropDownOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
    className?: string;
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
    isSearchable?: boolean;
    onSearchChange?: (value: string) => void;
    disableLocalFiltering?: boolean;
    customDisplayLabel?: string;
    searchableTrigger?: boolean;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    inputRef?: React.Ref<HTMLInputElement>;
    triggerClassName?: string;
    hideScrollbar?: boolean;
}

const DropDown: React.FC<DropDownProps> = ({
    value,
    onChange,
    options,
    placeholder = 'Select option',
    icon,
    error,
    disabled = false,
    className = '',
    isSearchable = false,
    onSearchChange,
    disableLocalFiltering = false,
    customDisplayLabel,
    searchableTrigger = false,
    onKeyDown,
    inputRef,
    triggerClassName = '',
    hideScrollbar = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
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

    useEffect(() => {
        if (!isOpen && !searchableTrigger) setSearch('');
    }, [isOpen, searchableTrigger]);

    const selectedOption = options.find(opt => opt.value === value);

    // Only show global icon if implicit placeholder state OR selected option has no icon
    const showGlobalIcon = icon && (!selectedOption || !selectedOption.icon);

    const filteredOptions = isSearchable && !disableLocalFiltering
        ? options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()))
        : options;

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        if (!searchableTrigger) setSearch('');
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Trigger Button or Input */}
            {searchableTrigger ? (
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        disabled={disabled}
                        placeholder={placeholder}
                        value={customDisplayLabel !== undefined ? customDisplayLabel : search}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (onSearchChange) onSearchChange(val);
                            else setSearch(val);
                            setIsOpen(true);
                        }}
                        onKeyDown={onKeyDown}
                        onClick={() => !disabled && setIsOpen(true)}
                        onFocus={() => !disabled && setIsOpen(true)}
                        className={`
                            w-full ${showGlobalIcon ? 'pl-11' : 'pl-4'} pr-10 py-2.5 border rounded-xl outline-none transition-all 
                            bg-white min-h-[46px]
                            ${error ? 'border-red-300 ring-1 ring-red-100' : (isOpen ? 'border-secondary ring-2 ring-secondary shadow-md' : 'border-gray-200 hover:border-gray-300 shadow-sm')}
                            ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}
                            ${triggerClassName}
                        `}
                    />
                    {/* Left Input Icon */}
                    {showGlobalIcon && (
                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${error ? 'text-red-400' : 'text-gray-400'}`}>
                            {icon}
                        </div>
                    )}

                    {/* Right Clear Icon (SearchableTrigger only) */}
                    {(customDisplayLabel || search) && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onSearchChange) onSearchChange('');
                                else setSearch('');
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            ) : (
                <div
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={`
                        w-full ${showGlobalIcon ? 'pl-11' : 'pl-4'} pr-10 py-2.5 border rounded-xl outline-none transition-all 
                        cursor-pointer bg-white flex items-center min-h-[46px] select-none
                        ${error ? 'border-red-300 ring-1 ring-red-100' : (isOpen ? 'border-secondary ring-2 ring-secondary shadow-md' : 'border-gray-200 hover:border-gray-300 shadow-sm')}
                        ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}
                        ${triggerClassName}
                    `}
                >
                    {/* Left Input Icon */}
                    {showGlobalIcon && (
                        <div className={`absolute left-4 ${error ? 'text-red-400' : 'text-gray-400'}`}>
                            {icon}
                        </div>
                    )}

                    {/* Selected Value or Placeholder */}
                    <div className={`flex items-center gap-2 flex-1 truncate ${!selectedOption && !customDisplayLabel ? 'text-gray-400' : 'text-black'}`}>
                        {selectedOption?.icon && (
                            <span className="text-gray-600">{selectedOption.icon}</span>
                        )}
                        <span className="font-medium truncate">
                            {customDisplayLabel || selectedOption?.label || placeholder}
                        </span>
                    </div>

                    {/* Right Chevron */}
                    <ChevronDown
                        size={16}
                        className={`absolute right-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>
            )}

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && !disabled && (!searchableTrigger || filteredOptions.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5"
                    >
                        <div className={`py-1 max-h-64 overflow-y-auto ${hideScrollbar ? "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']" : 'custom-scrollbar'}`}>
                            {isSearchable && !searchableTrigger && (
                                <div className="p-3 border-b border-gray-50 bg-gray-50/30 sticky top-0 z-10">
                                    <div className="relative group">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors" size={16} />
                                        <input
                                            autoFocus
                                            className="w-full pl-10 pr-10 py-2 text-sm border-none bg-white rounded-xl outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-secondary shadow-sm transition-all"
                                            placeholder="Search options..."
                                            value={search}
                                            onChange={(e) => {
                                                setSearch(e.target.value);
                                                onSearchChange?.(e.target.value);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        {search && (
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); setSearch(''); }}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
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
                                            <span className={`text-sm ${value === option.value ? 'font-semibold' : 'font-medium'} ${option.className || ''}`}>
                                                {option.label}
                                            </span>
                                        </div>

                                        {value === option.value && (
                                            <Check size={16} className="text-blue-600" />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-8 text-center text-sm text-gray-400 flex flex-col items-center gap-2">
                                    <Search size={24} className="text-gray-200" />
                                    <span>{search ? 'No matches found' : 'No options available'}</span>
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
