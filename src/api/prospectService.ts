import api from './api';

// --- NEW INTERFACE FOR PROSPECT INTEREST ---
export interface ProspectInterest {
  category: string;
  brands: string[];
}

export interface ApiProspectImage {
  imageNumber: number;
  imageUrl: string;
}

// --- UPDATED INTERFACE: Prospect (Frontend Representation) ---
export interface Prospect {
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
  // NEW FIELD: Prospect Interest - Array of interests (as per API response)
  interest?: ProspectInterest[];
  createdBy?: { _id: string; name: string };
}

// --- UPDATED INTERFACE: ApiProspect (Backend Format) ---
export interface ApiProspect {
  _id: string;
  prospectName: string;
  ownerName: string;
  dateJoined: string;
  panVatNumber?: string;
  contact: {
    phone: string;
    email?: string;
  };
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  description?: string;
  images?: ApiProspectImage[];
  // NEW FIELD: Prospect Interest in API format
  prospectInterest?: {
      category: string;
      brands: string[];
      _id?: string; // Backend-generated ID
  }[];
}

export interface ProspectCategoryData {
    name: string;
    brands: string[];
    _id: string; 
}

// --- UPDATED INTERFACE: NewProspectData (Frontend Create Payload from Modal) ---
// This is the shape received from AddEntityModal's onSave function
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
  // NEW FIELD: Interest data from the form (Array of Interest Items)
  interest?: {
      category: string;
      brands: string[]; 
      technicianName?: string;
      technicianPhone?: string;
  }[];
}

// --- RESPONSE TYPE INTERFACES (from backend) ---
interface GetProspectsResponse {
  success: boolean;
  count: number;
  data: any[]; // API prospect objects
}

interface ProspectResponse {
  success: boolean;
  data: any; // A single API prospect object
}

interface DeleteProspectResponse {
  success: boolean;
  message: string;
}

interface TransferResponse {
  success: boolean;
  message: string;
  data: any; // The newly created API Party object
}

// --- IMAGE RESPONSE TYPES ---
interface ApiImageResponseData {
  imageNumber: number;
  imageUrl: string;
}

interface UploadProspectImageResponse {
  success: boolean;
  message: string;
  data: ApiImageResponseData;
}

const getErrorMessage = (error: any, defaultMsg: string) => {
  return error.response?.data?.message || error.message || defaultMsg;
};

// --- MAPPING FUNCTIONS ---

const mapApiToFrontend = (apiProspect: any): Prospect => {
  // Map prospectInterest only if it exists and is an array
  const interest: ProspectInterest[] = (apiProspect.prospectInterest || []).map((i: any) => ({
      category: i.category,
      brands: i.brands || [],
  }));

  return {
    id: apiProspect._id,
    // Handle potential naming inconsistency
    name: apiProspect.prospectName || apiProspect.partyName, 
    ownerName: apiProspect.ownerName,
    dateJoined: apiProspect.dateJoined,
    address: apiProspect.location?.address || '',
    latitude: apiProspect.location?.latitude || null,
    longitude: apiProspect.location?.longitude || null,
    phone: apiProspect.contact?.phone || '',
    email: apiProspect.contact?.email || undefined, // Use undefined if missing
    description: apiProspect.description || undefined, // Use undefined if missing
    panVat: apiProspect.panVatNumber || undefined, // Map panVatNumber if present
    images: apiProspect.images || [],
    interest: interest.length > 0 ? interest : undefined, // Attach interest
    createdBy: apiProspect.createdBy,
  };
};

/**
 * Maps the frontend's NewProspectData (including interest array) to the API's create structure.
 */
const mapFrontendToApiCreate = (prospectData: NewProspectData): any => {
  const apiPayload: any = {
    prospectName: prospectData.name,
    ownerName: prospectData.ownerName,
    dateJoined: prospectData.dateJoined,
    contact: {
      phone: prospectData.phone,
      email: prospectData.email || undefined,
    },
    location: {
      address: prospectData.address,
      latitude: prospectData.latitude,
      longitude: prospectData.longitude,
    },
    description: prospectData.description || undefined,
    panVatNumber: prospectData.panVat || undefined,
  };

  // --- UPDATED: Map the Interest Array directly ---
  if (prospectData.interest && prospectData.interest.length > 0) {
      apiPayload.prospectInterest = prospectData.interest.map(item => ({
          category: item.category,
          brands: item.brands,
          // If you need to send technician info to backend for prospects, add it here:
          // technicianName: item.technicianName,
          // technicianPhone: item.technicianPhone
      }));
  }

  return apiPayload;
};

/**
 * Maps a frontend Partial<Prospect> to the API's update structure.
 */
const mapFrontendToApiUpdate = (prospectData: Partial<Prospect>): any => {
  const apiData: any = {};

  if (prospectData.name !== undefined) apiData.prospectName = prospectData.name;
  if (prospectData.ownerName !== undefined) apiData.ownerName = prospectData.ownerName;
  if (prospectData.description !== undefined) apiData.description = prospectData.description;
  if (prospectData.panVat !== undefined) apiData.panVatNumber = prospectData.panVat;
  if (prospectData.interest) {
    apiData.prospectInterest = prospectData.interest.map(item => ({
      category: item.category,
      brands: item.brands
    }));
  }
  
  const location: any = {};
  if (prospectData.address !== undefined) location.address = prospectData.address;
  if (prospectData.latitude !== undefined) location.latitude = prospectData.latitude;
  if (prospectData.longitude !== undefined) location.longitude = prospectData.longitude;
  if (Object.keys(location).length > 0) apiData.location = location;

  // Contact object
  const contact: any = {};
  if (prospectData.phone !== undefined) contact.phone = prospectData.phone;
  if (prospectData.email !== undefined) contact.email = prospectData.email;
  if (Object.keys(contact).length > 0) apiData.contact = contact;

  return apiData;
};

// --- API SERVICE FUNCTIONS ---

/**
 * Fetches all prospects
 * API: GET /prospects
 */
export const getProspects = async (): Promise<Prospect[]> => {
  try {
    const response = await api.get<GetProspectsResponse>('/prospects');
    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data.map(mapApiToFrontend);
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches a single prospect by its ID
 * API: GET /prospects/{prospectId}
 */
export const getProspectById = async (prospectId: string): Promise<Prospect> => {
  try {
    const response = await api.get<ProspectResponse>(`/prospects/${prospectId}`);
    if (response.data.success && response.data.data) {
      return mapApiToFrontend(response.data.data);
    } else {
      throw new Error('Prospect not found or invalid data format');
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a new prospect
 * API: POST /prospects
 */
export const addProspect = async (prospectData: NewProspectData): Promise<Prospect> => {
  try {
    const apiPayload = mapFrontendToApiCreate(prospectData);
    const response = await api.post<ProspectResponse>('/prospects', apiPayload);
    return mapApiToFrontend(response.data.data);
  } catch (error) {
    throw error;
  }
};

/**
 * Updates an existing prospect
 * API: PUT /prospects/{prospectId}
 */
export const updateProspect = async (
  prospectId: string,
  updatedData: Partial<Prospect>
): Promise<Prospect> => {
  try {
    const apiPayload = mapFrontendToApiUpdate(updatedData);
    // Filter out undefined values before sending, PUT might require only defined fields
    Object.keys(apiPayload).forEach(key => apiPayload[key] === undefined && delete apiPayload[key]);
    if (apiPayload.location && Object.keys(apiPayload.location).length === 0) delete apiPayload.location;
    if (apiPayload.contact && Object.keys(apiPayload.contact).length === 0) delete apiPayload.contact;

    const response = await api.put<ProspectResponse>(
      `/prospects/${prospectId}`,
      apiPayload
    );
    return mapApiToFrontend(response.data.data);
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a prospect
 * API: DELETE /prospects/{prospectId}
 */
export const deleteProspect = async (prospectId: string): Promise<boolean> => {
  try {
    const response = await api.delete<DeleteProspectResponse>(`/prospects/${prospectId}`);
    return response.data.success;
  } catch (error) {
    throw error;
  }
};

/**
 * Transfers a prospect to a party.
 * API: POST /prospects/{prospectId}/transfer
 * Returns the newly created API Party object.
 */
export const transferProspectToParty = async (prospectId: string): Promise<any> => {
  try {
    const response = await api.post<TransferResponse>(
      `/prospects/${prospectId}/transfer`
    );
    // Return the new party object (as received) from the API response
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getProspectCategoriesList = async (): Promise<ProspectCategoryData[]> => {
    try {
        const response = await api.get('/prospects/categories');
        return response.data.data || [];
    } catch (error) {
        throw error;
    }
};


export interface FullProspectDetailsData {
  prospect: Prospect; 
  contact: { phone: string; email?: string };
  location: { address: string; latitude: number; longitude: number };
}

export const getFullProspectDetails = async (prospectId: string): Promise<FullProspectDetailsData> => {
  try {
    const response = await api.get<ProspectResponse>(`/prospects/${prospectId}`);
    if (!response.data.success || !response.data.data) {
      throw new Error('Prospect not found');
    }
    const apiData = response.data.data;
    const mappedProspect = mapApiToFrontend(apiData);

    return {
      prospect: mappedProspect,
      contact: { 
        phone: mappedProspect.phone, 
        email: mappedProspect.email 
      },
      location: { 
        address: mappedProspect.address, 
        latitude: mappedProspect.latitude || 0, 
        longitude: mappedProspect.longitude || 0 
      },
    };
  } catch (error: any) {
    throw new Error(getErrorMessage(error, 'Failed to fetch prospect details'));
  }
};

export const uploadProspectImage = async (
  prospectId: string,
  imageNumber: number,
  imageFile: File
): Promise<ApiImageResponseData> => {
  try {
    const formData = new FormData();
    formData.append('imageNumber', imageNumber.toString());
    formData.append('image', imageFile);

    // Axios automatically sets 'multipart/form-data'
    const response = await api.post<UploadProspectImageResponse>(
      `/prospects/${prospectId}/images`,
      formData
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(getErrorMessage(error, 'Failed to upload image'));
  }
};

/**
 * Delete an image from a prospect.
 */
export const deleteProspectImage = async (
  prospectId: string,
  imageNumber: number
): Promise<boolean> => {
  try {
    const response = await api.delete<DeleteProspectResponse>(
      `/prospects/${prospectId}/images/${imageNumber}`
    );
    return response.data.success;
  } catch (error: any) {
    throw new Error(getErrorMessage(error, 'Failed to delete image'));
  }
};

export const getAllProspectsDetails = async (): Promise<any[]> => {
  try {
    // Hits {{BASE_URL_DEV}}/api/v1/prospects/details
    const response = await api.get('/prospects/details');
    
    if (response.data.success && Array.isArray(response.data.data)) {
      // Return data directly or map it if a specific ProspectDetails interface is created
      return response.data.data; 
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};