import React from 'react';
import { Search, Navigation, X } from 'lucide-react';
import Button from '../UI/Button/Button';
import { type Suggestion } from './useLocationServices';

interface LocationSearchBoxProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: () => void;
    handleClearSearch: () => void;
    suggestions: Suggestion[];
    handleSuggestionClick: (suggestion: Suggestion) => void;
    handleGetCurrentLocation: () => void;
    isSearching: boolean;
    setIsSuggestionSelected: (selected: boolean) => void;
}

export const LocationSearchBox: React.FC<LocationSearchBoxProps> = ({
    searchQuery,
    setSearchQuery,
    handleSearch,
    handleClearSearch,
    suggestions,
    handleSuggestionClick,
    handleGetCurrentLocation,
    isSearching,
    setIsSuggestionSelected
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative w-full">
                <input
                    type="text"
                    placeholder="Search for location (e.g., Kathmandu, Nepal)"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsSuggestionSelected(false);
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg outline-none shadow-sm transition-all focus:border-secondary focus:ring-2 focus:ring-secondary"
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label="Clear search"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
                {suggestions.length > 0 && (
                    <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                        {suggestions.map((suggestion) => (
                            <li
                                key={suggestion.place_id}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                            >
                                {suggestion.description}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="flex gap-2 w-full sm:w-auto sm:flex-shrink-0">
                <Button
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearching}
                    variant="secondary"
                    className="flex items-center gap-2 flex-1 justify-center"
                >
                    <Search className="w-4 h-4" />
                    {isSearching ? 'Searching...' : 'Search'}
                </Button>
                <Button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    variant="secondary"
                    className="flex items-center justify-center px-3"
                    title="Get current location"
                >
                    <Navigation className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};
