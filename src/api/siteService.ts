import api from './api';

// --- NEW IMAGE TYPE ---
export interface ApiSiteImage {
  imageNumber: number;
  imageUrl: string;
}

export interface Site {
  id: string;
  name: string;
  ownerName: string;
  dateJoined: string;
  address: string;
  phone: string;
  email?: string;
  latitude: number | null;
  longitude: number | null;
  description?: string;
  images: ApiSiteImage[]; // <-- ADDED
}

export interface NewSiteData {
  name: string;
  ownerName: string;
  dateJoined: string;
  address: string;
  phone: string;
  email?: string;
  latitude: number | null;
  longitude: number | null;
  description?: string;
}

export interface ApiSite {
  _id: string;
  siteName: string;
  ownerName: string;
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
  images: ApiSiteImage[]; // <-- ADDED
}

export interface ApiNewSiteData {
  siteName: string;
  ownerName: string;
  dateJoined: string;
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
}

interface GetSitesResponse {
  success: boolean;
  data: ApiSite[];
}

interface SiteResponse {
  success: boolean;
  data: ApiSite;
}

interface DeleteSiteResponse {
  success: boolean;
  message: string;
}

// --- NEW IMAGE RESPONSE TYPES ---
interface ApiImageResponseData {
  imageNumber: number;
  imageUrl: string;
}

interface UploadSiteImageResponse {
  success: boolean;
  message: string;
  data: ApiImageResponseData;
}

// --- HELPER ---
const getErrorMessage = (error: any, defaultMsg: string) => {
  return error.response?.data?.message || error.message || defaultMsg;
};

// --- MAPPERS ---
const mapApiToFrontend = (apiSite: ApiSite): Site => {
  return {
    id: apiSite._id,
    name: apiSite.siteName,
    ownerName: apiSite.ownerName,
    dateJoined: apiSite.dateJoined,
    address: apiSite.location?.address || '',
    latitude: apiSite.location?.latitude || null,
    longitude: apiSite.location?.longitude || null,
    phone: apiSite.contact?.phone || '',
    email: apiSite.contact?.email || undefined,
    description: apiSite.description || undefined,
    images: apiSite.images || [], // <-- ADDED
  };
};

/**
 * Maps the frontend's NewSiteData to the API's create structure.
 */
const mapFrontendToApiCreate = (siteData: NewSiteData): ApiNewSiteData => {
  return {
    siteName: siteData.name,
    ownerName: siteData.ownerName,
    dateJoined: siteData.dateJoined,
    contact: {
      phone: siteData.phone,
      email: siteData.email || undefined,
    },
    location: {
      address: siteData.address,
      latitude: siteData.latitude,
      longitude: siteData.longitude,
    },
    description: siteData.description || undefined,
  };
};

/**
 * Maps a frontend Partial<Site> to the API's update structure.
 */
const mapFrontendToApiUpdate = (
  siteData: Partial<Site>
): Partial<ApiNewSiteData> => {
  const apiData: Partial<ApiNewSiteData> & {
    location?: any;
    contact?: any;
  } = {};

  if (siteData.name !== undefined) apiData.siteName = siteData.name;
  if (siteData.ownerName !== undefined)
    apiData.ownerName = siteData.ownerName;
  if (siteData.dateJoined !== undefined)
    apiData.dateJoined = siteData.dateJoined;
  if (siteData.description !== undefined)
    apiData.description = siteData.description;

  // Location object
  const location: any = {};
  if (siteData.address !== undefined) location.address = siteData.address;
  if (siteData.latitude !== undefined) location.latitude = siteData.latitude;
  if (siteData.longitude !== undefined)
    location.longitude = siteData.longitude;
  if (Object.keys(location).length > 0) apiData.location = location;

  // Contact object
  const contact: any = {};
  if (siteData.phone !== undefined) contact.phone = siteData.phone;
  if (siteData.email !== undefined) contact.email = siteData.email;
  if (Object.keys(contact).length > 0) apiData.contact = contact;

  return apiData;
};

// --- SITE CRUD FUNCTIONS ---

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

export const updateSite = async (
  siteId: string,
  updatedData: Partial<Site>
): Promise<Site> => {
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

// --- FULL DETAILS FUNCTION (Returns API structure) ---

export interface FullSiteDetailsData {
  site: ApiSite;
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
  // Note: images are inside site: ApiSite
}

export const getFullSiteDetails = async (
  siteId: string
): Promise<FullSiteDetailsData> => {
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

// --- NEW IMAGE FUNCTIONS ---

/**
 * Upload a new image for a site.
 */
export const uploadSiteImage = async (
  siteId: string,
  imageNumber: number,
  imageFile: File
): Promise<ApiImageResponseData> => {
  try {
    const formData = new FormData();
    formData.append('imageNumber', imageNumber.toString());
    formData.append('image', imageFile);

    // Note: Do not manually set Content-Type;
    // 'api' (axios) will automatically set it to 'multipart/form-data'
    // with the correct boundary when given FormData.
    const response = await api.post<UploadSiteImageResponse>(
      `/sites/${siteId}/images`,
      formData
    );

    return response.data.data;
  } catch (error: any) {
    throw new Error(getErrorMessage(error, 'Failed to upload image'));
  }
};

/**
 * Delete an image from a site.
 */
export const deleteSiteImage = async (
  siteId: string,
  imageNumber: number
): Promise<boolean> => {
  try {
    const response = await api.delete<DeleteSiteResponse>(
      `/sites/${siteId}/images/${imageNumber}`
    );
    return response.data.success;
  } catch (error: any) {
    throw new Error(getErrorMessage(error, 'Failed to delete image'));
  }
};