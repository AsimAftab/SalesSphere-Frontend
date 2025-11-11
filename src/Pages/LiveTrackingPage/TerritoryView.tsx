import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, AlertTriangle } from 'lucide-react';
import { TerritoryMap } from './TerritoryMap';
import { getMapLocations } from '../../api/mapService';
import type { UnifiedLocation } from '../../api/mapService';



const filterConfig: { label: string; type: UnifiedLocation['type']; color: string }[] = [
  { label: 'Parties', type: 'Party', color: 'blue' },
  { label: 'Prospects', type: 'Prospect', color: 'green' },
  { label: 'Sites', type: 'Site', color: 'orange' },
];

const TerritoryView = () => {
  const [selectedLocation, setSelectedLocation] = useState<UnifiedLocation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilters, setTypeFilters] = useState<Record<UnifiedLocation['type'], boolean>>({
    Party: true,
    Prospect: true,
    Site: true,
  });

  // --- Data Fetching with TanStack Query ---
  const { data: allLocations = [], isLoading, isError, error } = useQuery<UnifiedLocation[], Error>({
    queryKey: ['territoryLocations'],
    queryFn: getMapLocations,
  });



  // Effect to set the initial selected location
  useEffect(() => {
    if (allLocations.length > 0 && !selectedLocation) {
      setSelectedLocation(allLocations[0]);
    }
  }, [allLocations, selectedLocation]);

  const locationCounts = useMemo(() => {
    return allLocations.reduce((acc, loc) => {
      acc[loc.type] = (acc[loc.type] || 0) + 1;
      return acc;
    }, {} as Record<UnifiedLocation['type'], number>);
  }, [allLocations]);

  const filteredLocations = useMemo(() => {
    return allLocations.filter(loc => {
      const matchesType = typeFilters[loc.type];
      const matchesSearch = searchTerm.trim() === '' ||
        loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.address.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [searchTerm, typeFilters, allLocations]);

  const handleFilterChange = (type: UnifiedLocation['type']) => {
    setTypeFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleLocationSelect = (location: UnifiedLocation) => {
    setSelectedLocation(location);
  };

  const handleMarkerClick = (locationId: string) => {
    const location = allLocations.find(loc => loc.id === locationId);
    if (location) {
      setSelectedLocation(location);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">


      {/* Top Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 border-b pb-3 gap-4">
        <span className="text-gray-900 font-semibold text-lg">Territory Locations</span>
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 text-sm w-full lg:w-auto">
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
            />
            <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-4 md:gap-6">
            {filterConfig.map(filter => (
              <label key={filter.type} className="flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={typeFilters[filter.type]}
                  onChange={() => handleFilterChange(filter.type)}
                  className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-sm bg-white checked:bg-gray-800 checked:border-gray-800 focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-2 bg-checkbox-check"
                />
                <span className={`w-3 h-3 rounded-full bg-${filter.color}-500 mr-2`}></span>
                {filter.label} ({locationCounts[filter.type] || 0})
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
        {/* Left Panel: Location List */}
        <div className="lg:col-span-1 bg-gray-50 rounded-lg p-3 overflow-y-auto">
          <h2 className="text-md font-semibold mb-3">
            {filteredLocations.length} Locations Found
          </h2>
          {isLoading ? (
            <div className="text-center py-10">Loading locations...</div>
          ) : isError ? (
            <div className="text-center py-10 text-red-600">
              <AlertTriangle size={24} className="mx-auto mb-2" />
              <p>Error fetching data:</p>
              <p className="text-sm">{error?.message}</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {filteredLocations.map(loc => (
                <li
                  key={loc.id}
                  onClick={() => handleLocationSelect(loc)}
                  className={`p-3 rounded-lg cursor-pointer border-l-4 ${selectedLocation?.id === loc.id
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-white hover:bg-gray-100 border-transparent'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{loc.name}</span>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full text-white bg-${filterConfig.find(f => f.type === loc.type)?.color
                        }-500`}
                    >
                      {loc.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <MapPin size={12} className="mr-1.5" />
                    {loc.address}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right Panel: Map */}
        <div className="lg:col-span-2 rounded-lg overflow-hidden shadow-md">
          <TerritoryMap
            locations={filteredLocations}
            selectedLocationId={selectedLocation?.id}
            onMarkerClick={handleMarkerClick}
          />
        </div>
      </div>
    </div>
  );
};

export default TerritoryView;
