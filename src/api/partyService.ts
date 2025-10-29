import api from './api'; // 👈 Import your central API instance

// --- TYPE DEFINITIONS ---
export interface Party {
  id: string; // Maps from API's `_id`
  companyName: string; // Maps from API's `partyName`
  ownerName: string;
  address: string; // Maps from API's `location.address`
  latitude: number | null; // Maps from API's `location.latitude`
  longitude: number | null; // Maps from API's `location.longitude`
  dateCreated: string; // Maps from API's `dateJoined` or `createdAt`
  phone: string; // Maps from API's `contact.phone`
  panVat: string; // Maps from API's `panVatNumber`
  email: string; // Maps from API's `contact.email`
  description?: string;
}

export interface NewPartyData {
  companyName: string; // Maps to partyName
  ownerName: string;
  dateJoined: string;
  address: string;     // Maps to location.address
  latitude: number | null;   // Required
  longitude: number | null;  // Required
  email: string;           // Required
  phone: string;           // Required
  panVat: string;          // Required
  description?: string;    // This one is optional
}

// --- RESPONSE TYPE INTERFACES (from backend) ---
interface GetPartiesResponse {
  success: boolean;
  count: number;
  data: any[]; // API party objects
}

interface PartyResponse {
  success: boolean;
  data: any; // A single API party object
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
// --- DATA MAPPERS (Translate between Frontend and API) ---

/**
 * Maps the API's party object (with `_id`, `partyName`, nested `location`)
 * to the frontend's flat `Party` interface.
 */
const mapApiToFrontend = (apiParty: any): Party => {
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
  };
};

/**
 * Maps the frontend's `NewPartyData` to the nested structure
 * expected by the API's POST (Create) endpoint.
 */
const mapFrontendToApiCreate = (partyData: NewPartyData): any => {
  return {
    partyName: partyData.companyName,
    ownerName: partyData.ownerName,
    dateJoined: partyData.dateJoined,
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

/**
 * Maps a frontend `Partial<Party>` object to the nested structure
 * expected by the API's PUT (Update) endpoint.
 */
const mapFrontendToApiUpdate = (partyData: Partial<Party>): any => {
  const apiData: any = {};

  if (partyData.companyName !== undefined) apiData.partyName = partyData.companyName;
  if (partyData.ownerName !== undefined) apiData.ownerName = partyData.ownerName;
  if (partyData.description !== undefined) apiData.description = partyData.description;
  if (partyData.panVat !== undefined) apiData.panVatNumber = partyData.panVat;

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

// --- API SERVICE FUNCTIONS ---

/**
 * Fetches all parties
 * API: GET /parties
 */
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

/**
 * Fetches a single party by its ID
 * API: GET /parties/{partyId}
 */
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

/**
 * Creates a new party
 * API: POST /parties
 */
export const addParty = async (partyData: NewPartyData): Promise<Party> => {
  try {
    const apiPayload = mapFrontendToApiCreate(partyData);
    const response = await api.post<PartyResponse>('/parties', apiPayload);
    return mapApiToFrontend(response.data.data);
  } catch (error) {
    throw error;
  }
};

/**
 * Updates an existing party
 * API: PUT /parties/{partyId}
 */
export const updateParty = async (partyId: string, updatedData: Partial<Party>): Promise<Party> => {
  try {
    const apiPayload = mapFrontendToApiUpdate(updatedData);
    const response = await api.put<PartyResponse>(`/parties/${partyId}`, apiPayload);
    return mapApiToFrontend(response.data.data);
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a party
 * API: DELETE /parties/{partyId}
 */
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
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const result: BulkUploadResult = {
    success: 0,
    failed: 0,
    errors: [],
  };

  // Validate and "process" each party
  for (let i = 0; i < parties.length; i++) {
    const partyData = parties[i];

    try {
      // Validate required fields (using frontend Party interface names)
      if (!partyData.companyName || !partyData.ownerName || !partyData.address) {
        result.failed++;
        result.errors.push(
          `Row ${i + 2}: Missing required fields (Company Name, Owner Name, or Address)`
        );
        continue;
      }

      // Validate email format
      if (!partyData.email || !partyData.email.includes('@')) {
        result.failed++;
        result.errors.push(`Row ${i + 2}: Email is required and must be valid`);
        continue;
      }

      // Validate phone number (must be 10 digits)
      if (!partyData.phone || !/^\d{10}$/.test(partyData.phone)) {
        result.failed++;
        result.errors.push(`Row ${i + 2}: Phone number is required and must be 10 digits`);
        continue;
      }

      // If validation passes, count as success
      result.success++;

      // In a real mock, we might push to a local array, but since
      // mockPartyData is gone, we just simulate the success.
      // const newParty: Party = { ... };
      // mockPartyData.push(newParty); // This line is removed

    } catch (error) {
      result.failed++;
      result.errors.push(
        `Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  return result;
};