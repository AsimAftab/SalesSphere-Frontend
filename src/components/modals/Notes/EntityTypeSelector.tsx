import React from 'react';
import { Store, Users, Building2 } from 'lucide-react';

interface Props {
  value?: string;
  onChange: (val: "party" | "prospect" | "site") => void;
  error?: string;
  allowedTypes?: string[]; // Optional: if provided, only these types will be shown
}

export const EntityTypeSelector: React.FC<Props> = ({ value, onChange, error, allowedTypes }) => {
  const allOptions = [
    { id: 'party', label: 'Party', icon: Store },
    { id: 'prospect', label: 'Prospect', icon: Users },
    { id: 'site', label: 'Site', icon: Building2 }
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
            className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${value === opt.id ? 'border-secondary bg-secondary/10 text-secondary' : 'border-gray-100 bg-white text-gray-400'
              }`}
          >
            <opt.icon size={24} className="mb-2" />
            <span className="text-sm font-black tracking-widest">{opt.label}</span>
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};