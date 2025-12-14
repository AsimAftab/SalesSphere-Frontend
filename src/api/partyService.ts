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
  image?: string | null; // ✅ Add this line
}

export interface NewPartyData {
  companyName: string;
  ownerName: string;
  dateJoined: string; // <-- FIX: Changed from dateCreated
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

interface ApiOrderStatusSummary {
  pending: number;
  inProgress: number;
  inTransit: number;
  completed: number;
  rejected: number;
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
  ordersByStatus: ApiOrderStatusSummary;
}

interface ApiPartyOrder {
  _id: string;
  invoiceNumber: string;
  expectedDeliveryDate: string;
  totalAmount: number;
  status: string;
}

export interface PartyStatsData {
  summary: PartyStatsSummary;
  allOrders: ApiPartyOrder[];
}

interface GetPartyStatsResponse {
  success: boolean;
  data: PartyStatsData;
}

// This function is correct: it maps the API's 'dateJoined' to the frontend's 'dateCreated'
const mapApiToFrontend = (apiParty: any): Party => {
  return {
    id: apiParty._id,
    companyName: apiParty.partyName,
    ownerName: apiParty.ownerName,
    address: apiParty.location?.address || '',
    latitude: apiParty.location?.latitude || null,
    longitude: apiParty.location?.longitude || null,
    dateCreated: apiParty.dateJoined || apiParty.createdAt || '', // This is correct
    phone: apiParty.contact?.phone || '',
    panVat: apiParty.panVatNumber || '',
    email: apiParty.contact?.email || '',
    description: apiParty.description || '',
    image: apiParty.image || null, // ✅ Add this line
  };
};

// This function now maps to 'dateJoined' to match the API
const mapFrontendToApiCreate = (partyData: NewPartyData): any => {
  return {
    partyName: partyData.companyName,
    ownerName: partyData.ownerName,
    dateJoined: partyData.dateJoined, // <-- FIX: Changed from dateCreated
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

  // Note: If you want to update the date, you'd add 'dateJoined' logic here too
  // if (partyData.dateCreated !== undefined) apiData.dateJoined = partyData.dateCreated;

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

export const bulkUploadParties = async (
  _organizationId: string,
  parties: Omit<Party, 'id' | 'dateCreated'>[]
): Promise<BulkUploadResult> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const result: BulkUploadResult = {
    success: 0,
    failed: 0,
    errors: [],
  };

  for (let i = 0; i < parties.length; i++) {
    const partyData = parties[i];

    try {
      if (!partyData.companyName || !partyData.ownerName || !partyData.address) {
        result.failed++;
        result.errors.push(
          `Row ${i + 2}: Missing required fields (Company Name, Owner Name, or Address)`
        );
        continue;
      }

      if (!partyData.email || !partyData.email.includes('@')) {
        result.failed++;
        result.errors.push(`Row ${i + 2}: Email is required and must be valid`);
        continue;
      }

      if (!partyData.phone || !/^\d{10}$/.test(partyData.phone)) {
        result.failed++;
        result.errors.push(`Row ${i + 2}: Phone number is required and must be 10 digits`);
        continue;
      }

      result.success++;
    } catch (error) {
      result.failed++;
      result.errors.push(
        `Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  return result;
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
    // This hits the endpoint: {{BASE_URL}}/api/v1/parties/details
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