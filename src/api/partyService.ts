import api from './api';
import { isAxiosError } from 'axios';

// --- Interfaces ---

export interface Party {
  id: string;
  companyName: string;
  ownerName: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  dateCreated: string;
  phone: string;
  panVat: string;
  email: string;
  description?: string;
  image?: string | null;
  partyType: string;
  createdBy?: { _id: string; name: string };
}

export interface NewPartyData {
  companyName: string;
  ownerName: string;
  dateJoined: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  email: string;
  phone: string;
  panVat: string;
  description?: string;
  partyType?: string;
}

export interface BulkUploadResult {
  success: number;
  failed: number;
  errors: string[];
}

export interface PartyStatsSummary {
  _id: string;
  partyName: string;
  partyOwnerName: string;
  partyAddress: string;
  partyPanVatNumber: string;
  totalOrders: number;
  totalAmount: number;
  totalDiscount: number;
  lastOrderDate: string;
  firstOrderDate: string;
  ordersByStatus: any;
}

export interface PartyStatsData {
  summary: PartyStatsSummary;
  allOrders: any[];
}

// --- Response Types ---

interface GetPartiesResponse {
  success: boolean;
  count: number;
  data: any[];
}

interface PartyResponse {
  success: boolean;
  data: any;
}

interface DeletePartyResponse {
  success: boolean;
  message: string;
}

interface GetPartyStatsResponse {
  success: boolean;
  data: PartyStatsData;
}

// --- Mapping Functions ---

/**
 * Maps API data to Frontend Interface
 */
const mapApiToFrontend = (apiParty: any): Party => {
  return {
    id: apiParty._id,
    companyName: apiParty.partyName,
    ownerName: apiParty.ownerName,
    address: apiParty.location?.address || '',
    latitude: apiParty.location?.latitude || null,
    longitude: apiParty.location?.longitude || null,
    dateCreated: apiParty.dateJoined || apiParty.createdAt || '',
    phone: apiParty.contact?.phone || '',
    panVat: apiParty.panVatNumber || '',
    email: apiParty.contact?.email || '',
    description: apiParty.description || '',
    image: apiParty.image || null,
    partyType: apiParty.partyType || '',
    createdBy: apiParty.createdBy,
  };
};

/**
 * Maps Frontend creation data to API format
 */
const mapFrontendToApiCreate = (partyData: NewPartyData): any => {
  return {
    partyName: partyData.companyName,
    ownerName: partyData.ownerName,
    dateJoined: partyData.dateJoined,
    panVatNumber: partyData.panVat,
    contact: {
      phone: partyData.phone,
      email: partyData.email,
    },
    location: {
      address: partyData.address,
      latitude: partyData.latitude,
      longitude: partyData.longitude,
    },
    description: partyData.description,
    partyType: partyData.partyType,
  };
};

/**
 * Maps Partial Frontend data to API update format
 * Handles both "companyName" (interface) and "name" (modal form data)
 */
const mapFrontendToApiUpdate = (partyData: any): any => {
  const apiData: any = {};

  // Map Name
  if (partyData.companyName !== undefined) apiData.partyName = partyData.companyName;
  else if (partyData.name !== undefined) apiData.partyName = partyData.name;

  if (partyData.ownerName !== undefined) apiData.ownerName = partyData.ownerName;
  if (partyData.description !== undefined) apiData.description = partyData.description;
  if (partyData.partyType !== undefined) apiData.partyType = partyData.partyType;

  // Map PAN/VAT
  if (partyData.panVat !== undefined) apiData.panVatNumber = partyData.panVat;

  // Map Location nested object
  const location: any = {};
  if (partyData.address !== undefined) location.address = partyData.address;
  if (partyData.latitude !== undefined) location.latitude = partyData.latitude;
  if (partyData.longitude !== undefined) location.longitude = partyData.longitude;
  if (Object.keys(location).length > 0) apiData.location = location;

  // Map Contact nested object
  const contact: any = {};
  if (partyData.phone !== undefined) contact.phone = partyData.phone;
  if (partyData.email !== undefined) contact.email = partyData.email;
  if (Object.keys(contact).length > 0) apiData.contact = contact;

  return apiData;
};

// --- Exported Service Functions ---

export const getParties = async (): Promise<Party[]> => {
  try {
    const response = await api.get<GetPartiesResponse>('/parties');
    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data.map(mapApiToFrontend);
    }
    throw new Error('Invalid data format received from server');
  } catch (error) {
    throw error;
  }
};

export const getPartyDetails = async (partyId: string): Promise<Party> => {
  try {
    const response = await api.get<PartyResponse>(`/parties/${partyId}`);
    if (response.data.success && response.data.data) {
      return mapApiToFrontend(response.data.data);
    }
    throw new Error('Party not found');
  } catch (error) {
    throw error;
  }
};

export const getPartyStats = async (partyId: string): Promise<PartyStatsData | null> => {
  try {
    const response = await api.get<GetPartyStatsResponse>(`/invoices/parties/${partyId}/stats`);
    return response.data.success && response.data.data ? response.data.data : null;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
};

export const addParty = async (partyData: NewPartyData): Promise<Party> => {
  try {
    const apiPayload = mapFrontendToApiCreate(partyData);
    const response = await api.post<PartyResponse>('/parties', apiPayload);
    return mapApiToFrontend(response.data.data);
  } catch (error) {
    throw error;
  }
};

export const updateParty = async (partyId: string, updatedData: Partial<Party>): Promise<Party> => {
  try {
    const apiPayload = mapFrontendToApiUpdate(updatedData);
    const response = await api.put<PartyResponse>(`/parties/${partyId}`, apiPayload);
    return mapApiToFrontend(response.data.data);
  } catch (error) {
    throw error;
  }
};

export const deleteParty = async (partyId: string): Promise<boolean> => {
  try {
    const response = await api.delete<DeletePartyResponse>(`/parties/${partyId}`);
    return response.data.success;
  } catch (error) {
    throw error;
  }
};

export const getPartyTypes = async (): Promise<string[]> => {
  try {
    const response = await api.get<{ success: boolean; data: any[] }>('/parties/types');
    if (response.data.success) {
      return response.data.data.map(t => t.name);
    }
    return [];
  } catch (error) {
    console.error("Error fetching party types:", error);
    return [];
  }
};

export const bulkUploadParties = async (
  _organizationId: string,
  parties: Omit<Party, 'id' | 'dateCreated'>[]
): Promise<BulkUploadResult> => {
  const partiesPayload = parties.map(p => ({
    partyName: p.companyName,
    ownerName: p.ownerName,
    panVatNumber: p.panVat,
    contact: { phone: p.phone, email: p.email },
    location: { address: p.address, latitude: p.latitude, longitude: p.longitude },
    address: p.address, 
    description: p.description,
    partyType: p.partyType
  }));

  try {
    const response = await api.post('/parties/bulk-import', { parties: partiesPayload });
    const resultData = response.data.data;
    const errors: string[] = [];

    if (resultData.failed) {
      resultData.failed.forEach((item: any) => {
        const errorMsg = item.errors ? item.errors.map((e: any) => e.message).join(', ') : 'Unknown error';
        errors.push(`Row ${item.row}: ${item.partyName} - ${errorMsg}`);
      });
    }
    if (resultData.duplicates) {
      resultData.duplicates.forEach((item: any) => {
        errors.push(`Row ${item.row}: ${item.partyName} - ${item.message}`);
      });
    }

    return {
      success: resultData.successfulCount || 0,
      failed: (resultData.failedCount || 0) + (resultData.duplicateCount || 0),
      errors: errors
    };
  } catch (error: any) {
    return {
      success: 0,
      failed: parties.length,
      errors: [error.response?.data?.message || error.message || "Server error occurred"]
    };
  }
};

export const uploadPartyImage = async (partyId: string, file: File): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post(`/parties/${partyId}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

export const deletePartyImage = async (partyId: string): Promise<boolean> => {
  const response = await api.delete(`/parties/${partyId}/image`);
  return response.data.success;
};

export const getAllPartiesDetails = async (): Promise<Party[]> => {
  const response = await api.get('/parties/details');
  return response.data.success && Array.isArray(response.data.data) 
    ? response.data.data.map(mapApiToFrontend) 
    : [];
};