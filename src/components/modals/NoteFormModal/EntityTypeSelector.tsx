import React from 'react';
import { Store, Users, Building2 } from 'lucide-react';

interface Props {
  value?: string;
  onChange: (val: "party" | "prospect" | "site") => void;
  error?: string;
}

export const EntityTypeSelector: React.FC<Props> = ({ value, onChange, error }) => {
  const options = [
    { id: 'party', label: 'Party', icon: Store },
    { id: 'prospect', label: 'Prospect', icon: Users },
    { id: 'site', label: 'Site', icon: Building2 }
  ] as const;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-gray-500 tracking-wider  ml-1">Link to (Select one) *</label>
      <div className="grid grid-cols-3 gap-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
              value === opt.id ? 'border-secondary bg-secondary/10 text-secondary' : 'border-gray-100 bg-white text-gray-400'
            }`}
          >
            <opt.icon size={24} className="mb-2" />
            <span className="text-sm font-black  tracking-widest">{opt.label}</span>
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm font-bold ml-1">{error}</p>}
    </div>
  );
};