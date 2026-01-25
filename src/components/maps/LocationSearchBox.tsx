import React, { useRef } from 'react';
import { Search, Navigation, MapPin } from 'lucide-react';
import Button from '../UI/Button/Button';
import { type Suggestion } from './useLocationServices';
import DropDown from '../UI/DropDown/DropDown';

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
    const inputRef = useRef<HTMLInputElement>(null);

    const dropdownOptions = suggestions.map(s => ({
        label: s.description,
        value: s.place_id,
        icon: <MapPin className="w-4 h-4 text-gray-400" />
    }));

    return (
        <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative w-full">
                <DropDown
                    inputRef={inputRef}
                    value="" // We don't bind value directly to ID because searchQuery is text. We use customDisplayLabel.
                    onChange={(val) => {
                        const sug = suggestions.find(s => s.place_id === val);
                        if (sug) {
                            handleSuggestionClick(sug);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSearch();
                        }
                    }}
                    options={dropdownOptions}
                    placeholder="Search for location (e.g., Kathmandu, Nepal)"
                    isSearchable={true}
                    onSearchChange={(query) => {
                        if (query === '') {
                            handleClearSearch();
                        } else {
                            setSearchQuery(query);
                            setIsSuggestionSelected(false);
                        }
                    }}
                    disableLocalFiltering={true}
                    customDisplayLabel={searchQuery}
                    searchableTrigger={true}
                    icon={<Search className="w-4 h-4" />}
                    className="w-full"
                />
            </div>

            <div className="flex gap-2 w-full sm:w-auto sm:flex-shrink-0">
                <Button
                    type="button"
                    onClick={() => {
                        handleSearch();
                        setTimeout(() => inputRef.current?.focus(), 10);
                    }}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                    }}
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
