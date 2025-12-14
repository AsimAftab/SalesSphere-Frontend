import React, { useState, useEffect } from 'react';
import {
  XMarkIcon as X,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  GlobeAltIcon,
  IdentificationIcon,
  BriefcaseIcon,
  PlusIcon,
  ChevronDownIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { LocationMap } from '../maps/LocationMap';
import Button from '../UI/Button/Button';
import toast from 'react-hot-toast';
// Import the type for Category Data
import { type ProspectCategoryData } from '../../api/prospectService';

// --- Types ---

export type EntityType = 'Party' | 'Prospect' | 'Site';

export interface InterestItem {
  category: string;
  newCategory?: string;
  brands: string[];
  technicianName?: string;
  technicianPhone?: string;
}

export interface EditEntityData {
  name: string;
  ownerName: string;
  dateJoined: string;
  address: string;
  description?: string;
  latitude: number;
  longitude: number;
  email: string;
  phone: string;
  panVat?: string;
  prospectInterest?: InterestItem[];
}

interface EditEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: EditEntityData) => Promise<void>;
  initialData: EditEntityData;
  title: string;
  nameLabel: string;
  ownerLabel: string;
  panVatMode: 'required' | 'optional' | 'hidden';
  descriptionMode: 'required' | 'hidden' | 'optional';
  entityType: EntityType;
  // ✅ UPDATED: Accept full category objects to handle brand mapping
  categoriesData?: ProspectCategoryData[];
  onAddCategory?: (newCategory: string) => void;
  onAddBrand?: (newBrand: string) => void;
}

interface FormData {
  name: string;
  ownerName: string;
  dateJoined: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  email: string;
  phone: string;
  panVat: string;
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    return date.toLocaleDateString('en-US', options);
  } catch (error) { return dateString; }
};

const EditEntityModal: React.FC<EditEntityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  title,
  nameLabel,
  ownerLabel,
  panVatMode,
  descriptionMode,
  entityType,
  categoriesData = [], // ✅ Default to empty array
  onAddCategory,
  onAddBrand
}) => {
  const defaultPosition = { lat: 27.7172, lng: 85.324 };

  const mapInitialToFormData = (data: EditEntityData): FormData => ({
    name: data.name ?? '',
    ownerName: data.ownerName ?? '',
    dateJoined: data.dateJoined ?? '',
    address: data.address ?? '',
    description: data.description ?? '',
    latitude: data.latitude ?? defaultPosition.lat,
    longitude: data.longitude ?? defaultPosition.lng,
    email: data.email ?? '',
    phone: (data.phone ?? '').replace(/[^0-9]/g, ''),
    panVat: data.panVat ?? '',
  });

  const [formData, setFormData] = useState<FormData>(mapInitialToFormData(initialData));
  const [mapPosition, setMapPosition] = useState(defaultPosition);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // --- INTEREST LIST STATE ---
  const [interests, setInterests] = useState<InterestItem[]>([]);
  const [isInterestCollapsed, setIsInterestCollapsed] = useState(true);

  // Dynamic Lists
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // Current Entry Form State
  const [catSelectValue, setCatSelectValue] = useState('');
  const [catInputValue, setCatInputValue] = useState('');
  const [currentBrands, setCurrentBrands] = useState<string[]>([]);
  const [brandSelectValue, setBrandSelectValue] = useState('');
  const [brandInputValue, setBrandInputValue] = useState('');
  const [technicianName, setTechnicianName] = useState('');
  const [technicianPhone, setTechnicianPhone] = useState('');

  const showInterestSection = ['Prospect', 'Site'].includes(entityType);
  const isAddingNewCategory = catSelectValue === 'ADD_NEW';
  const isAddingNewBrand = brandSelectValue === 'ADD_NEW';

  const resetCurrentInterestEntry = () => {
    setCatSelectValue('');
    setCatInputValue('');
    setCurrentBrands([]);
    setBrandSelectValue('');
    setBrandInputValue('');
    setTechnicianName('');
    setTechnicianPhone('');
    // Clear available brands when resetting
    setAvailableBrands([]); 
    setErrors(prev => {
      const newErr = { ...prev };
      delete newErr.category; delete newErr.newCategory; delete newErr.brands;
      delete newErr.technicianName; delete newErr.technicianPhone;
      return newErr;
    });
  };

  useEffect(() => {
    if (isOpen) {
      const mapped = mapInitialToFormData(initialData);
      setFormData(mapped);
      setMapPosition({ lat: mapped.latitude, lng: mapped.longitude });
      
      setInterests(initialData.prospectInterest || []);
      
      // ✅ Initialize Categories from the passed data
      const catNames = categoriesData.map(c => c.name).sort();
      setAvailableCategories(catNames);
      setAvailableBrands([]); // Start empty until a category is picked

      resetCurrentInterestEntry();
      setErrors({});
      setIsSaving(false);
      setIsInterestCollapsed(true);
    }
  }, [isOpen, initialData, categoriesData]);

  // --- HANDLERS (General) ---
  const handleMapSync = (location: { lat: number; lng: number }) => {
    setFormData((prev) => ({ ...prev, latitude: location.lat, longitude: location.lng }));
    setMapPosition(location);
  };

  const handleAddressSync = (address: string) => {
    setFormData((prev) => ({ ...prev, address }));
    if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target;
    if (name === 'phone') value = value.replace(/[^0-9]/g, '').slice(0, 10);
    if (name === 'panVat') value = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 14);
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // --- INTEREST HANDLERS ---

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCatSelectValue(val);
    
    // ✅ Reset Brands when category changes
    setBrandSelectValue('');
    setCurrentBrands([]); 
    
    // ✅ Update Available Brands based on selected category
    if (val && val !== 'ADD_NEW') {
        const selectedCatData = categoriesData.find(c => c.name === val);
        if (selectedCatData && selectedCatData.brands) {
            setAvailableBrands(selectedCatData.brands.sort());
        } else {
            setAvailableBrands([]);
        }
    } else {
        setAvailableBrands([]);
    }

    if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
  };

  const handleClearCategoryInput = () => setCatInputValue('');

  const handleBrandSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setBrandSelectValue(val);

    if (val && val !== 'ADD_NEW') {
      if (!currentBrands.includes(val)) {
        setCurrentBrands(prev => [...prev, val]);
        setBrandSelectValue('');
        if (errors.brands) setErrors(prev => ({ ...prev, brands: '' }));
      } else {
        toast.error('Brand already added');
        setBrandSelectValue('');
      }
    }
  };

  const handleAddCustomBrand = () => {
    const trimmed = brandInputValue.trim();
    if (!trimmed) return;
    if (currentBrands.includes(trimmed)) { toast.error('Brand already added'); return; }

    setCurrentBrands(prev => [...prev, trimmed]);
    // Optionally add to local available list for this session
    if (!availableBrands.includes(trimmed)) {
      setAvailableBrands(prev => [...prev, trimmed].sort());
      if (onAddBrand) onAddBrand(trimmed);
    }
    setBrandInputValue('');
    setBrandSelectValue('');
    if (errors.brands) setErrors(prev => ({ ...prev, brands: '' }));
  };

  const handleCancelCustomBrand = () => { setBrandSelectValue(''); setBrandInputValue(''); };
  const handleClearBrandInput = () => setBrandInputValue('');
  const removeBrandChip = (brandToRemove: string) => setCurrentBrands(prev => prev.filter(b => b !== brandToRemove));

  const handleAddInterestEntry = () => {
    const newErrors: Record<string, string> = {};
    let finalCategory = '';

    if (!catSelectValue) newErrors.category = 'Category is required.';
    else if (catSelectValue === 'ADD_NEW') {
      if (!catInputValue.trim()) newErrors.newCategory = 'New category name is required.';
      else finalCategory = catInputValue.trim();
    } else {
      finalCategory = catSelectValue;
    }

    if (currentBrands.length === 0) newErrors.brands = 'At least one brand is required.';
    
    if (entityType === 'Site') {
      if (!technicianName.trim()) newErrors.technicianName = 'Technician name required.';
      if (!technicianPhone.trim() || technicianPhone.length !== 10) newErrors.technicianPhone = 'Valid phone required.';
    }

    if (Object.keys(newErrors).length > 0) { setErrors(prev => ({ ...prev, ...newErrors })); return; }
    if (interests.some(item => item.category.toLowerCase() === finalCategory.toLowerCase())) {
      toast.error(`Interest for category "${finalCategory}" already exists.`);
      return;
    }

    const newInterestItem: InterestItem = {
      category: finalCategory,
      newCategory: catSelectValue === 'ADD_NEW' ? finalCategory : undefined,
      brands: currentBrands,
      ...(entityType === 'Site' ? { technicianName: technicianName.trim(), technicianPhone: technicianPhone.trim() } : {})
    };

    if (catSelectValue === 'ADD_NEW' && !availableCategories.includes(finalCategory)) {
        // If adding new, temporarily add to list so they can see it if they add another entry
        setAvailableCategories(prev => [...prev, finalCategory].sort());
        if (onAddCategory) onAddCategory(finalCategory);
    }

    setInterests(prev => [...prev, newInterestItem]);
    resetCurrentInterestEntry();
    toast.success(`Interest added.`);
  };

  const handleRemoveInterestItem = (index: number) => setInterests(prev => prev.filter((_, i) => i !== index));

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = `${nameLabel} is required`;
    if (!formData.ownerName.trim()) newErrors.ownerName = `${ownerLabel} is required`;
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (panVatMode === 'required' && !formData.panVat.trim()) newErrors.panVat = 'PAN/VAT number is required';
    else if (formData.panVat.trim() && formData.panVat.length > 14) newErrors.panVat = 'PAN/VAT must be 14 characters or less';
    if (descriptionMode === 'required' && !formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (formData.phone.length !== 10) newErrors.phone = 'Phone number must be 10 digits';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (isNaN(Number(formData.latitude))) newErrors.latitude = 'Invalid latitude';
    if (isNaN(Number(formData.longitude))) newErrors.longitude = 'Invalid longitude';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    if (!validate()) { toast.error("Please fix form errors"); return; }
    if (showInterestSection && !isInterestCollapsed && (catSelectValue || currentBrands.length > 0)) {
        toast.error('You have unsaved interest details. Please click "Add Interest Entry" or clear fields.');
        return;
    }
    setIsSaving(true);
    const updatedData: EditEntityData = {
      ...formData,
      dateJoined: formData.dateJoined,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      prospectInterest: showInterestSection ? interests : undefined
    };
    try { await onSave(updatedData); onClose(); }
    catch (error) { console.error("Save error", error); toast.error("Failed to save changes"); setIsSaving(false); }
  };

  if (!isOpen) return null;
  const readOnlyFieldClass = "w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-900 border-gray-300 min-h-[42px]";
  const inputClass = (name: string) => `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[name] ? 'border-red-500' : 'border-gray-300'}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 pointer-events-none" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto" style={{ zIndex: 10000 }}>
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            
            {/* ... General Details Fields (Name, Owner, Date, Pan, Phone, Email, Map, Address) ... */}
            {/* (Assuming these are the same as before, condensed for brevity) */}
            <div className="md:col-span-2 pb-2 border-b border-gray-200"><h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><UserIcon className="w-5 h-5 text-blue-600" /> General Details</h3></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">{nameLabel} <span className="text-red-500">*</span></label><input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass('name')} placeholder={`Enter ${nameLabel.toLowerCase()}`} />{errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}</div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">{ownerLabel} <span className="text-red-500">*</span></label><input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} className={inputClass('ownerName')} />{errors.ownerName && <p className="mt-1 text-sm text-red-500">{errors.ownerName}</p>}</div>
            <div><label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><CalendarDaysIcon className="w-4 h-4 text-gray-500" /> Date Joined</label><p className={readOnlyFieldClass}>{formatDate(formData.dateJoined)}</p></div>
            {panVatMode !== 'hidden' && (<div><label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><IdentificationIcon className="w-4 h-4 text-gray-500" /> PAN/VAT Number {panVatMode === 'required' && <span className="text-red-500">*</span>}</label><input type="text" name="panVat" value={formData.panVat} onChange={handleChange} maxLength={14} className={inputClass('panVat')} />{errors.panVat && <p className="text-red-500 text-sm mt-1">{errors.panVat}</p>}</div>)}
            <div className="md:col-span-2 pt-4 pb-2 mt-4 border-t border-b border-gray-200"><h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><PhoneIcon className="w-5 h-5 text-blue-600" /> Contact Details</h3></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} maxLength={10} className={inputClass('phone')} />{errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}</div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass('email')} />{errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}</div>
            <div className="md:col-span-2 mt-4"><h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><MapPinIcon className="w-5 h-5 text-blue-600" /> Location Map</h3><div className="h-72 rounded-lg" style={{ pointerEvents: 'auto' }}><LocationMap position={mapPosition} onLocationChange={handleMapSync} onAddressGeocoded={handleAddressSync} /></div></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Address <span className="text-red-500">*</span></label><p className={`${readOnlyFieldClass} min-h-[78px]`}>{formData.address || 'N/A'}</p>{errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}</div>
            <div><label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1"><GlobeAltIcon className="w-4 h-4 text-gray-500" /> Latitude</label><p className={readOnlyFieldClass}>{formData.latitude}</p></div>
            <div><label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1"><GlobeAltIcon className="w-4 h-4 text-gray-500" /> Longitude</label><p className={readOnlyFieldClass}>{formData.longitude}</p></div>

            {/* --- INTEREST DETAILS SECTION --- */}
            {showInterestSection && (
              <div className="md:col-span-2 mt-6">
                <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsInterestCollapsed(!isInterestCollapsed)}>
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                      <BriefcaseIcon className="w-5 h-5 text-blue-600"/>
                      {entityType} Interest Details <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">{interests.length}</span>
                    </h3>
                    <button type="button" className="text-gray-500 hover:text-blue-600">
                      {isInterestCollapsed ? <ChevronDownIcon className="h-5 w-5"/> : <PlusIcon className="h-5 w-5 rotate-45"/>}
                    </button>
                  </div>

                  {!isInterestCollapsed && (
                    <div className="space-y-6 pt-2">
                      {/* List of Added Interests */}
                      {interests.length > 0 && (
                        <div className="grid grid-cols-1 gap-3">
                          {interests.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                              <div>
                                <p className="font-bold text-gray-800 text-sm">{item.category}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.brands.map(b => (
                                    <span key={b} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">{b}</span>
                                  ))}
                                </div>
                                {item.technicianName && <p className="text-xs text-gray-500 mt-1">Tech: {item.technicianName} ({item.technicianPhone})</p>}
                              </div>
                              <button type="button" onClick={() => handleRemoveInterestItem(idx)} className="text-red-400 hover:text-red-600 p-1">
                                <TrashIcon className="h-4 w-4"/>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add New Interest Form */}
                      <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                        <h4 className="text-sm font-bold text-blue-600 mb-3 uppercase tracking-wide">Add Interest Details:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* ✅ Category Selection - Populated from props */}
                          <div className="relative">
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1">Category <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <select value={catSelectValue} onChange={handleCategorySelect} className={`${inputClass('category')} appearance-none pr-10`}>
                                <option value="" disabled>Select Category</option>
                                {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                <option value="ADD_NEW" className="font-bold text-blue-600">+ Add New Category</option>
                              </select>
                              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"/>
                            </div>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                          </div>

                          {/* New Category Input */}
                          {isAddingNewCategory && (
                            <div>
                              <label className="text-xs font-semibold text-gray-500 uppercase mb-1">New Category Name <span className="text-red-500">*</span></label>
                              <div className="relative">
                                <input type="text" value={catInputValue} onChange={(e) => setCatInputValue(e.target.value)} className={`mt-0 ${inputClass('newCategory')} pr-8`} placeholder="e.g. Solar" />
                                {catInputValue && (
                                  <button type="button" onClick={handleClearCategoryInput} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <XMarkIcon className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                              {errors.newCategory && <p className="text-red-500 text-xs mt-1">{errors.newCategory}</p>}
                            </div>
                          )}

                          {/* ✅ Brand Multi-Select - Updates based on category */}
                          <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1">Brands <span className="text-red-500">*</span></label>
                            
                            {/* Selected Chips */}
                            {currentBrands.length > 0 && (
                              <div className="mb-2 flex flex-wrap gap-2">
                                {currentBrands.map(brand => (
                                  <span key={brand} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                                    {brand}
                                    <button type="button" onClick={() => removeBrandChip(brand)} className="ml-1 text-blue-600 hover:text-blue-900"><XMarkIcon className="h-3 w-3"/></button>
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="relative">
                              <select value={brandSelectValue} onChange={handleBrandSelect} className={`${inputClass('brands')} appearance-none pr-10 w-full`}>
                                <option value="" disabled>Select Brand to Add...</option>
                                {availableBrands.map(brand => (
                                  <option key={brand} value={brand}>{brand}</option>
                                ))}
                                <option value="ADD_NEW" className="font-bold text-blue-600">+ Add New Brand</option>
                              </select>
                              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"/>
                            </div>
                            {errors.brands && <p className="text-red-500 text-xs mt-1">{errors.brands}</p>}
                          </div>

                          {/* Brand Input - Input Column */}
                          {isAddingNewBrand && (
                            <div className="md:col-span-2">
                              <label className="text-xs font-semibold text-gray-500 uppercase mb-1">New Brand Name <span className="text-red-500">*</span></label>
                              <div className="flex gap-2">
                                <div className="relative flex-1">
                                  <input type="text" value={brandInputValue} onChange={(e) => setBrandInputValue(e.target.value)} className={`${inputClass('brands')} pr-8`} placeholder="Type new brand name..." autoFocus />
                                  {brandInputValue && (<button type="button" onClick={handleClearBrandInput} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"><XMarkIcon className="h-4 w-4" /></button>)}
                                </div>
                                <Button type="button" onClick={handleAddCustomBrand} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</Button>
                                <button type="button" onClick={handleCancelCustomBrand} className="p-2 text-gray-500 hover:text-gray-700" title="Cancel"><XMarkIcon className="h-5 w-5" /></button>
                              </div>
                            </div>
                          )}

                          {/* Site Specifics */}
                          {entityType === 'Site' && (
                            <div className="md:col-span-2 mt-2">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1">Technician Name</label><input type="text" value={technicianName} onChange={(e) => setTechnicianName(e.target.value)} className={`mt-0 ${inputClass('technicianName')}`} />{errors.technicianName && <p className="text-red-500 text-xs mt-1">{errors.technicianName}</p>}</div>
                                <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1">Technician Phone</label><input type="tel" value={technicianPhone} onChange={(e) => setTechnicianPhone(e.target.value.replace(/[^0-9]/g, '').slice(0,10))} maxLength={10} className={`mt-0 ${inputClass('technicianPhone')}`} />{errors.technicianPhone && <p className="text-red-500 text-xs mt-1">{errors.technicianPhone}</p>}</div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button type="button" className="py-1 px-3 text-sm bg-blue-600 text-white hover:bg-blue-700" onClick={handleAddInterestEntry}>
                            <PlusIcon className="h-4 w-4 mr-1"/> Add Interest Entry
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {descriptionMode !== 'hidden' && (
              <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2"><DocumentTextIcon className="w-5 h-5 text-blue-600" /> Description</h3>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4 mt-6 border-t border-gray-200">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving} className="py-1.5 px-4 text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">Cancel</Button>
            <Button type="submit" variant="primary" disabled={isSaving} className="py-1.5 px-4 text-sm">{isSaving ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEntityModal;