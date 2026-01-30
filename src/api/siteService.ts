import api from './api';

// --- 1. Interface Segregation ---

export interface Technician {
  name: string;
  phone: string;
}

export interface SiteInterestItem {
  category: string;
  brands: string[];
  technicians?: Technician[];
}

export interface SiteCategoryData {
  _id: string;
  name: string;
  brands: string[];
}

export interface ApiSiteImage {
  imageNumber: number;
  imageUrl: string;
}

/**
 * STRICT Backend Interface matching the raw JSON response.
 * This prevents runtime errors by defining exactly what comes from the API.
 */
export interface RawApiSite {
  _id: string;
  siteName: string; // Backend uses siteName
  name?: string;     // Fallback
  prospectName?: string; // Fallback
  partyName?: string; // Fallback
  ownerName: string;
  subOrganization?: string;
  dateJoined: string;
  location?: {
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  contact?: {
    phone?: string;
    email?: string;
  };
  description?: string;
  images?: ApiSiteImage[];
  siteInterest?: SiteInterestItem[];
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface Site {
  id: string;
  name: string;
  ownerName: string;
  dateJoined: string;
  subOrgName?: string;
  address: string;
  phone: string;
  email?: string;
  latitude: number | null;
  longitude: number | null;
  description?: string;
  images: ApiSiteImage[];
  siteInterest?: SiteInterestItem[];
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
}

export type ApiSite = Site;

export interface NewSiteData {
  name: string;
  ownerName: string;
  dateJoined: string;
  subOrgName?: string;
  address: string;
  phone: string;
  email?: string;
  latitude: number | null;
  longitude: number | null;
  description?: string;
  siteInterest?: SiteInterestItem[];
}

export interface FullSiteDetailsData {
  site: RawApiSite; // Use strict RawApiSite for modals
  contact: { phone: string; email: string };
  location: { address: string; latitude: number; longitude: number };
  description?: string;
}

// --- 2. Mapper Logic (Ensuring 100% Logic Compatibility) ---

export class SiteMapper {
  static toFrontend(apiSite: RawApiSite): Site {
    return {
      id: apiSite._id,
      // ORIGINAL FALLBACK LOGIC: Ensures name display is fixed
      name: apiSite.siteName || apiSite.name || apiSite.prospectName || apiSite.partyName || '',
      ownerName: apiSite.ownerName || '',
      subOrgName: apiSite.subOrganization || undefined,
      dateJoined: apiSite.dateJoined || '',
      address: apiSite.location?.address || '',
      latitude: apiSite.location?.latitude ?? null,
      longitude: apiSite.location?.longitude ?? null,
      phone: apiSite.contact?.phone || '',
      email: apiSite.contact?.email || undefined,
      description: apiSite.description || undefined,
      images: apiSite.images || [],
      siteInterest: apiSite.siteInterest || undefined,
      createdBy: apiSite.createdBy,
      createdAt: apiSite.createdAt || '',
    };
  }

  static toApiPayload(siteData: Partial<any>): any {
    const payload: any = {};

    if (siteData.name !== undefined) payload.siteName = siteData.name;
    if (siteData.ownerName !== undefined) payload.ownerName = siteData.ownerName;
    if (siteData.subOrgName !== undefined) payload.subOrganization = siteData.subOrgName;
    if (siteData.dateJoined !== undefined) payload.dateJoined = siteData.dateJoined;
    if (siteData.description !== undefined) payload.description = siteData.description;
    if (siteData.siteInterest !== undefined) payload.siteInterest = siteData.siteInterest;

    if (siteData.address !== undefined || siteData.latitude !== undefined) {
      payload.location = {
        ...(siteData.address !== undefined && { address: siteData.address }),
        ...(siteData.latitude !== undefined && { latitude: siteData.latitude }),
        ...(siteData.longitude !== undefined && { longitude: siteData.longitude }),
      };
    }

    if (siteData.phone !== undefined || siteData.email !== undefined) {
      payload.contact = {
        ...(siteData.phone !== undefined && { phone: siteData.phone }),
        ...(siteData.email !== undefined && { email: siteData.email }),
      };
    }

    return payload;
  }
}

// --- 3. Centralized Endpoints ---

const ENDPOINTS = {
  BASE: '/sites',
  DETAIL: (id: string) => `/sites/${id}`,
  CATEGORIES: '/sites/categories',
  SUB_ORGS: '/sites/sub-organizations',
  IMAGES: (id: string) => `/sites/${id}/images`,
  IMAGE_SPECIFIC: (id: string, num: number) => `/sites/${id}/images/${num}`,
};

// --- 4. Repository Pattern ---

export const SiteRepository = {
  async getSites(): Promise<Site[]> {
    const response = await api.get(ENDPOINTS.BASE);
    return response.data.success ? response.data.data.map(SiteMapper.toFrontend) : [];
  },

  async getSiteById(siteId: string): Promise<Site> {
    const response = await api.get(ENDPOINTS.DETAIL(siteId));
    if (!response.data.success) throw new Error('Site not found');
    return SiteMapper.toFrontend(response.data.data);
  },

  async addSite(siteData: NewSiteData): Promise<Site> {
    const payload = SiteMapper.toApiPayload(siteData);
    const response = await api.post(ENDPOINTS.BASE, payload);
    return SiteMapper.toFrontend(response.data.data);
  },

  async updateSite(siteId: string, updatedData: Partial<Site>): Promise<Site> {
    const payload = SiteMapper.toApiPayload(updatedData);
    const response = await api.put(ENDPOINTS.DETAIL(siteId), payload);
    if (!response.data.success) throw new Error(response.data.message || 'Update failed');
    return SiteMapper.toFrontend(response.data.data);
  },

  async deleteSite(siteId: string): Promise<boolean> {
    const response = await api.delete(ENDPOINTS.DETAIL(siteId));
    return response.data.success;
  },

  /**
   * RE-FIXED: This returns the raw API object AND the structured components.
   * This ensures the Modals have their original 'contact' and 'location' 
   * objects while the UI gets its mapped 'site.name'.
   */
  async getFullSiteDetails(siteId: string): Promise<FullSiteDetailsData> {
    const response = await api.get(ENDPOINTS.DETAIL(siteId));
    if (!response.data.success || !response.data.data) throw new Error('Site not found');

    const apiData = response.data.data;

    return {
      // Map the site object to have the 'name' property for display
      site: {
        ...apiData,
        id: apiData._id,
        name: apiData.siteName || apiData.name || '',
        subOrgName: apiData.subOrganization
      },
      contact: apiData.contact || { phone: '', email: '' },
      location: apiData.location || { address: '', latitude: 0, longitude: 0 },
      description: apiData.description,
    };
  },

  async getSiteCategoriesList(): Promise<SiteCategoryData[]> {
    try {
      const response = await api.get(ENDPOINTS.CATEGORIES);
      return response.data.success ? response.data.data : [];
    } catch {
      return [];
    }
  },

  async getSiteSubOrganizations(): Promise<string[]> {
    try {
      const response = await api.get(ENDPOINTS.SUB_ORGS);
      return response.data.success ? response.data.data.map((org: any) => org.name) : [];
    } catch {
      return [];
    }
  },

  async uploadSiteImage(siteId: string, imageNumber: number, file: File): Promise<ApiSiteImage> {
    const formData = new FormData();
    formData.append('imageNumber', imageNumber.toString());
    formData.append('image', file);
    const response = await api.post(ENDPOINTS.IMAGES(siteId), formData);
    return response.data.data;
  },

  async deleteSiteImage(siteId: string, imageNumber: number): Promise<boolean> {
    const response = await api.delete(ENDPOINTS.IMAGE_SPECIFIC(siteId, imageNumber));
    return response.data.success;
  }
};

// --- 5. Clean Named Exports ---

export const {
  getSites,
  getSiteById,
  addSite,
  updateSite,
  deleteSite,
  getFullSiteDetails,
  getSiteCategoriesList,
  getSiteSubOrganizations,
  uploadSiteImage,
  deleteSiteImage
} = SiteRepository;