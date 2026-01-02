
import { BriefcaseIcon, ChevronDownIcon, TrashIcon, XMarkIcon, UsersIcon, PlusIcon } from '@heroicons/react/24/outline';
import Button from '../../UI/Button/Button';

export const InterestSection = ({ logic, entityType }: any) => {
  const isAddingNewCategory = logic.catSelectValue === 'ADD_NEW';
  const isAddingNewBrand = logic.brandSelectValue === 'ADD_NEW';

  return (
    <div className="md:col-span-2 mt-6">
      <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
        {/* Header Toggle */}
        <div 
          className="flex justify-between items-center cursor-pointer" 
          onClick={() => logic.setIsInterestCollapsed(!logic.isInterestCollapsed)}
        >
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <BriefcaseIcon className="w-5 h-5 text-secondary"/> {entityType} Interests 
            <span className="bg-blue-100 text-secondary text-xs px-2 py-0.5 rounded-full font-bold">
              {logic.interests.length}
            </span>
          </h3>
          {logic.isInterestCollapsed ? <ChevronDownIcon className="h-5 w-5 text-gray-500"/> : <PlusIcon className="h-5 w-5 rotate-45 text-gray-500"/>}
        </div>

        {!logic.isInterestCollapsed && (
          <div className="space-y-6 pt-2">
            {/* 1. List of added interests */}
            {logic.interests.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-start bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <div>
                  <p className="font-bold text-gray-800 text-sm">{item.category}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.brands.map((b: string) => (
                      <span key={b} className="text-xs bg-blue-50 text-secondary px-2 py-0.5 rounded-full border border-blue-100">{b}</span>
                    ))}
                  </div>
                  {item.technicians?.map((t: any, i: number) => (
                    <p key={i} className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <UsersIcon className="w-3 h-3"/> {t.name} ({t.phone})
                    </p>
                  ))}
                </div>
                <button 
                  type="button" 
                  onClick={() => logic.setInterests(logic.interests.filter((_:any, i:any)=> i !== idx))} 
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <TrashIcon className="h-4 w-4"/>
                </button>
              </div>
            ))}

            {/* 2. Entry Form Container with SECONDARY Border */}
            <div className="bg-white p-4 rounded-lg border  shadow-sm">
              <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Add Interest Details:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Category Selection */}
                <div className="relative">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Category *</label>
                  <select 
                    value={logic.catSelectValue} 
                    onChange={(e) => logic.handleCategorySelect(e.target.value)} 
                    className="w-full p-2 border border-gray-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                  >
                    <option value="" disabled>Select Category</option>
                    {logic.availableCategories.map((c: string) => <option key={c} value={c}>{c}</option>)}
                    <option value="ADD_NEW" className="font-bold text-secondary"> Add New Category</option>
                  </select>
                </div>

                {isAddingNewCategory && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">New Category Name *</label>
                    <input 
                      type="text" 
                      value={logic.catInputValue} 
                      onChange={(e) => logic.setCatInputValue(e.target.value)} 
                      className="w-full p-2 border border-gray-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-secondary focus:border-secondary" 
                      placeholder="e.g. Solar" 
                    />
                  </div>
                )}

                {/* Brands Selection */}
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Brands *</label>
                  <div className="flex flex-wrap gap-2 mb-2 mt-1">
                    {logic.currentBrands.map((brand: string) => (
                      <span key={brand} className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-blue-100 text-secondary font-medium border border-blue-200">
                        {brand}
                        <button 
                          type="button" 
                          onClick={() => logic.setCurrentBrands(logic.currentBrands.filter((b: string) => b !== brand))} 
                          className="ml-1.5 hover:text-red-600 transition-colors"
                        >
                          <XMarkIcon className="h-3.5 w-3.5"/>
                        </button>
                      </span>
                    ))}
                  </div>
                  <select 
                    value={logic.brandSelectValue} 
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'ADD_NEW') logic.setBrandSelectValue(val);
                      else if (!logic.currentBrands.includes(val)) logic.setCurrentBrands([...logic.currentBrands, val]);
                    }} 
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                  >
                    <option value="" disabled>Select Brand to Add...</option>
                    {logic.availableBrands.map((b: string) => <option key={b} value={b}>{b}</option>)}
                    <option value="ADD_NEW" className="font-bold text-secondary">Add New Brand</option>
                  </select>
                </div>

                {isAddingNewBrand && (
                  <div className="md:col-span-2 flex gap-2">
                    <input 
                      type="text" 
                      value={logic.brandInputValue} 
                      onChange={(e) => logic.setBrandInputValue(e.target.value)} 
                      className="flex-1 p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-secondary focus:border-secondary" 
                      placeholder="Type brand name..." 
                    />
                    <Button type="button" onClick={logic.handleAddCustomBrand}>Add</Button>
                    <button type="button" onClick={() => logic.setBrandSelectValue('')} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}

                {/* Technicians (Active Form Display & Input) */}
                {entityType === 'Site' && (
                  <div className="md:col-span-2 pt-2 border-t border-dashed border-gray-200">
                    <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">Technicians</label>
                    
                    {/* NEW: Display pending technicians being added to this specific entry */}
                    {logic.currentTechnicians.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {logic.currentTechnicians.map((tech: any, i: number) => (
                          <div key={i} className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-green-50 text-green-700 border border-green-200">
                            <UsersIcon className="w-3.5 h-3.5 mr-1.5"/>
                            <span className="font-medium">{tech.name}</span>
                            <span className="mx-1 opacity-50">|</span>
                            <span>{tech.phone}</span>
                            <button 
                              type="button" 
                              onClick={() => logic.setCurrentTechnicians(logic.currentTechnicians.filter((_: any, idx: number) => idx !== i))}
                              className="ml-2 hover:text-red-600 transition-colors"
                            >
                              <XMarkIcon className="h-3.5 w-3.5"/>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input 
                        type="text" 
                        value={logic.techNameInput} 
                        onChange={(e) => logic.setTechNameInput(e.target.value)} 
                        className="flex-1 p-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-secondary focus:border-secondary" 
                        placeholder="Tech Name" 
                      />
                      <input 
                        type="tel" 
                        value={logic.techPhoneInput} 
                        onChange={(e) => logic.setTechPhoneInput(e.target.value.replace(/\D/g,'').slice(0,10))} 
                        className="flex-1 p-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-secondary focus:border-secondary" 
                        placeholder="10-digit Phone" 
                      />
                      <Button type="button" onClick={logic.handleAddTechnician}>Add Tech</Button>
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION: Confirm button aligned to the right */}
              <div className="mt-6 flex justify-end">
                <Button 
                  type="button" 
                  onClick={logic.addInterestEntry}
                  className="px-8 py-2.5 shadow-md hover:shadow-lg transition-all"
                >
                  Confirm Interest Entry
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};