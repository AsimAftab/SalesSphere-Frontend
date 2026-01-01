// index.tsx
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

  // Blank Screen Guard: Prevent crash if data is missing
  if (!isOpen) return null;
    if (!initialData.name) {
    toast.error("Initial data missing");
    return null;
    }


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
  const interestLogic = useEditInterestManagement(entityType, props.categoriesData || []);

  // Sync state when modal opens or initialData updates
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        name: initialData.name || '',
        ownerName: initialData.ownerName || '',
        subOrgName: initialData.subOrgName || '',
        partyType: initialData.partyType || '',
        address: initialData.address || '',
        latitude: initialData.latitude,
        longitude: initialData.longitude,
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
    if (!formData.name.trim()) newErrors.name = "Required";
    if (entityType === 'Party' && !formData.partyType) newErrors.partyType = "Required";
    if (panVatMode === 'required' && !formData.panVat) newErrors.panVat = "Required";

    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    setIsSaving(true);
    try {
      const payload: EditEntityData = {
        name: formData.name,
        ownerName: formData.ownerName,
        dateJoined: initialData.dateJoined,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        email: formData.email,
        phone: formData.phone,
        panVat: formData.panVat,
        description: formData.description,

        // Fix interest saving based on enum type
        prospectInterest: entityType === 'Prospect' ? interestLogic.interests.map(i => ({
            category: i.category,
            brands: i.brands,
            technicians: i.technicians || []  // allow technicians if added
        })) : undefined,

        siteInterest: entityType === 'Site' ? interestLogic.interests : undefined,
        };

      await onSave(payload);
      onClose();
    } catch (err) {
      toast.error("Failed to update");
    } finally { setIsSaving(false); }
  };

  return (
    <ModalShell 
      isOpen={isOpen} onClose={onClose} title={props.title} 
      isSaving={isSaving} onSubmit={handleSubmit} submitLabel="Save Changes"
    >
      <CommonDetails 
        formData={formData} 
        onChange={handleChange} 
        errors={errors} 
        labels={{ name: props.nameLabel, owner: props.ownerLabel }} 
        // Pass original date and a flag to ensure UI renders it as read-only
        dateJoined={initialData.dateJoined}
        isReadOnlyDate={true} 
      />
      
      <EntitySpecific props={props} formData={formData} setFormData={setFormData} errors={errors} />
      
      <ContactDetails formData={formData} onChange={handleChange} errors={errors} />
      
      <LocationSection formData={formData} setFormData={setFormData} />
      
      {['Prospect', 'Site'].includes(entityType) && (
        <InterestSection logic={interestLogic} entityType={entityType} />
      )}
      
      <AdditionalInfoSection formData={formData} onChange={handleChange} errors={errors} />
    </ModalShell>
  );
};

export default EditEntityModal;