import api from './api';

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

// --- 2. Mapper Logic ---

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

    // Map Location
    if (prospectData.address !== undefined || prospectData.latitude !== undefined) {
      payload.location = {
        ...(prospectData.address !== undefined && { address: prospectData.address }),
        ...(prospectData.latitude !== undefined && { latitude: prospectData.latitude }),
        ...(prospectData.longitude !== undefined && { longitude: prospectData.longitude }),
      };
    }

    // Map Contact
    if (prospectData.phone !== undefined || prospectData.email !== undefined) {
      payload.contact = {
        ...(prospectData.phone !== undefined && { phone: prospectData.phone }),
        ...(prospectData.email !== undefined && { email: prospectData.email }),
      };
    }

    return payload;
  }
}

// --- 3. Centralized Endpoints ---

const ENDPOINTS = {
  BASE: '/prospects',
  DETAIL: (id: string) => `/prospects/${id}`,
  TRANSFER: (id: string) => `/prospects/${id}/transfer`,
  CATEGORIES: '/prospects/categories',
  DETAILS_ALL: '/prospects/details',
  IMAGE_BASE: (id: string) => `/prospects/${id}/images`,
  IMAGE_SPECIFIC: (id: string, num: number) => `/prospects/${id}/images/${num}`,
};

// --- 4. Repository Pattern ---

export const ProspectRepository = {
  async getProspects(): Promise<Prospect[]> {
    const response = await api.get(ENDPOINTS.BASE);
    return response.data.success ? response.data.data.map(ProspectMapper.toFrontend) : [];
  },

  async getProspectById(prospectId: string): Promise<Prospect> {
    const response = await api.get(ENDPOINTS.DETAIL(prospectId));
    if (!response.data.success) throw new Error('Prospect not found');
    return ProspectMapper.toFrontend(response.data.data);
  },

  async addProspect(prospectData: NewProspectData): Promise<Prospect> {
    const payload = ProspectMapper.toApiPayload(prospectData);
    const response = await api.post(ENDPOINTS.BASE, payload);
    return ProspectMapper.toFrontend(response.data.data);
  },

  async updateProspect(prospectId: string, updatedData: Partial<Prospect>): Promise<Prospect> {
    const payload = ProspectMapper.toApiPayload(updatedData);
    const response = await api.put(ENDPOINTS.DETAIL(prospectId), payload);
    if (!response.data.success) throw new Error(response.data.message || 'Update failed');
    return ProspectMapper.toFrontend(response.data.data);
  },

  async deleteProspect(prospectId: string): Promise<boolean> {
    const response = await api.delete(ENDPOINTS.DETAIL(prospectId));
    return response.data.success;
  },

  async transferProspectToParty(prospectId: string): Promise<{ _id: string }> {
    const response = await api.post(ENDPOINTS.TRANSFER(prospectId));
    return response.data.data;
  },

  async getProspectCategoriesList(): Promise<ProspectCategoryData[]> {
    const response = await api.get(ENDPOINTS.CATEGORIES);
    return response.data.data || [];
  },

  async getFullProspectDetails(prospectId: string): Promise<FullProspectDetailsData> {
    const response = await api.get(ENDPOINTS.DETAIL(prospectId));
    if (!response.data.success || !response.data.data) throw new Error('Prospect not found');
    
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
  },

  async uploadProspectImage(prospectId: string, imageNumber: number, file: File): Promise<ApiProspectImage> {
    const formData = new FormData();
    formData.append('imageNumber', imageNumber.toString());
    formData.append('image', file);
    
    const response = await api.post(ENDPOINTS.IMAGE_BASE(prospectId), formData);
    return response.data.data;
  },

  async deleteProspectImage(prospectId: string, imageNumber: number): Promise<boolean> {
    const response = await api.delete(ENDPOINTS.IMAGE_SPECIFIC(prospectId, imageNumber));
    return response.data.success;
  },

  async getAllProspectsDetails(): Promise<Prospect[]> {
    const response = await api.get(ENDPOINTS.DETAILS_ALL);
    return response.data.success ? response.data.data.map(ProspectMapper.toFrontend) : [];
  }
};

// --- 5. Clean Named Exports ---

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