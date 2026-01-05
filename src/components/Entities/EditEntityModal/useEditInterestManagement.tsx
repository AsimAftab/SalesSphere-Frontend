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

  // Update categories when data changes
  useEffect(() => {
    const names = Array.from(new Set((categoriesData || []).map((c: any) => c.name))).sort();
    setAvailableCategories(prev => JSON.stringify(prev) === JSON.stringify(names) ? prev : names);
  }, [categoriesData]);

  // Resets all input fields to default
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

  // Sync available brands when category is selected
  const handleCategorySelect = (val: string) => {
    setCatSelectValue(val);
    if (val === 'ADD_NEW') {
      setAvailableBrands([]);
    } else {
      const selected = categoriesData.find(c => c.name === val);
      setAvailableBrands(selected?.brands?.sort() || []);
    }
  };

  // Logic to add a brand to the current entry
  const handleAddBrand = useCallback(() => {
    const finalBrand = brandSelectValue === 'ADD_NEW' ? brandInputValue.trim() : brandSelectValue;
    
    if (!finalBrand) return toast.error("Select or enter a brand");
    if (currentBrands.includes(finalBrand)) return toast.error("Brand already added");

    setCurrentBrands(prev => [...prev, finalBrand]);
    setBrandSelectValue('');
    setBrandInputValue('');
  }, [brandSelectValue, brandInputValue, currentBrands]);

  // Logic to remove a brand from the current list
  const handleRemoveBrand = (brandName: string) => {
    setCurrentBrands(prev => prev.filter(b => b !== brandName));
  };

  // Handle Technician Addition
  const handleAddTechnician = useCallback(() => {
    if (!techNameInput.trim() || techPhoneInput.length !== 10) {
      return toast.error("Valid name and 10-digit phone required");
    }
    setCurrentTechnicians(prev => [...prev, { name: techNameInput.trim(), phone: techPhoneInput }]);
    setTechNameInput(''); 
    setTechPhoneInput('');
  }, [techNameInput, techPhoneInput]);

  // Prefills the form when a card is clicked
  const handleEditItem = (index: number) => {
    const item = interests[index];
    setEditingIndex(index);
    
    // Check if category is existing or custom
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
    setIsInterestCollapsed(false); // Ensure form is visible
  };

  const handleDeleteItem = (index: number) => {
    setInterests(prev => prev.filter((_, i) => i !== index));
    if (editingIndex === index) resetEntryFields();
  };

  // Final confirmation logic (Add or Update)
  const addInterestEntry = () => {
    const finalCat = catSelectValue === 'ADD_NEW' ? catInputValue.trim() : catSelectValue;
    if (!finalCat || currentBrands.length === 0) {
      return toast.error("Category and at least one brand required");
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

  return {
    interests, setInterests, isInterestCollapsed, setIsInterestCollapsed,
    availableCategories, availableBrands, catSelectValue, setCatSelectValue,
    catInputValue, setCatInputValue, currentBrands, setCurrentBrands,
    brandSelectValue, setBrandSelectValue, brandInputValue, setBrandInputValue,
    currentTechnicians, setCurrentTechnicians, techNameInput, setTechNameInput,
    techPhoneInput, setTechPhoneInput, handleCategorySelect, handleAddTechnician, 
    handleAddBrand, handleRemoveBrand, addInterestEntry, handleEditItem, 
    handleDeleteItem, resetEntryFields, editingIndex
  };
};