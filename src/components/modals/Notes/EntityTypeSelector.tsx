import React from 'react';
import partiesIcon from '../../../assets/Image/icons/parties-icon.svg';
import prospectsIcon from '../../../assets/Image/icons/prospects-icon.svg';
import sitesIcon from '../../../assets/Image/icons/sites-icon.svg';


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

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700 mb-2">Link to (Select one) <span className="text-red-500">*</span></label>
      <div className={`grid gap-3 ${visibleOptions.length === 1 ? 'grid-cols-1' : visibleOptions.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {visibleOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${value === opt.id
              ? 'border-secondary bg-secondary/10 text-secondary'
              : error
                ? 'border-red-300 bg-red-50/10 text-gray-500'
                : 'border-gray-100 bg-white text-gray-400'
              }`}
          >
            <img
              src={opt.icon}
              alt={`${opt.label} Icon`}
              className={`w-6 h-6 mb-2 ${value === opt.id ? '[filter:brightness(0)_saturate(100%)_invert(27%)_sepia(51%)_saturate(2878%)_hue-rotate(346deg)_brightness(104%)_contrast(97%)]' : ''}`} // Apply styling to match active state if needed, primarily relies on SVG color or filter
            />
            <span className="text-sm font-black tracking-widest">{opt.label}</span>
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};