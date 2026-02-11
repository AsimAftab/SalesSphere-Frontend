import api from './api';
import { API_ENDPOINTS } from './endpoints';
import { BaseRepository } from './base';
import type { EndpointConfig } from './base';
import { handleApiError } from './errors';

// --- 1. Interface Segregation ---

export interface ProspectInterest {
  category: string;
  brands: string[];
}

export interface ApiProspectImage {
  imageNumber: number;
  imageUrl: string;
}

export interface Prospect {
  [key: string]: unknown;
  id: string;
  name: string;
  ownerName: string;
  dateJoined: string;
  address: string;
  phone: string;
  latitude: number | null;
  longitude: number | null;
  email?: string;
  description?: string;
  panVat?: string;
  images: ApiProspectImage[];
  interest?: ProspectInterest[];
  createdBy?: { _id: string; name: string };
  createdAt?: string;
}

export interface NewProspectData {
  name: string;
  ownerName: string;
  dateJoined: string;
  address: string;
  phone: string;
  latitude: number | null;
  longitude: number | null;
  email?: string;
  description?: string;
  panVat?: string;
  interest?: {
    category: string;
    brands: string[];
    technicianName?: string;
    technicianPhone?: string;
  }[];
}

export interface ProspectCategoryData {
  name: string;
  brands: string[];
  _id: string;
}

export interface FullProspectDetailsData {
  prospect: Prospect;
  contact: { phone: string; email?: string };
  location: { address: string; latitude: number; longitude: number };
}

// --- 2. API Response Interface ---

interface ApiProspectResponse {
  _id: string;
  prospectName?: string;
  partyName?: string;
  ownerName?: string;
  dateJoined?: string;
  location?: { address?: string; latitude?: number; longitude?: number };
  contact?: { phone?: string; email?: string };
  description?: string;
  panVatNumber?: string;
  images?: ApiProspectImage[];
  prospectInterest?: Array<{ category: string; brands?: string[] }>;
  createdBy?: { _id: string; name: string };
  createdAt?: string;
}

interface ProspectFormInput {
  name?: string;
  ownerName?: string;
  dateJoined?: string;
  description?: string;
  panVat?: string;
  interest?: Array<{ category: string; brands: string[] }>;
  prospectInterest?: Array<{ category: string; brands: string[] }>;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string;
  email?: string;
}

// --- 3. Mapper Logic ---

/**
 * ProspectMapper - Transforms data between backend API shape and frontend domain models.
 */
class ProspectMapper {
  static toFrontend(apiProspect: ApiProspectResponse): Prospect {
    const interest: ProspectInterest[] = (apiProspect.prospectInterest || []).map((i) => ({
      category: i.category,
      brands: i.brands || [],
    }));

    return {
      id: apiProspect._id,
      name: apiProspect.prospectName || apiProspect.partyName || '',
      ownerName: apiProspect.ownerName || '',
      dateJoined: apiProspect.dateJoined || '',
      address: apiProspect.location?.address || '',
      latitude: apiProspect.location?.latitude ?? null,
      longitude: apiProspect.location?.longitude ?? null,
      phone: apiProspect.contact?.phone || '',
      email: apiProspect.contact?.email,
      description: apiProspect.description,
      panVat: apiProspect.panVatNumber,
      images: apiProspect.images || [],
      interest: interest.length > 0 ? interest : undefined,
      createdBy: apiProspect.createdBy,
      createdAt: apiProspect.createdAt || '',
    };
  }

  static toApiPayload(prospectData: ProspectFormInput): Record<string, unknown> {
    const payload: Record<string, unknown> = {};

    if (prospectData.name !== undefined) payload.prospectName = prospectData.name;
    if (prospectData.ownerName !== undefined) payload.ownerName = prospectData.ownerName;
    if (prospectData.dateJoined !== undefined) payload.dateJoined = prospectData.dateJoined;
    if (prospectData.description !== undefined) payload.description = prospectData.description;
    if (prospectData.panVat !== undefined) payload.panVatNumber = prospectData.panVat;

    const interestData = prospectData.interest || prospectData.prospectInterest;
    if (interestData) {
      payload.prospectInterest = interestData.map((item) => ({
        category: item.category,
        brands: item.brands,
      }));
    }

    if (prospectData.address !== undefined || prospectData.latitude !== undefined) {
      payload.location = {
        ...(prospectData.address !== undefined && { address: prospectData.address }),
        ...(prospectData.latitude !== undefined && { latitude: prospectData.latitude }),
        ...(prospectData.longitude !== undefined && { longitude: prospectData.longitude }),
      };
    }

    if (prospectData.phone !== undefined || prospectData.email !== undefined) {
      payload.contact = {
        ...(prospectData.phone !== undefined && { phone: prospectData.phone }),
        ...(prospectData.email !== undefined && { email: prospectData.email }),
      };
    }

    return payload;
  }
}

// --- 4. Endpoint Configuration ---

const PROSPECT_ENDPOINTS: EndpointConfig = {
  BASE: API_ENDPOINTS.prospects.BASE,
  DETAIL: API_ENDPOINTS.prospects.DETAIL,
};

// --- 5. ProspectRepositoryClass - Extends BaseRepository ---

/**
 * ProspectRepositoryClass - Extends BaseRepository for standard CRUD operations.
 */
class ProspectRepositoryClass extends BaseRepository<Prospect, ApiProspectResponse, NewProspectData, Partial<Prospect>> {
  protected readonly endpoints = PROSPECT_ENDPOINTS;

  protected mapToFrontend(apiData: ApiProspectResponse): Prospect {
    return ProspectMapper.toFrontend(apiData);
  }

  protected mapToPayload(data: NewProspectData | Partial<Prospect>): Record<string, unknown> {
    return ProspectMapper.toApiPayload(data as ProspectFormInput);
  }

  // --- Entity-specific methods ---

  /**
   * Transfers a prospect to a party (converts prospect to party).
   */
  async transferProspectToParty(prospectId: string): Promise<{ _id: string }> {
    try {
      const response = await api.post(API_ENDPOINTS.prospects.TRANSFER(prospectId));
      return response.data.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to transfer prospect to party');
    }
  }

  /**
   * Fetches all prospect categories with brands.
   */
  async getProspectCategoriesList(): Promise<ProspectCategoryData[]> {
    try {
      const response = await api.get(API_ENDPOINTS.prospects.CATEGORIES);
      return response.data.data || [];
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch prospect categories');
    }
  }

  /**
   * Fetches full prospect details with contact and location.
   */
  async getFullProspectDetails(prospectId: string): Promise<FullProspectDetailsData> {
    try {
      const response = await api.get(API_ENDPOINTS.prospects.DETAIL(prospectId));
      if (!response.data.success || !response.data.data) {
        throw new Error('Prospect not found');
      }

      const mapped = ProspectMapper.toFrontend(response.data.data);
      return {
        prospect: mapped,
        contact: { phone: mapped.phone, email: mapped.email },
        location: {
          address: mapped.address,
          latitude: mapped.latitude || 0,
          longitude: mapped.longitude || 0
        },
      };
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch prospect details');
    }
  }

  /**
   * Uploads an image to a prospect.
   */
  async uploadProspectImage(prospectId: string, imageNumber: number, file: File): Promise<ApiProspectImage> {
    try {
      const formData = new FormData();
      formData.append('imageNumber', imageNumber.toString());
      formData.append('image', file);

      const response = await api.post(API_ENDPOINTS.prospects.IMAGE_BASE(prospectId), formData);
      return response.data.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to upload prospect image');
    }
  }

  /**
   * Deletes an image from a prospect.
   */
  async deleteProspectImage(prospectId: string, imageNumber: number): Promise<boolean> {
    try {
      const response = await api.delete(API_ENDPOINTS.prospects.IMAGE_SPECIFIC(prospectId, imageNumber));
      return response.data.success;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to delete prospect image');
    }
  }

  /**
   * Fetches all prospects with full details.
   */
  async getAllProspectsDetails(): Promise<Prospect[]> {
    try {
      const response = await api.get(API_ENDPOINTS.prospects.DETAILS_ALL);
      return response.data.success ? response.data.data.map(ProspectMapper.toFrontend) : [];
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch all prospect details');
    }
  }
}

// Create singleton instance
const prospectRepositoryInstance = new ProspectRepositoryClass();

// --- 6. ProspectRepository - Public API maintaining backward compatibility ---

export const ProspectRepository = {
  // Standard CRUD (from BaseRepository)
  getProspects: () => prospectRepositoryInstance.getAll(),
  getProspectById: (prospectId: string) => prospectRepositoryInstance.getById(prospectId),
  addProspect: (prospectData: NewProspectData) => prospectRepositoryInstance.create(prospectData),
  updateProspect: (prospectId: string, updatedData: Partial<Prospect>) => prospectRepositoryInstance.update(prospectId, updatedData),
  deleteProspect: (prospectId: string) => prospectRepositoryInstance.delete(prospectId),

  // Entity-specific methods
  transferProspectToParty: (prospectId: string) => prospectRepositoryInstance.transferProspectToParty(prospectId),
  getProspectCategoriesList: () => prospectRepositoryInstance.getProspectCategoriesList(),
  getFullProspectDetails: (prospectId: string) => prospectRepositoryInstance.getFullProspectDetails(prospectId),
  uploadProspectImage: (prospectId: string, imageNumber: number, file: File) =>
    prospectRepositoryInstance.uploadProspectImage(prospectId, imageNumber, file),
  deleteProspectImage: (prospectId: string, imageNumber: number) =>
    prospectRepositoryInstance.deleteProspectImage(prospectId, imageNumber),
  getAllProspectsDetails: () => prospectRepositoryInstance.getAllProspectsDetails(),
};

// --- 7. Clean Named Exports ---

export const {
  getProspects,
  getProspectById,
  addProspect,
  updateProspect,
  deleteProspect,
  transferProspectToParty,
  getProspectCategoriesList,
  getFullProspectDetails,
  uploadProspectImage,
  deleteProspectImage,
  getAllProspectsDetails
} = ProspectRepository;
