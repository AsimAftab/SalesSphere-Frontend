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
  ChevronDownIcon,
  TrashIcon,
  BuildingOfficeIcon,
  UsersIcon,
  PencilSquareIcon
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
  partyType?: string; 
  address: string;
  description?: string;
  latitude: number;
  longitude: number;
  email: string;
  phone: string;
  panVat?: string;
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
  partyTypesList?: string[]; 
  onAddCategory?: (newCategory: string) => void;
  onAddBrand?: (newBrand: string) => void;
  onAddSubOrg?: (newSubOrg: string) => void;
  onAddPartyType?: (newType: string) => void;
}

interface FormData {
  name: string;
  ownerName: string;
  subOrgName: string;
  partyType: string;
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
  return typeof lat === 'number' && typeof lng === 'number' && lat !== 0 && lng !== 0;
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
  partyTypesList = [], 
  onAddCategory,
  onAddBrand,
  onAddSubOrg,
  onAddPartyType 
}) => {
  const defaultPosition = { lat: 27.7172, lng: 85.324 };

  const mapInitialToFormData = (data: EditEntityData): FormData => {
    const validCoords = hasValidCoordinates(data.latitude, data.longitude);
    return {
      name: data.name ?? '',
      ownerName: data.ownerName ?? '',
      subOrgName: data.subOrgName ?? '',
      partyType: data.partyType ?? '',
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

  // --- INTEREST STATE ---
  const [interests, setInterests] = useState<InterestItem[]>([]);
  const [isInterestCollapsed, setIsInterestCollapsed] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  
  const [subOrgSelectValue, setSubOrgSelectValue] = useState('');
  const [subOrgInputValue, setSubOrgInputValue] = useState('');
  const isAddingNewSubOrg = subOrgSelectValue === 'ADD_NEW';

  const [partyTypeSelectValue, setPartyTypeSelectValue] = useState('');
  const [partyTypeInputValue, setPartyTypeInputValue] = useState('');
  const isAddingNewPartyType = partyTypeSelectValue === 'ADD_NEW';

  const [catSelectValue, setCatSelectValue] = useState('');
  const [catInputValue, setCatInputValue] = useState('');
  const [currentBrands, setCurrentBrands] = useState<string[]>([]);
  const [brandSelectValue, setBrandSelectValue] = useState('');
  const [brandInputValue, setBrandInputValue] = useState('');
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
    setEditingIndex(null);
    setErrors({});
  };

  // ✅ FIX: The effect now only triggers when the modal OPENS. 
  // Removing initialData from dependencies stops the form from resetting while you type.
  useEffect(() => {
    if (!isOpen) return;

    const mapped = mapInitialToFormData(initialData);
    setFormData(mapped);

    const validCoords = hasValidCoordinates(initialData.latitude, initialData.longitude);
    setMapPosition(
      validCoords
        ? { lat: mapped.latitude, lng: mapped.longitude }
        : defaultPosition
    );

    const loadedInterests =
      entityType === 'Site'
        ? initialData.siteInterest || []
        : initialData.prospectInterest || initialData.interest || [];

    setInterests(loadedInterests);
    setIsInterestCollapsed(loadedInterests.length === 0);
    setAvailableCategories(categoriesData.map(c => c.name).sort());

    setSubOrgSelectValue(mapped.subOrgName || '');
    setPartyTypeSelectValue(mapped.partyType || '');

    resetCurrentInterestEntry();
  }, [isOpen]); // Only trigger when modal opens

  const derivedSubOrgs = React.useMemo(() => {
    const list = subOrgsList ? [...subOrgsList] : [];
    if (formData.subOrgName && !list.includes(formData.subOrgName)) {
      list.push(formData.subOrgName);
    }
    return list.sort();
  }, [subOrgsList, formData.subOrgName]);

  const derivedPartyTypes = React.useMemo(() => {
    const list = partyTypesList ? [...partyTypesList] : [];
    if (formData.partyType && !list.includes(formData.partyType)) {
      list.push(formData.partyType);
    }
    return list.sort();
  }, [partyTypesList, formData.partyType]);


  // --- HANDLERS ---
  const handleMapSync = (location: { lat: number; lng: number }) => {
    setFormData(prev => ({ ...prev, latitude: location.lat, longitude: location.lng }));
    setMapPosition(location);
  };

  const handleAddressSync = (address: string) => {
    setFormData(prev => ({ ...prev, address }));
    if (errors.address) setErrors(prev => ({ ...prev, address: '' }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target;
    if (name === 'phone') value = value.replace(/[^0-9]/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubOrgSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSubOrgSelectValue(val);
    if (val === 'ADD_NEW') {
      setSubOrgInputValue('');
      setFormData(prev => ({ ...prev, subOrgName: '' }));
    } else {
      setFormData(prev => ({ ...prev, subOrgName: val }));
    }
  };

  const handleSubOrgInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubOrgInputValue(e.target.value);
    setFormData(prev => ({ ...prev, subOrgName: e.target.value }));
  };

  const handleClearSubOrgInput = () => {
    setSubOrgInputValue('');
    setFormData(prev => ({ ...prev, subOrgName: '' }));
  };

  const handlePartyTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setPartyTypeSelectValue(val);
    if (val === 'ADD_NEW') {
      setPartyTypeInputValue('');
      setFormData(prev => ({ ...prev, partyType: '' }));
    } else {
      setFormData(prev => ({ ...prev, partyType: val }));
    }
    if (errors.partyType) setErrors(prev => ({ ...prev, partyType: '' }));
  };

  const handlePartyTypeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPartyTypeInputValue(e.target.value);
    setFormData(prev => ({ ...prev, partyType: e.target.value }));
    if (errors.partyType) setErrors(prev => ({ ...prev, partyType: '' }));
  };

  const handleClearPartyTypeInput = () => {
    setPartyTypeInputValue('');
    setFormData(prev => ({ ...prev, partyType: '' }));
  };

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCatSelectValue(val);
    setBrandSelectValue('');
    setCurrentBrands([]);
    const selectedCatData = categoriesData.find(c => c.name === val);
    setAvailableBrands(selectedCatData?.brands ? [...selectedCatData.brands].sort() : []);
    if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
  };

  const handleEditInterestItem = (index: number) => {
    const item = interests[index];
    setEditingIndex(index);
    setCatSelectValue(item.category);
    setCatInputValue('');
    const selectedCatData = categoriesData.find(c => c.name === item.category);
    setAvailableBrands(selectedCatData?.brands || []);
    setCurrentBrands([...item.brands]);
    setCurrentTechnicians(item.technicians || []);
  };


  const handleBrandSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setBrandSelectValue(val);
    if (val && val !== 'ADD_NEW') {
      if (!currentBrands.includes(val)) {
        setCurrentBrands(prev => [...prev, val]);
        setBrandSelectValue('');
      } else {
        toast.error('Brand already added');
        setBrandSelectValue('');
      }
    }
  };

  const handleAddCustomBrand = () => {
    const trimmed = brandInputValue.trim();
    if (!trimmed || currentBrands.includes(trimmed)) return;
    setCurrentBrands(prev => [...prev, trimmed]);
    if (!availableBrands.includes(trimmed)) {
      setAvailableBrands(prev => [...prev, trimmed].sort());
      if (onAddBrand) onAddBrand(trimmed);
    }
    setBrandInputValue('');
    setBrandSelectValue('');
  };

  const removeBrandChip = (brandToRemove: string) => {
    setCurrentBrands(prev => prev.filter(b => b !== brandToRemove));
  };

  const handleAddTechnician = () => {
    if (!techNameInput.trim() || techPhoneInput.length !== 10) {
      toast.error('Valid Name and 10-digit phone required');
      return;
    }
    setCurrentTechnicians(prev => [...prev, { name: techNameInput.trim(), phone: techPhoneInput.trim() }]);
    setTechNameInput('');
    setTechPhoneInput('');
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

    if (interests.some((item, idx) => idx !== editingIndex && item.category.toLowerCase() === finalCategory.toLowerCase())) {
      toast.error(`Interest for category "${finalCategory}" already exists.`);
      return;
    }

    const newInterestItem: InterestItem = {
      category: finalCategory,
      newCategory: catSelectValue === 'ADD_NEW' ? finalCategory : undefined,
      brands: currentBrands,
      ...(entityType === 'Site' ? { technicians: currentTechnicians } : {})
    };

    if (editingIndex !== null) {
      const updated = [...interests];
      updated[editingIndex] = newInterestItem;
      setInterests(updated);
      toast.success('Interest updated.');
    } else {
      setInterests(prev => [...prev, newInterestItem]);
      toast.success('Interest added.');
    }

    if (catSelectValue === 'ADD_NEW' && onAddCategory) onAddCategory(finalCategory);
    resetCurrentInterestEntry();
  };

  const handleRemoveInterestItem = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setInterests(prev => prev.filter((_, i) => i !== index));
    if (editingIndex === index) resetCurrentInterestEntry();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    if (entityType === 'Party' && !formData.partyType.trim()) {
      setErrors(prev => ({ ...prev, partyType: 'Party Type is required' }));
      toast.error('Party Type is required');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        subOrgName: entityType === 'Site' ? formData.subOrgName : undefined,
        partyType: entityType === 'Party' ? formData.partyType : undefined,
        siteInterest: entityType === 'Site' ? interests : undefined,
        prospectInterest: entityType !== 'Site' ? interests : undefined,
      });

      if (entityType === 'Site' && isAddingNewSubOrg && onAddSubOrg && formData.subOrgName) {
        onAddSubOrg(formData.subOrgName);
      }
      if (entityType === 'Party' && isAddingNewPartyType && onAddPartyType && formData.partyType) {
        onAddPartyType(formData.partyType);
      }

      onClose();
    } catch (error) { setIsSaving(false); }
  };

  if (!isOpen) return null;
  const inputClass = (name: string) => `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[name] ? 'border-red-500' : 'border-gray-300'}`;
  const readOnlyFieldClass = "w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-900 border-gray-300 min-h-[42px]";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div className="md:col-span-2 pb-2 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-blue-600" /> General Details
              </h3>
            </div>
            
            <div><label className="block text-sm font-medium text-gray-700 mb-2">{nameLabel} *</label><input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass('name')} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">{ownerLabel} *</label><input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} className={inputClass('ownerName')} /></div>
            <div><label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><CalendarDaysIcon className="w-4 h-4 text-gray-500" /> Date Joined</label><p className={readOnlyFieldClass}>{formatDate(formData.dateJoined)}</p></div>
            
            {entityType === 'Site' && (
               <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><BuildingOfficeIcon className="w-4 h-4 text-gray-500" /> Sub Organization Name</label>
                <div className="relative">
                  <select value={subOrgSelectValue} onChange={handleSubOrgSelect} className={`${inputClass('subOrgName')} appearance-none pr-10`}>
                    <option value="" disabled>Select Sub Organization...</option>
                    {derivedSubOrgs.map((org) => <option key={org} value={org}>{org}</option>)}
                    <option value="ADD_NEW">+ Add New Sub Org</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"/>
                </div>
                {isAddingNewSubOrg && (
                  <div className="relative mt-2">
                    <input type="text" value={subOrgInputValue} onChange={handleSubOrgInputChange} className={inputClass('subOrgName')} placeholder="New Sub Org Name" />
                    {subOrgInputValue && <button type="button" onClick={handleClearSubOrgInput} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"><XMarkIcon className="h-4 w-4" /></button>}
                  </div>
                )}
              </div>
            )}

            {entityType === 'Party' && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <BriefcaseIcon className="w-4 h-4 text-gray-500"/> 
                  Party Type *
                </label>
                <div className="relative">
                  <select value={partyTypeSelectValue} onChange={handlePartyTypeSelect} className={`${inputClass('partyType')} appearance-none pr-10`}>
                    <option value="" disabled>Select Party Type</option>
                    {derivedPartyTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                    <option value="ADD_NEW">+ Add New Party Type</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"/>
                </div>
              </div>
            )}

            {entityType === 'Party' && isAddingNewPartyType && (
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">New Party Type *</label>
                <div className="relative">
                  <input type="text" value={partyTypeInputValue} onChange={handlePartyTypeInputChange} className={inputClass('partyType')} placeholder="New Party Type" autoFocus />
                  {partyTypeInputValue && (
                    <button type="button" onClick={handleClearPartyTypeInput} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {panVatMode !== 'hidden' && (
               <div><label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><IdentificationIcon className="w-4 h-4 text-gray-500" /> PAN/VAT Number {panVatMode === 'required' && "*"}</label><input type="text" name="panVat" value={formData.panVat} onChange={handleChange} maxLength={14} className={inputClass('panVat')} /></div>
            )}

            <div className="md:col-span-2 pt-4 pb-2 border-t border-b border-gray-200"><h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><PhoneIcon className="w-5 h-5 text-blue-600" /> Contact Details</h3></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} maxLength={10} className={inputClass('phone')} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass('email')} /></div>

            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><MapPinIcon className="w-5 h-5 text-blue-600" /> Location Map</h3>
              <div className="h-72 rounded-lg"><LocationMap position={mapPosition} onLocationChange={handleMapSync} onAddressGeocoded={handleAddressSync} /></div>
            </div>
            
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Address *</label><p className={`${readOnlyFieldClass} min-h-[78px]`}>{formData.address || 'N/A'}</p></div>
            <div><label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1"><GlobeAltIcon className="w-4 h-4 text-gray-500"/> Latitude</label><p className={readOnlyFieldClass}>{formData.latitude}</p></div>
            <div><label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1"><GlobeAltIcon className="w-4 h-4 text-gray-500"/> Longitude</label><p className={readOnlyFieldClass}>{formData.longitude}</p></div>

            {showInterestSection && (
              <div className="md:col-span-2 mt-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsInterestCollapsed(!isInterestCollapsed)}>
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800"><BriefcaseIcon className="w-5 h-5 text-secondary"/> {entityType} Interests <span className="bg-blue-100 text-secondary text-xs px-2 py-0.5 rounded-full">{interests.length}</span></h3>
                    <ChevronDownIcon className={`h-5 w-5 transition-transform ${isInterestCollapsed ? '' : 'rotate-180'}`}/>
                  </div>

                  {!isInterestCollapsed && (
                    <div className="space-y-6 pt-4">
                      <div className="grid grid-cols-1 gap-3">
                        {interests.map((item, idx) => (
                          <div key={idx} onClick={() => handleEditInterestItem(idx)} className={`flex justify-between items-start p-3 rounded-lg border cursor-pointer transition-all ${editingIndex === idx ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-400' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-gray-800 text-sm">{item.category}</p>
                                {editingIndex === idx && <span className="text-[10px] text-blue-600 font-bold uppercase">(Editing)</span>}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">{item.brands.map(b => <span key={b} className="text-xs bg-blue-50 text-secondary px-2 py-0.5 rounded-full border border-blue-100">{b}</span>)}</div>
                              {item.technicians?.map((tech, tIdx) => (
                                <p key={tIdx} className="text-xs text-gray-500 flex items-center gap-1 mt-1"><UsersIcon className="w-3 h-3"/> {tech.name} ({tech.phone})</p>
                              ))}
                            </div>
                            <div className="flex gap-2">
                                <PencilSquareIcon className="h-4 w-4 text-blue-400" />
                                <button type="button" onClick={(e) => handleRemoveInterestItem(e, idx)} className="text-red-400 hover:text-red-600"><TrashIcon className="h-4 w-4"/></button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 rounded-lg border-2 border-dashed bg-white border-gray-200">
                        <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">{editingIndex !== null ? 'Modify Interest Entry:' : 'Add Interest Entry:'}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                          <div className="w-full">
                            <label className="text-xs font-semibold text-gray-500 uppercase">Category *</label>
                            <div className="relative">
                              <select value={catSelectValue} onChange={handleCategorySelect} disabled={editingIndex !== null} className={`${inputClass('category')} appearance-none pr-10`}>
                                <option value="" disabled>Select Category</option>
                                {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                <option value="ADD_NEW">+ Add New Category</option>
                              </select>
                              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"/>
                            </div>
                          </div>

                          {isAddingNewCategory && (
                            <div className="w-full">
                              <label className="text-xs font-semibold text-gray-500 uppercase">New Category Name *</label>
                              <input type="text" value={catInputValue} onChange={(e) => setCatInputValue(e.target.value)} className={inputClass('newCategory')} placeholder="Enter category name" />
                            </div>
                          )}

                          <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase">Brands *</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {currentBrands.map(brand => (
                                <span key={brand} className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-blue-100 text-secondary">{brand}<button type="button" onClick={() => removeBrandChip(brand)} className="ml-1"><XMarkIcon className="h-3 w-3"/></button></span>
                              ))}
                            </div>
                            <div className="relative">
                              <select value={brandSelectValue} onChange={handleBrandSelect} className={`${inputClass('brands')} appearance-none pr-10`}>
                                <option value="" disabled>Select Brand to Add...</option>
                                {availableBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                                <option value="ADD_NEW">+ Add New Brand</option>
                              </select>
                              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"/>
                            </div>
                            {isAddingNewBrand && <div className="mt-2 flex gap-2"><input type="text" value={brandInputValue} onChange={(e) => setBrandInputValue(e.target.value)} className={inputClass('brands')} placeholder="Brand Name" /><Button type="button" onClick={handleAddCustomBrand}>Add</Button></div>}
                          </div>

                          {entityType === 'Site' && (
                            <div className="md:col-span-2 pt-2 border-t border-dashed">
                              <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">Technicians</label>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {currentTechnicians.map((tech, i) => (
                                  <div key={i} className="text-xs bg-green-50 text-green-700 p-1 px-2 rounded-md border border-green-100 flex items-center gap-1">{tech.name}<button type="button" onClick={() => handleRemoveTechnician(i)}><XMarkIcon className="h-3 w-3"/></button></div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <input type="text" value={techNameInput} onChange={(e) => setTechNameInput(e.target.value)} className={inputClass('techName')} placeholder="Technician Name" />
                                <input type="tel" value={techPhoneInput} onChange={(e) => setTechPhoneInput(e.target.value.replace(/\D/g,''))} maxLength={10} className={inputClass('techPhone')} placeholder="Technician Phone" />
                                <Button type="button" onClick={handleAddTechnician} className="bg-gray-800 text-white">Add</Button>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                          {editingIndex !== null && <Button type="button" variant="ghost" onClick={resetCurrentInterestEntry}>Cancel Edit</Button>}
                          <Button type="button" className="bg-secondary text-white px-6" onClick={handleAddInterestEntry}>{editingIndex !== null ? 'Update Interest Entry' : 'Add Interest Entry'}</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="md:col-span-2 pt-4">
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><DocumentTextIcon className="w-4 h-4 text-gray-500" /> Description {descriptionMode === 'required' && "*"}</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className={inputClass('description')} />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEntityModal;