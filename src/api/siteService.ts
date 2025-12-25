import api from './api';

// --- NEW TYPES FOR SITE INTEREST ---
export interface Technician {
  name: string;
  phone: string;
}

export interface SiteInterestItem {
  category: string;
  brands: string[];
  technicians?: Technician[];
}

// ✅ 1. Add SiteCategoryData Interface (Fixes error 1 & 2)
export interface SiteCategoryData {
  _id: string;
  name: string;
  brands: string[];
}

// --- IMAGE TYPE ---
export interface ApiSiteImage {
  imageNumber: number;
  imageUrl: string;
}

// --- Frontend Site Interface ---
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
}

// --- New Site Data Interface ---
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

// --- API Site Interface ---
export interface ApiSite {
  _id: string;
  siteName: string;
  ownerName: string;
  // ✅ Ensure this property is exactly 'subOrganization'
  subOrganization?: string;
  dateJoined: string;
  contact: {
    phone: string;
    email: string;
  };
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  description?: string;
  images: ApiSiteImage[];
  siteInterest?: SiteInterestItem[];
  createdBy?: {
    _id: string;
    name: string;
    email: string;
    id?: string;
  };
}

// --- API New Site Data Interface ---
export interface ApiNewSiteData {
  siteName: string;
  ownerName: string;
  dateJoined: string;
  subOrganization?: string;
  contact: {
    phone: string;
    email?: string;
  };
  location: {
    address: string;
    latitude: number | null;
    longitude: number | null;
  };
  description?: string;
  siteInterest?: SiteInterestItem[];
}

// --- Responses ---
interface GetSitesResponse { success: boolean; data: ApiSite[]; }
interface SiteResponse { success: boolean; data: ApiSite; }
interface DeleteSiteResponse { success: boolean; message: string; }
interface ApiImageResponseData { imageNumber: number; imageUrl: string; }
interface UploadSiteImageResponse { success: boolean; message: string; data: ApiImageResponseData; }

// --- Helpers ---
const getErrorMessage = (error: any, defaultMsg: string) => {
  return error.response?.data?.message || error.message || defaultMsg;
};

// --- Mappers ---
const mapApiToFrontend = (apiSite: ApiSite): Site => {
  return {
    id: apiSite._id,
    name: apiSite.siteName,
    ownerName: apiSite.ownerName,
    subOrgName: apiSite.subOrganization || undefined,
    dateJoined: apiSite.dateJoined,
    address: apiSite.location?.address || '',
    latitude: apiSite.location?.latitude || null,
    longitude: apiSite.location?.longitude || null,
    phone: apiSite.contact?.phone || '',
    email: apiSite.contact?.email || undefined,
    description: apiSite.description || undefined,
    images: apiSite.images || [],
    siteInterest: apiSite.siteInterest || undefined,
  };
};

const mapFrontendToApiCreate = (siteData: NewSiteData): ApiNewSiteData => {
  return {
    siteName: siteData.name,
    ownerName: siteData.ownerName,
    dateJoined: siteData.dateJoined,
    subOrganization: siteData.subOrgName || undefined,
    contact: { phone: siteData.phone, email: siteData.email || undefined },
    location: { address: siteData.address, latitude: siteData.latitude, longitude: siteData.longitude },
    description: siteData.description || undefined,
    siteInterest: siteData.siteInterest || undefined,
  };
};

const mapFrontendToApiUpdate = (siteData: Partial<Site>): Partial<ApiNewSiteData> => {
  const apiData: Partial<ApiNewSiteData> & { location?: any; contact?: any; } = {};
  if (siteData.name !== undefined) apiData.siteName = siteData.name;
  if (siteData.ownerName !== undefined) apiData.ownerName = siteData.ownerName;
  if (siteData.subOrgName !== undefined) apiData.subOrganization = siteData.subOrgName;
  if (siteData.dateJoined !== undefined) apiData.dateJoined = siteData.dateJoined;
  if (siteData.description !== undefined) apiData.description = siteData.description;
  if (siteData.siteInterest !== undefined) apiData.siteInterest = siteData.siteInterest;

  const location: any = {};
  if (siteData.address !== undefined) location.address = siteData.address;
  if (siteData.latitude !== undefined) location.latitude = siteData.latitude;
  if (siteData.longitude !== undefined) location.longitude = siteData.longitude;
  if (Object.keys(location).length > 0) apiData.location = location;

  const contact: any = {};
  if (siteData.phone !== undefined) contact.phone = siteData.phone;
  if (siteData.email !== undefined) contact.email = siteData.email;
  if (Object.keys(contact).length > 0) apiData.contact = contact;

  return apiData;
};

// --- CRUD Functions ---

export const addSite = async (siteData: NewSiteData): Promise<Site> => {
  try {
    const apiPayload = mapFrontendToApiCreate(siteData);
    const response = await api.post<SiteResponse>('/sites', apiPayload);
    return mapApiToFrontend(response.data.data);
  } catch (error: any) {
    throw new Error(getErrorMessage(error, 'Failed to create site'));
  }
};

export const getSites = async (): Promise<Site[]> => {
  try {
    const response = await api.get<GetSitesResponse>('/sites');
    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data.map(mapApiToFrontend);
    }
    return [];
  } catch (error: any) {
    throw new Error(getErrorMessage(error, 'Failed to fetch sites'));
  }
};

export const getSiteById = async (siteId: string): Promise<Site> => {
  try {
    const response = await api.get<SiteResponse>(`/sites/${siteId}`);
    if (response.data.success && response.data.data) {
      return mapApiToFrontend(response.data.data);
    } else {
      throw new Error('Site not found');
    }
  } catch (error: any) {
    throw new Error(getErrorMessage(error, 'Failed to fetch site details'));
  }
};

export const updateSite = async (siteId: string, updatedData: Partial<Site>): Promise<Site> => {
  try {
    const apiPayload = mapFrontendToApiUpdate(updatedData);
    const response = await api.put<SiteResponse>(`/sites/${siteId}`, apiPayload);
    return mapApiToFrontend(response.data.data);
  } catch (error: any) {
    throw new Error(getErrorMessage(error, 'Failed to update site'));
  }
};

export const deleteSite = async (siteId: string): Promise<boolean> => {
  try {
    const response = await api.delete<DeleteSiteResponse>(`/sites/${siteId}`);
    return response.data.success;
  } catch (error: any) {
    throw new Error(getErrorMessage(error, 'Failed to delete site'));
  }
};

export interface FullSiteDetailsData {
  site: ApiSite;
  contact: { phone: string; email: string };
  location: { address: string; latitude: number; longitude: number };
  description?: string;
}

export const getFullSiteDetails = async (siteId: string): Promise<FullSiteDetailsData> => {
  try {
    const response = await api.get<SiteResponse>(`/sites/${siteId}`);
    if (!response.data.success || !response.data.data) {
      throw new Error('Site not found');
    }
    const apiSite = response.data.data;
    return {
      site: apiSite,
      contact: apiSite.contact,
      location: apiSite.location,
      description: apiSite.description,
    };
  } catch (error: any) {
    throw new Error(getErrorMessage(error, 'Failed to fetch site details'));
  }
};

export const uploadSiteImage = async (siteId: string, imageNumber: number, imageFile: File): Promise<ApiImageResponseData> => {
  try {
    const formData = new FormData();
    formData.append('imageNumber', imageNumber.toString());
    formData.append('image', imageFile);
    const response = await api.post<UploadSiteImageResponse>(`/sites/${siteId}/images`, formData);
    return response.data.data;
  } catch (error: any) {
    throw new Error(getErrorMessage(error, 'Failed to upload image'));
  }
};

export const deleteSiteImage = async (siteId: string, imageNumber: number): Promise<boolean> => {
  try {
    const response = await api.delete<DeleteSiteResponse>(`/sites/${siteId}/images/${imageNumber}`);
    return response.data.success;
  } catch (error: any) {
    throw new Error(getErrorMessage(error, 'Failed to delete image'));
  }
};

// ✅ 2. Add getSiteCategoriesList Function (Fixes error 1)
export const getSiteCategoriesList = async (): Promise<SiteCategoryData[]> => {
  try {
    const response = await api.get<{ success: boolean; data: SiteCategoryData[] }>('/sites/categories');
    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error: any) {
    console.error('Failed to fetch site categories', error);
    return [];
  }
};

export const getSiteSubOrganizations = async (): Promise<string[]> => {
  try {
    const response = await api.get<{ success: boolean; data: { _id: string; name: string }[] }>('/sites/sub-organizations');
    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data.map(org => org.name);
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch sub-organizations', error);
    return [];
  }
};