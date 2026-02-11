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

export interface CategoryData {
  _id: string;
  name: string;
  brands: string[];
  technicians?: Technician[];
}

// This was missing and causing the error in PartyContent.tsx
export interface NewEntityData {
  name: string;
  ownerName: string;
  dateJoined: string;
  subOrgName?: string;
  partyType?: string;
  address: string;
  description: string;
  latitude?: number;
  longitude?: number;
  email?: string;
  phone?: string;
  panVat?: string;
  prospectInterest?: InterestItem[];
  siteInterest?: InterestItem[];
}

export interface FormData {
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

export const defaultPosition = { lat: 27.7172, lng: 85.324 };

export interface AddEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewEntityData) => Promise<void>;
  title: string;
  nameLabel: string;
  ownerLabel: string;
  panVatMode: 'required' | 'optional' | 'hidden';
  entityType: EntityType;
  categoriesData?: CategoryData[];
  subOrgsList?: string[];
  partyTypesList?: string[];
  onAddCategory?: (val: string) => void;
  onAddBrand?: (val: string) => void;
  onAddSubOrg?: (val: string) => void;
  onAddPartyType?: (val: string) => void;
}