import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { type EntityType } from './types';

export const useInterestManagement = (entityType: EntityType, categoriesData: any[]) => {
  const [interests, setInterests] = useState<any[]>([]);
  const [isInterestCollapsed, setIsInterestCollapsed] = useState(true);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // Entry States
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [catSelectValue, setCatSelectValue] = useState('');
  const [catInputValue, setCatInputValue] = useState('');
  const [currentBrands, setCurrentBrands] = useState<string[]>([]);
  const [brandSelectValue, setBrandSelectValue] = useState('');
  const [brandInputValue, setBrandInputValue] = useState('');
  const [currentTechnicians, setCurrentTechnicians] = useState<any[]>([]);
  const [techNameInput, setTechNameInput] = useState('');
  const [techPhoneInput, setTechPhoneInput] = useState('');

  useEffect(() => {
    const names = Array.from(new Set((categoriesData || []).map((c: any) => c.name))).sort();
    setAvailableCategories(names);
  }, [categoriesData]);

  const resetEntryFields = useCallback(() => {
    setEditingIndex(null);
    setCatSelectValue('');
    setCatInputValue('');
    setCurrentBrands([]);
    setBrandSelectValue('');
    setBrandInputValue('');
    setCurrentTechnicians([]);
    setTechNameInput('');
    setTechPhoneInput('');
  }, []);

  const handleCategorySelect = (val: string) => {
    setCatSelectValue(val);
    if (val === 'ADD_NEW') {
      setAvailableBrands([]);
    } else {
      const selected = categoriesData.find(c => c.name === val);
      setAvailableBrands(selected?.brands?.sort() || []);
    }
  };

  // FIXED: Consolidated Brand Addition Logic
  const handleAddBrand = useCallback(() => {
    const finalBrand = brandSelectValue === 'ADD_NEW' ? brandInputValue.trim() : brandSelectValue;
    
    if (!finalBrand) return toast.error("Select or enter a brand");
    if (currentBrands.includes(finalBrand)) return toast.error("Brand already added");

    setCurrentBrands(prev => [...prev, finalBrand]);
    setBrandSelectValue('');
    setBrandInputValue('');
  }, [brandSelectValue, brandInputValue, currentBrands]);

  const handleRemoveBrand = (brandName: string) => {
    setCurrentBrands(prev => prev.filter(b => b !== brandName));
  };

  const handleAddTechnician = useCallback(() => {
    if (!techNameInput.trim() || techPhoneInput.length !== 10) {
      return toast.error("Valid name and 10-digit phone required");
    }
    setCurrentTechnicians(prev => [...prev, { name: techNameInput.trim(), phone: techPhoneInput }]);
    setTechNameInput(''); 
    setTechPhoneInput('');
  }, [techNameInput, techPhoneInput]);

  // ADDED: Pre-fill form when clicking an existing interest card
  const handleEditItem = (index: number) => {
    const item = interests[index];
    setEditingIndex(index);
    
    if (availableCategories.includes(item.category)) {
      setCatSelectValue(item.category);
      const selected = categoriesData.find(c => c.name === item.category);
      setAvailableBrands(selected?.brands?.sort() || []);
    } else {
      setCatSelectValue('ADD_NEW');
      setCatInputValue(item.category);
    }

    setCurrentBrands(item.brands || []);
    setCurrentTechnicians(item.technicians || []);
    setIsInterestCollapsed(false);
  };

  const handleDeleteItem = (index: number) => {
    setInterests(prev => prev.filter((_, i) => i !== index));
    if (editingIndex === index) resetEntryFields();
  };

  const addInterestEntry = () => {
    const finalCat = catSelectValue === 'ADD_NEW' ? catInputValue.trim() : catSelectValue;
    if (!finalCat || currentBrands.length === 0) {
      return toast.error("Category and brands required");
    }

    const newItem = {
      category: finalCat,
      brands: currentBrands,
      technicians: (entityType === 'Site' || entityType === 'Prospect') ? currentTechnicians : undefined
    };

    if (editingIndex !== null) {
      const updated = [...interests];
      updated[editingIndex] = newItem;
      setInterests(updated);
      toast.success("Entry updated");
    } else {
      setInterests([...interests, newItem]);
      toast.success("Entry added");
    }
    resetEntryFields();
  };

  const resetInterestForm = () => {
    setInterests([]);
    setCatSelectValue('');
    setCatInputValue('');
    setBrandSelectValue('');
    setBrandInputValue('');
    setCurrentBrands([]);
    setCurrentTechnicians([]);
    setTechNameInput('');
    setTechPhoneInput('');
    setIsInterestCollapsed(true);
  };


  return {
    interests, setInterests, isInterestCollapsed, setIsInterestCollapsed,
    availableCategories, availableBrands, catSelectValue, setCatSelectValue,
    catInputValue, setCatInputValue, currentBrands, setCurrentBrands,
    brandSelectValue, setBrandSelectValue, brandInputValue, setBrandInputValue,
    currentTechnicians, setCurrentTechnicians, techNameInput, setTechNameInput,
    techPhoneInput, setTechPhoneInput, handleCategorySelect, handleAddTechnician, 
    handleAddBrand, handleRemoveBrand, addInterestEntry, handleEditItem, 
    handleDeleteItem, resetEntryFields, editingIndex, resetInterestForm 
  };
};