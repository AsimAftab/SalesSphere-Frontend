import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
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
  BuildingOfficeIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { LocationMap } from '../maps/LocationMap';
import Button from '../UI/Button/Button';
import toast from 'react-hot-toast';
import { type ProspectCategoryData } from '../../api/prospectService';

// --- Types ---

export type EntityType = 'Party' | 'Prospect' | 'Site';

export interface Technician {
  name: string;
  phone: string;
}

export interface InterestItem {
  category: string;
  newCategory?: string;
  brands: string[];
  technicians?: Technician[];
}

export interface EditEntityData {
  name: string;
  ownerName: string;
  dateJoined: string;
  subOrgName?: string;
  address: string;
  description?: string;
  latitude: number;
  longitude: number;
  email: string;
  phone: string;
  panVat?: string;
  // Allow all naming conventions
  prospectInterest?: InterestItem[];
  siteInterest?: InterestItem[]; 
  interest?: InterestItem[];
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
  categoriesData?: ProspectCategoryData[];
  subOrgsList?: string[];
  onAddCategory?: (newCategory: string) => void;
  onAddBrand?: (newBrand: string) => void;
  onAddSubOrg?: (newSubOrg: string) => void;
}

interface FormData {
  name: string;
  ownerName: string;
  subOrgName: string;
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

const hasValidCoordinates = (lat?: number, lng?: number) => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat !== 0 &&
    lng !== 0
  );
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
  categoriesData = [],
  subOrgsList = [],
  onAddCategory,
  onAddBrand,
  onAddSubOrg
}) => {
  const defaultPosition = { lat: 27.7172, lng: 85.324 };

  const mapInitialToFormData = (data: EditEntityData): FormData => {
  const validCoords = hasValidCoordinates(data.latitude, data.longitude);

  return {
    name: data.name ?? '',
    ownerName: data.ownerName ?? '',
    subOrgName: data.subOrgName ?? '',
    dateJoined: data.dateJoined ?? '',
    address: data.address ?? '',
    description: data.description ?? '',
    latitude: validCoords ? data.latitude : defaultPosition.lat,
    longitude: validCoords ? data.longitude : defaultPosition.lng,
    email: data.email ?? '',
    phone: (data.phone ?? '').replace(/[^0-9]/g, ''),
    panVat: data.panVat ?? '',
  };
};


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
  
  // Sub Organization Dropdown State
  const [availableSubOrgs, setAvailableSubOrgs] = useState<string[]>([]);
  const [subOrgSelectValue, setSubOrgSelectValue] = useState('');
  const [subOrgInputValue, setSubOrgInputValue] = useState('');
  const isAddingNewSubOrg = subOrgSelectValue === 'ADD_NEW';

  // Current Entry Form State
  const [catSelectValue, setCatSelectValue] = useState('');
  const [catInputValue, setCatInputValue] = useState('');
  const [currentBrands, setCurrentBrands] = useState<string[]>([]);
  const [brandSelectValue, setBrandSelectValue] = useState('');
  const [brandInputValue, setBrandInputValue] = useState('');
  
  // Multiple Technicians State
  const [currentTechnicians, setCurrentTechnicians] = useState<Technician[]>([]);
  const [techNameInput, setTechNameInput] = useState('');
  const [techPhoneInput, setTechPhoneInput] = useState('');

  const showInterestSection = ['Prospect', 'Site'].includes(entityType);
  const isAddingNewCategory = catSelectValue === 'ADD_NEW';
  const isAddingNewBrand = brandSelectValue === 'ADD_NEW';

  const resetCurrentInterestEntry = () => {
    setCatSelectValue('');
    setCatInputValue('');
    setCurrentBrands([]);
    setBrandSelectValue('');
    setBrandInputValue('');
    setCurrentTechnicians([]);
    setTechNameInput('');
    setTechPhoneInput('');
    setAvailableBrands([]); 
    setErrors({});
  };

  // ✅ INITIALIZATION LOGIC (CRITICAL FIX HERE)
  useEffect(() => {
    if (isOpen) {
      const mapped = mapInitialToFormData(initialData);
      setFormData(mapped);
      const validCoords = hasValidCoordinates(
      initialData.latitude,
      initialData.longitude
    );

    setMapPosition(
      validCoords
        ? { lat: mapped.latitude, lng: mapped.longitude }
        : defaultPosition
    );

      
      // Select correct data source
      let loadedInterests: InterestItem[] = [];
      if (entityType === 'Site') {
          loadedInterests = initialData.siteInterest || [];
      } else {
          // Check both keys for prospects
          loadedInterests = initialData.prospectInterest || initialData.interest || [];
      }
      
      setInterests(loadedInterests);
      
      // Auto-open if data exists
      if (loadedInterests.length > 0) {
          setIsInterestCollapsed(false);
      } else {
          setIsInterestCollapsed(true);
      }
      
      const catNames = categoriesData.map(c => c.name).sort();
      setAvailableCategories(catNames);
      setAvailableBrands([]);

      
      if (mapped.subOrgName) {
         setSubOrgSelectValue(mapped.subOrgName);
         setAvailableSubOrgs(() => {
            const list = subOrgsList ? [...subOrgsList] : [];
            if (!list.includes(mapped.subOrgName!)) {
                list.push(mapped.subOrgName!);
            }
            return list.sort();
         });
      } else {
         setSubOrgSelectValue('');
         if (subOrgsList) setAvailableSubOrgs([...subOrgsList].sort());
      }

      resetCurrentInterestEntry();
      setErrors({});
      setIsSaving(false);
    }
    
  }, [isOpen]); 

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

  // Sub Organization Handlers
  const handleSubOrgSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSubOrgSelectValue(val);
    
    if (val === 'ADD_NEW') {
      setSubOrgInputValue('');
      setFormData(prev => ({ ...prev, subOrgName: '' })); 
    } else {
      setFormData(prev => ({ ...prev, subOrgName: val })); 
    }
    if (errors.subOrgName) setErrors(prev => ({ ...prev, subOrgName: '' }));
  };

  const handleSubOrgInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSubOrgInputValue(val);
    setFormData(prev => ({ ...prev, subOrgName: val }));
  };

  const handleClearSubOrgInput = () => {
    setSubOrgInputValue('');
    setFormData(prev => ({ ...prev, subOrgName: '' }));
  };

  // --- INTEREST HANDLERS ---
  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCatSelectValue(val);
    setBrandSelectValue('');
    setCurrentBrands([]); 
    
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

  // Multiple Technician Handlers
  const handleAddTechnician = () => {
    if (!techNameInput.trim()) { toast.error('Technician name is required'); return; }
    if (!techPhoneInput.trim() || techPhoneInput.length !== 10) { toast.error('Valid 10-digit phone is required'); return; }

    const newTech: Technician = { name: techNameInput.trim(), phone: techPhoneInput.trim() };
    setCurrentTechnicians(prev => [...prev, newTech]);
    setTechNameInput('');
    setTechPhoneInput('');
    if (errors.technicians) setErrors(prev => ({ ...prev, technicians: '' }));
  };

  const handleRemoveTechnician = (index: number) => {
    setCurrentTechnicians(prev => prev.filter((_, i) => i !== index));
  };

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
    
    if (Object.keys(newErrors).length > 0) { setErrors(prev => ({ ...prev, ...newErrors })); return; }
    
    if (interests.some(item => item.category.toLowerCase() === finalCategory.toLowerCase())) {
      toast.error(`Interest for category "${finalCategory}" already exists.`);
      return;
    }

    const newInterestItem: InterestItem = {
      category: finalCategory,
      newCategory: catSelectValue === 'ADD_NEW' ? finalCategory : undefined,
      brands: currentBrands,
      ...(entityType === 'Site' ? { technicians: currentTechnicians } : {})
    };

    if (catSelectValue === 'ADD_NEW' && !availableCategories.includes(finalCategory)) {
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
    
    if (entityType === 'Site' && isAddingNewSubOrg && !formData.subOrgName.trim()) {
       newErrors.subOrgName = 'Sub Organization name is required when adding new';
    }

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
    
    const isSite = entityType === 'Site';
    
    const updatedData: EditEntityData = {
      ...formData,
      subOrgName: isSite ? formData.subOrgName : undefined,
      dateJoined: formData.dateJoined,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      
      // ✅ Correctly assign interests based on Entity Type
      siteInterest: (showInterestSection && isSite) ? interests : undefined,
      prospectInterest: (showInterestSection && !isSite) ? interests : undefined
    };

    try { 
        await onSave(updatedData); 
        
        if (entityType === 'Site' && isAddingNewSubOrg && formData.subOrgName && onAddSubOrg) {
            onAddSubOrg(formData.subOrgName);
        }

        onClose(); 
    }
    catch (error) { console.error("Save error", error); toast.error("Failed to save changes"); setIsSaving(false); }
  };

  if (!isOpen) return null;
  const readOnlyFieldClass = "w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-900 border-gray-300 min-h-[42px]";
  const inputClass = (name: string) => `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[name] ? 'border-red-500' : 'border-gray-300'}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 pointer-events-none" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto" style={{ zIndex: 10000 }}>
        <div className="flex justify-between items-center p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            
            <div className="md:col-span-2 pb-2 border-b border-gray-200"><h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><UserIcon className="w-5 h-5 text-blue-600" /> General Details</h3></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">{nameLabel} <span className="text-red-500">*</span></label><input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass('name')} placeholder={`Enter ${nameLabel.toLowerCase()}`} />{errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}</div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">{ownerLabel} <span className="text-red-500">*</span></label><input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} className={inputClass('ownerName')} />{errors.ownerName && <p className="mt-1 text-sm text-red-500">{errors.ownerName}</p>}</div>
            <div><label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><CalendarDaysIcon className="w-4 h-4 text-gray-500" /> Date Joined</label><p className={readOnlyFieldClass}>{formatDate(formData.dateJoined)}</p></div>
            
            {entityType === 'Site' ? (
               <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <BuildingOfficeIcon className="w-4 h-4 text-gray-500"/>
                  Sub Organization Name
                </label>
                <div className="relative">
                  <select value={subOrgSelectValue} onChange={handleSubOrgSelect} className={`${inputClass('subOrgName')} appearance-none pr-10`} disabled={isSaving}>
                    <option value="">Select Sub Organization...</option>
                    {availableSubOrgs.map((org) => (
                      <option key={org} value={org}>{org}</option>
                    ))}
                    <option value="ADD_NEW" className="font-bold text-secondary">+ Add New Sub Org</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"/>
                </div>
                {isAddingNewSubOrg && (
                  <div className="relative mt-2">
                     <input type="text" value={subOrgInputValue} onChange={handleSubOrgInputChange} className={inputClass('subOrgName')} placeholder="Enter new sub organization name" disabled={isSaving} autoFocus />
                    {subOrgInputValue && (
                      <button type="button" onClick={handleClearSubOrgInput} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
                {errors.subOrgName && <p className="text-red-500 text-sm mt-1">{errors.subOrgName}</p>}
              </div>
            ) : (
                panVatMode !== 'hidden' && (<div><label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><IdentificationIcon className="w-4 h-4 text-gray-500" /> PAN/VAT Number {panVatMode === 'required' && <span className="text-red-500">*</span>}</label><input type="text" name="panVat" value={formData.panVat} onChange={handleChange} maxLength={14} className={inputClass('panVat')} />{errors.panVat && <p className="text-red-500 text-sm mt-1">{errors.panVat}</p>}</div>)
            )}

            {entityType === 'Site' && panVatMode !== 'hidden' && (
                <div><label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><IdentificationIcon className="w-4 h-4 text-gray-500" /> PAN/VAT Number {panVatMode === 'required' && <span className="text-red-500">*</span>}</label><input type="text" name="panVat" value={formData.panVat} onChange={handleChange} maxLength={14} className={inputClass('panVat')} />{errors.panVat && <p className="text-red-500 text-sm mt-1">{errors.panVat}</p>}</div>
            )}

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
                      <BriefcaseIcon className="w-5 h-5 text-secondary"/>
                      {entityType} Interest Details <span className="bg-blue-100 text-secondary text-xs font-bold px-2 py-0.5 rounded-full">{interests.length}</span>
                    </h3>
                    <button type="button" className="text-gray-500 hover:text-secondary">
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
                                    <span key={b} className="text-sm bg-blue-50 text-secondary px-2 py-0.5 rounded-full border border-blue-100">{b}</span>
                                  ))}
                                </div>
                                {item.technicians && item.technicians.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    {item.technicians.map((tech, tIdx) => (
                                        <p key={tIdx} className="text-xs text-gray-500 flex items-center gap-1">
                                            <UsersIcon className="w-3 h-3"/> {tech.name} ({tech.phone})
                                        </p>
                                    ))}
                                  </div>
                                )}
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
                        <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Add Interest Details:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Category Selection */}
                          <div className="relative">
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1">Category <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <select value={catSelectValue} onChange={handleCategorySelect} className={`${inputClass('category')} appearance-none pr-10`}>
                                <option value="" disabled>Select Category</option>
                                {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                <option value="ADD_NEW" className="font-bold text-secondary">+ Add New Category</option>
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

                          {/* Brand Multi-Select */}
                          <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1">Brands <span className="text-red-500">*</span></label>
                            {currentBrands.length > 0 && (
                              <div className="mb-2 flex flex-wrap gap-2">
                                {currentBrands.map(brand => (
                                  <span key={brand} className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-blue-100 text-secondary">
                                    {brand}
                                    <button type="button" onClick={() => removeBrandChip(brand)} className="ml-1 text-blue-600 hover:text-secondary"><XMarkIcon className="h-3 w-3"/></button>
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
                                <option value="ADD_NEW" className="font-bold text-secondary">+ Add New Brand</option>
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
                                  {brandInputValue && (<button type="button" onClick={handleClearBrandInput} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary"><XMarkIcon className="h-4 w-4" /></button>)}
                                </div>
                                <Button type="button" onClick={handleAddCustomBrand} className="px-3 py-1.5 text-sm bg-secondary text-white rounded-lg hover:bg-secondary">Add</Button>
                                <button type="button" onClick={handleCancelCustomBrand} className="p-2 text-gray-500 hover:text-gray-700" title="Cancel"><XMarkIcon className="h-5 w-5" /></button>
                              </div>
                            </div>
                          )}

                          {/* Site Specifics: Multiple Technicians */}
                          {entityType === 'Site' && (
                            <div className="md:col-span-2 mt-2 pt-2 border-t border-dashed border-gray-300">
                              <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">Technicians</label>
                              {currentTechnicians.length > 0 && (
                                <div className="mb-3 flex flex-wrap gap-2">
                                    {currentTechnicians.map((tech, i) => (
                                        <div key={i} className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-green-50 text-green-700 border border-green-200">
                                            <UsersIcon className="w-3 h-3 mr-1"/>
                                            <span className="font-medium mr-1">{tech.name}</span>
                                            <span className="text-xs text-green-600">({tech.phone})</span>
                                            <button type="button" onClick={() => handleRemoveTechnician(i)} className="ml-2 text-green-500 hover:text-green-800"><XMarkIcon className="h-3 w-3"/></button>
                                        </div>
                                    ))}
                                </div>
                              )}
                              <div className="flex flex-col sm:flex-row gap-2 items-end">
                                <div className="flex-1 w-full">
                                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1">Name</label>
                                  <input type="text" value={techNameInput} onChange={(e) => setTechNameInput(e.target.value)} className={`mt-0 ${inputClass('technicianName')}`} placeholder="Technician Name" />
                                </div>
                                <div className="flex-1 w-full">
                                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1">Phone</label>
                                  <input type="tel" value={techPhoneInput} onChange={(e) => setTechPhoneInput(e.target.value.replace(/[^0-9]/g, '').slice(0,10))} maxLength={10} className={`mt-0 ${inputClass('technicianPhone')}`} placeholder="Technician Phone" />
                                </div>
                                <Button type="button" onClick={handleAddTechnician} className="px-4 py-2 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-700 whitespace-nowrap"><PlusIcon className="h-4 w-4"/> Add Tech</Button>
                              </div>
                              {errors.technicians && <p className="text-red-500 text-xs mt-1">{errors.technicians}</p>}
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button type="button" className="py-1 px-3 text-sm bg-secondary text-white hover:bg-secondary" onClick={handleAddInterestEntry}>
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