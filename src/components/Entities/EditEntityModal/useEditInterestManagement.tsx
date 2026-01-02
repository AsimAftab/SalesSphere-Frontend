import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useEditInterestManagement = (entityType: string, categoriesData: any[]) => {
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

  // Fix: Infinite Loop Prevention
  useEffect(() => {
    const names = Array.from(new Set((categoriesData || []).map((c: any) => c.name))).sort();
    setAvailableCategories(prev => JSON.stringify(prev) === JSON.stringify(names) ? prev : names);
  }, [categoriesData]);

  const handleAddTechnician = useCallback(() => {
    if (!techNameInput.trim() || techPhoneInput.length !== 10) {
      return toast.error("Valid name and 10-digit phone required");
    }
    setCurrentTechnicians(prev => [...prev, { name: techNameInput.trim(), phone: techPhoneInput }]);
    setTechNameInput(''); setTechPhoneInput('');
  }, [techNameInput, techPhoneInput]);

  const resetEntryFields = useCallback(() => {
    setEditingIndex(null); setCatSelectValue(''); setCatInputValue('');
    setCurrentBrands([]); setBrandSelectValue(''); setBrandInputValue('');
    setCurrentTechnicians([]); setTechNameInput(''); setTechPhoneInput('');
  }, []);

  const handleCategorySelect = (val: string) => {
    setCatSelectValue(val);
    const selected = categoriesData.find(c => c.name === val);
    setAvailableBrands(selected?.brands?.sort() || []);
  };

  const addInterestEntry = () => {
    const finalCat = catSelectValue === 'ADD_NEW' ? catInputValue.trim() : catSelectValue;
    if (!finalCat || currentBrands.length === 0) return toast.error("Category and brands required");

    const newItem = {
      category: finalCat,
      brands: currentBrands,
      technicians: (entityType === 'Site' || entityType === 'Prospect') ? currentTechnicians : undefined
    };

    if (editingIndex !== null) {
      const updated = [...interests]; updated[editingIndex] = newItem;
      setInterests(updated);
    } else { setInterests([...interests, newItem]); }
    resetEntryFields();
  };

  return {
    interests, setInterests, isInterestCollapsed, setIsInterestCollapsed,
    availableCategories, availableBrands, catSelectValue, setCatSelectValue,
    catInputValue, setCatInputValue, currentBrands, setCurrentBrands,
    brandSelectValue, setBrandSelectValue, brandInputValue, setBrandInputValue,
    currentTechnicians, setCurrentTechnicians, techNameInput, setTechNameInput,
    techPhoneInput, setTechPhoneInput, handleCategorySelect, handleAddTechnician, 
    addInterestEntry, handleEditItem: () => { /* logic */ }, resetEntryFields, editingIndex
  };
};