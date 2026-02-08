import React from 'react';
import { Settings2 } from 'lucide-react';
import { DropDown } from '@/components/ui';
import type { CategoryConfig } from '../categoryConfig';

interface CategorySidebarProps {
  categories: CategoryConfig[];
  selectedKey: string;
  onSelect: (key: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedKey,
  onSelect,
}) => {
  const dropdownOptions = categories.map((cat) => ({
    value: cat.key,
    label: cat.label,
    icon: <img src={cat.icon} alt="" className="w-4 h-4" />,
  }));

  return (
    <>
      {/* Mobile: DropDown selector */}
      <div className="lg:hidden">
        <DropDown
          value={selectedKey}
          onChange={onSelect}
          options={dropdownOptions}
          placeholder="Select category"
        />
      </div>

      {/* Desktop: Sidebar card */}
      <div className="hidden lg:flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 p-2 bg-secondary/10 rounded-lg">
              <Settings2 className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Custom Fields</h3>
              <p className="text-xs text-gray-500">Select a field to manage</p>
            </div>
          </div>
        </div>

        {/* Category List */}
        <nav className="flex-1 overflow-y-auto py-1" style={{ scrollbarWidth: 'thin' }}>
          {categories.map((cat) => {
            const isActive = cat.key === selectedKey;

            return (
              <button
                key={cat.key}
                onClick={() => onSelect(cat.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-md transition-all duration-150 ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-secondary'
                }`}
              >
                <img
                  src={cat.icon}
                  alt=""
                  className={`w-4 h-4 flex-shrink-0 ${isActive ? 'brightness-0 invert' : ''}`}
                />
                <span className={`text-sm flex-1 truncate ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default CategorySidebar;
