import React, { useState, useEffect } from 'react';
import type { EditEntityModalProps, EditEntityData, EditFormData } from './types';
import { ModalShell } from '../AddEntityModal/AddEntityModalShell';
import { useEditInterestManagement } from './useEditInterestManagement';
import { CommonDetails } from '../sections/CommonDetails';
import { EntitySpecific } from '../sections/EntitySpecific';
import { ContactDetails } from '../sections/ContactDetails';
import { LocationSection } from '../sections/LocationSection';
import { InterestSection } from '../sections/InterestSection';
import { AdditionalInfoSection } from '../sections/AdditionalInfoSection';
import toast from 'react-hot-toast';

const EditEntityModal: React.FC<EditEntityModalProps> = (props) => {
  const { isOpen, onClose, initialData, entityType, onSave, panVatMode } = props;

  // 1. Guard Clauses
  if (!isOpen) return null;
  if (!initialData.name) {
    toast.error("Initial data missing");
    return null;
  }

  // 2. State Initialization
  const [formData, setFormData] = useState<EditFormData>({
    name: initialData.name || '',
    ownerName: initialData.ownerName || '',
    subOrgName: initialData.subOrgName || '',
    partyType: initialData.partyType || '',
    address: initialData.address || '',
    latitude: initialData.latitude || 0,
    longitude: initialData.longitude || 0,
    email: initialData.email || '',
    phone: initialData.phone || '',
    panVat: initialData.panVat || '',
    description: initialData.description || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Initialize updated logic hook
  const interestLogic = useEditInterestManagement(entityType, props.categoriesData || []);

  // 3. Sync state on Modal Open
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        name: initialData.name || '',
        ownerName: initialData.ownerName || '',
        subOrgName: initialData.subOrgName || '',
        partyType: initialData.partyType || '',
        address: initialData.address || '',
        latitude: initialData.latitude || 0,
        longitude: initialData.longitude || 0,
        email: initialData.email || '',
        phone: initialData.phone || '',
        panVat: initialData.panVat || '',
        description: initialData.description || '',
      });
      
      const loadedInterests = entityType === 'Site' 
        ? initialData.siteInterest || [] 
        : initialData.prospectInterest || initialData.interest || [];
      interestLogic.setInterests(loadedInterests);
    }
  }, [isOpen, initialData, entityType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    // Validation
    if (!formData.name.trim()) newErrors.name = "Required";
    if (entityType === 'Party' && !formData.partyType) newErrors.partyType = "Required";
    if (panVatMode === 'required' && !formData.panVat) newErrors.panVat = "Required";

    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    setIsSaving(true);
    try {
      // Build Payload: Pull dateJoined from initialData to avoid TS error on EditFormData
      const payload: EditEntityData = {
        name: formData.name,
        ownerName: formData.ownerName,
        address: formData.address,
        dateJoined: initialData.dateJoined, 
        latitude: formData.latitude,
        longitude: formData.longitude,
        email: formData.email,
        phone: formData.phone,
        panVat: formData.panVat,
        description: formData.description,
        
        partyType: entityType === 'Party' ? formData.partyType : undefined,
        subOrgName: entityType === 'Site' ? formData.subOrgName : undefined,
        prospectInterest: entityType === 'Prospect' ? interestLogic.interests : undefined,
        siteInterest: entityType === 'Site' ? interestLogic.interests : undefined,
      };

      await onSave(payload);
      toast.success("Updated successfully");
      onClose();
    } catch (err) {
      toast.error("Update failed. Please try again.");
    } finally { 
      setIsSaving(false); 
    }
  };

  return (
    <ModalShell 
      isOpen={isOpen} 
      onClose={onClose} 
      title={props.title} 
      isSaving={isSaving} 
      onSubmit={handleSubmit} 
      submitLabel="Save Changes"
    >
      <CommonDetails 
        formData={formData} 
        onChange={handleChange} 
        errors={errors} 
        labels={{ name: props.nameLabel, owner: props.ownerLabel }} 
        dateJoined={initialData.dateJoined}
        isReadOnlyDate={true} 
      />
      
      <EntitySpecific 
        props={props} 
        formData={formData} 
        setFormData={setFormData} 
        errors={errors} 
      />
      
      <ContactDetails formData={formData} onChange={handleChange} errors={errors} />
      
      <LocationSection formData={formData} setFormData={setFormData} />
      
      {['Prospect', 'Site'].includes(entityType) && (
        <InterestSection 
          logic={interestLogic} 
          entityType={entityType} 
          categoriesData={props.categoriesData}
        />
      )}
      
      <AdditionalInfoSection formData={formData} onChange={handleChange} errors={errors} />
    </ModalShell>
  );
};

export default EditEntityModal;