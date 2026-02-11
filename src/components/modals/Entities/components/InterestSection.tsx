import { DropDown, Button } from '@/components/ui';
import {
  Briefcase,
  ChevronDown,
  Phone,
  Plus,
  SquarePen,
  Trash2,
  User,
  X,
} from 'lucide-react';

interface Technician {
  name: string;
  phone: string;
}

interface InterestItem {
  category: string;
  brands: string[];
  technicians?: Technician[];
}

interface InterestLogic {
  catSelectValue: string;
  brandSelectValue: string;
  editingIndex: number | null;
  isInterestCollapsed: boolean;
  setIsInterestCollapsed: (val: boolean) => void;
  interests: InterestItem[];
  handleEditItem: (idx: number) => void;
  handleDeleteItem: (idx: number) => void;
  availableCategories: string[];
  handleCategorySelect: (val: string) => void;
  catInputValue: string;
  setCatInputValue: (val: string) => void;
  currentBrands: string[];
  handleRemoveBrand: (brand: string) => void;
  setBrandSelectValue: (val: string) => void;
  availableBrands: string[];
  handleAddBrand: () => void;
  brandInputValue: string;
  setBrandInputValue: (val: string) => void;
  currentTechnicians: Technician[];
  setCurrentTechnicians: (val: Technician[]) => void;
  techNameInput: string;
  setTechNameInput: (val: string) => void;
  techPhoneInput: string;
  setTechPhoneInput: (val: string) => void;
  handleAddTechnician: () => void;
  addInterestEntry: () => void;
  resetEntryFields: () => void;
  // New fields for Site Contact Dropdown
  availableContacts: string[];
  techSelectValue: string;
  setTechSelectValue: (val: string) => void;
  handleTechSelect: (val: string) => void;
}

interface InterestSectionProps {
  logic: InterestLogic;
  entityType: string;
  categoriesData?: { _id: string; name: string; brands: string[] }[];
}

export const InterestSection = ({ logic, entityType }: InterestSectionProps) => {
  const isAddingNewCategory = logic.catSelectValue === 'ADD_NEW';
  const isAddingNewBrand = logic.brandSelectValue === 'ADD_NEW';

  // Explicitly check if we are in edit mode
  const isEditing = logic.editingIndex !== null;

  return (
    <div className="md:col-span-2 mt-6">
      <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
        {/* Header Toggle */}
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => logic.setIsInterestCollapsed(!logic.isInterestCollapsed)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && logic.setIsInterestCollapsed(!logic.isInterestCollapsed)}
          role="button"
          tabIndex={0}
        >
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <Briefcase className="w-5 h-5 text-secondary" /> {entityType} Interests
            <span className="bg-blue-100 text-secondary text-xs px-2 py-0.5 rounded-full font-bold">
              {logic.interests.length}
            </span>
          </h3>
          {logic.isInterestCollapsed ? <ChevronDown className="h-5 w-5 text-gray-500" /> : <Plus className="h-5 w-5 rotate-45 text-gray-500" />}
        </div>

        {!logic.isInterestCollapsed && (
          <div className="space-y-6 pt-2">
            {/* 1. List of added interests - compact rows */}
            {logic.interests.length > 0 && (
              <div className="space-y-2.5">
                {logic.interests.map((item: InterestItem, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => logic.handleEditItem(idx)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && logic.handleEditItem(idx)}
                    role="button"
                    tabIndex={0}
                    className={`px-4 py-3 rounded-lg border transition-all cursor-pointer ${logic.editingIndex === idx
                      ? 'bg-white border-secondary ring-1 ring-secondary'
                      : 'bg-white border-gray-200 hover:border-secondary'
                      }`}
                  >
                    {/* Top row: Category + Actions */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-900 uppercase">{item.category}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <SquarePen className="w-4 h-4 text-gray-400" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            logic.handleDeleteItem(idx);
                          }}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Brands */}
                    <div className="flex flex-wrap gap-1.5">
                      {item.brands.map((b: string) => (
                        <span key={b} className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          {b}
                        </span>
                      ))}
                    </div>

                    {/* Contacts */}
                    {item.technicians && item.technicians.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-gray-100">
                        {item.technicians.map((t: Technician, i: number) => (
                          <span key={i} className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                            <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="font-medium">{t.name}</span>
                            {t.phone && (
                              <>
                                <span className="text-gray-300">|</span>
                                <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span>{t.phone}</span>
                              </>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 2. Entry Form Container */}
            <div className={`p-4 rounded-lg border shadow-sm transition-colors ${isEditing ? 'bg-white border-secondary ring-1 ring-secondary' : 'bg-white border-gray-200'}`}>
              <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
                {isEditing ? 'Update Interest Details:' : 'Add Interest Details:'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Category Selection - FIXED CATEGORY DURING EDIT */}
                <div className="relative">
                  <span className="block text-sm font-semibold text-gray-700 mb-2">
                    Category {isEditing && "(Fixed)"} <span className="text-red-500">*</span>
                  </span>
                  <DropDown
                    value={logic.catSelectValue}
                    onChange={(val) => logic.handleCategorySelect(val)}
                    disabled={isEditing}
                    options={[
                      ...logic.availableCategories.map((c: string) => ({ value: c, label: c })),
                      ...(isEditing ? [] : [{ value: 'ADD_NEW', label: '+ Add New Category', className: 'text-blue-600 font-bold' }])
                    ]}
                    placeholder="Select Category"
                  />
                </div>

                {isAddingNewCategory && (
                  <div>
                    <label htmlFor="newCategoryName" className="block text-sm font-semibold text-gray-700 mb-2">New Category Name <span className="text-red-500">*</span></label>
                    <input
                      id="newCategoryName"
                      type="text"
                      value={logic.catInputValue}
                      onChange={(e) => logic.setCatInputValue(e.target.value)}
                      disabled={isEditing} // <--- ALSO DISABLE IF IT WAS A CUSTOM CATEGORY
                      className={`w-full p-2 border border-gray-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-secondary focus:border-secondary ${isEditing ? 'bg-gray-100' : ''}`}
                      placeholder="e.g. Solar"
                    />
                  </div>
                )}

                {/* Brands Selection */}
                <div className="md:col-span-2">
                  <span className="block text-sm font-semibold text-gray-700 mb-2">Brands <span className="text-red-500">*</span></span>
                  <div className="flex flex-wrap gap-2 mb-2 mt-1">
                    {logic.currentBrands.map((brand: string) => (
                      <span key={brand} className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {brand}
                        <button
                          type="button"
                          onClick={() => logic.handleRemoveBrand(brand)}
                          className="ml-1.5 text-blue-400 hover:text-red-600 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <DropDown
                      value={logic.brandSelectValue}
                      onChange={(val) => logic.setBrandSelectValue(val)}
                      className="flex-1"
                      options={[
                        ...logic.availableBrands.map((b: string) => ({ value: b, label: b })),
                        { value: 'ADD_NEW', label: '+ Add New Brand', className: 'text-blue-600 font-bold' }
                      ]}
                      placeholder="Select Brand to Add..."
                    />

                    {/* Brand ADD Button logic */}
                    {!isAddingNewBrand && logic.brandSelectValue && (
                      <Button
                        type="button"
                        onClick={logic.handleAddBrand}
                        className="px-3 min-h-[46px] bg-secondary hover:bg-secondary/90 text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {isAddingNewBrand && (
                  <div className="md:col-span-2 flex gap-2 items-end">
                    <div className="flex-1">
                      <label htmlFor="newBrandName" className="block text-sm font-semibold text-gray-700 mb-2">New Brand Name</label>
                      <input
                        id="newBrandName"
                        type="text"
                        value={logic.brandInputValue}
                        onChange={(e) => logic.setBrandInputValue(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-secondary focus:border-secondary mt-1"
                        placeholder="Type brand name..."
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={logic.handleAddBrand}
                      className="px-3 min-h-[46px] bg-secondary hover:bg-secondary/90 text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <button type="button" onClick={() => logic.setBrandSelectValue('')} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}

                {/* Site Contacts */}
                {entityType === 'Site' && (
                  <div className="md:col-span-2 pt-2 border-t border-dashed border-gray-200">
                    <span className="block text-sm font-semibold text-gray-700 mb-2">Site Contacts (e.g. Engineer, Plumber)</span>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {logic.currentTechnicians.map((tech: Technician, i: number) => (
                        <div key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm bg-gray-50 text-gray-700 border border-gray-200">
                          <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="font-medium">{tech.name}</span>
                          {tech.phone && (
                            <>
                              <span className="text-gray-300">|</span>
                              <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span>{tech.phone}</span>
                            </>
                          )}
                          <button type="button" onClick={() => logic.setCurrentTechnicians(logic.currentTechnicians.filter((_: unknown, idx: number) => idx !== i))} className="ml-1 text-gray-400 hover:text-red-600 transition-colors"><X className="h-3.5 w-3.5" /></button>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-end">

                      {/* Role Dropdown / Input Group */}
                      <div className="w-full">
                        {logic.techSelectValue === 'ADD_NEW' ? (
                          <div className="flex gap-2 items-center">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={logic.techNameInput}
                                onChange={(e) => logic.setTechNameInput(e.target.value)}
                                className="w-full p-2.5 min-h-[46px] border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                                placeholder="Contact Name"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                logic.setTechSelectValue('');
                                logic.setTechNameInput('');
                              }}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        ) : (
                          <DropDown
                            value={logic.techSelectValue}
                            onChange={(val) => logic.handleTechSelect(val)}
                            options={[
                              ...logic.availableContacts.map((r: string) => ({ value: r, label: r })),
                              { value: 'ADD_NEW', label: '+ Add Site Contact', className: 'text-blue-600 font-bold' }
                            ]}
                            placeholder="Select Site Contact"
                          />
                        )}
                      </div>

                      {/* Phone Input */}
                      <div className="w-full">
                        <input
                          type="tel"
                          value={logic.techPhoneInput}
                          onChange={(e) => logic.setTechPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="w-full p-2.5 min-h-[46px] border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                          placeholder="Phone Number (10 digits)"
                        />
                      </div>

                      {/* Add Button - Visible unless we are adding new (handled by flow) actually button should always be there to commit */}
                      <Button
                        type="button"
                        onClick={logic.handleAddTechnician}
                        className="px-3 min-h-[46px] bg-secondary hover:bg-secondary/90 text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION: Confirm button */}
              <div className="mt-6 flex justify-between items-center">
                {isEditing ? (
                  <Button type="button" onClick={logic.resetEntryFields} variant='outline'>Cancel Edit</Button>
                ) : <div />}

                <Button
                  type="button"
                  onClick={logic.addInterestEntry}
                  className={`ml-auto px-8 py-2.5 shadow-md ${isEditing ? 'bg-secondary' : ''}`}
                >
                  {isEditing ? 'Update Entry' : 'Confirm Interest Entry'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
