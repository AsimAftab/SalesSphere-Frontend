import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { type EntityType } from './types';

export const useInterestManagement = (entityType: EntityType, categoriesData: any[]) => {
  const [interests, setInterests] = useState<any[]>([]);
  const [isInterestCollapsed, setIsInterestCollapsed] = useState(true);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // Current Entry Form State
  const [catSelectValue, setCatSelectValue] = useState('');
  const [catInputValue, setCatInputValue] = useState('');
  const [currentBrands, setCurrentBrands] = useState<string[]>([]);
  const [brandSelectValue, setBrandSelectValue] = useState('');
  const [brandInputValue, setBrandInputValue] = useState('');
  const [currentTechnicians, setCurrentTechnicians] = useState<any[]>([]);
  const [techNameInput, setTechNameInput] = useState('');
  const [techPhoneInput, setTechPhoneInput] = useState('');

  const resetInterestState = () => {
    setInterests([]);
    setIsInterestCollapsed(true);
    resetEntryFields();
  };

  const resetEntryFields = () => {
    setCatSelectValue('');
    setCatInputValue('');
    setCurrentBrands([]);
    setBrandSelectValue('');
    setBrandInputValue('');
    setCurrentTechnicians([]);
    setTechNameInput('');
    setTechPhoneInput('');
  };

  useEffect(() => {
    const names = Array.from(new Set((categoriesData || []).map((c: any) => c.name))).sort();
    setAvailableCategories(prev => JSON.stringify(prev) === JSON.stringify(names) ? prev : names);
  }, [categoriesData]);

  const handleCategorySelect = (val: string) => {
    setCatSelectValue(val);
    setBrandSelectValue('');
    setCurrentBrands([]);
    if (val && val !== 'ADD_NEW') {
      const selected = categoriesData.find(c => c.name === val);
      setAvailableBrands(selected?.brands?.sort() || []);
    } else {
      setAvailableBrands([]);
    }
  };

  const handleAddCustomBrand = () => {
    const trimmed = brandInputValue.trim();
    if (!trimmed) return;
    if (currentBrands.includes(trimmed)) return toast.error('Brand already added');
    setCurrentBrands([...currentBrands, trimmed]);
    setBrandInputValue('');
    setBrandSelectValue('');
  };

  const handleAddTechnician = () => {
    if (!techNameInput.trim() || techPhoneInput.length !== 10) {
      return toast.error('Valid name and 10-digit phone required');
    }
    setCurrentTechnicians([...currentTechnicians, { name: techNameInput.trim(), phone: techPhoneInput.trim() }]);
    setTechNameInput('');
    setTechPhoneInput('');
  };

  const addInterestEntry = () => {
    const finalCategory = catSelectValue === 'ADD_NEW' ? catInputValue.trim() : catSelectValue;
    if (!finalCategory || currentBrands.length === 0) {
      return toast.error("Category and at least one brand required");
    }
    if (interests.some(item => item.category.toLowerCase() === finalCategory.toLowerCase())) {
      return toast.error(`Interest for "${finalCategory}" already exists.`);
    }

    const newItem = {
      category: finalCategory,
      brands: currentBrands,
      ...(entityType === 'Site' ? { technicians: currentTechnicians } : {})
    };

    setInterests([...interests, newItem]);
    resetEntryFields();
    toast.success("Interest added");
  };

  return {
    interests, setInterests, isInterestCollapsed, setIsInterestCollapsed,
    availableCategories, availableBrands, catSelectValue, setCatSelectValue,
    catInputValue, setCatInputValue, currentBrands, setCurrentBrands,
    brandSelectValue, setBrandSelectValue, brandInputValue, setBrandInputValue,
    currentTechnicians, setCurrentTechnicians, techNameInput, setTechNameInput,
    techPhoneInput, setTechPhoneInput, resetInterestState, handleCategorySelect,
    handleAddCustomBrand, handleAddTechnician, addInterestEntry
  };
};