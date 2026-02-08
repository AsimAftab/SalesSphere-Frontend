import api from './api';
import { API_ENDPOINTS } from './endpoints';
import { BaseRepository } from './base';
import type { EndpointConfig } from './base';
import { handleApiError, isStatusError } from './errors';

// --- 1. Interface Segregation ---
export interface Party {
  [key: string]: unknown;
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
  createdAt?: string;
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

/**
 * PartyStatsSummary - Statistics summary for a party
 */
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
  ordersByStatus: Record<string, number>;
}

export interface PartyStatsData {
  summary: PartyStatsSummary;
  allOrders: { _id: string; invoiceNumber: string; totalAmount: number; status: string; expectedDeliveryDate: string; }[];
}

// --- 2. API Response Interface ---
interface ApiPartyResponse {
  _id: string;
  partyName?: string;
  ownerName?: string;
  location?: { address?: string; latitude?: number; longitude?: number };
  dateJoined?: string;
  createdAt?: string;
  contact?: { phone?: string; email?: string };
  panVatNumber?: string;
  description?: string;
  image?: string;
  partyType?: string;
  createdBy?: { _id: string; name: string };
}

interface PartyFormInput {
  companyName?: string;
  name?: string;
  ownerName?: string;
  dateJoined?: string;
  description?: string;
  panVat?: string;
  panVatNumber?: string;
  partyType?: string | { value?: string; name?: string };
  type?: string | { value?: string; name?: string };
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string;
  email?: string;
}

// --- 3. Mapper Logic ---
/**
 * PartyMapper - Transforms data between backend API shape and frontend domain models.
 */
class PartyMapper {
  static toFrontend(apiParty: ApiPartyResponse): Party {
    return {
      id: apiParty._id,
      companyName: apiParty.partyName || '',
      ownerName: apiParty.ownerName || '',
      address: apiParty.location?.address || '',
      latitude: apiParty.location?.latitude || null,
      longitude: apiParty.location?.longitude || null,
      dateCreated: apiParty.dateJoined || apiParty.createdAt || '',
      createdAt: apiParty.createdAt || '',
      phone: apiParty.contact?.phone || '',
      panVat: apiParty.panVatNumber || '',
      email: apiParty.contact?.email || '',
      description: apiParty.description || '',
      image: apiParty.image || null,
      partyType: apiParty.partyType || '',
      createdBy: apiParty.createdBy,
    };
  }

  static toApiPayload(partyData: PartyFormInput): Record<string, unknown> {
    const payload: Record<string, unknown> = {};

    const rawType = partyData.partyType ?? partyData.type;
    if (rawType !== undefined) {
      payload.partyType = typeof rawType === 'object' ? (rawType.value || rawType.name) : rawType;
    }

    if (partyData.companyName !== undefined) payload.partyName = partyData.companyName;
    else if (partyData.name !== undefined) payload.partyName = partyData.name;

    if (partyData.ownerName !== undefined) payload.ownerName = partyData.ownerName;
    if (partyData.dateJoined !== undefined) payload.dateJoined = partyData.dateJoined;
    if (partyData.description !== undefined) payload.description = partyData.description;

    if (partyData.panVat !== undefined) payload.panVatNumber = partyData.panVat;
    else if (partyData.panVatNumber !== undefined) payload.panVatNumber = partyData.panVatNumber;

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

// --- 4. Endpoint Configuration ---
const PARTY_ENDPOINTS: EndpointConfig = {
  BASE: API_ENDPOINTS.parties.BASE,
  DETAIL: API_ENDPOINTS.parties.DETAIL,
};

// --- 5. PartyRepositoryClass - Extends BaseRepository ---
/**
 * PartyRepositoryClass - Extends BaseRepository for standard CRUD operations.
 * Adds entity-specific methods for party management.
 */
class PartyRepositoryClass extends BaseRepository<Party, ApiPartyResponse, NewPartyData, Partial<Party>> {
  protected readonly endpoints = PARTY_ENDPOINTS;

  protected mapToFrontend(apiData: ApiPartyResponse): Party {
    return PartyMapper.toFrontend(apiData);
  }

  protected mapToPayload(data: NewPartyData | Partial<Party>): Record<string, unknown> {
    return PartyMapper.toApiPayload(data as PartyFormInput);
  }

  // --- Entity-specific methods ---

  /**
   * Fetches party statistics including orders summary.
   */
  async getPartyStats(partyId: string): Promise<PartyStatsData | null> {
    try {
      const response = await api.get(API_ENDPOINTS.invoices.PARTY_STATS(partyId));
      return response.data.success ? response.data.data : null;
    } catch (error: unknown) {
      if (isStatusError(error, 404)) return null;
      throw handleApiError(error, 'Failed to fetch party statistics');
    }
  }

  /**
   * Fetches all available party types.
   */
  async getPartyTypes(): Promise<string[]> {
    try {
      const response = await api.get(API_ENDPOINTS.parties.TYPES);
      return response.data.success ? response.data.data.map((t: { name: string }) => t.name) : [];
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch party types');
    }
  }

  /**
   * Fetches all party types as items with _id and name.
   */
  async getPartyTypeItems(): Promise<{ _id: string; name: string }[]> {
    try {
      const response = await api.get(API_ENDPOINTS.parties.TYPES);
      return response.data.success ? response.data.data : [];
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch party types');
    }
  }

  /**
   * Creates a new party type.
   */
  async createPartyType(name: string): Promise<{ _id: string; name: string }> {
    try {
      const response = await api.post(API_ENDPOINTS.parties.TYPES, { name });
      return response.data.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to create party type');
    }
  }

  /**
   * Updates a party type by ID.
   */
  async updatePartyType(id: string, name: string): Promise<{ _id: string; name: string }> {
    try {
      const response = await api.put(API_ENDPOINTS.parties.TYPE_DETAIL(id), { name });
      return response.data.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to update party type');
    }
  }

  /**
   * Deletes a party type by ID.
   */
  async deletePartyType(id: string): Promise<boolean> {
    try {
      const response = await api.delete(API_ENDPOINTS.parties.TYPE_DETAIL(id));
      return response.data.success;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to delete party type');
    }
  }

  /**
   * Uploads an image for a party.
   */
  async uploadPartyImage(partyId: string, file: File): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await api.post(API_ENDPOINTS.parties.IMAGE(partyId), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to upload party image');
    }
  }

  /**
   * Deletes the image for a party.
   */
  async deletePartyImage(partyId: string): Promise<boolean> {
    try {
      const response = await api.delete(API_ENDPOINTS.parties.IMAGE(partyId));
      return response.data.success;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to delete party image');
    }
  }

  /**
   * Bulk uploads multiple parties.
   */
  async bulkUploadParties(
    organizationId: string,
    parties: Omit<Party, 'id' | 'dateCreated'>[]
  ): Promise<BulkUploadResult> {
    const partiesPayload = parties.map(p => PartyMapper.toApiPayload(p as PartyFormInput));
    try {
      const url = organizationId
        ? API_ENDPOINTS.parties.ORG_BULK_IMPORT(organizationId)
        : API_ENDPOINTS.parties.BULK_IMPORT;

      const response = await api.post(url, { parties: partiesPayload });
      const resultData = response.data.data;
      const errors: string[] = [];

      const handleIssue = (item: { row?: number; partyName?: string; errors?: { message: string }[]; message?: string }) => {
        const msg = item.errors ? item.errors.map((e) => e.message).join(', ') : (item.message || 'Error');
        errors.push(`Row ${item.row}: ${item.partyName} - ${msg}`);
      };

      resultData.failed?.forEach(handleIssue);
      resultData.duplicates?.forEach(handleIssue);

      return {
        success: resultData.successfulCount || 0,
        failed: (resultData.failedCount || 0) + (resultData.duplicateCount || 0),
        errors
      };
    } catch (error: unknown) {
      const apiError = handleApiError(error, 'Failed to bulk upload parties');
      return {
        success: 0,
        failed: parties.length,
        errors: [apiError.message]
      };
    }
  }

  /**
   * Fetches all parties with full details.
   */
  async getAllPartiesDetails(): Promise<Party[]> {
    try {
      const response = await api.get(API_ENDPOINTS.parties.DETAILS_ALL);
      return response.data.success ? response.data.data.map(PartyMapper.toFrontend) : [];
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch party details');
    }
  }
}

// Create singleton instance
const partyRepositoryInstance = new PartyRepositoryClass();

// --- 6. PartyRepository - Public API maintaining backward compatibility ---
/**
 * PartyRepository - Maps class methods to familiar object-literal interface
 */
export const PartyRepository = {
  // Standard CRUD (from BaseRepository)
  getParties: () => partyRepositoryInstance.getAll(),
  getPartyDetails: (partyId: string) => partyRepositoryInstance.getById(partyId),
  addParty: (partyData: NewPartyData) => partyRepositoryInstance.create(partyData),
  updateParty: (partyId: string, updatedData: Partial<Party>) => partyRepositoryInstance.update(partyId, updatedData),
  deleteParty: (partyId: string) => partyRepositoryInstance.delete(partyId),

  // Entity-specific methods
  getPartyStats: (partyId: string) => partyRepositoryInstance.getPartyStats(partyId),
  getPartyTypes: () => partyRepositoryInstance.getPartyTypes(),
  getPartyTypeItems: () => partyRepositoryInstance.getPartyTypeItems(),
  createPartyType: (name: string) => partyRepositoryInstance.createPartyType(name),
  updatePartyType: (id: string, name: string) => partyRepositoryInstance.updatePartyType(id, name),
  deletePartyType: (id: string) => partyRepositoryInstance.deletePartyType(id),
  uploadPartyImage: (partyId: string, file: File) => partyRepositoryInstance.uploadPartyImage(partyId, file),
  deletePartyImage: (partyId: string) => partyRepositoryInstance.deletePartyImage(partyId),
  bulkUploadParties: (organizationId: string, parties: Omit<Party, 'id' | 'dateCreated'>[]) =>
    partyRepositoryInstance.bulkUploadParties(organizationId, parties),
  getAllPartiesDetails: () => partyRepositoryInstance.getAllPartiesDetails(),
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
  getPartyTypeItems,
  createPartyType,
  updatePartyType,
  deletePartyType,
  bulkUploadParties,
  uploadPartyImage,
  deletePartyImage,
  getAllPartiesDetails
} = PartyRepository;