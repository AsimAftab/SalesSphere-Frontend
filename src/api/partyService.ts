import api from './api';

// --- 1. Interface Segregation (Preserved) ---
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

export interface PartyStatsData {
  summary: {
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
  };
  allOrders: any[];
}

/**
 * 2. Mapper Logic
 * FIXED: Reverted to nested objects to satisfy Backend Zod Schema.
 */
class PartyMapper {
  static toFrontend(apiParty: any): Party {
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
  }

  static toApiPayload(partyData: Partial<any>): any {
    const payload: any = {};

    // 1. Party Type Fix: Extract string value from possible UI object
    const rawType = partyData.partyType ?? partyData.type;
    if (rawType !== undefined) {
      payload.partyType = typeof rawType === 'object' ? (rawType.value || rawType.name) : rawType;
    }

    // 2. Main Fields
    if (partyData.companyName !== undefined) payload.partyName = partyData.companyName;
    else if (partyData.name !== undefined) payload.partyName = partyData.name;

    if (partyData.ownerName !== undefined) payload.ownerName = partyData.ownerName;
    if (partyData.dateJoined !== undefined) payload.dateJoined = partyData.dateJoined;
    if (partyData.description !== undefined) payload.description = partyData.description;

    if (partyData.panVat !== undefined) payload.panVatNumber = partyData.panVat;
    else if (partyData.panVatNumber !== undefined) payload.panVatNumber = partyData.panVatNumber;

    // 3. Nested Objects: REQUIRED for Backend Zod Schema validation
    // We construct full objects instead of dot-notation so Zod.parse() accepts them
    if (partyData.address !== undefined || partyData.latitude !== undefined) {
      payload.location = {
        ...(partyData.address !== undefined && { address: partyData.address }),
        ...(partyData.latitude !== undefined && { latitude: partyData.latitude }),
        ...(partyData.longitude !== undefined && { longitude: partyData.longitude }),
      };
    }

    if (partyData.phone !== undefined || partyData.email !== undefined) {
      payload.contact = {
        ...(partyData.phone !== undefined && { phone: partyData.phone }),
        ...(partyData.email !== undefined && { email: partyData.email }),
      };
    }

    return payload;
  }
}

// --- 3. Centralized Endpoints ---
const ENDPOINTS = {
  BASE: '/parties',
  DETAIL: (id: string) => `/parties/${id}`,
  IMAGE: (id: string) => `/parties/${id}/image`,
  TYPES: '/parties/types',
  BULK: '/parties/bulk-import',
  DETAILS_ALL: '/parties/details',
  STATS: (id: string) => `/invoices/parties/${id}/stats`,
};

/**
 * 4. Repository Pattern
 */
export const PartyRepository = {
  async getParties(): Promise<Party[]> {
    const response = await api.get(ENDPOINTS.BASE);
    return response.data.success ? response.data.data.map(PartyMapper.toFrontend) : [];
  },

  async getPartyDetails(partyId: string): Promise<Party> {
    const response = await api.get(ENDPOINTS.DETAIL(partyId));
    if (!response.data.success) throw new Error('Party not found');
    return PartyMapper.toFrontend(response.data.data);
  },

  async getPartyStats(partyId: string): Promise<PartyStatsData | null> {
    try {
      const response = await api.get(ENDPOINTS.STATS(partyId));
      return response.data.success ? response.data.data : null;
    } catch (error: any) {
      // Handles 404 until route is added to backend
      if (error.response?.status === 404) return null;
      throw error;
    }
  },

  async addParty(partyData: NewPartyData): Promise<Party> {
    const payload = PartyMapper.toApiPayload(partyData);
    const response = await api.post(ENDPOINTS.BASE, payload);
    return PartyMapper.toFrontend(response.data.data);
  },

  async updateParty(partyId: string, updatedData: Partial<Party>): Promise<Party> {
    // Sends nested objects to match the Zod schema expectation in party.controller.js
    const payload = PartyMapper.toApiPayload(updatedData);
    const response = await api.put(ENDPOINTS.DETAIL(partyId), payload);
    
    if (response.data.success) {
      return PartyMapper.toFrontend(response.data.data);
    }
    throw new Error(response.data.message || 'Update failed');
  },

  async deleteParty(partyId: string): Promise<boolean> {
    const response = await api.delete(ENDPOINTS.DETAIL(partyId));
    return response.data.success;
  },

  async getPartyTypes(): Promise<string[]> {
    try {
      const response = await api.get(ENDPOINTS.TYPES);
      return response.data.success ? response.data.data.map((t: any) => t.name) : [];
    } catch (error) {
      return [];
    }
  },

  async uploadPartyImage(partyId: string, file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post(ENDPOINTS.IMAGE(partyId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  async deletePartyImage(partyId: string): Promise<boolean> {
    const response = await api.delete(ENDPOINTS.IMAGE(partyId));
    return response.data.success;
  },

  async bulkUploadParties(
    _organizationId: string,
    parties: Omit<Party, 'id' | 'dateCreated'>[]
  ): Promise<BulkUploadResult> {
    const partiesPayload = parties.map(p => PartyMapper.toApiPayload(p));
    try {
      const response = await api.post(ENDPOINTS.BULK, { parties: partiesPayload });
      const resultData = response.data.data;
      const errors: string[] = [];

      const handleIssue = (item: any) => {
        const msg = item.errors ? item.errors.map((e: any) => e.message).join(', ') : (item.message || 'Error');
        errors.push(`Row ${item.row}: ${item.partyName} - ${msg}`);
      };

      resultData.failed?.forEach(handleIssue);
      resultData.duplicates?.forEach(handleIssue);

      return {
        success: resultData.successfulCount || 0,
        failed: (resultData.failedCount || 0) + (resultData.duplicateCount || 0),
        errors
      };
    } catch (error: any) {
      return {
        success: 0,
        failed: parties.length,
        errors: [error.response?.data?.message || "Service error"]
      };
    }
  },

  async getAllPartiesDetails(): Promise<Party[]> {
    const response = await api.get(ENDPOINTS.DETAILS_ALL);
    return response.data.success ? response.data.data.map(PartyMapper.toFrontend) : [];
  }
};

// --- 5. Clean Named Exports ---
export const {
  getParties,
  getPartyDetails,
  getPartyStats,
  addParty,
  updateParty,
  deleteParty,
  getPartyTypes,
  bulkUploadParties,
  uploadPartyImage,
  deletePartyImage,
  getAllPartiesDetails
} = PartyRepository;