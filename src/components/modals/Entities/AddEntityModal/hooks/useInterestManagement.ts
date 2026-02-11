import { useState, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import { type EntityType, type CategoryData, type InterestItem, type Technician } from '../types';

export const useInterestManagement = (
  entityType: EntityType,
  categoriesData: CategoryData[] = []
) => {
  const [interests, setInterests] = useState<InterestItem[]>([]);
  const [isInterestCollapsed, setIsInterestCollapsed] = useState(true);

  // 1. FIXED: Use useMemo instead of useEffect to derive categories.
  const availableCategories = useMemo(() => {
    return Array.from(new Set((categoriesData || []).map((c) => c.name))).sort();
  }, [categoriesData]);

  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // Entry States
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [catSelectValue, setCatSelectValue] = useState('');
  const [catInputValue, setCatInputValue] = useState('');
  const [currentBrands, setCurrentBrands] = useState<string[]>([]);
  const [brandSelectValue, setBrandSelectValue] = useState('');
  const [brandInputValue, setBrandInputValue] = useState('');

  const [currentTechnicians, setCurrentTechnicians] = useState<Technician[]>([]);
  const [techSelectValue, setTechSelectValue] = useState('');
  const [techNameInput, setTechNameInput] = useState(''); // Acts as "Custom Role" input
  const [techPhoneInput, setTechPhoneInput] = useState('');

  // 2. FIXED: availableContacts now depends on the SELECTED CATEGORY
  const availableContacts = useMemo(() => {
    if (!catSelectValue || catSelectValue === 'ADD_NEW') return [];

    const selectedCategory = categoriesData.find(c => c.name === catSelectValue);
    // Map technicians from the selected category, or empty if none
    return (selectedCategory?.technicians || []).map((t: Technician) => t.name).sort();
  }, [categoriesData, catSelectValue]);

  // Helper to get phone for a specific contact in the selected category
  const getContactPhone = useCallback((contactName: string) => {
    if (!catSelectValue || catSelectValue === 'ADD_NEW') return '';
    const selectedCategory = categoriesData.find(c => c.name === catSelectValue);
    const tech = selectedCategory?.technicians?.find((t: Technician) => t.name === contactName);
    return tech?.phone || '';
  }, [categoriesData, catSelectValue]);

  const resetEntryFields = useCallback(() => {
    setEditingIndex(null);
    setCatSelectValue('');
    setCatInputValue('');
    setCurrentBrands([]);
    setBrandSelectValue('');
    setBrandInputValue('');
    setCurrentTechnicians([]);
    setTechSelectValue('');
    setTechNameInput('');
    setTechPhoneInput('');
  }, []);

  // Handle Technician Selection to Auto-fill Phone
  const handleTechSelect = useCallback((val: string) => {
    setTechSelectValue(val);
    if (val !== 'ADD_NEW') {
      const phone = getContactPhone(val);
      setTechPhoneInput(phone);
    } else {
      setTechPhoneInput('');
      setTechNameInput('');
    }
  }, [getContactPhone]);

  // 2. IMPROVED: Wrap in useCallback to prevent unnecessary child re-renders
  const handleCategorySelect = useCallback((val: string) => {
    setCatSelectValue(val);

    // Reset dependant fields when category changes
    setBrandSelectValue('');
    setBrandInputValue('');
    setTechSelectValue('');
    setTechNameInput('');
    setTechPhoneInput('');

    if (val === 'ADD_NEW') {
      setAvailableBrands([]);
    } else {
      const selected = categoriesData.find(c => c.name === val);
      setAvailableBrands(selected?.brands?.sort() || []);
    }
  }, [categoriesData]);

  const handleAddBrand = useCallback(() => {
    const finalBrand = brandSelectValue === 'ADD_NEW' ? brandInputValue.trim() : brandSelectValue;

    if (!finalBrand) return toast.error("Select or enter a brand");
    if (currentBrands.includes(finalBrand)) return toast.error("Brand already added");

    setCurrentBrands(prev => [...prev, finalBrand]);
    setBrandSelectValue('');
    setBrandInputValue('');
  }, [brandSelectValue, brandInputValue, currentBrands]);

  const handleRemoveBrand = useCallback((brandName: string) => {
    setCurrentBrands(prev => prev.filter(b => b !== brandName));
  }, []);

  const handleAddTechnician = useCallback(() => {
    const finalName = techSelectValue === 'ADD_NEW' ? techNameInput.trim() : techSelectValue;

    if (!finalName) return toast.error("Select or enter a contact name/role");
    if (techPhoneInput.length !== 10) return toast.error("Valid 10-digit phone required");

    // Check for duplicates
    if (currentTechnicians.some(t => t.name === finalName && t.phone === techPhoneInput)) {
      return toast.error("Contact already added");
    }

    setCurrentTechnicians(prev => [...prev, { name: finalName, phone: techPhoneInput }]);
    setTechSelectValue('');
    setTechNameInput('');
    setTechPhoneInput('');
  }, [techSelectValue, techNameInput, techPhoneInput, currentTechnicians]);

  const handleEditItem = useCallback((index: number) => {
    const item = interests[index];
    setEditingIndex(index);

    if (availableCategories.includes(item.category)) {
      setCatSelectValue(item.category);
      const selected = categoriesData.find(c => c.name === item.category);
      setAvailableBrands(selected?.brands?.sort() || []);
    } else {
      setCatSelectValue('ADD_NEW');
      setCatInputValue(item.category);
      setAvailableBrands([]);
    }

    setCurrentBrands(item.brands || []);
    setCurrentTechnicians(item.technicians || []);
    setIsInterestCollapsed(false);
  }, [interests, availableCategories, categoriesData]);

  const handleDeleteItem = useCallback((index: number) => {
    setInterests(prev => prev.filter((_, i) => i !== index));
    setEditingIndex(prev => {
      if (prev === index) resetEntryFields();
      return prev;
    });
  }, [resetEntryFields]);

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
      setInterests(prev => {
        const updated = [...prev];
        updated[editingIndex] = newItem;
        return updated;
      });
      toast.success("Entry updated");
    } else {
      setInterests(prev => [...prev, newItem]);
      toast.success("Entry added");
    }
    resetEntryFields();
  };

  const resetInterestForm = useCallback(() => {
    setInterests([]);
    resetEntryFields();
    setIsInterestCollapsed(true);
  }, [resetEntryFields]);

  return {
    interests, setInterests, isInterestCollapsed, setIsInterestCollapsed,
    availableCategories, availableBrands, catSelectValue, setCatSelectValue,
    catInputValue, setCatInputValue, currentBrands, setCurrentBrands,
    brandSelectValue, setBrandSelectValue, brandInputValue, setBrandInputValue,
    currentTechnicians, setCurrentTechnicians, techNameInput, setTechNameInput,
    techPhoneInput, setTechPhoneInput, handleCategorySelect, handleAddTechnician,
    handleAddBrand, handleRemoveBrand, addInterestEntry, handleEditItem,
    handleDeleteItem, resetEntryFields, editingIndex, resetInterestForm,
    availableContacts, techSelectValue, setTechSelectValue, handleTechSelect
  };
};