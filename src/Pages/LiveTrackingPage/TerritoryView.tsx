import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import LocationInfoModal from '../../components/modals/LocationInfoModal';
import Button from '../../components/UI/Button/Button';

// Define a type for our location data
export type Location = {
  id: string;
  type: 'Prospect' | 'Party' | 'Site';
  name: string;
  address: string;
  status: 'Hot Lead' | 'Cold' | 'Warm'; // Example statuses
  coords: { top: string; left: string }; // Using percentages for responsive positioning
};

// Mock data (unchanged)
const locations: Location[] = [
  { id: 'p1', type: 'Prospect', name: 'Tech Solutions Inc.', address: '456 Tech Ave, New York, NY', status: 'Hot Lead', coords: { top: '30%', left: '70%' } },
  { id: 'p2', type: 'Prospect', name: 'Global Enterprises', address: '123 Business Rd, San Francisco, CA', status: 'Warm', coords: { top: '55%', left: '48%' } },
  { id: 'p3', type: 'Prospect', name: 'Innovate Co.', address: '789 Future St, Austin, TX', status: 'Cold', coords: { top: '15%', left: '55%' } },
  { id: 'pa1', type: 'Party', name: 'Acme Corp', address: '101 Main St, Chicago, IL', status: 'Warm', coords: { top: '25%', left: '22%' } },
  { id: 'pa2', type: 'Party', name: 'Apex Industries', address: '202 Market St, Boston, MA', status: 'Warm', coords: { top: '65%', left: '15%' } },
  { id: 's1', type: 'Site', name: 'Downtown Office', address: '303 Central Plaza, Miami, FL', status: 'Warm', coords: { top: '50%', left: '80%' } },
  { id: 's2', type: 'Site', name: 'Westside Warehouse', address: '404 Industrial Way, Seattle, WA', status: 'Warm', coords: { top: '80%', left: '70%' } },
];

const locationStyles = {
  Party: 'bg-blue-500 border-blue-700',
  Prospect: 'bg-green-500 border-green-700',
  Site: 'bg-orange-500 border-orange-700',
};

const filterConfig: { label: string; type: Location['type']; color: string }[] = [
    { label: 'Parties', type: 'Party', color: 'blue' },
    { label: 'Prospects', type: 'Prospect', color: 'green' },
    { label: 'Sites', type: 'Site', color: 'orange' },
];


const TerritoryView = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilters, setTypeFilters] = useState<Record<Location['type'], boolean>>({
    Party: true,
    Prospect: true,
    Site: true,
  });

  const locationCounts = useMemo(() => {
    const counts: Record<Location['type'], number> = { Party: 0, Prospect: 0, Site: 0 };
    for (const loc of locations) {
        counts[loc.type]++;
    }
    return counts;
  }, []);

  const filteredLocations = useMemo(() => {
    return locations.filter(loc => {
      const matchesType = typeFilters[loc.type];
      const matchesSearch = searchTerm.trim() === '' ||
        loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.address.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [searchTerm, typeFilters]);


  const getPinColor = (type: Location['type']) => {
    return locationStyles[type] || 'bg-gray-500 border-gray-700';
  };

  const handleFilterChange = (type: Location['type']) => {
    setTypeFilters(prev => ({
        ...prev,
        [type]: !prev[type]
    }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      {/* --- MODIFIED: Top Filter Bar (responsive layout) --- */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 border-b pb-3 gap-4">
        <span className="text-gray-900 font-semibold text-lg lg:text-base">Filter Locations</span>
        
        {/* --- MODIFIED: Container for search and filters --- */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 text-sm w-full lg:w-auto">
            {/* Search Input */}
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

            {/* --- MODIFIED: Checkbox Filters (responsive layout) --- */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-4 md:gap-6">
                {filterConfig.map(filter => (
                    <label key={filter.type} className="flex items-center cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={typeFilters[filter.type]}
                            onChange={() => handleFilterChange(filter.type)}
                            className="
                                appearance-none w-4 h-4 border-2 border-gray-300 rounded-sm
                                bg-white checked:bg-gray-800 checked:border-gray-800
                                focus:outline-none transition duration-200
                                align-top bg-no-repeat bg-center bg-contain float-left mr-2
                            "
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/%3e%3c/svg%3e")` }}
                        />
                        <span className={`w-3 h-3 rounded-full bg-${filter.color}-500 mr-2`}></span>
                        {filter.label} ({locationCounts[filter.type]})
                    </label>
                ))}
            </div>
        </div>
      </div>

      {/* --- MODIFIED: Map Area (responsive height) --- */}
      <div className="relative w-full h-[450px] md:h-[600px] bg-blue-50 rounded-lg overflow-hidden">
        {/* Faint grid lines */}
        <div className="absolute inset-0 grid grid-rows-10">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="border-t border-blue-100/50"></div>
          ))}
        </div>
        
        {/* Location Pins */}
        {filteredLocations.map((loc) => (
          <button
            key={loc.id}
            className={`
              absolute w-6 h-6 rounded-full border-4 shadow-lg transform -translate-x-1/2 -translate-y-1/2
              flex items-center justify-center ${getPinColor(loc.type)}
            `}
            style={{ top: loc.coords.top, left: loc.coords.left }}
            onClick={() => setSelectedLocation(loc)}
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </button>
        ))}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow">
          <p className="font-bold text-sm mb-2">Legend</p>
          <ul className="space-y-1 text-xs text-gray-700">
            <li className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 border-2 border-blue-700 mr-2"></span>
              Parties (Customers)
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 border-2 border-green-700 mr-2"></span>
              Prospects (Leads)
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-orange-500 border-2 border-orange-700 mr-2"></span>
              Sites (Locations)
            </li>
          </ul>
        </div>
        
        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1">
          <Button
            variant="outline"
            className="!rounded-md !w-8 !h-8 !p-0 flex items-center justify-center !text-lg"
          >
            +
          </Button>
          <Button
            variant="outline"
            className="!rounded-md !w-8 !h-8 !p-0 flex items-center justify-center !text-lg"
          >
            -
          </Button>
        </div>
      </div>

      {/* Modal */}
      {selectedLocation && (
        <LocationInfoModal
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </div>
  );
};

export default TerritoryView;