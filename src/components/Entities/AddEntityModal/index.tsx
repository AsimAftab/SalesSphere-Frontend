import React, { useState, useEffect } from 'react';
import type { FormData, AddEntityModalProps, NewEntityData } from './types';
import { defaultPosition } from './types';
import { ModalShell } from './AddEntityModalShell';
import { useInterestManagement } from './useInterestManagement';
import { CommonDetails } from '../sections/CommonDetails';
import { EntitySpecific } from '../sections/EntitySpecific';
import { ContactDetails } from '../sections/ContactDetails';
import { LocationSection } from '../sections/LocationSection';
import { InterestSection } from '../sections/InterestSection';
import { AdditionalInfoSection } from '../sections/AdditionalInfoSection';
import toast from 'react-hot-toast';

const AddEntityModal: React.FC<AddEntityModalProps> = (props) => {
  const { entityType, categoriesData, onSave, onClose, isOpen, title, panVatMode } = props;

  // --- State Management ---
  const [formData, setFormData] = useState<FormData>({
    name: '',
    ownerName: '',
    subOrgName: '',
    partyType: '',
    address: '',
    latitude: defaultPosition.lat,
    longitude: defaultPosition.lng,
    email: '',
    phone: '',
    panVat: '',
    description: '',
  });

  const [dateJoined, setDateJoined] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- Logic Hooks ---
  const interestLogic = useInterestManagement(entityType, categoriesData || []);

  // --- Reset Function ---
  // Optimized to be a single source of truth for clearing the form
  const resetForm = () => {
    setFormData({
      name: '',
      ownerName: '',
      subOrgName: '',
      partyType: '',
      address: '',
      latitude: defaultPosition.lat,
      longitude: defaultPosition.lng,
      email: '',
      phone: '',
      panVat: '',
      description: '',
    });
    setDateJoined(null);
    setErrors({});
    setIsSaving(false);
    
    // This specifically clears the interests list and the entry form states
     interestLogic.setInterests([]);
  };

  // --- Reset on Modal Toggle ---
  useEffect(() => {
    // We reset when the modal OPENS to ensure a clean slate
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleClose = () => {
    resetForm();
    interestLogic.resetInterestForm();
    onClose();
  };

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    // ... Validation Logic ...
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.ownerName.trim()) newErrors.ownerName = "Owner is required";
    if (!dateJoined) newErrors.dateJoined = "Date joined is required";
    if (entityType === 'Site' && !formData.subOrgName) newErrors.subOrgName = "Sub Org is required";
    if (entityType === 'Party' && !formData.partyType) newErrors.partyType = "Party Type is required";
    if (panVatMode === 'required' && !formData.panVat.trim()) newErrors.panVat = "PAN/VAT is required";
    if (!formData.phone.trim() || formData.phone.length !== 10) newErrors.phone = "Valid 10-digit phone is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return toast.error("Please fix form errors");
    }

    // Guard against forgotten interest entries in the sub-form
    if (interestLogic.catSelectValue || interestLogic.currentBrands.length > 0) {
      return toast.error("You have unsaved interest details. Click 'Confirm Interest Entry' or clear fields.");
    }

    setIsSaving(true);
    try {
      const formattedDate = dateJoined!.toISOString().split('T')[0];
      
      const payload: NewEntityData = {
        name: formData.name,
        ownerName: formData.ownerName,
        dateJoined: formattedDate,
        address: formData.address,
        description: formData.description,
        latitude: formData.latitude,
        longitude: formData.longitude,
        email: formData.email || undefined,
        phone: formData.phone,
        panVat: formData.panVat || undefined,
      };

      if (entityType === 'Site') {
        payload.subOrgName = formData.subOrgName;
        payload.siteInterest = interestLogic.interests;
      } else if (entityType === 'Prospect') {
        payload.prospectInterest = interestLogic.interests;
      } else if (entityType === 'Party') {
        payload.partyType = formData.partyType;
      }

      await onSave(payload);
      setIsSaving(false);
      handleClose(); 
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
      setIsSaving(false);
    }
  };

  return (
    <ModalShell 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={title} 
      isSaving={isSaving} 
      onSubmit={handleSubmit}
      submitLabel={`Create ${entityType}`}
    >
      <CommonDetails 
        formData={formData} 
        onChange={handleChange} 
        dateJoined={dateJoined} 
        setDateJoined={setDateJoined} 
        errors={errors} 
        labels={{ name: props.nameLabel, owner: props.ownerLabel }}
      />
      
      <EntitySpecific 
        props={props} 
        formData={formData} 
        setFormData={setFormData} 
        errors={errors} 
      />

      <ContactDetails 
        formData={formData} 
        onChange={handleChange} 
        errors={errors} 
        isSaving={isSaving}
      />
      
      <LocationSection 
        formData={formData} 
        setFormData={setFormData} 
      />

      {['Prospect', 'Site'].includes(entityType) && (
        <InterestSection logic={interestLogic} entityType={entityType} />
      )}

      <AdditionalInfoSection 
        formData={formData} 
        onChange={handleChange} 
        errors={errors} 
        isSaving={isSaving}
      />
    </ModalShell>
  );
};

export default AddEntityModal;