import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui';

// Define a common structure for status styling
export interface StatusOption {
  value: string;
  label: string;
  colorClass: string; // e.g., 'blue', 'green', 'red'
}

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newValue: string) => void;
  currentValue: string;
  title?: string;
  entityIdLabel?: string;
  entityIdValue: string;
  options: StatusOption[];
  isSaving?: boolean;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentValue,
  title = "Update Status",
  entityIdLabel = "ID",
  entityIdValue,
  options,
  isSaving
}) => {
  const [tempValue, setTempValue] = useState<string>(currentValue);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) setTempValue(currentValue);
  }, [isOpen, currentValue]);

  // Click outside listener
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && !isSaving) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose, isSaving]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
            {entityIdLabel}: <span className="text-gray-900">{entityIdValue}</span>
          </p>
        </div>

        {/* Dynamic Selection List */}
        <div className="p-4 space-y-2">
          {options.map(option => {
            const isSelected = tempValue === option.value;
            const isCurrentlyActive = option.value === currentValue;

            // Static color mapping for Tailwind CSS (prevents purging issues)
            const colorMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
              blue: { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-600', dot: 'bg-blue-500' },
              green: { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-600', dot: 'bg-green-500' },
              red: { bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-600', dot: 'bg-red-500' },
              orange: { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-600', dot: 'bg-orange-500' },
              violet: { bg: 'bg-violet-50', border: 'border-violet-400', text: 'text-violet-600', dot: 'bg-violet-500' },
              purple: { bg: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-600', dot: 'bg-purple-500' },
              gray: { bg: 'bg-gray-50', border: 'border-gray-400', text: 'text-gray-600', dot: 'bg-gray-500' },
            };

            const colors = colorMap[option.colorClass] || colorMap.gray;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setTempValue(option.value)}
                disabled={isSaving}
                className={`
                  w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200
                  ${isSelected ? `${colors.border} ${colors.bg}` : 'border-gray-100 hover:border-gray-200 bg-white'}
                  ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${isSelected ? colors.dot : 'bg-gray-300'}`} />
                  <span className={`text-sm font-bold uppercase tracking-tight ${isSelected ? colors.text : 'text-gray-600'}`}>
                    {option.label}
                  </span>
                  {isCurrentlyActive && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-bold">CURRENT</span>
                  )}
                </div>
                {isSelected && <Check size={16} className={colors.text} strokeWidth={3} />}
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-100 flex items-center justify-end gap-3 border-t border-gray-100">
          <Button
            variant="ghost"
            onClick={onClose}
            className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onSave(tempValue)}
            disabled={isSaving || tempValue === currentValue}
            className="text-xs font-bold tracking-widest px-6 min-w-[140px] flex justify-center"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;