// types.ts
export type EntityType = 'Party' | 'Prospect' | 'Site';

export interface Technician {
  name: string;
  phone: string;
}

export interface InterestItem {
  category: string;
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

export interface EditFormData {
  name: string;
  ownerName: string;
  subOrgName: string;
  partyType: string;
  address: string;
  latitude: number;
  longitude: number;
  email: string;
  phone: string;
  panVat: string;
  description: string;
}

export interface CategoryData {
  _id: string;
  name: string;
  brands: string[];
  technicians?: Technician[];
}

export interface EditEntityModalProps {
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
  categoriesData?: CategoryData[];
  subOrgsList?: string[];
  partyTypesList?: string[];
  onAddCategory?: (val: string) => void;
  onAddBrand?: (val: string) => void;
  onAddSubOrg?: (val: string) => void;
  onAddPartyType?: (val: string) => void;
}