import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChange,
    placeholder = "Search...",
    className = ""
}) => {
    return (
        <div className={`relative w-full sm:w-64 xl:w-72 2xl:w-80 ${className}`}>
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="h-10 xl:h-10 w-full bg-gray-200 rounded-full pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-secondary transition-all placeholder-gray-500"
            />
        </div>
    );
};

export default SearchBar;
