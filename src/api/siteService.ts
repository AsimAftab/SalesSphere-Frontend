import api from './api';
import { API_ENDPOINTS } from './endpoints';
import { BaseRepository } from './base';
import type { EndpointConfig } from './base';
import { handleApiError } from './errors';

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
  technicians?: Technician[];
}

export interface SiteCategoryPayload {
  name: string;
  brands?: string[];
  technicians?: Technician[];
}

export interface ApiSiteImage {
  imageNumber: number;
  imageUrl: string;
}

/**
 * Raw API Site response matching the backend JSON structure.
 */
export interface RawApiSite {
  _id: string;
  siteName: string;
  name?: string;
  prospectName?: string;
  partyName?: string;
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
  createdAt?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface Site {
  [key: string]: unknown;
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
  site: RawApiSite;
  contact: { phone: string; email: string };
  location: { address: string; latitude: number; longitude: number };
  description?: string;
}

// --- 2. Form Input Interface ---

interface SiteFormInput {
  name?: string;
  ownerName?: string;
  subOrgName?: string;
  dateJoined?: string;
  description?: string;
  siteInterest?: SiteInterestItem[];
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string;
  email?: string;
}

// --- 3. Mapper Logic ---

/**
 * SiteMapper - Transforms data between backend API shape and frontend domain models.
 */
export class SiteMapper {
  static toFrontend(apiSite: RawApiSite): Site {
    return {
      id: apiSite._id,
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

  static toApiPayload(siteData: SiteFormInput): Record<string, unknown> {
    const payload: Record<string, unknown> = {};

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

// --- 4. Endpoint Configuration ---

const SITE_ENDPOINTS: EndpointConfig = {
  BASE: API_ENDPOINTS.sites.BASE,
  DETAIL: API_ENDPOINTS.sites.DETAIL,
};

// --- 5. SiteRepositoryClass - Extends BaseRepository ---

/**
 * SiteRepositoryClass - Extends BaseRepository for standard CRUD operations.
 */
class SiteRepositoryClass extends BaseRepository<Site, RawApiSite, NewSiteData, Partial<Site>> {
  protected readonly endpoints = SITE_ENDPOINTS;

  protected mapToFrontend(apiData: RawApiSite): Site {
    return SiteMapper.toFrontend(apiData);
  }

  protected mapToPayload(data: NewSiteData | Partial<Site>): Record<string, unknown> {
    return SiteMapper.toApiPayload(data as SiteFormInput);
  }

  // --- Entity-specific methods ---

  /**
   * Fetches full site details with contact and location objects.
   */
  async getFullSiteDetails(siteId: string): Promise<FullSiteDetailsData> {
    try {
      const response = await api.get(API_ENDPOINTS.sites.DETAIL(siteId));
      if (!response.data.success || !response.data.data) {
        throw new Error('Site not found');
      }

      const apiData = response.data.data;

      return {
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
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch site details');
    }
  }

  /**
   * Fetches all site categories with brands.
   */
  async getSiteCategoriesList(): Promise<SiteCategoryData[]> {
    try {
      const response = await api.get(API_ENDPOINTS.sites.CATEGORIES);
      return response.data.success ? response.data.data : [];
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch site categories');
    }
  }

  async getSiteCategoryItems(): Promise<{ _id: string; name: string }[]> {
    const categories = await this.getSiteCategoriesList();
    return categories.map((category) => ({ _id: category._id, name: category.name }));
  }

  async createSiteCategory(input: string | SiteCategoryPayload): Promise<SiteCategoryData> {
    try {
      const payload: SiteCategoryPayload = typeof input === 'string' ? { name: input } : input;
      const response = await api.post(API_ENDPOINTS.sites.CATEGORIES, payload);
      return response.data.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to create site category');
    }
  }

  async updateSiteCategory(id: string, input: string | SiteCategoryPayload): Promise<SiteCategoryData> {
    try {
      const payload: SiteCategoryPayload = typeof input === 'string' ? { name: input } : input;
      const response = await api.put(API_ENDPOINTS.sites.CATEGORY_DETAIL(id), payload);
      return response.data.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to update site category');
    }
  }

  async deleteSiteCategory(id: string): Promise<boolean> {
    try {
      const response = await api.delete(API_ENDPOINTS.sites.CATEGORY_DETAIL(id));
      return response.data.success;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to delete site category');
    }
  }

  /**
   * Fetches all sub-organizations for sites.
   */
  async getSiteSubOrganizations(): Promise<string[]> {
    try {
      const response = await api.get(API_ENDPOINTS.sites.SUB_ORGS);
      return response.data.success ? response.data.data.map((org: { name: string }) => org.name) : [];
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch sub-organizations');
    }
  }

  /**
   * Fetches all sub-organizations as items with _id and name.
   */
  async getSubOrganizationItems(): Promise<{ _id: string; name: string }[]> {
    try {
      const response = await api.get(API_ENDPOINTS.sites.SUB_ORGS);
      return response.data.success ? response.data.data : [];
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch sub-organizations');
    }
  }

  /**
   * Creates a new sub-organization.
   */
  async createSubOrganization(name: string): Promise<{ _id: string; name: string }> {
    try {
      const response = await api.post(API_ENDPOINTS.sites.SUB_ORGS, { name });
      return response.data.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to create sub-organization');
    }
  }

  /**
   * Updates a sub-organization by ID.
   */
  async updateSubOrganization(id: string, name: string): Promise<{ _id: string; name: string }> {
    try {
      const response = await api.put(API_ENDPOINTS.sites.SUB_ORG_DETAIL(id), { name });
      return response.data.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to update sub-organization');
    }
  }

  /**
   * Deletes a sub-organization by ID.
   */
  async deleteSubOrganization(id: string): Promise<boolean> {
    try {
      const response = await api.delete(API_ENDPOINTS.sites.SUB_ORG_DETAIL(id));
      return response.data.success;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to delete sub-organization');
    }
  }

  /**
   * Uploads an image to a site.
   */
  async uploadSiteImage(siteId: string, imageNumber: number, file: File): Promise<ApiSiteImage> {
    try {
      const formData = new FormData();
      formData.append('imageNumber', imageNumber.toString());
      formData.append('image', file);
      const response = await api.post(API_ENDPOINTS.sites.IMAGES(siteId), formData);
      return response.data.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to upload site image');
    }
  }

  /**
   * Deletes an image from a site.
   */
  async deleteSiteImage(siteId: string, imageNumber: number): Promise<boolean> {
    try {
      const response = await api.delete(API_ENDPOINTS.sites.IMAGE_SPECIFIC(siteId, imageNumber));
      return response.data.success;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to delete site image');
    }
  }

  /**
   * Fetches available technicians/contacts for sites.
   */
  async getTechnicians(): Promise<Technician[]> {
    try {
      // Assuming endpoint exists as per user request, using a likely path or falling back to a role-based user fetch if needed.
      // For now, mapping to a hypothetical /sites/technicians or similar if it existed, but based on user saying "see the end point for that",
      // and previous file specific searches failing, I will use a generic users fetch filtered by role alias if possible, 
      // OR specifically add the endpoint if I missed it.
      // WAITING: If user meant an existing endpoint I missed, I'll use that.
      // For now, I will use a placeholder endpoint that I will add to endpoints.ts to make it real.
      const response = await api.get(API_ENDPOINTS.sites.TECHNICIANS);
      return response.data.success ? response.data.data : [];
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch technicians');
    }
  }
}

// Create singleton instance
const siteRepositoryInstance = new SiteRepositoryClass();

// --- 6. SiteRepository - Public API maintaining backward compatibility ---

export const SiteRepository = {
  // Standard CRUD (from BaseRepository)
  getSites: () => siteRepositoryInstance.getAll(),
  getSiteById: (siteId: string) => siteRepositoryInstance.getById(siteId),
  addSite: (siteData: NewSiteData) => siteRepositoryInstance.create(siteData),
  updateSite: (siteId: string, updatedData: Partial<Site>) => siteRepositoryInstance.update(siteId, updatedData),
  deleteSite: (siteId: string) => siteRepositoryInstance.delete(siteId),

  // Entity-specific methods
  getFullSiteDetails: (siteId: string) => siteRepositoryInstance.getFullSiteDetails(siteId),
  getSiteCategoriesList: () => siteRepositoryInstance.getSiteCategoriesList(),
  getSiteCategoryItems: () => siteRepositoryInstance.getSiteCategoryItems(),
  getSiteSubOrganizations: () => siteRepositoryInstance.getSiteSubOrganizations(),
  createSiteCategory: (input: string | SiteCategoryPayload) => siteRepositoryInstance.createSiteCategory(input),
  updateSiteCategory: (id: string, input: string | SiteCategoryPayload) => siteRepositoryInstance.updateSiteCategory(id, input),
  deleteSiteCategory: (id: string) => siteRepositoryInstance.deleteSiteCategory(id),
  getSubOrganizationItems: () => siteRepositoryInstance.getSubOrganizationItems(),
  createSubOrganization: (name: string) => siteRepositoryInstance.createSubOrganization(name),
  updateSubOrganization: (id: string, name: string) => siteRepositoryInstance.updateSubOrganization(id, name),
  deleteSubOrganization: (id: string) => siteRepositoryInstance.deleteSubOrganization(id),
  uploadSiteImage: (siteId: string, imageNumber: number, file: File) =>
    siteRepositoryInstance.uploadSiteImage(siteId, imageNumber, file),
  deleteSiteImage: (siteId: string, imageNumber: number) =>
    siteRepositoryInstance.deleteSiteImage(siteId, imageNumber),
  getTechnicians: () => siteRepositoryInstance.getTechnicians(),
};

// --- 7. Clean Named Exports ---

export const {
  getSites,
  getSiteById,
  addSite,
  updateSite,
  deleteSite,
  getFullSiteDetails,
  getSiteCategoriesList,
  getSiteCategoryItems,
  getSiteSubOrganizations,
  createSiteCategory,
  updateSiteCategory,
  deleteSiteCategory,
  getSubOrganizationItems,
  createSubOrganization,
  updateSubOrganization,
  deleteSubOrganization,
  uploadSiteImage,
  deleteSiteImage,
  getTechnicians
} = SiteRepository;
