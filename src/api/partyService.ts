import api from './api';
import { isAxiosError } from 'axios';

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
}

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

interface GetPartyStatsResponse {
  success: boolean;
  data: PartyStatsData;
}

// Map API response to Frontend Interface
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
  };
};

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
  };
};

const mapFrontendToApiUpdate = (partyData: Partial<Party>): any => {
  const apiData: any = {};

  if (partyData.companyName !== undefined) apiData.partyName = partyData.companyName;
  if (partyData.ownerName !== undefined) apiData.ownerName = partyData.ownerName;
  if (partyData.description !== undefined) apiData.description = partyData.description;
  if (partyData.panVat !== undefined) apiData.panVatNumber = partyData.panVat;

  const location: any = {};
  if (partyData.address !== undefined) location.address = partyData.address;
  if (partyData.latitude !== undefined) location.latitude = partyData.latitude;
  if (partyData.longitude !== undefined) location.longitude = partyData.longitude;
  if (Object.keys(location).length > 0) apiData.location = location;

  const contact: any = {};
  if (partyData.phone !== undefined) contact.phone = partyData.phone;
  if (partyData.email !== undefined) contact.email = partyData.email;
  if (Object.keys(contact).length > 0) apiData.contact = contact;

  return apiData;
};

export const getParties = async (): Promise<Party[]> => {
  try {
    const response = await api.get<GetPartiesResponse>('/parties');
    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data.map(mapApiToFrontend);
    } else {
      throw new Error('Invalid data format received from server');
    }
  } catch (error) {
    throw error;
  }
};

export const getPartyDetails = async (partyId: string): Promise<Party> => {
  try {
    const response = await api.get<PartyResponse>(`/parties/${partyId}`);
    if (response.data.success && response.data.data) {
      return mapApiToFrontend(response.data.data);
    } else {
      throw new Error('Party not found or invalid data format');
    }
  } catch (error) {
    throw error;
  }
};

export const getPartyStats = async (
  partyId: string
): Promise<PartyStatsData | null> => {
  try {
    const response = await api.get<GetPartyStatsResponse>(
      `/invoices/parties/${partyId}/stats`
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      return null;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
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

export const updateParty = async (
  partyId: string,
  updatedData: Partial<Party>
): Promise<Party> => {
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

// ✅ FIXED: Now properly calls the Backend API for Bulk Upload
export const bulkUploadParties = async (
  _organizationId: string, // Kept for interface compatibility
  parties: Omit<Party, 'id' | 'dateCreated'>[]
): Promise<BulkUploadResult> => {
  
  // 1. Prepare data for backend (map to API format)
  const partiesPayload = parties.map(p => ({
    partyName: p.companyName,
    ownerName: p.ownerName,
    panVatNumber: p.panVat,
    contact: {
      phone: p.phone,
      email: p.email // Backend handles empty string as optional
    },
    location: {
        address: p.address,
        latitude: p.latitude,
        longitude: p.longitude
    },
    // We send address as top-level if your backend schema expects it there for bulk, 
    // OR inside location if that matches your schema. 
    // Based on your backend controller provided earlier:
    // location: validatedData.address ? { address: validatedData.address } : undefined,
    // So the backend expects `address` at top level for bulk schema logic you showed:
    // address: z.string().optional()
    address: p.address, 
    description: p.description,
  }));

  try {
    // 2. Call the Real Endpoint
    const response = await api.post('/parties/bulk-import', { parties: partiesPayload });
    
    // 3. Map Backend Result to Frontend Interface
    const resultData = response.data.data;
    
    const errors: string[] = [];
    
    // Collect errors from failed items
    if (resultData.failed && Array.isArray(resultData.failed)) {
      resultData.failed.forEach((item: any) => {
        const errorMsg = item.errors ? item.errors.map((e: any) => e.message).join(', ') : 'Unknown error';
        errors.push(`Row ${item.row}: ${item.partyName} - ${errorMsg}`);
      });
    }

    // Collect errors from duplicates
    if (resultData.duplicates && Array.isArray(resultData.duplicates)) {
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
    console.error("Bulk upload error:", error);
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

  try {
    const response = await api.post(`/parties/${partyId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const deletePartyImage = async (partyId: string): Promise<boolean> => {
  try {
    const response = await api.delete(`/parties/${partyId}/image`);
    return response.data.success;
  } catch (error) {
    throw error;
  }
};

export const getAllPartiesDetails = async (): Promise<Party[]> => {
  try {
    const response = await api.get('/parties/details'); 
    
    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data.map(mapApiToFrontend);
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};