import React from 'react';
import partiesIcon from '@/assets/images/icons/parties-icon.svg';
import prospectsIcon from '@/assets/images/icons/prospects-icon.svg';
import sitesIcon from '@/assets/images/icons/sites-icon.svg';


interface Props {
  value?: string;
  onChange: (val: "party" | "prospect" | "site") => void;
  error?: string;
  allowedTypes?: string[]; // Optional: if provided, only these types will be shown
}

export const EntityTypeSelector: React.FC<Props> = ({ value, onChange, error, allowedTypes }) => {
  const allOptions = [
    { id: 'party', label: 'Party', icon: partiesIcon },
    { id: 'prospect', label: 'Prospect', icon: prospectsIcon },
    { id: 'site', label: 'Site', icon: sitesIcon }
  ] as const;

  // Filter options if allowedTypes is provided
  const visibleOptions = allowedTypes
    ? allOptions.filter(opt => allowedTypes.includes(opt.id))
    : allOptions;

  if (visibleOptions.length === 0) {
    return null; // Or render a message saying "No linkable entities available"
  }

  // Color Configuration
  const colorMap = {
    party: 'border-blue-500 bg-blue-50 text-blue-700',
    prospect: 'border-green-500 bg-green-50 text-green-700',
    site: 'border-orange-500 bg-orange-50 text-orange-700'
  };

  // Icon Filter Configuration (Calculated for Tailwind 700 shades)
  const filterMap = {
    party: 'brightness(0) saturate(100%) invert(24%) sepia(88%) saturate(2627%) hue-rotate(218deg) brightness(93%) contrast(92%)', // Blue-700
    prospect: 'brightness(0) saturate(100%) invert(34%) sepia(97%) saturate(1637%) hue-rotate(97deg) brightness(92%) contrast(88%)', // Green-700
    site: 'brightness(0) saturate(100%) invert(37%) sepia(51%) saturate(2252%) hue-rotate(10deg) brightness(95%) contrast(98%)' // Orange-700
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700 mb-2">Link to (Select one) <span className="text-red-500">*</span></label>
      <div className={`grid gap-3 ${visibleOptions.length === 1 ? 'grid-cols-1' : visibleOptions.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {visibleOptions.map((opt) => {
          const isSelected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${isSelected
                ? colorMap[opt.id as keyof typeof colorMap]
                : error
                  ? 'border-red-300 bg-red-50/10 text-gray-500'
                  : 'border-gray-100 bg-white text-gray-400'
                }`}
            >
              <img
                src={opt.icon}
                alt={`${opt.label} Icon`}
                className="w-6 h-6 mb-2"
                style={{
                  filter: isSelected ? filterMap[opt.id as keyof typeof filterMap] : 'grayscale(100%) opacity(0.6)',
                  transition: 'filter 0.2s ease'
                }}
              />
              <span className="text-sm font-black tracking-widest">{opt.label}</span>
            </button>
          );
        })}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};